/**
 * prebuild: pemetaan penyajian gambar.
 *
 * Membaca `public/images/works/*.webp` (tanpa dependency apa pun — header WebP
 * diparse manual), lalu menulis `src/data/image-dims.ts`:
 *
 *   - dimensi intrinsik tiap gambar → dipakai untuk atribut `width`/`height`
 *     pada <img> supaya ruangnya dipesan sejak awal (nol layout shift);
 *   - daftar kandidat `srcSet` berupa NAMA BERKAS LENGKAP yang sudah diverifikasi
 *     ada di disk (`nama-800.webp` + berkas asli) → kode runtime tidak menyusun
 *     nama berkas sendiri, dan gambar tidak mungkin gagal muat karena salah nama.
 *
 * Pembuatan variannya sendiri dilakukan di luar skrip ini (ImageMagick/PIL),
 * lihat bagian "Gambar" di README.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'public/images/works';
const OUT = 'src/data/image-dims.ts';
const TIERS = [400, 800, 1200];

/** Baca dimensi dari header WebP (VP8 / VP8L / VP8X). */
function webpSize(buf) {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP')
    return null;
  const fourcc = buf.toString('ascii', 12, 16);
  if (fourcc === 'VP8X') {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return [w, h];
  }
  if (fourcc === 'VP8 ') {
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  if (fourcc === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  return null;
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.webp'))
  .sort();

const entries = {};
const missing = [];

for (const file of files) {
  // berkas varian: "<nama>-<lebar>.webp"
  const m = file.match(/^(.*)-(\d+)\.webp$/);
  const base = m?.[1];
  const tier = m ? Number(m[2]) : null;
  const isVariant = Boolean(base) && TIERS.includes(tier) && files.includes(`${base}.webp`);

  if (isVariant) continue;

  const size = webpSize(fs.readFileSync(path.join(DIR, file)));
  if (!size) {
    console.warn(`! dimensi tak terbaca: ${file}`);
    continue;
  }

  const [w, h] = size;
  const stem = file.replace(/\.webp$/, '');

  // Varian yang benar-benar ada di disk + berkas asli sebagai kandidat terbesar.
  // Daftar ini ditulis lengkap ke data, sehingga kode runtime TIDAK PERNAH
  // menyusun sendiri nama berkasnya (pernah salah dan gambarnya gagal senyap).
  const sources = [
    ...TIERS.filter((t) => t < w && files.includes(`${stem}-${t}.webp`)).map((t) => ({
      file: `${stem}-${t}.webp`,
      w: t,
    })),
    { file, w },
  ].sort((a, b) => a.w - b.w);

  // pastikan setiap kandidat benar-benar ada — gagal keras, bukan senyap
  for (const s of sources) {
    if (!files.includes(s.file)) throw new Error(`kandidat srcSet tak ada di disk: ${s.file}`);
  }

  entries[file] = { w, h, sources };

  // varian yang lebih besar dari sumbernya = pemborosan; laporkan
  for (const t of TIERS) {
    const v = `${stem}-${t}.webp`;
    if (files.includes(v) && t >= w) missing.push(`${v} (sumber hanya ${w}px)`);
  }
}

const lines = Object.entries(entries).map(([file, v]) => {
  const sources = v.sources.map((s) => `{ file: '${s.file}', w: ${s.w} }`).join(', ');
  return `  '${file}': { w: ${v.w}, h: ${v.h}, sources: [${sources}] },`;
});

const ts = `/**
 * DIBUAT OTOMATIS oleh scripts/media.mjs — jangan disunting manual.
 * Jalankan \`npm run media\` setelah menambah/mengganti gambar.
 *
 * w/h     = dimensi intrinsik (untuk atribut width/height <img>)
 * sources = kandidat srcSet, sudah terurut kecil→besar; nama berkasnya dijamin ada di disk
 */
export type ImageSource = { file: string; w: number };
export const IMAGE_META: Record<string, { w: number; h: number; sources: ImageSource[] }> = {
${lines.join('\n')}
};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, ts);
console.log(`media: ${Object.keys(entries).length} gambar → ${OUT}`);
if (missing.length) {
  console.warn(`! varian lebih besar dari sumber (buang saja):\n  ${missing.join('\n  ')}`);
}
