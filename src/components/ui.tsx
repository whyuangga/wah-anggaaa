import type { ReactNode } from 'react';
import { motion } from 'motion/react';

/**
 * Primitif UI bersama — dulu tersebar & terduplikasi di tiap route
 * (Meta 3×, Reveal 2×, EASE 10×). Sekarang satu sumber.
 */

/** Easing tunggal seluruh situs (easeOutExpo-ish) — bahasa gerak satu tangan. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Padding horizontal standar halaman. */
export const PAGE_X = 'px-5 md:px-10';

/** Kelas CTA underline yang dipakai berulang (say hi, more about me, visit…). */
export const CTA =
  'font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all';

/** Label meta mono: `[ something ]`. */
export function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bone ${className}`}>
      {children}
    </p>
  );
}

/** Reveal saat masuk viewport (sekali saja). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [...EASE] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Panah kecil yang bergerak saat induknya (`group`) di-hover. */
export function Arrow({ dir = 'ne' }: { dir?: 'ne' | 'e' | 'w' }) {
  const glyph = dir === 'ne' ? '↗' : dir === 'w' ? '←' : '→';
  const shift =
    dir === 'ne'
      ? 'group-hover:translate-x-1 group-hover:-translate-y-1'
      : dir === 'w'
        ? 'group-hover:-translate-x-1'
        : 'group-hover:translate-x-1';
  return <span className={`inline-block transition-transform ${shift}`}>{glyph}</span>;
}
