import { useEffect, useRef, useState } from 'react';
import Carousel, { type PosisiKlik } from './components/Carousel';
import Hero from './components/Hero';
import ProjectOverlay from './components/ProjectOverlay';
import { initScroll, scrollToY, startScroll, stopScroll } from './lib/scroll';

/**
 * Kerangka situs.
 *
 * Mesin scroll (Lenis) dinyalakan sekali di sini lewat `initScroll()`.
 * Overlay detail karya menghentikan mesin itu (`stopScroll`) dan
 * menjalankannya kembali (`startScroll`) lewat instance yang sama.
 */
export default function App() {
  useEffect(() => initScroll(), []);

  const [detail, setDetail] = useState<{ slug: string; posisi: PosisiKlik } | null>(null);
  /** hash tujuan dari nav overlay — dijalankan setelah overlay benar-benar lepas */
  const pindahRef = useRef<string | null>(null);

  const bukaKarya = (posisi: PosisiKlik) => {
    setDetail({ slug: posisi.slug, posisi });
    stopScroll();
  };

  const selesai = () => {
    setDetail(null);
    startScroll();
    const tujuan = pindahRef.current;
    if (!tujuan) return;
    pindahRef.current = null;
    requestAnimationFrame(() => {
      const el = tujuan === '#top' ? null : document.querySelector(tujuan);
      if (el) {
        scrollToY(el.getBoundingClientRect().top + window.scrollY, { duration: 0.8 });
      } else {
        scrollToY(0, { duration: 0.8 });
      }
    });
  };

  const pindah = (hash: string) => {
    pindahRef.current = hash; // overlay-nya sendiri yang memicu animasi keluar
  };

  return (
    <>
      {/* overlay TIDAK boleh di dalam #top: halaman lama yang memudar 0,35 s
          tidak boleh ikut memudar bersama overlay (persis pemisahan
          halaman lama/baru di transisi sumbernya) */}
      <div id="top">
        <Hero />
        <Carousel jeda={detail !== null} onOpen={bukaKarya} />
      </div>
      {detail && (
        <ProjectOverlay
          slug={detail.slug}
          posisi={detail.posisi}
          onSelesai={selesai}
          onPindah={pindah}
        />
      )}
    </>
  );
}
