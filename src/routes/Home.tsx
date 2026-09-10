import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { SELECTED, WORKS } from '../data/works';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 ${className}`}>
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      {/* ============ HERO — freeform ============ */}
      <section className="relative min-h-svh flex flex-col justify-end overflow-hidden px-5 md:px-10 pt-24 pb-8">
        <Meta className="absolute top-24 md:top-28 left-5 md:left-10">[ portfolio — vol.01 ]</Meta>
        <Meta className="absolute top-24 md:top-28 right-5 md:right-10 text-right hidden sm:block">
          11 works — '26
        </Meta>
        <Meta className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 hidden lg:block [writing-mode:vertical-rl]">
          jakarta, id — 6.2°s 106.8°e
        </Meta>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [...EASE] }}
          className="font-sans font-semibold uppercase tracking-[-0.035em] leading-[0.82] text-[clamp(4.2rem,17vw,16rem)]"
        >
          wah:
          <br />
          anggaaa
        </motion.h1>

        {/* role line menabrak nama */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [...EASE] }}
          className="relative z-10 -mt-3 md:-mt-8 ml-[8vw] md:ml-[30vw]"
        >
          <p className="inline-block bg-void pr-4 font-sans font-medium tracking-tight text-[clamp(1.2rem,3.4vw,2.4rem)]">
            Designer <span className="text-bone/40">&</span> Creative Developer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6 items-end mt-10 md:mt-14">
          <p className="md:col-span-4 text-[15px] leading-relaxed text-bone/60 max-w-[34ch]">
            Taman bermain satu orang. Aku mendesain &amp; membangun landing page
            fiktif — brand khayalan yang digarap serius.
          </p>
          <div className="md:col-span-5 flex items-center gap-8">
            <Link
              to="/contact"
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              say hi <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </Link>
            <Link to="/about" className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone transition-colors">
              [ about ]
            </Link>
          </div>
          <Meta className="md:col-span-3 md:text-right">scroll ↓</Meta>
        </div>
      </section>

      {/* ============ SELECTED WORKS — staggered collage ============ */}
      <section className="relative px-5 md:px-10 pt-28 md:pt-40">
        <div className="flex items-end justify-between mb-12 md:mb-20">
          <h2 className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(2.8rem,9vw,8rem)]">
            selected<br />works
          </h2>
          <Meta className="pb-2">[ 001 — 005 ]</Meta>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
          {SELECTED.map((w, i) => {
            const flip = i % 2 === 1;
            return (
              <motion.a
                key={w.index}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [...EASE] }}
                className={`group relative block ${
                  flip ? 'md:ml-[18vw]' : 'md:mr-[18vw]'
                } ${i === 2 ? 'md:mx-[8vw]' : ''}`}
              >
                {/* nomor raksasa di belakang */}
                <span
                  aria-hidden
                  className={`text-stroke pointer-events-none select-none absolute -top-[0.55em] font-sans font-semibold leading-none text-[clamp(5rem,14vw,12rem)] opacity-60 ${
                    flip ? '-left-2 md:-left-10' : '-right-2 md:-right-10'
                  }`}
                >
                  {w.index}
                </span>

                <div className="relative overflow-hidden bg-[#141412]">
                  {w.thumb ? (
                    <img
                      src={w.thumb}
                      alt={w.title}
                      loading="lazy"
                      className="img-mono w-full aspect-[4/3] md:aspect-[16/9] object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center">
                      <span className="font-sans font-semibold uppercase tracking-tight text-[clamp(2.5rem,8vw,7rem)] text-bone/90">
                        {w.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* judul menabrak gambar */}
                <div className={`relative z-10 -mt-6 md:-mt-10 ${flip ? 'text-right' : ''}`}>
                  <h3 className="inline-block bg-void px-1 font-sans font-semibold uppercase tracking-tight leading-none text-[clamp(2rem,6.5vw,5.5rem)]">
                    {w.title}
                  </h3>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
                    {w.category} — {w.year} <span className="text-bone">↗</span>
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ============ FULL INDEX ============ */}
      <section className="px-5 md:px-10 pt-28 md:pt-40">
        <div className="flex items-end justify-between mb-8">
          <Meta>[ full index ]</Meta>
          <Meta>( 011 )</Meta>
        </div>
        <div className="border-t border-bone/15">
          {WORKS.map((w) => (
            <a
              key={w.index}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_1fr_1fr_5rem_3rem] items-center gap-3 md:gap-6 py-4 md:py-5 border-b border-bone/15 transition-colors duration-300 hover:bg-bone hover:text-void px-1 md:px-3"
            >
              <span className="font-mono text-[11px] text-bone/40 group-hover:text-void/50">{w.index}</span>
              <span className="font-sans font-medium uppercase tracking-tight text-xl md:text-3xl">{w.title}</span>
              <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.16em] text-bone/50 group-hover:text-void/60">{w.category}</span>
              <span className="hidden md:block font-mono text-[11px] text-bone/50 group-hover:text-void/60">({w.year})</span>
              <span className="font-sans text-lg justify-self-end transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="px-5 md:px-10 pt-32 md:pt-48 pb-8">
        <Meta className="mb-8">[ manifesto ]</Meta>
        <Reveal
          text="Iseng-iseng yang diniatkan. Satu halaman, satu dunia kecil — fiktif tapi digarap sampai selesai."
          className="font-sans font-medium tracking-tight leading-[1.08] text-[clamp(1.9rem,5.5vw,4.5rem)] max-w-[20ch]"
        />
        <div className="mt-10 md:ml-[40vw]">
          <Link
            to="/about"
            className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
          >
            more about me <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
