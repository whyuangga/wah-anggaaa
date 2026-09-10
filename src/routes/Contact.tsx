import { motion } from 'motion/react';
import Footer from '../components/Footer';
import { CONTACT } from '../data/works';
import { useJakartaTime } from '../hooks/useJakartaTime';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const time = useJakartaTime();

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-44 min-h-[80svh]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
          [ contact ]
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 font-sans font-semibold uppercase tracking-[-0.035em] leading-[0.82] text-[clamp(4rem,18vw,17rem)]"
        >
          say hi<span className="text-bone/40">.</span>
        </motion.h1>

        <motion.a
          href={`mailto:${CONTACT.email}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [...EASE] }}
          className="group inline-block mt-10 md:mt-14 md:ml-[30vw] font-sans font-medium tracking-tight text-[clamp(1.4rem,4vw,3rem)] underline underline-offset-[10px] decoration-bone/30 hover:decoration-bone transition-all"
        >
          {CONTACT.email}
          <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"> ↗</span>
        </motion.a>

        <div className="mt-16 md:mt-24 border-t border-bone/15">
          {CONTACT.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 border-b border-bone/15 transition-colors duration-300 hover:bg-bone hover:text-void px-1 md:px-3"
            >
              <span className="font-sans font-medium uppercase tracking-tight text-2xl md:text-4xl">
                {s.label}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/40 group-hover:text-void/60">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/50">
          <p>jakarta, id — {time} wib</p>
          <p>iseng-iseng welcome — no brief, no deadline, no drama</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
