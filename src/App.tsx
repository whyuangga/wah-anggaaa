import { useEffect } from 'react';
import Carousel from './components/Carousel';
import Hero from './components/Hero';
import { initScroll } from './lib/scroll';

/**
 * Kerangka situs.
 *
 * Mesin scroll (Lenis) dinyalakan sekali di sini lewat `initScroll()`. Komponen
 * lain — menu overlay sekarang, carousel & overlay karya nanti — memanggil
 * `stopScroll()` / `startScroll()` ke instance yang sama, bukan bikin sendiri.
 */
export default function App() {
  useEffect(() => initScroll(), []);

  return (
    <div id="top">
      <Hero />
      <Carousel />
    </div>
  );
}
