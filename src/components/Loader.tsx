import { motion } from 'motion/react';

export const INTRO_KEY = 'wah-intro-seen';

/**
 * Intro ala Onoera: tenang, tanpa counter.
 * Teks kecil di tengah fade-in perlahan, lalu seluruh layer fade-out graceful.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
      onAnimationComplete={() => {
        // selesai setelah hold — dijadwalkan via timeout di bawah
      }}
    >
      <LoaderInner onDone={onDone} />
    </motion.div>
  );
}

import { useEffect } from 'react';

function LoaderInner({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        /* abaikan */
      }
      onDone();
    }, 1900);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="text-center px-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono text-[13px] tracking-[0.35em] uppercase text-bone"
      >
        wah:anggaaa
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40"
      >
        designer &amp; creative developer
      </motion.p>
    </div>
  );
}
