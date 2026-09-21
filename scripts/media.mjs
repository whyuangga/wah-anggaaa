/**
 * prebuild: pemetaan penyajian gambar.
 *
 * Membaca `public/images/works/*.webp` (tanpa dependency apa pun — header WebP
 * diparse manual), lalu menulis `src/data/image-dims.ts`:
 *
 *   - dimensi intrinsik tiap gambar → dipakai untuk atribut `width`/`height`
 *     pada <img> supaya ruangnya dipesan sejak awal (nol layout shift);
 *   - daftar varian ukuran yang benar-benar ada di disk (`-800.webp`, `-1200.webp`)
 *     → `srcSet` hanya menawarkan berkas yang memang ada, jadi gambar tidak
 *     pernah 404 hanya karena variannya belum dibuat.
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
  const widths = TIERS.filter((t) => t < w && files.includes(`${file.replace(/\.webp$/, '')}-${t}.webp`));
  entries[file] = { w, h, widths };

  // varian yang lebih besar dari sumbernya = pemborosan; laporkan
  for (const t of TIERS) {
    const v = `${file.replace(/\.webp$/, '')}-${t}.webp`;
    if (files.includes(v) && t >= w) missing.push(`${v} (sumber hanya ${w}px)`);
  }
}

const lines = Object.entries(entries).map(
  ([file, v]) => `  '${file}': { w: ${v.w}, h: ${v.h}, widths: [${v.widths.join(', ')}] },`,
);

const ts = `/**
 * DIBUAT OTOMATIS oleh scripts/media.mjs — jangan disunting manual.
 * Jalankan \`npm run media\` setelah menambah/mengganti gambar.
 *
 * w/h        = dimensi intrinsik (untuk atribut width/height <img>)
 * widths     = lebar varian yang tersedia di disk (untuk srcSet)
 */
export const IMAGE_META: Record<string, { w: number; h: number; widths: number[] }> = {
${lines.join('\n')}
};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, ts);
console.log(`media: ${Object.keys(entries).length} gambar → ${OUT}`);
if (missing.length) {
  console.warn(`! varian lebih besar dari sumber (buang saja):\n  ${missing.join('\n  ')}`);
}
