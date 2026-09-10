import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { TLink } from '../lib/transition';
import { SELECTED, WORKS, type Work } from '../data/works';
import { useSceneSections } from '../hooks/useSceneSections';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 ${className}`}>
      {children}
    </p>
  );
}

/* ---------- manifesto: opacity kata-per-kata mengikuti scroll (scrub) ---------- */
function ManifestoScrub({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll('[data-w]')) as HTMLElement[];
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress * spans.length;
        for (let i = 0; i < spans.length; i++) {
          spans[i].style.opacity = String(Math.min(1, Math.max(0.12, p - i)));
        }
      },
    });
    return () => {
      st.kill();
    };
  }, [text]);

  return (
    <p
      ref={ref}
      className="font-sans font-medium tracking-tight leading-[1.08] text-[clamp(1.9rem,5.5vw,4.5rem)] max-w-[20ch]"
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} data-w style={{ opacity: 0.12 }} className="inline-block mr-[0.27em]">
          {w}
        </span>
      ))}
    </p>
  );
}

/* ---------- full index + preview melayang mengikuti kursor (desktop) ---------- */
function FullIndex() {
  const [active, setActive] = useState<Work | null>(null);
  const [fine] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false,
  );
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });

  return (
    <section
      data-scene={1}
      className="px-5 md:px-10 pt-28 md:pt-40"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setActive(null)}
    >
      <div className="flex items-end justify-between mb-8">
        <Meta>[ full index ]</Meta>
        <Meta>( 011 )</Meta>
      </div>

      {fine && active?.thumb && (
        <motion.div
          aria-hidden
          className="fixed left-0 top-0 z-30 pointer-events-none hidden lg:block"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="-translate-x-1/2 -translate-y-[112%] w-64 aspect-[4/3] overflow-hidden border border-bone/25 bg-void">
            <img src={active.thumb} alt="" className="img-mono w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      <div className="border-t border-bone/15">
        {WORKS.map((w) => (
          <a
            key={w.index}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActive(w)}
            onFocus={() => setActive(w)}
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
  );
}

export default function Home() {
  useSceneSections();

  return (
    <>
      {/* ============ HERO — freeform ============ */}
      <section data-scene={0} className="relative min-h-svh flex flex-col justify-end overflow-hidden px-5 md:px-10 pt-24 pb-8">
        <Meta className="absolute top-24 md:top-28 left-5 md:left-10">[ portfolio — vol.01 ]</Meta>
        <Meta className="absolute top-24 md:top-28 right-5 md:right-10 text-right hidden sm:block">
          11 works — '26
        </Meta>
        <Meta className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 hidden lg:block [writing-mode:vertical-rl]">
          jakarta, id — 6.2°s 106.8°e
        </Meta>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="font-sans font-semibold uppercase tracking-[-0.035em] leading-[0.82] text-[clamp(4.2rem,17vw,16rem)]"
        >
          wah:
          <br />
          anggaaa
        </motion.h1>

        {/* role line menabrak nama */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [...EASE] }}
          className="relative z-10 -mt-3 md:-mt-8 ml-[8vw] md:ml-[30vw]"
        >
          <p className="inline-block bg-void/80 pr-4 font-sans font-medium tracking-tight text-[clamp(1.2rem,3.4vw,2.4rem)]">
            Designer <span className="text-bone/40">&</span> Creative Developer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6 items-end mt-10 md:mt-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [...EASE] }}
            className="md:col-span-4 text-[15px] leading-relaxed text-bone/60 max-w-[34ch]"
          >
            Taman bermain satu orang. Aku mendesain &amp; membangun landing page
            fiktif — brand khayalan yang digarap serius.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.85, ease: [...EASE] }}
            className="md:col-span-5 flex items-center gap-8"
          >
            <TLink
              to="/contact"
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              <>say hi <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></>
            </TLink>
            <TLink to="/about" className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone transition-colors">
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

      {/* ============ SELECTED WORKS — staggered collage ============ */}
      <section data-scene={1} className="relative px-5 md:px-10 pt-28 md:pt-40">
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
                  className={`text-stroke pointer-events-none select-none absolute -top-[0.55em] z-10 font-sans font-semibold leading-none text-[clamp(5rem,14vw,12rem)] opacity-60 ${
                    flip ? '-left-2 md:-left-10' : '-right-2 md:-right-10'
                  }`}
                >
                  {w.index}
                </span>

                <div className="relative overflow-hidden bg-[#141412]">
                  {w.thumb ? (
                    <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                      <div className="work-parallax absolute inset-x-0 -top-[8%] h-[116%]">
                        <img
                          src={w.thumb}
                          alt={w.title}
                          loading="lazy"
                          className="img-mono w-full h-full object-cover opacity-80 transition-[opacity,scale] duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center px-6">
                      <span className="font-sans font-semibold uppercase tracking-tight text-center leading-none text-[clamp(2.5rem,8vw,7rem)] text-bone/90">
                        {w.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* judul menabrak gambar */}
                <div className={`relative z-10 -mt-6 md:-mt-10 ${flip ? 'text-right' : ''}`}>
                  <h3 className="inline-block bg-void/85 px-1 font-sans font-semibold uppercase tracking-tight leading-none text-[clamp(2rem,6.5vw,5.5rem)]">
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

      <FullIndex />

      {/* ============ MANIFESTO ============ */}
      <section data-scene={2} className="px-5 md:px-10 pt-32 md:pt-48 pb-8">
        <Meta className="mb-8">[ manifesto ]</Meta>
        <ManifestoScrub text="Iseng-iseng yang diniatkan. Satu halaman, satu dunia kecil — fiktif tapi digarap sampai selesai." />
        <div className="mt-10 md:ml-[40vw]">
          <TLink
            to="/about"
            className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
          >
            <>more about me <span className="inline-block transition-transform group-hover:translate-x-1">→</span></>
          </TLink>
        </div>
      </section>

      <Footer />
    </>
  );
}
