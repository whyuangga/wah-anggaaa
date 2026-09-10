import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneBus } from '../canvas/bus';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home: elemen [data-scene] menggeser state kanvas WebGL (0/1/2),
 * dan .work-parallax dapat parallax scrub. Semua dibersihkan saat unmount.
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

      gsap.utils.toArray<HTMLElement>('.work-parallax').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
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
