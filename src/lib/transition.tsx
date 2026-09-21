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
import { animate } from 'motion/react';
import { EASE } from '../components/ui';

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

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

type ProviderProps = {
  children: ReactNode;
  /** wrapper konten route — SATU-SATUNYA elemen yang di-transform saat transisi */
  contentRef: RefObject<HTMLDivElement | null>;
  scrollTop: () => void;
};

/**
 * Transisi halaman: konten lama fade-out naik → `navigate()` → konten baru
 * fade-in turun. Digerakkan `animate()` dari Motion (sudah ada di bundle untuk
 * seluruh UI), jadi tidak ada pustaka animasi kedua yang perlu diunduh.
 *
 * Penting: `contentRef` tidak boleh memuat elemen `position: fixed`
 * (transform di elemen ini jadi containing block bagi mereka).
 * Nav ada di luar wrapper, overlay works di-render lewat portal.
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

      const run = async () => {
        try {
          if (el) {
            await animate(
              el,
              reduced ? { opacity: 0 } : { opacity: 0, y: -24 },
              { duration: reduced ? 0.15 : 0.32, ease: 'easeIn' },
            ).finished;
          }

          navigate(to);
          scrollTop();
          await nextFrame(); // biar konten baru sempat ter-commit sebelum fade-in

          if (el) {
            await animate(
              el,
              reduced ? { opacity: [0, 1] } : { opacity: [0, 1], y: [24, 0] },
              { duration: reduced ? 0.25 : 0.7, ease: [...EASE] },
            ).finished;
          }
        } finally {
          // bersihkan inline style: sisa transform mengubah containing block
          // dan merusak elemen fixed di dalam konten
          if (el) {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
          busyRef.current = false;
        }
      };

      void run();
    },
    [location.pathname, navigate, scrollTop, contentRef],
  );

  // back/forward browser (location berubah tanpa go()): fade cepat
  useEffect(() => {
    if (busyRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = contentRef.current;
    if (!el) return;
    const controls = animate(el, { opacity: [0.2, 1] }, { duration: 0.45, ease: 'easeOut' });
    controls.finished
      .then(() => {
        if (!busyRef.current) el.style.removeProperty('opacity');
      })
      .catch(() => {});
  }, [location.pathname, contentRef]);

  return <GoContext.Provider value={go}>{children}</GoContext.Provider>;
}

type TLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Link internal yang lewat transisi halaman (tetap `<a>` untuk semantik). */
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
