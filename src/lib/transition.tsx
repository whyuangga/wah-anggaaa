import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneBus } from '../canvas/bus';

gsap.registerPlugin(ScrollTrigger);

type GoFn = (to: string) => void;
const GoContext = createContext<GoFn>(() => {});
export const useGo = () => useContext(GoContext);

/** status aktif nav: case study ikut index, postingan ikut journal. */
export function isActivePath(to: string, pathname: string): boolean {
  if (pathname === to) return true;
  if (to === '/' && pathname.startsWith('/works/')) return true;
  if (to === '/journal' && pathname.startsWith('/journal/')) return true;
  return false;
}

type ProviderProps = {
  children: ReactNode;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollTop: () => void;
};

/**
 * Transisi 3D morph: konten fade-out + warp shader → navigate →
 * konten fade-in + warp reda. Back/forward browser dapat fade cepat.
 */
export function TransitionProvider({ children, contentRef, scrollTop }: ProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const busyRef = useRef(false);

  const go = useCallback<GoFn>(
    (to: string) => {
      if (busyRef.current || to === location.pathname) {
        if (to === location.pathname) scrollTop();
        return;
      }
      busyRef.current = true;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = contentRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          busyRef.current = false;
          // bersihkan inline style: sisa transform mengubah containing block
          // dan merusak elemen fixed (Nav) di dalam konten
          if (el) gsap.set(el, { clearProps: 'opacity,transform' });
        },
      });

      if (!reduced) {
        tl.to(sceneBus, { morph: 1, duration: 0.38, ease: 'power2.in' }, 0);
        if (el) tl.to(el, { opacity: 0, y: -24, duration: 0.32, ease: 'power2.in' }, 0);
      } else if (el) {
        tl.to(el, { opacity: 0, duration: 0.15 }, 0);
      }

      tl.add(() => {
        navigate(to);
        scrollTop();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      if (!reduced && el) {
        tl.fromTo(
          el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '+=0.02',
        );
        tl.to(sceneBus, { morph: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55');
      } else {
        if (el) tl.to(el, { opacity: 1, duration: 0.25 }, '+=0.02');
        tl.to(sceneBus, { morph: 0, duration: 0.01 }, 0);
      }
    },
    [location.pathname, navigate, scrollTop, contentRef],
  );

  // back/forward browser (location berubah tanpa go()): fade cepat + warp kecil
  useEffect(() => {
    if (busyRef.current) return;
    const el = contentRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0.2 },
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => gsap.set(el, { clearProps: 'opacity' }),
        },
      );
    }
    gsap.timeline().to(sceneBus, { morph: 0.4, duration: 0.2 }).to(sceneBus, { morph: 0, duration: 0.5 });
  }, [location.pathname]);

  return <GoContext.Provider value={go}>{children}</GoContext.Provider>;
}

type TLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Link internal yang lewat transisi morph (tetap <a> untuk semantik). */
export function TLink({ to, children, className, ariaLabel }: TLinkProps) {
  const go = useGo();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // hormati klik modifier / tombol tengah (buka tab baru)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  // href sadar basename: klik modifier / tab baru tetap benar di Pages
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <a href={`${base}${to}`} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
