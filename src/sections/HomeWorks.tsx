import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorksFocusOverlay from '../components/WorksFocusOverlay';
import { EASE, Meta } from '../components/ui';
import { WORKS } from '../data/works';

/** rasio gambar kolase bergilir (desktop) */
const ASPECTS_MD = [
  'md:aspect-[4/5]',
  'md:aspect-square',
  'md:aspect-[4/3]',
  'md:aspect-[3/4]',
  'md:aspect-[16/11]',
  'md:aspect-[1/1]',
];

/**
 * Works ala Grégory Lallé: kolase + rel judul + spotlight + focus overlay.
 * Mobile: 1 kolom gambar + rel judul sticky kanan (scroll-spy).
 * Desktop: rel judul sticky kiri + kolase multi-column.
 */
export default function HomeWorks() {
  const [focus, setFocus] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [order, setOrder] = useState<number[]>(() => WORKS.map((_, i) => i));
  const [shuffled, setShuffled] = useState(0);

  const total = WORKS.length;
  const count = String(total).padStart(3, '0');

  const close = () => setOpen(null);
  const prev = () => setOpen((o) => (o === null ? o : (o - 1 + total) % total));
  const next = () => setOpen((o) => (o === null ? o : (o + 1) % total));

  // acak urutan kolase (Fisher-Yates) + kaskade ulang
  const shuffle = () => {
    setOrder((prevOrder) => {
      const nextOrder = [...prevOrder];
      for (let i = nextOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
      }
      return nextOrder;
    });
    setShuffled((n) => n + 1);
    setFocus(null);
  };

  // kunci scroll halaman saat overlay dibuka (App mendengarkan event ini)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('works-overlay', { detail: { open: open !== null } }));
  }, [open]);

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
  }, [shuffled]);

  return (
    <section className="relative px-5 md:px-10 pt-28 md:pt-40">
      <div className="flex items-end justify-between mb-10 md:mb-16">
        <h2 className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(2.8rem,9vw,8rem)]">
          works
        </h2>
        <div className="pb-2 flex items-center gap-5">
          <Meta>( {count} )</Meta>
          <button
            onClick={shuffle}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone transition-colors cursor-pointer"
          >
            [ acak! ]
          </button>
        </div>
      </div>

      <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-6">
        {/* rel judul: sticky kanan di mobile, sticky kiri di desktop */}
        <div className="order-2 w-[34%] shrink-0 md:order-1 md:col-span-3 md:w-auto">
          <div
            className="sticky top-28 md:top-24 max-h-[72vh] overflow-y-auto flex flex-col gap-y-1 md:max-h-none md:overflow-visible text-right md:text-left py-1"
            onMouseLeave={() => setFocus(null)}
          >
            {order.map((i) => {
              const w = WORKS[i];
              const on = focus === i;
              return (
                <button
                  key={w.index}
                  onMouseEnter={() => setFocus(i)}
                  onFocus={() => setFocus(i)}
                  onClick={() => {
                    if (focus === i) {
                      setFocus(null);
                      return;
                    }
                    setFocus(i);
                    // sentuh: tap judul = lompat ke gambarnya (biar tak stuck redup)
                    if (window.matchMedia('(pointer: coarse)').matches) {
                      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      cellRefs.current[i]?.scrollIntoView({
                        behavior: reduced ? 'auto' : 'smooth',
                        block: 'center',
                      });
                    }
                  }}
                  aria-pressed={on}
                  className={`group flex md:items-baseline items-start justify-end md:justify-start gap-2 py-1 transition-all duration-300 cursor-pointer ${
                    on ? 'text-bone md:translate-x-1.5' : 'text-bone/35 hover:text-bone/80'
                  }`}
                >
                  <span
                    className={`hidden md:inline font-mono text-[10px] ${on ? 'text-bone' : 'text-bone/30'}`}
                  >
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

        {/* gambar: 1 kolom di mobile, multi-column di desktop */}
        <div className="order-1 flex-1 min-w-0 md:order-2 md:col-span-9">
          <div className="flex flex-col gap-10 md:block md:columns-2 lg:columns-3 md:gap-4">
            {order.map((i, pos) => {
              const w = WORKS[i];
              return (
                <motion.div
                  key={`${shuffled}-${w.index}`}
                  ref={(el) => {
                    cellRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: Math.min(pos * 0.04, 0.4), ease: [...EASE] }}
                  className="break-inside-avoid md:mb-5"
                >
                  <button
                    onClick={() => setOpen(i)}
                    data-cursor="buka ↗"
                    aria-label={`${w.title} — buka focus view`}
                    className={`group block w-full text-left cursor-pointer transition-opacity duration-500 ${
                      focus === null || focus === i ? 'opacity-100' : 'opacity-[0.12]'
                    }`}
                  >
                    <span
                      className={`relative block overflow-hidden bg-[#141412] aspect-[16/10] ${ASPECTS_MD[i % ASPECTS_MD.length]}`}
                    >
                      <span
                        aria-hidden
                        className="img-mono absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: `url(${w.blur})` }}
                      />
                      <img
                        src={w.thumb}
                        alt={w.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        className="img-mono relative w-full h-full object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-[1.04]"
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
              );
            })}
          </div>
          <Meta className="md:hidden mt-2">tap judul = lompat · tap gambar = buka</Meta>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <WorksFocusOverlay
            key="works-focus"
            work={WORKS[open]}
            total={total}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
