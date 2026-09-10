import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/loader.mp4`;

/**
 * Intro ala Grégory Lallé: video kecil di tengah + frame counter pojok kanan.
 * Counter mengikuti progres video (00 → 99, tak pernah 100) dan naik dari
 * kanan-bawah ke kanan-atas seiring progres; garis tepi ikut tumbuh.
 * Selesai mengikuti video; fallback timeout bila video gagal.
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
  const numberRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const baseYRef = useRef(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const number = numberRef.current;
    const line = lineRef.current;
    const video = videoRef.current;

    // posisi awal: angka di kanan-bawah (rumus ala Lallé)
    const measure = () => {
      if (!number) return;
      // ukur tanpa transform (resize bisa datang saat angka sudah bergeser)
      const prev = number.style.transform;
      number.style.transform = '';
      const r = number.getBoundingClientRect();
      number.style.transform = prev;
      // y agar angka duduk di margin bawah yang sama dengan margin atasnya
      baseYRef.current = Math.max(0, window.innerHeight - r.height - r.top * 2);
    };
    measure();
    window.addEventListener('resize', measure);

    const paint = (p: number) => {
      const v = Math.min(1, Math.max(0, p));
      if (number) {
        number.textContent = v >= 1 ? '99' : String(Math.floor(v * 100)).padStart(2, '0');
        number.style.transform = `translateY(${(baseYRef.current * (1 - v)).toFixed(1)}px)`;
      }
      if (line) line.style.transform = `scaleY(${v.toFixed(4)})`;
    };

    // rAF: progres mengikuti frame video; sintetis bila durasi tak dikenal
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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      paint(1); // kunci di 99 / kanan-atas sebelum overlay terangkat
      onDone();
    };

    if (reduced) {
      if (number) number.style.display = 'none';
      if (line) line.style.display = 'none';
      const id = setTimeout(finish, 700);
      return () => {
        clearTimeout(id);
        window.removeEventListener('resize', measure);
      };
    }

    paint(0);
    rafRef.current = requestAnimationFrame(tick);

    // fallback: jangan jebak user bila video macet
    const fallback = setTimeout(finish, 4500);
    const onEnded = () => finish();
    const onError = () => finish();
    video?.addEventListener('ended', onEnded);
    video?.addEventListener('error', onError);
    // autoplay eksplisit (iOS butuh muted + playsInline — sudah diset di JSX)
    video?.play().catch(() => finish());

    return () => {
      clearTimeout(fallback);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
      video?.removeEventListener('ended', onEnded);
      video?.removeEventListener('error', onError);
    };
  }, [onDone]);

  return (
    <>
      {/* garis progres tepi kanan */}
      <div
        ref={lineRef}
        aria-hidden
        className="absolute top-0 right-0 h-full w-[3px] bg-bone origin-top"
        style={{ transform: 'scaleY(0)' }}
      />
      {/* frame counter: kanan-bawah → kanan-atas */}
      <span
        ref={numberRef}
        aria-hidden
        className="absolute top-5 right-5 md:top-7 md:right-9 font-sans font-semibold tracking-tight tabular-nums text-bone leading-none text-[clamp(3.2rem,9vw,6.5rem)] will-change-transform"
      >
        00
      </span>
      {/* video kecil tengah */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-28 h-28 md:w-32 md:h-32 overflow-hidden"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="w-full h-full object-cover"
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          aria-hidden
        />
      </motion.div>
    </>
  );
}
