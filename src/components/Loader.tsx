import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/loader.mp4`;

/**
 * Intro ala Onoera: video kecil di tengah layar + nama brand.
 * Selesai mengikuti video (±3 detik); fallback timeout bila video gagal.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
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

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const id = setTimeout(finish, 700);
      return () => clearTimeout(id);
    }

    // fallback: jangan jebak user bila video macet
    const fallback = setTimeout(finish, 4500);
    const video = videoRef.current;
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
    <div className="text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-28 h-28 md:w-32 md:h-32 overflow-hidden"
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
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 font-mono text-[12px] tracking-[0.35em] uppercase text-bone"
      >
        wah:anggaaa
      </motion.p>
    </div>
  );
}
