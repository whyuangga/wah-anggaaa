import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/loader.mp4`;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Preloader: video kecil 112px di tengah + "( loading )" di paling bawah
 * + frame counter mono di kanan bawah. Selesai mengikuti video (6 dtk @2x = 3 dtk).
 * Tanpa background: video mengambang di atas kanvas, lalu crossfade
 * lambat (1,6 dtk) berbarengan konten hero muncul.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[100]"
      role="status"
      aria-label="Memuat halaman"
    >
      <LoaderInner onDone={onDone} />
    </motion.div>
  );
}

function LoaderInner({ onDone }: { onDone: () => void }) {
  const doneRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const number = numberRef.current;

    const paint = (p: number) => {
      if (!number) return;
      const v = Math.min(1, Math.max(0, p));
      number.textContent = v >= 1 ? '99' : String(Math.floor(v * 100)).padStart(2, '0');
    };

    // rAF: counter mengikuti frame video; sintetis bila durasi tak dikenal
    startRef.current = performance.now();
    const tick = () => {
      const dur = video?.duration;
      let p: number;
      if (dur && Number.isFinite(dur) && dur > 0) {
        p = (video?.currentTime ?? 0) / dur;
      } else {
        p = (performance.now() - startRef.current) / 3000;
      }
      paint(p);
      if (!doneRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      paint(1);
      onDone();
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      if (video) video.style.display = 'none';
      if (number) number.style.display = 'none';
      const id = setTimeout(finish, 700);
      return () => clearTimeout(id);
    }

    paint(0);
    rafRef.current = requestAnimationFrame(tick);

    // fallback: jangan jebak user bila video macet (durasi 6 dtk + buffer)
    const fallback = setTimeout(finish, 4500);
    const onEnded = () => finish();
    const onError = () => finish();
    video?.addEventListener('ended', onEnded);
    video?.addEventListener('error', onError);
    // 2x: video 6 dtk selesai dalam 3 dtk
    if (video) video.playbackRate = 2;
    // autoplay eksplisit (iOS butuh muted + playsInline — sudah diset di JSX)
    video?.play().catch(() => finish());

    return () => {
      clearTimeout(fallback);
      cancelAnimationFrame(rafRef.current);
      video?.removeEventListener('ended', onEnded);
      video?.removeEventListener('error', onError);
    };
  }, [onDone]);

  return (
    <>
      {/* video 112px: menempel di hero, fade belakangan */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [...EASE] }}
          exit={{ opacity: 0, transition: { delay: 0.6, duration: 1.6, ease: [...EASE] } }}
          className="h-28 w-28 overflow-hidden"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            className="img-mono h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
        </motion.div>
      </div>
      {/* teks loading: paling bawah */}
      <motion.p
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [...EASE] } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[12px] uppercase tracking-[0.3em] text-bone/60"
      >
        ( loading )
      </motion.p>
      {/* frame counter mono: kanan bawah */}
      <motion.span
        ref={numberRef}
        aria-hidden
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [...EASE] } }}
        className="absolute bottom-6 right-5 font-mono text-[12px] tracking-[0.2em] text-bone/70 tabular-nums"
      >
        00
      </motion.span>
    </>
  );
}
