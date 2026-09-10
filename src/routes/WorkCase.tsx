import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import Footer from '../components/Footer';
import { TLink } from '../lib/transition';
import { WORKS } from '../data/works';
import NotFound from './NotFound';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">{children}</p>
  );
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [...EASE] }}
    >
      {children}
    </motion.div>
  );
}

export default function WorkCase() {
  const { slug } = useParams();
  const idx = WORKS.findIndex((w) => w.slug === slug);
  if (idx === -1) return <NotFound />;
  const w = WORKS[idx];
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-44">
        <Meta>[ case — {w.index} / 011 ]</Meta>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.88] text-[clamp(2.8rem,10vw,9rem)]"
        >
          {w.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [...EASE] }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/50"
        >
          {w.category} — {w.year} — {w.role}
        </motion.p>

        {/* hero image + blur */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [...EASE] }}
          className="relative overflow-hidden bg-[#141412] mt-10 md:mt-14"
        >
          <span
            aria-hidden
            className="img-mono absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${w.blur})` }}
          />
          <img
            src={w.thumb}
            alt={w.title}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            className="img-mono relative w-full max-h-[62vh] object-cover opacity-0 transition-opacity duration-700"
          />
        </motion.div>

        {/* cerita */}
        <div className="grid md:grid-cols-12 gap-10 mt-14 md:mt-20">
          <div className="md:col-span-6 md:col-start-5 space-y-6 text-[16px] leading-relaxed text-bone/70">
            {w.story.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* statistik ngarang */}
        <div className="mt-16 md:mt-24">
          <Reveal>
            <Meta>[ angka penting (katanya) ]</Meta>
            <div className="mt-6 grid grid-cols-3 gap-6 border-t border-bone/15 pt-6">
              {w.stats.map(([label, value]) => (
                <div key={label}>
                  <p className="font-sans font-semibold tracking-tight text-[clamp(1.6rem,4.5vw,3rem)]">
                    {value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-bone/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* stack */}
        <div className="mt-12 md:mt-16">
          <Reveal>
            <Meta>[ dibangun dengan ]</Meta>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone/60">
              {w.stack.map((s) => `[ ${s} ]`).join('  ')}
            </p>
          </Reveal>
        </div>

        {/* visit */}
        <div className="mt-12 md:mt-16">
          <Reveal>
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="kunjungi ↗"
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              visit live site{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        {/* prev / next */}
        <div className="mt-20 md:mt-28 border-t border-bone/15 pt-8 pb-4 grid grid-cols-2 gap-6">
          <TLink to={`/works/${prev.slug}`} className="group block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45">
              [ ← prev ]
            </span>
            <span className="block mt-3 font-sans font-semibold uppercase tracking-tight leading-[0.95] text-[clamp(1.4rem,4vw,2.6rem)] text-bone/70 group-hover:text-bone transition-colors">
              {prev.title}
            </span>
          </TLink>
          <TLink to={`/works/${next.slug}`} className="group block text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45">
              [ next → ]
            </span>
            <span className="block mt-3 font-sans font-semibold uppercase tracking-tight leading-[0.95] text-[clamp(1.4rem,4vw,2.6rem)] text-bone/70 group-hover:text-bone transition-colors">
              {next.title}
            </span>
          </TLink>
        </div>
      </section>

      <Footer />
    </>
  );
}
