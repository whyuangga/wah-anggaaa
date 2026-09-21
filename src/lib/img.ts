import { IMAGE_META } from '../data/image-dims';

/**
 * Helper penyajian gambar. Datanya dihasilkan `scripts/media.mjs` saat prebuild,
 * jadi daftar varian di sini selalu sama dengan berkas yang benar-benar ada.
 */

const keyOf = (url: string) => url.slice(url.lastIndexOf('/') + 1);

/** Dimensi intrinsik — untuk atribut `width`/`height` (pemesanan ruang, nol CLS). */
export function dimsOf(url: string): { width: number; height: number } | undefined {
  const meta = IMAGE_META[keyOf(url)];
  return meta ? { width: meta.w, height: meta.h } : undefined;
}

/**
 * `srcSet` dari varian yang tersedia (mis. `…-800.webp 800w, … 1200w`).
 * Mengembalikan `undefined` bila hanya ada satu kandidat — supaya browser
 * tidak memilih di antara opsi yang sama.
 */
export function srcSetOf(url: string): string | undefined {
  const meta = IMAGE_META[keyOf(url)];
  if (!meta || meta.widths.length === 0) return undefined;
  const candidates = [...meta.widths, meta.w]
    .sort((a, b) => a - b)
    .map((w) => `${url.replace(/\.webp$/, `-${w}.webp`)} ${w}w`);
  return candidates.join(', ');
}
