import { IMAGE_META } from '../data/image-dims';

/**
 * Helper penyajian gambar. Datanya dihasilkan `scripts/media.mjs` saat prebuild:
 * daftar kandidat `srcSet` di sana berupa nama berkas yang sudah diverifikasi
 * ada di disk, plus dimensi intrinsiknya.
 *
 * PENTING: jangan menyusun nama berkas gambar di sini. Dulu kandidat "ukuran
 * penuh" dibuat dengan menempelkan lebar asli ke nama berkas
 * (`nama-<lebar>.webp`) padahal berkas itu tidak pernah ada — dan di Vercel
 * permintaan seperti itu tetap dibalas 200 (rewrite SPA menyajikan index.html),
 * jadi kegagalannya senyap: gambar tak muncul, yang terlihat hanya placeholder
 * buram. Sekarang URL hanya diambil dari `IMAGE_META[].sources`.
 */

const keyOf = (url: string) => url.slice(url.lastIndexOf('/') + 1);
/** awalan path (termasuk BASE_URL) di depan nama berkas */
const dirOf = (url: string) => url.slice(0, url.lastIndexOf('/') + 1);

/** Dimensi intrinsik — untuk atribut `width`/`height` (pemesanan ruang, nol CLS). */
export function dimsOf(url: string): { width: number; height: number } | undefined {
  const meta = IMAGE_META[keyOf(url)];
  return meta ? { width: meta.w, height: meta.h } : undefined;
}

/**
 * `srcSet` dari kandidat yang ada di disk, mis. `…-800.webp 800w, … 1200w`.
 * Mengembalikan `undefined` bila hanya ada satu kandidat — supaya browser tidak
 * memilih di antara opsi yang sama.
 */
export function srcSetOf(url: string): string | undefined {
  const meta = IMAGE_META[keyOf(url)];
  if (!meta || meta.sources.length < 2) return undefined;
  const dir = dirOf(url);
  return meta.sources.map((s) => `${dir}${s.file} ${s.w}w`).join(', ');
}
