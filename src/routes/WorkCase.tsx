import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import Seo from '../components/Seo';
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

/** satu gambar galeri dengan blur placeholder */
function Figure({ src, blur, alt, n }: { src: string; blur: string; alt: string; n: number }) {
  return (
    <Reveal>
      <figure className="relative overflow-hidden bg-[#141412]">
        <span
          aria-hidden
          className="img-mono absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${blur})` }}
        />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          className="img-mono relative w-full object-cover opacity-0 transition-opacity duration-700"
        />
      </figure>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/35">
        [ fig. {String(n).padStart(2, '0')} ]
      </p>
    </Reveal>
  );
}

export default function WorkCase() {
  const { slug } = useParams();
  const idx = WORKS.findIndex((w) => w.slug === slug);
  if (idx === -1) return <NotFound />;
  const w = WORKS[idx];
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];
  const og = w.thumb.replace(/\.webp$/, '-og.jpg');

  return (
    <>
      <Seo
        title={`${w.title} — studi kasus`}
        description={w.blurb}
        image={og}
        type="article"
        path={`/works/${w.slug}`}
      />
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

        {/* ringkasan */}
        <div className="grid md:grid-cols-12 gap-10 mt-14 md:mt-20">
          <div className="md:col-span-4">
            <Reveal>
              <Meta>[ ringkasan ]</Meta>
              <dl className="mt-6 space-y-4 font-mono text-[11px] uppercase tracking-[0.16em]">
                <div className="flex justify-between border-t border-bone/15 pt-3">
                  <dt className="text-bone/40">klien</dt>
                  <dd className="text-bone/70">fiktif belaka</dd>
                </div>
                <div className="flex justify-between border-t border-bone/15 pt-3">
                  <dt className="text-bone/40">tahun</dt>
                  <dd className="text-bone/70">{w.year}</dd>
                </div>
                <div className="flex justify-between border-t border-bone/15 pt-3">
                  <dt className="text-bone/40">peran</dt>
                  <dd className="text-bone/70">{w.role}</dd>
                </div>
                <div className="flex justify-between border-t border-bone/15 pt-3">
                  <dt className="text-bone/40">stack</dt>
                  <dd className="text-bone/70 text-right">{w.stack.join(' / ')}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="font-sans text-[clamp(1.3rem,2.6vw,1.9rem)] leading-snug tracking-tight text-bone/85">
                {w.blurb}
              </p>
            </Reveal>
          </div>
        </div>

        {/* tantangan */}
        <div className="mt-16 md:mt-24 border-t border-bone/15 pt-8">
          <Reveal>
            <Meta>[ 01 — tantangan ]</Meta>
            <p className="mt-6 max-w-3xl font-sans text-[clamp(1.5rem,3.4vw,2.6rem)] leading-tight tracking-tight">
              {w.challenge}
            </p>
          </Reveal>
        </div>

        {/* proses + galeri selingan */}
        <div className="mt-16 md:mt-24 border-t border-bone/15 pt-8">
          <Reveal>
            <Meta>[ 02 — proses ]</Meta>
          </Reveal>
          <div className="mt-8 space-y-14 md:space-y-20">
            {w.story.map((p, i) => (
              <Fragment key={i}>
                <div className="grid md:grid-cols-12 gap-6">
                  <p className="md:col-span-5 md:col-start-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/40">
                    [ langkah {String(i + 1).padStart(2, '0')} ]
                  </p>
                  <Reveal delay={0.05}>
                    <p className="md:col-span-6 text-[16px] md:text-[17px] leading-relaxed text-bone/70 max-w-xl">
                      {p}
                    </p>
                  </Reveal>
                </div>
                {w.gallery[i] && (
                  <Figure
                    src={w.gallery[i].src}
                    blur={w.gallery[i].blur}
                    alt={`${w.title} — gambar ${i + 1}`}
                    n={i + 1}
                  />
                )}
              </Fragment>
            ))}
            {/* sisa galeri di luar langkah proses */}
            {w.gallery.slice(w.story.length).map((g, j) => (
              <Fragment key={j}>
                <Figure
                  src={g.src}
                  blur={g.blur}
                  alt={`${w.title} — gambar ${w.story.length + j + 1}`}
                  n={w.story.length + j + 1}
                />
              </Fragment>
            ))}
          </div>
        </div>

        {/* hasil */}
        <div className="mt-16 md:mt-24 border-t border-bone/15 pt-8">
          <Reveal>
            <Meta>[ 03 — hasil ]</Meta>
            <p className="mt-6 max-w-3xl font-sans text-[clamp(1.5rem,3.4vw,2.6rem)] leading-tight tracking-tight text-bone/90">
              {w.outcome}
            </p>
          </Reveal>
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
    </>
  );
}
