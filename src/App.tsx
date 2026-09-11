import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Nav from './components/Nav';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import { sceneBus } from './canvas/bus';
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

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Umpan shader dari scroll NATIVE (satu-satunya sumber progress/velocity):
    // Lenis + syncTouch:false tak memancarkan event saat scroll sentuh, dan di
    // desktop pun Lenis menggerakkan window scroll asli → tercakup juga.
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onNativeScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sceneBus.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const v = ((y - lastY) / dt) * 16.7; // px per frame (se-skala Lenis)
      sceneBus.velocity = Math.max(-60, Math.min(60, v));
      lastY = y;
      lastT = now;
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    // velocity meluruh ke nol tiap frame (Scene me-lerp menujunya)
    let sraf = 0;
    const decay = () => {
      sceneBus.velocity *= 0.9;
      if (Math.abs(sceneBus.velocity) < 0.01) sceneBus.velocity = 0;
      sraf = requestAnimationFrame(decay);
    };
    sraf = requestAnimationFrame(decay);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts) document.fonts.ready.then(onLoad).catch(() => {});

    return () => {
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onNativeScroll);
      cancelAnimationFrame(sraf);
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
    import('./routes/WorkCase').catch(() => {});
    import('./routes/NotFound').catch(() => {});
    import('./routes/Journal').catch(() => {});
    import('./routes/JournalPost').catch(() => {});
    import('./canvas/Scene').catch(() => {});
  }, []);

  return (
    <TransitionProvider contentRef={contentRef} scrollTop={scrollTop}>
      <div className="min-h-screen bg-void text-bone">
        <AnimatePresence>{!entered && <Loader onDone={() => setEntered(true)} />}</AnimatePresence>

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <Cursor />

        <div ref={contentRef} className="relative z-10">
          {entered && <Nav />}
          <RouteSync scrollTop={scrollTop} />
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
