import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Arrow, CTA, EASE, Meta } from '../components/ui';
import { TLink } from '../lib/transition';

/** kata punchline hero yang berganti-ganti (kinetic words) */
const KINETIC = ['seriously', 'playfully', 'obsessively', 'personally', 'religiously'];
const ROTATE_MS = 2600;

function KineticWord() {
  const [i, setI] = useState(0);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % KINETIC.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={KINETIC[i]}
          initial={reduced ? false : { y: '70%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={reduced ? undefined : { y: '-70%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [...EASE] }}
          className="inline-block will-change-transform"
        >
          {KINETIC[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Babak 1 landing: tagline puitis + baris peran + CTA. */
export default function HomeHero() {
  return (
    <section className="relative min-h-svh flex flex-col justify-end overflow-hidden px-5 md:px-10 pt-24 pb-8">
      <Meta className="absolute top-24 md:top-28 left-5 md:left-10">[ portfolio — vol.01 ]</Meta>
      <Meta className="absolute top-24 md:top-28 right-5 md:right-10 text-right hidden sm:block">
        11 works — '26
      </Meta>
      <Meta className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 hidden lg:block [writing-mode:vertical-rl]">
        jakarta, id — 6.2°s 106.8°e
      </Meta>

      <h1 className="font-sans font-medium tracking-[-0.02em] leading-[1.04] text-[clamp(2.4rem,7.4vw,7rem)] max-w-[22ch] md:max-w-none">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [...EASE] }}
          className="md:block text-bone/85"
        >
          A one-man playground{' '}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.14, ease: [...EASE] }}
          className="md:block text-bone/85"
        >
          for imaginary brands,{' '}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.28, ease: [...EASE] }}
          className="md:block text-bone"
        >
          taken far too <KineticWord />.
        </motion.span>
      </h1>

      {/* baris peran di bawah tagline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: [...EASE] }}
        className="relative z-10 mt-6 md:mt-8 ml-1 md:ml-[30vw]"
      >
        <p className="font-sans font-medium tracking-tight text-[clamp(1.2rem,3.4vw,2.4rem)]">
          Designer <span className="text-bone/40">&</span> Creative Developer
        </p>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-6 items-end mt-10 md:mt-14">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.7, ease: [...EASE] }}
          className="md:col-span-4 text-[15px] leading-relaxed text-bone/85 max-w-[34ch]"
        >
          Taman bermain satu orang milik Angga — dibangun di jam-jam curian: tanpa klien, tanpa brief,
          cuma obsesi.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.85, ease: [...EASE] }}
          className="md:col-span-5 flex items-center gap-8"
        >
          <TLink to="/contact" className={`group ${CTA}`}>
            <>
              say hi <Arrow />
            </>
          </TLink>
          <TLink
            to="/about"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone transition-colors"
          >
            [ about ]
          </TLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 1.0, ease: [...EASE] }}
          className="md:col-span-3 md:text-right"
        >
          <Meta>scroll ↓</Meta>
        </motion.div>
      </div>
    </section>
  );
}
