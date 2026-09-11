import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/loader.mp4`;

/**
 * Preloader ala Isabel Moranta: kotak video tengah diapit kurung raksasa
 * "( ... )" + teks "( loading )" di bawahnya. Selesai mengikuti video
 * (6 dtk); fallback timeout bila video macet. Keluar via fade sistem
 * reveal yang sudah ada — lalu video hilang total dari hero.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
      role="status"
      aria-label="Memuat halaman"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      <LoaderInner onDone={onDone} />
    </motion.div>
  );
}

function LoaderInner({ onDone }: { onDone: () => void }) {
  const doneRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // teks saja, video disembunyikan
      if (boxRef.current) boxRef.current.style.display = 'none';
      const id = setTimeout(finish, 700);
      return () => clearTimeout(id);
    }

    // fallback: jangan jebak user bila video macet (durasi 6 dtk + buffer)
    const fallback = setTimeout(finish, 7500);
    const onEnded = () => finish();
    const onError = () => finish();
    video?.addEventListener('ended', onEnded);
    video?.addEventListener('error', onError);
    // autoplay eksplisit (iOS butuh muted + playsInline — sudah diset di JSX)
    video?.play().catch(() => finish());

    return () => {
      clearTimeout(fallback);
      video?.removeEventListener('ended', onEnded);
      video?.removeEventListener('error', onError);
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center px-6">
      <div className="flex items-center gap-4 md:gap-8">
        <span
          aria-hidden
          className="font-sans font-medium leading-none select-none text-bone/90 text-[clamp(3.5rem,13vw,9rem)]"
        >
          (
        </span>
        <motion.div
          ref={boxRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(62vw,520px)] aspect-video overflow-hidden bg-[#141412]"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            className="img-mono w-full h-full object-cover"
            muted
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
        </motion.div>
        <span
          aria-hidden
          className="font-sans font-medium leading-none select-none text-bone/90 text-[clamp(3.5rem,13vw,9rem)]"
        >
          )
        </span>
      </div>
      <p className="mt-6 md:mt-8 font-mono text-[12px] uppercase tracking-[0.3em] text-bone/60">
        ( loading )
      </p>
    </div>
  );
}
