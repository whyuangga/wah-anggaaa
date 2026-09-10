import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Loader, { INTRO_KEY } from './components/Loader';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));

/** Kembalikan scroll ke atas setiap pindah route (lewat Lenis bila ada). */
function ScrollManager({ getLenis }: { getLenis: () => Lenis | null }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, getLenis]);
  return null;
}

function Shell() {
  const lenisRef = useRef<Lenis | null>(null);
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_KEY);
    } catch {
      return true;
    }
  });

  const getLenis = useCallback(() => lenisRef.current, []);

  // Lenis smooth scroll — cleanup benar untuk StrictMode
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      // touch: default native momentum (paling mulus di mobile)
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // kunci scroll selama intro
  useEffect(() => {
    const lenis = lenisRef.current;
    if (loading) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-void text-bone">
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>

      {/* Phase 2: satu kanvas WebGL fixed akan di-mount di sini */}
      <div id="webgl-bg" aria-hidden className="fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10">
        <Nav />
        <ScrollManager getLenis={getLenis} />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
