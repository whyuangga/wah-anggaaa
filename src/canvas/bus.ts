/**
 * Bus mutable untuk kanvas WebGL — ditulis oleh React (scroll, route,
 * transisi), dibaca tiap frame oleh Scene. Tanpa re-render React.
 */
export const sceneBus = {
  /** route aktif: '/', '/about', '/contact' */
  route: '/',
  /** section home yang sedang dominan: 0 hero, 1 works, 2 manifesto */
  section: 0,
  /** progres scroll halaman 0..1 (dari Lenis) */
  progress: 0,
  /** velositas scroll (dari Lenis, diredam di Scene) */
  velocity: 0,
  /** warp transisi 0..1 (di-tween oleh GSAP saat pindah halaman) */
  morph: 0,
};

/** Target state visual: home pakai section, halaman lain punya state sendiri. */
export function sceneTarget(): number {
  if (sceneBus.route === '/about') return 3;
  if (sceneBus.route === '/contact') return 4;
  if (sceneBus.route.startsWith('/works/')) return 1;
  return Math.min(2, Math.max(0, sceneBus.section));
}
