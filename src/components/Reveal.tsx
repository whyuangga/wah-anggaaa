import { motion } from 'motion/react';

type Props = {
  text: string;
  className?: string;
  /** kata yang digelapkan/diterangkan beda (opsional) */
  dim?: string[];
};

/**
 * Reveal kinetik kata-per-kata.
 * Phase 1: whileInView (transform/opacity saja).
 * Phase 2: di-upgrade ke scroll-linked scrub via GSAP.
 */
export default function Reveal({ text, className = '', dim = [] }: Props) {
  const words = text.split(' ');
  return (
    <p className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0.1, y: 10 }}
          whileInView={{ opacity: dim.includes(w) ? 0.45 : 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.02, 0.5) }}
          className="inline-block mr-[0.27em]"
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}
