import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bone">{children}</p>
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

/**
 * Dua baris raksasa konvergen dari sisi berlawanan mengikuti scroll —
 * meniru mesin Inspirux (GSAP scrub, x ±% → 0).
 */
function DriftLines({
  lineA,
  lineB,
  className = '',
}: {
  lineA: ReactNode;
  lineB: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current || !aRef.current || !bRef.current) return;
    const mm = gsap.matchMedia();
    const drift = (amt: string) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 1,
          },
        })
        .fromTo(aRef.current, { x: `-${amt}` }, { x: '0%', ease: 'none' }, 0)
        .fromTo(bRef.current, { x: amt }, { x: '0%', ease: 'none' }, 0);
    };
    mm.add('(min-width: 768px)', () => drift('35%'));
    mm.add('(max-width: 767px)', () => drift('12%'));
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={ref} className="whitespace-nowrap">
      <span ref={aRef} className={`block will-change-transform ${className}`}>
        {lineA}
      </span>
      <span ref={bRef} className={`block will-change-transform ${className}`}>
        {lineB}
      </span>
    </div>
  );
}

const CAPABILITIES: [string, string[]][] = [
  ['Design', ['Art Direction', 'Landing Pages', 'Typography', 'Design Systems']],
  ['Develop', ['React', 'Three.js / WebGL', 'GSAP', 'Tailwind']],
];

export default function About() {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  return (
    <>
      <Seo title="tentang" path="/about" />
      <section className="px-5 md:px-10 pt-32 md:pt-44 overflow-x-clip">
        <Meta>[ about ]</Meta>

        <h1 className="mt-8 font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.88] text-[clamp(3rem,11vw,10rem)]">
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, x: '-14%' }}
            animate={{ opacity: 1, x: '0%' }}
            transition={{ duration: 1.6, ease: [...EASE] }}
          >
            halo, aku
          </motion.span>
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, x: '14%' }}
            animate={{ opacity: 1, x: '0%' }}
            transition={{ duration: 1.6, delay: 0.12, ease: [...EASE] }}
          >
            wah<span className="text-bone/40">.</span>
          </motion.span>
        </h1>

        <div className="grid md:grid-cols-12 gap-10 mt-12 md:mt-20">
          <div className="md:col-span-5 md:col-start-7 space-y-6 text-[16px] leading-relaxed text-bone/85">
            <Reveal>
              <p>
                <span className="text-bone">wah:anggaaa adalah taman bermain satu orang</span>{' '}
                milik Angga — designer &amp; creative developer dari Jakarta.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Siang mengerjakan yang beneran, malam merawat yang iseng-iseng:
                brand fiktif, tipografi rusak, dan landing page yang tidak diminta
                siapa pun. Sebelas dunia kecil sejauh ini — dan masih nambah.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-bone/45">
                [ no client work here — just for fun ]
              </p>
            </Reveal>
          </div>
        </div>

        {/* capabilities — daftar mono polos ala referensi */}
        <div className="grid sm:grid-cols-2 gap-12 sm:gap-10 mt-20 md:mt-28 max-w-3xl">
          {CAPABILITIES.map(([group, items], gi) => (
            <div key={group}>
              <Reveal delay={gi * 0.1}>
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-bone/45">
                  {group}
                </p>
                <ul className="mt-5 space-y-1">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[15px] leading-[1.35] tracking-[0.02em] text-bone"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>

        {/* recognition */}
        <div className="mt-20 md:mt-28 md:ml-[40vw]">
          <Meta>[ recognition ]</Meta>
          <div className="mt-6">
            <DriftLines
              lineA="Belum ada —"
              lineB="iseng-iseng dulu."
              className="font-sans font-medium tracking-tight text-[clamp(1.5rem,3.5vw,2.5rem)] text-bone/85"
            />
          </div>
        </div>

        {/* colophon — daftar mono polos ala referensi */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-bone/45">
              colophon
            </p>
            <ul className="mt-5 space-y-1 font-mono text-[15px] leading-[1.35] tracking-[0.02em] text-bone">
              <li>type — general sans + ibm plex mono</li>
              <li>color — #020202 + #eae8e1</li>
              <li>built — react + three.js + gsap</li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-24">
          <Reveal>
            <TLink
              to="/contact"
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              <>say hi <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></>
            </TLink>
          </Reveal>
        </div>
      </section>

      <Footer giant={false} />
    </>
  );
}
