import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneBus } from '../canvas/bus';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home: elemen [data-scene] menggeser state kanvas WebGL (0/1/2).
 * Semua dibersihkan saat unmount.
 */
export function useSceneSections() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) sceneBus.section = Number(el.dataset.scene || 0);
          },
        });
      });
    });
    // pastikan posisi dihitung ulang setelah mount
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
    };
  }, []);
}
