import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import type Lenis from 'lenis';
import Nav from './components/Nav';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import { TransitionProvider } from './lib/transition';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));
const WorkCase = lazy(() => import('./routes/WorkCase'));
const NotFound = lazy(() => import('./routes/NotFound'));
const Journal = lazy(() => import('./routes/Journal'));
const JournalPost = lazy(() => import('./routes/JournalPost'));

/** Scroll ke atas setiap ganti route. */
function RouteSync({ scrollTop }: { scrollTop: () => void }) {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollTop();
  }, [pathname, scrollTop]);
  return null;
}

/** Analytics hanya di produksi, dan hanya setelah browser menganggur. */
function DeferredAnalytics() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      import('@vercel/analytics')
        .then((m) => m.inject())
        .catch(() => {});
    };
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 3000 })
      : window.setTimeout(start, 1500);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, []);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Intro sinematik hanya di landing (`/`) dan hanya saat halaman di-refresh.
  // Route lain langsung tampil: tidak ada video yang menahan LCP, dan crawler
  // selalu melihat kontennya.
  const [entered, setEntered] = useState(() => pathname !== '/');

  const scrollTop = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  /**
   * Smooth scroll. Lenis diimpor dinamis: ±10 kB gzip yang dulu ikut menahan
   * paint pertama kini menyusul setelah konten tampil. Selama belum siap,
   * scroll tetap pakai native — jadi tidak ada momen scroll "mati".
   */
  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;

    import('lenis')
      .then(({ default: Lenis }) => {
        if (disposed) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lenis = new Lenis({
          duration: 1.15,
          smoothWheel: !reduced,
          syncTouch: false,
        });
        lenisRef.current = lenis;

        // digerakkan loop rAF sendiri — dulu lewat GSAP ticker, sekarang tidak
        // perlu pustaka tambahan hanya untuk memanggil lenis.raf tiap frame
        let raf = 0;
        const tick = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        teardown = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
          lenisRef.current = null;
        };
      })
      .catch(() => {});

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  // kunci scroll selama intro (Lenis belum tentu sudah siap — body cukup)
  useEffect(() => {
    if (entered) {
      lenisRef.current?.start();
      document.body.style.overflow = '';
      return;
    }
    lenisRef.current?.stop();
    document.body.style.overflow = 'hidden';
  }, [entered]);

  // kunci scroll halaman saat focus overlay works dibuka
  useEffect(() => {
    const onOverlay = (e: Event) => {
      const open = (e as CustomEvent<{ open: boolean }>).detail.open;
      if (open) lenisRef.current?.stop();
      else if (entered) lenisRef.current?.start();
    };
    window.addEventListener('works-overlay', onOverlay);
    return () => window.removeEventListener('works-overlay', onOverlay);
  }, [entered]);

  return (
    <TransitionProvider contentRef={contentRef} scrollTop={scrollTop}>
      <div className="min-h-screen bg-void text-bone">
        <AnimatePresence>{!entered && <Loader onDone={() => setEntered(true)} />}</AnimatePresence>

        <Cursor />

        <div className="relative z-10">
          {entered && <Nav />}
          <RouteSync scrollTop={scrollTop} />

          {/* Wrapper transisi: satu-satunya elemen yang di-transform saat pindah
              halaman, dan sengaja TIDAK memuat elemen fixed (Nav di luar,
              overlay works lewat portal) agar transform tak merusak posisinya. */}
          <div ref={contentRef}>
            {entered && (
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/works/:slug" element={<WorkCase />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/journal/:slug" element={<JournalPost />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            )}
          </div>
        </div>
      </div>
      <DeferredAnalytics />
    </TransitionProvider>
  );
}

export default function App() {
  return (
    // BASE_URL: '/' di Vercel, '/wah-anggaaa/' di dev lokal & Pages —
    // basename router selalu mengikutinya.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  );
}
