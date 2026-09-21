import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import { TransitionProvider } from './lib/transition';
import { Analytics } from '@vercel/analytics/react';

gsap.registerPlugin(ScrollTrigger);

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));
const WorkCase = lazy(() => import('./routes/WorkCase'));
const NotFound = lazy(() => import('./routes/NotFound'));
const Journal = lazy(() => import('./routes/Journal'));
const JournalPost = lazy(() => import('./routes/JournalPost'));

/** Scroll ke atas + hitung ulang posisi trigger setiap ganti route. */
function RouteSync({ scrollTop }: { scrollTop: () => void }) {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollTop();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, scrollTop]);
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

  // Lenis digerakkan oleh GSAP ticker (pola resmi Lenis + ScrollTrigger)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: !reduced,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts) document.fonts.ready.then(onLoad).catch(() => {});

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // kunci scroll selama intro
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
      <Analytics />
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
