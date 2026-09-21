import { useEffect, useRef } from 'react';
import { Arrow, CTA, Meta } from '../components/ui';
import { TLink } from '../lib/transition';

/**
 * Manifesto: opacity menyala kata per kata mengikuti scroll.
 * Ukur posisi live tiap frame (kebal toolbar Chrome yang mengubah tinggi
 * viewport saat scroll), tulis opacity langsung ke style — tanpa state React,
 * tanpa re-render saat scroll.
 * Rentang: atas paragraf di 90% layar → penuh di 60%.
 */
function ManifestoScrub({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll('[data-w]')) as HTMLElement[];
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

/** Babak 3 landing: manifesto + jalan ke /about. */
export default function HomeManifesto() {
  return (
    <section className="px-5 md:px-10 pt-32 md:pt-48 pb-8">
      <Meta className="mb-8">[ manifesto ]</Meta>
      <ManifestoScrub text="Iseng-iseng yang diniatkan. Satu halaman, satu dunia kecil — fiktif tapi digarap sampai selesai." />
      <div className="mt-10 md:ml-[40vw]">
        <TLink to="/about" className={`group ${CTA}`}>
          <>
            more about me <Arrow dir="e" />
          </>
        </TLink>
      </div>
    </section>
  );
}
