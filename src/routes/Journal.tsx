import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';
import { POSTS, formatDate } from '../lib/journal';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Journal() {
  return (
    <>
      <Seo
        title="jurnal"
        path="/journal"
        description="Jurnal wahanggaaa — catatan proses, eksperimen gagal, dan opini sok tahu. Tanpa jadwal terbit."
      />
      <section data-scene={2} className="px-5 md:px-10 pt-32 md:pt-44">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bone">
          [ jurnal — {String(POSTS.length).padStart(3, '0')} tulisan ]
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.88] text-[clamp(2.8rem,10vw,9rem)]"
        >
          jurnal<span className="text-bone/40">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [...EASE] }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/60"
        >
          Catatan proses, eksperimen gagal, dan opini sok tahu. Tanpa jadwal terbit — terbit
          kalau keisengannya menyala.
        </motion.p>

        <div className="mt-14 md:mt-20 border-t border-bone/15">
          {POSTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [...EASE] }}
            >
              <TLink
                to={`/journal/${p.slug}`}
                className={`group grid md:grid-cols-12 gap-2 md:gap-6 py-8 ${i < POSTS.length - 1 ? 'border-b border-bone/15' : ''}`}
              >
                <span className="md:col-span-1 font-mono text-[11px] tracking-[0.18em] text-bone/40">
                  {String(POSTS.length - i).padStart(3, '0')}
                </span>
                <span className="md:col-span-6 font-sans font-medium tracking-tight text-[clamp(1.4rem,3.4vw,2.4rem)] leading-tight group-hover:opacity-70 transition-opacity">
                  {p.title}
                </span>
                <span className="md:col-span-3 text-[14px] leading-relaxed text-bone/70">
                  {p.desc}
                </span>
                <span className="md:col-span-2 md:text-right font-mono text-[11px] uppercase tracking-[0.16em] text-bone/40">
                  {formatDate(p.date)}
                </span>
              </TLink>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer giant={false} rule={false} />
    </>
  );
}
