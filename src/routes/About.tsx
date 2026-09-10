import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">{children}</p>
  );
}

const CAPABILITIES: [string, string[]][] = [
  ['Design', ['Art Direction', 'Landing Pages', 'Typography', 'Design Systems']],
  ['Develop', ['React', 'Three.js / WebGL', 'GSAP', 'Tailwind']],
];

export default function About() {
  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-44">
        <Meta>[ about ]</Meta>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [...EASE] }}
          className="mt-8 font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.88] text-[clamp(3rem,11vw,10rem)]"
        >
          halo, aku
          <br />
          wah<span className="text-bone/40">.</span>
        </motion.h1>

        <div className="grid md:grid-cols-12 gap-10 mt-12 md:mt-20">
          <div className="md:col-span-5 md:col-start-7 space-y-6 text-[16px] leading-relaxed text-bone/70">
            <p>
              <span className="text-bone">wah:anggaaa adalah taman bermain satu orang</span>{' '}
              milik Angga — designer &amp; creative developer dari Jakarta.
            </p>
            <p>
              Siang mengerjakan yang beneran, malam merawat yang iseng-iseng:
              brand fiktif, tipografi rusak, dan landing page yang tidak diminta
              siapa pun. Sebelas dunia kecil sejauh ini — dan masih nambah.
            </p>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-bone/45">
              [ no client work here — just for fun ]
            </p>
          </div>
        </div>

        {/* capabilities */}
        <div className="grid md:grid-cols-12 gap-10 mt-20 md:mt-32">
          <Meta>
            <span className="md:col-span-12">[ capabilities ]</span>
          </Meta>
          {CAPABILITIES.map(([group, items], gi) => (
            <div key={group} className={`md:col-span-4 ${gi === 0 ? 'md:col-start-3' : ''}`}>
              <p className="font-sans font-medium text-xl mb-5">{group}</p>
              <ul className="border-t border-bone/15">
                {items.map((item) => (
                  <li
                    key={item}
                    className="py-4 border-b border-bone/15 font-mono text-[12px] uppercase tracking-[0.16em] text-bone/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* recognition */}
        <div className="mt-20 md:mt-32 md:ml-[40vw]">
          <Meta>[ recognition ]</Meta>
          <p className="mt-6 font-sans font-medium tracking-tight text-[clamp(1.5rem,3.5vw,2.5rem)] text-bone/70">
            Belum ada —<br />iseng-iseng dulu.
          </p>
        </div>

        {/* colophon */}
        <div className="mt-20 md:mt-32">
          <Meta>[ colophon ]</Meta>
          <div className="mt-6 grid sm:grid-cols-3 gap-6 font-mono text-[12px] uppercase tracking-[0.16em] text-bone/60">
            <p>type — general sans + ibm plex mono</p>
            <p>color — #0d0d0c + #eae8e1</p>
            <p>built — react + three.js + gsap</p>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <Link
            to="/contact"
            className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
          >
            say hi <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
