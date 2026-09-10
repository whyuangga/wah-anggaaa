import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { WORKS } from '../data/works';
import { TLink } from '../lib/transition';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;
const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/loader.mp4`;

/** Kurasi bebas diganti — index ke WORKS (0-based). */
const SELECTED = [0, 1, 3, 4, 9, 10];

/**
 * Selected works ala Inspirux: dua baris judul raksasa melayang horizontal
 * berlawanan arah mengikuti scroll (scrub) + kolom kiri sticky + baris karya
 * + preview gambar mengikuti kursor (desktop).
 */
export default function SelectedWorks() {
  const headRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<HTMLDivElement>(null);
  const lineBRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const prevImgRef = useRef<HTMLImageElement>(null);

  // drift horizontal berlawanan (mesin: GSAP scrub, meniru Inspirux)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mm = gsap.matchMedia();
    const drift = (amt: string) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top bottom',
            end: 'bottom +=40%',
            scrub: 1,
          },
        })
        .fromTo(lineARef.current, { x: `-${amt}` }, { x: '0%', ease: 'none' }, 0)
        .fromTo(lineBRef.current, { x: amt }, { x: '0%', ease: 'none' }, 0);
    };
    mm.add('(min-width: 768px)', () => drift('50%'));
    mm.add('(max-width: 767px)', () => drift('18%'));
    return () => {
      mm.revert();
    };
  }, []);

  // preview melayang mengikuti kursor (fine pointer saja)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const prev = prevRef.current;
    const img = prevImgRef.current;
    const list = listRef.current;
    if (!prev || !img || !list) return;

    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = false;

    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.14;
      pos.y += (pos.ty - pos.y) * 0.14;
      prev.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[data-thumb]');
      if (!a) return;
      const src = a.getAttribute('data-thumb');
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      if (!visible) {
        visible = true;
        pos.x = pos.tx;
        pos.y = pos.ty;
        prev.style.opacity = '1';
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      visible = false;
      cancelAnimationFrame(raf);
      prev.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    list.addEventListener('mouseover', onOver);
    list.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      list.removeEventListener('mouseover', onOver);
      list.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="mt-20 md:mt-32 overflow-x-clip">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
        [ selected works ]
      </p>

      {/* judul raksasa: dua baris konvergen dari sisi berlawanan */}
      <div ref={headRef} className="mt-6 select-none" aria-hidden>
        <div ref={lineARef} className="whitespace-nowrap will-change-transform text-center">
          <span className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(3.2rem,13vw,11rem)]">
            selected
          </span>
        </div>
        <div
          ref={lineBRef}
          className="whitespace-nowrap will-change-transform flex items-center justify-center gap-[2.5vw]"
        >
          <span className="hidden sm:block h-[0.62em] aspect-video overflow-hidden shrink-0 text-[clamp(3.2rem,13vw,11rem)]">
            <video
              src={VIDEO_SRC}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
            />
          </span>
          <span className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(3.2rem,13vw,11rem)]">
            works<sup className="font-mono font-normal text-[0.16em] tracking-[0.1em] text-bone/50 align-super ml-3">[ 06 ]</sup>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-10 mt-12 md:mt-20">
        {/* kolom kiri: sticky selama baris kanan lewat */}
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <p className="text-[15px] leading-relaxed text-bone/60 max-w-[30ch]">
              Enam dari sebelas dunia kecil — yang paling sering aku buka-buka
              sendiri. Sisanya nunggu di index.
            </p>
            <TLink
              to="/"
              className="group inline-block mt-8 font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              <>view all works <span className="inline-block transition-transform group-hover:translate-x-1">→</span></>
            </TLink>
          </div>
        </div>

        {/* kolom kanan: baris karya */}
        <div ref={listRef} className="md:col-span-8 border-t border-bone/15">
          {SELECTED.map((wi, i) => {
            const w = WORKS[wi];
            return (
              <motion.a
                key={w.index}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                data-thumb={w.thumb}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [...EASE] }}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 py-6 md:py-8 border-b border-bone/15"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-bone/40 group-hover:text-bone transition-colors">
                  .{String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-sans font-semibold uppercase tracking-tight leading-[0.95] text-[clamp(1.9rem,5.5vw,3.8rem)] truncate">
                    {w.title}
                  </span>
                  <span className="block mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/45">
                    {w.category} — {w.year}
                  </span>
                </span>
                <span className="font-sans text-2xl md:text-3xl text-bone/50 transition-all duration-500 group-hover:text-bone group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-px w-full bg-bone origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* preview melayang (desktop saja) */}
      <div
        ref={prevRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
      >
        <img
          ref={prevImgRef}
          alt=""
          className="img-mono block w-64 lg:w-80 aspect-[4/3] object-cover -translate-x-1/2 -translate-y-[112%]"
        />
      </div>
    </div>
  );
}
