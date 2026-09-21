import { useMemo, useRef } from 'react';
import { animate, motion, stagger } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useStudioStatus } from '../hooks/useStudioStatus';
import { TLink } from '../lib/transition';
import { EASE } from './ui';

const WORD = 'wah:anggaaa'.split('');

export default function Footer({ giant = true, rule = true }: { giant?: boolean; rule?: boolean }) {
  const time = useJakartaTime();
  const status = useStudioStatus();
  const wordRef = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(false);
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  /**
   * Gelombang hover: huruf-huruf melompat berurutan (desktop). Dulu digerakkan
   * GSAP; sekarang `animate()` dari Motion yang sudah ada di bundle — nol
   * dependency tambahan. Ditahan sampai cascade entrance selesai (anti-rebutan
   * transform).
   */
  const wave = () => {
    if (reduced || !shownRef.current) return;
    const el = wordRef.current;
    if (!el) return;
    animate(
      el.querySelectorAll('.f-letter'),
      { y: ['0%', '-14%', '0%'] },
      { duration: 0.56, delay: stagger(0.04), ease: 'easeOut' },
    );
  };

  return (
    <footer className={`relative px-5 md:px-10 pb-6 ${giant ? 'pt-20 md:pt-28' : 'pt-10 md:pt-14'}`}>
      {giant && (
        <TLink to="/" ariaLabel="Kembali ke index">
          <motion.span
            ref={wordRef}
            onMouseEnter={wave}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            onViewportEnter={() => {
              // cascade ±1,4 dtk → wave diizinkan setelahnya
              setTimeout(() => {
                shownRef.current = true;
              }, 1600);
            }}
            variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } }}
            className="block font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(3rem,12vw,12rem)] whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            {WORD.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                aria-hidden
                className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]"
              >
                <motion.span
                  variants={{
                    hidden: { y: '110%' },
                    show: { y: '0%', transition: { duration: 0.9, ease: [...EASE] } },
                  }}
                  className="f-letter inline-block will-change-transform"
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </TLink>
      )}

      {rule && <div className={`rule h-px w-full ${giant ? 'mt-10 md:mt-14' : ''}`} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/50">
        <p>© 2026</p>
        <div className="flex items-center gap-6">
          <TLink to="/about" className="hover:text-bone transition-colors">
            about
          </TLink>
          <TLink to="/contact" className="hover:text-bone transition-colors">
            contact
          </TLink>
          <TLink to="/journal" className="hover:text-bone transition-colors">
            journal
          </TLink>
        </div>
        <p>
          jakarta — {time} <span className="text-bone/30">[ just for fun ]</span>
        </p>
        <p>
          studio: <span className="text-bone/80">[ {status} ]</span>
        </p>
      </div>
    </footer>
  );
}
