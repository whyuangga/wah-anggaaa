import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { TLink } from '../lib/transition';
import { WORKS } from '../data/works';
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
    // Loop rAF + ukur posisi live tiap frame (bukan trigger persenan yang
    // dihitung sekali): kebal toolbar Chrome yang mengubah tinggi viewport
    // saat scroll — tiang gawang tak bisa bergeser lagi.
    // Mulai saat atas paragraf di 90% layar, penuh saat di 60%: rentang ini
    // selalu reachable (butuh konten bawah ≥40% viewport — footer muat jauh).
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = requestAnimationFrame(update);
      const vh = window.innerHeight;
      if (!vh) return;
      const top = el.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.3)));
      const q = Math.round(progress * 500);
      if (q === last) return; // posisi diam → lewati penulisan (hemat paint)
      last = q;
      const p = progress * spans.length;
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.opacity = String(Math.min(1, Math.max(0.12, p - i)));
      }
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
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

/* ---------- works grid ala Grégory Lallé: kolase + spotlight + overlay ----------
   Mobile: 1 kolom gambar + rel judul sticky di kanan (scroll-spy).
   Desktop: rel judul sticky kiri + kolase masonry. */
const ASPECTS_MD = [
  'md:aspect-[4/5]',
  'md:aspect-square',
  'md:aspect-[4/3]',
  'md:aspect-[3/4]',
  'md:aspect-[16/11]',
  'md:aspect-[1/1]',
];

function Works() {
  const [focus, setFocus] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const active = open !== null ? WORKS[open] : null;
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);

  // kunci scroll halaman saat overlay dibuka (App mendengarkan event ini)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('works-overlay', { detail: { open: open !== null } }));
  }, [open ]);

  // keyboard: esc tutup, panah pindah karya
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % WORKS.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + WORKS.length) % WORKS.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  // scroll-spy khusus sentuh: spotlight mengikuti gambar yang terlihat
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const triggers = cellRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setFocus(i);
        },
      });
    });
    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section data-scene={1} className="relative px-5 md:px-10 pt-28 md:pt-40">
      <div className="flex items-end justify-between mb-10 md:mb-16">
        <h2 className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(2.8rem,9vw,8rem)]">
          works
        </h2>
        <Meta className="pb-2">( 011 )</Meta>
      </div>

      <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-6">
        {/* rel judul: sticky kanan di mobile, sticky kiri di desktop */}
        <div className="order-2 w-[34%] shrink-0 md:order-1 md:col-span-3 md:w-auto">
          <div
            className="sticky top-28 md:top-24 max-h-[72vh] overflow-y-auto flex flex-col gap-y-1 md:max-h-none md:overflow-visible text-right md:text-left py-1"
            onMouseLeave={() => setFocus(null)}
          >
            {WORKS.map((w, i) => {
              const on = focus === i;
              return (
                <button
                  key={w.index}
                  onMouseEnter={() => setFocus(i)}
                  onFocus={() => setFocus(i)}
                  onClick={() => setFocus(focus === i ? null : i)}
                  aria-pressed={on}
                  className={`group flex md:items-baseline items-start justify-end md:justify-start gap-2 py-1 transition-all duration-300 cursor-pointer ${
                    on ? 'text-bone md:translate-x-1.5' : 'text-bone/35 hover:text-bone/80'
                  }`}
                >
                  <span className={`hidden md:inline font-mono text-[10px] ${on ? 'text-bone' : 'text-bone/30'}`}>
                    {w.index}
                  </span>
                  <span className="font-sans font-medium tracking-tight text-[12px] leading-snug md:text-[17px] md:whitespace-nowrap">
                    {on ? `[ ${w.title} ]` : w.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* gambar: 1 kolom di mobile, masonry di desktop */}
        <div className="order-1 flex-1 min-w-0 md:order-2 md:col-span-9">
          <div className="flex flex-col gap-10 md:block md:columns-2 lg:columns-3 md:gap-4">
            {WORKS.map((w, i) => (
              <motion.div
                key={w.index}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, ease: [...EASE] }}
                className="break-inside-avoid md:mb-5"
              >
                <button
                  onClick={() => setOpen(i)}
                  aria-label={`${w.title} — buka focus view`}
                  className={`group block w-full text-left cursor-pointer transition-opacity duration-500 ${
                    focus === null || focus === i ? 'opacity-100' : 'opacity-[0.12]'
                  }`}
                >
                  <span className={`relative block overflow-hidden bg-[#141412] aspect-[16/10] ${ASPECTS_MD[i % ASPECTS_MD.length]}`}>
                    <img
                      src={w.thumb}
                      alt={w.title}
                      loading="lazy"
                      decoding="async"
                      className="img-mono w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-2 left-2 font-mono text-[10px] tracking-[0.14em] bg-void/70 px-1.5 py-0.5 text-bone/80">
                      {w.index}
                    </span>
                  </span>
                  <span className="block pt-2 pb-1">
                    <span className="block font-sans font-medium tracking-tight text-[15px] md:text-base leading-tight">
                      {w.title}
                    </span>
                    <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/45">
                      {w.category}
                    </span>
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
          <Meta className="md:hidden mt-2">tap judul = sorot · tap gambar = buka</Meta>
        </div>
      </div>

      {/* focus overlay */}
      <AnimatePresence>
        {active && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[80] bg-void/[0.97] overflow-y-auto"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={() => setOpen(null)}
          >
            <div
              className="min-h-full max-w-[1400px] mx-auto px-5 md:px-10 py-5 md:py-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-bone/60">
                <span>
                  [ {active.index} / 011 ]
                </span>
                <button
                  onClick={() => setOpen(null)}
                  className="hover:text-bone transition-colors cursor-pointer tracking-[0.18em]"
                >
                  tutup ×
                </button>
              </div>

              <motion.div
                key={active.index}
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [...EASE] }}
                className="mt-5 md:mt-8"
              >
                <div className="overflow-hidden bg-[#141412]">
                  <img
                    src={active.thumb}
                    alt={active.title}
                    className="img-mono w-full max-h-[52vh] md:max-h-[58vh] object-cover"
                  />
                </div>
                <h3 className="mt-6 font-sans font-semibold uppercase tracking-tight leading-[0.9] text-[clamp(2.2rem,7vw,5.5rem)]">
                  {active.title}
                </h3>
                <p className="mt-4 text-[15px] md:text-base text-bone/65 max-w-[52ch] leading-relaxed">
                  {active.blurb}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45">
                  {active.category} — {active.year}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 pb-10">
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
                  >
                    visit live site{' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                  <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em]">
                    <button
                      onClick={() => setOpen((open - 1 + WORKS.length) % WORKS.length)}
                      className="text-bone/50 hover:text-bone transition-colors cursor-pointer"
                    >
                      [ ← prev ]
                    </button>
                    <button
                      onClick={() => setOpen((open + 1) % WORKS.length)}
                      className="text-bone/50 hover:text-bone transition-colors cursor-pointer"
                    >
                      [ next → ]
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

        {/* role line menabrak nama (desktop saja) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [...EASE] }}
          className="relative z-10 mt-3 md:mt-0 md:-mt-8 ml-1 md:ml-[30vw]"
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

      <Works />

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
