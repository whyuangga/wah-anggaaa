import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Loader from './components/Loader';
import { sceneBus } from './canvas/bus';
import { TransitionProvider } from './lib/transition';

gsap.registerPlugin(ScrollTrigger);

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));
const Scene = lazy(() => import('./canvas/Scene'));

/** Sinkron route → bus scene + scroll atas + refresh trigger. */
function RouteSync({ scrollTop }: { scrollTop: () => void }) {
  const { pathname } = useLocation();
  useEffect(() => {
    sceneBus.route = pathname;
    sceneBus.section = 0;
    scrollTop();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, scrollTop]);
  return null;
}

function Shell() {
  const lenisRef = useRef<Lenis | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Ala Onoera: konten TIDAK di-mount sebelum intro selesai,
  // lalu fade-in kalem berbarengan dengan terangkatnya overlay.
  // Intro selalu tampil setiap refresh (tanpa session skip).
  const [entered, setEntered] = useState(false);

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

    lenis.on('scroll', (e: Lenis) => {
      ScrollTrigger.update();
      sceneBus.progress = e.progress ?? 0;
      sceneBus.velocity = e.velocity ?? 0;
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
    const lenis = lenisRef.current;
    if (!entered) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
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

  // preload chunk route + scene sejak awal → reveal tanpa jeda
  useEffect(() => {
    import('./routes/Home').catch(() => {});
    import('./routes/About').catch(() => {});
    import('./routes/Contact').catch(() => {});
    import('./canvas/Scene').catch(() => {});
  }, []);

  return (
    <TransitionProvider contentRef={contentRef} scrollTop={scrollTop}>
      <div className="min-h-screen bg-void text-bone">
        <AnimatePresence>{!entered && <Loader onDone={() => setEntered(true)} />}</AnimatePresence>

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <div ref={contentRef} className="relative z-10">
          {entered && <Nav />}
          <RouteSync scrollTop={scrollTop} />
          {entered && (
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          )}
        </div>
      </div>
    </TransitionProvider>
  );
}

export default function App() {
  return (
    // BASE_URL: '/' saat dev lokal tertentu, '/wah-anggaaa/' di Pages —
    // basename router selalu mengikutinya.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  );
}
