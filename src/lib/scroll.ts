import Lenis from 'lenis';

/**
 * SATU mesin scroll untuk seluruh situs.
 *
 * Lenis disimpan di tingkat modul supaya komponen mana pun bisa menghentikan dan
 * menjalankannya kembali (menu overlay, nanti carousel & overlay karya) tanpa
 * harus mengoper instance lewat props atau context.
 *
 * Dulu sempat terpikir: tiap komponen bikin instance sendiri. Itu berarti dua
 * rAF loop yang saling berebut — persis kesalahan yang bikin situs lama terasa
 * berat.
 */
let lenis: Lenis | null = null;
let raf = 0;

export function initScroll(): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: !reduced,
    // sentuh: biarkan momentum asli perangkat yang bekerja — di mobile,
    // smoothing buatan hampir selalu terasa salah.
    syncTouch: false,
  });

  const tick = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}

/**
 * Pindah ke posisi gulir tertentu.
 *
 * Dipakai carousel: (a) saat menyetel ulang setelah strip berhenti (snap),
 * (b) saat strip digeser dengan tetikus/jari — di situ `immediate` dipakai
 * supaya gerakan jari tidak dilawan animasi Lenis.
 */
export function scrollToY(
  y: number,
  opsi?: { duration?: number; immediate?: boolean; onComplete?: () => void },
) {
  if (lenis)
    lenis.scrollTo(y, {
      duration: opsi?.duration,
      immediate: opsi?.immediate,
      onComplete: opsi?.onComplete,
    });
  else {
    window.scrollTo({ top: y, behavior: opsi?.immediate ? 'auto' : 'smooth' });
    opsi?.onComplete?.();
  }
}

/** Naik ke paling atas. Dipakai saat nanti pindah halaman. */
export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}
