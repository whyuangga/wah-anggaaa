import { useEffect, useRef, useState } from 'react';

/**
 * Kursor custom desktop: titik + cincin mengikuti mouse (rAF lerp),
 * membesar di link/button, menampilkan label dari [data-cursor].
 * Hanya di fine pointer tanpa reduced-motion; cursor native
 * disembunyikan via class .has-cursor di <html>.
 */
export default function Cursor() {
  const [on, setOn] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    document.documentElement.classList.add('has-cursor');
    return () => document.documentElement.classList.remove('has-cursor');
  }, []);

  useEffect(() => {
    if (!on) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const d = { x: -100, y: -100, tx: -100, ty: -100 };
    const r = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    let shown = false;

    const loop = () => {
      d.x += (d.tx - d.x) * 0.4;
      d.y += (d.ty - d.y) * 0.4;
      r.x += (r.tx - r.x) * 0.16;
      r.y += (r.ty - r.y) * 0.16;
      dot.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      d.tx = e.clientX;
      d.ty = e.clientY;
      r.tx = e.clientX;
      r.ty = e.clientY;
      if (!shown) {
        shown = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      const t = e.target as HTMLElement;
      const labelled = t.closest?.('[data-cursor]') as HTMLElement | null;
      const clickable = t.closest?.('a, button') as HTMLElement | null;
      if (labelled) {
        label.textContent = labelled.getAttribute('data-cursor') || '';
        ring.dataset.mode = 'label';
      } else if (clickable) {
        ring.dataset.mode = 'hover';
      } else {
        ring.dataset.mode = '';
      }
    };
    const onLeave = () => {
      shown = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [on ]);

  if (!on) return null;
  return (
    <>
      <div ref={dotRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0">
        <span className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference" />
      </div>
      <div ref={ringRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[199] opacity-0">
        <span className="cursor-ring">
          <span ref={labelRef} className="cursor-label" />
        </span>
      </div>
    </>
  );
}
