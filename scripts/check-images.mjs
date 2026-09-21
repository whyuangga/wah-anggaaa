/**
 * Uji regresi gambar — jalankan SETELAH build, sebelum menaikkan versi.
 *
 *   npm run build            # atau: VERCEL=1 npm run build
 *   npx vite preview --port 4000 &
 *   node scripts/check-images.mjs --origin http://localhost:4000
 *
 * Yang diperiksa, di DPR 1, 2, dan 3 (jumlah piksel perangkat menentukan kandidat
 * mana yang dipilih browser — bug 21 Sep 2026 hanya muncul di DPR 2):
 *   1. setiap <img> benar-benar ter-decode (naturalWidth > 0);
 *   2. setiap kandidat srcSet diambil sungguhan, harus 200 + content-type image/*;
 *   3. halaman yang seharusnya bergambar tidak boleh nol gambar.
 *
 * PENTING: jangan percaya "tidak ada 404" sebagai bukti gambar termuat. Rewrite SPA
 * Vercel membalas 200 + text/html untuk path gambar apa pun yang tidak ada, jadi
 * gambar yang salah nama gagal secara senyap (yang terlihat hanya placeholder blur).
 *
 * Butuh Playwright (opsional, tidak masuk dependency repo):
 *   npm i -D playwright-core && npx playwright-core install chromium
 */
import { chromium } from 'playwright-core';

const arg = process.argv.indexOf('--origin');
const ORIGIN = (arg > -1 ? process.argv[arg + 1] : undefined) ?? process.env.ORIGIN ?? 'http://localhost:4000';

const PAGES = ['/', '/works/lexier', '/works/elan', '/works/glint', '/contact'];
const PROFILES = [
  { name: 'DPR1', vp: { width: 1512, height: 945 }, dpr: 1 },
  { name: 'DPR2', vp: { width: 1512, height: 945 }, dpr: 2 },
  { name: 'DPR2-mobile', vp: { width: 390, height: 844 }, dpr: 2, mobile: true },
  { name: 'DPR3-mobile', vp: { width: 390, height: 844 }, dpr: 3, mobile: true },
];

const IMG_PATH = /\/images\/works\/[^/]+\.(webp|jpe?g)$/;
let browser;
try {
  browser = await chromium.launch({ args: ['--no-sandbox'] });
} catch (e) {
  console.error('Tidak bisa menjalankan Chromium. Pasang dulu:\n' +
    '  npm i -D playwright-core && npx playwright-core install chromium\n');
  throw e;
}

const problems = [];
const picks = new Map(); // profil → daftar berkas yang dipilih

for (const prof of PROFILES) {
  const ctx = await browser.newContext({
    viewport: prof.vp,
    deviceScaleFactor: prof.dpr,
    isMobile: Boolean(prof.mobile),
    hasTouch: Boolean(prof.mobile),
  });

  for (const path of PAGES) {
    const page = await ctx.newPage();
    const badResponses = [];
    page.on('response', (r) => {
      if (IMG_PATH.test(r.url()) && r.status() >= 400) {
        badResponses.push(`${r.status()} ${r.url().split('/').pop()}`);
      }
    });
    await page.goto(ORIGIN + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(path === '/' ? 5500 : 2500);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    await page.waitForTimeout(1500);

    const imgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter((i) => (i.getAttribute('src') || '').includes('/images/'))
        .map((i) => ({
          src: i.getAttribute('src').split('/').pop(),
          current: (i.currentSrc || '').split('/').pop(),
          ok: i.naturalWidth > 0,
        })),
    );
    // kandidat srcSet yang ditawarkan halaman
    const offered = await page.evaluate(() =>
      Array.from(new Set(
        Array.from(document.querySelectorAll('img[srcset]')).flatMap((img) =>
          img.getAttribute('srcset').split(',').map((c) => c.trim().split(/\s+/)[0]),
        ),
      )),
    );

    const failed = imgs.filter((i) => !i.ok);
    const expectImages = path === '/' || path.startsWith('/works/');
    if (expectImages && imgs.length === 0) problems.push(`${prof.name} ${path}: tidak ada gambar sama sekali`);
    if (failed.length) problems.push(`${prof.name} ${path}: tak termuat → ${failed.map((f) => `${f.src} (currentSrc ${f.current})`).join(', ')}`);
    if (badResponses.length) problems.push(`${prof.name} ${path}: respons gagal → ${badResponses.join(', ')}`);

    // setiap kandidat harus benar-benar ada dan bertipe gambar
    if (offered.length) {
      const broken = await page.evaluate(async (list) => {
        const out = [];
        for (const href of list) {
          const res = await fetch(href);
          const type = (res.headers.get('content-type') || '').split(';')[0];
          if (!res.ok || !type.startsWith('image/')) out.push(`${res.status} ${type || '(tanpa tipe)'} ${href.split('/').pop()}`);
        }
        return out;
      }, offered);
      if (broken.length) problems.push(`${prof.name} ${path}: kandidat srcSet rusak → ${broken.join(', ')}`);
    }

    if (imgs.length) picks.set(`${prof.name} ${path}`, imgs.map((i) => i.current).join(', '));
    const label = `${prof.name} ${path}`;
    console.log(
      `${label.padEnd(24)} img=${String(imgs.length).padStart(2)} gagal=${failed.length} kandidat=${offered.length}`,
    );
    await page.close();
  }
  await ctx.close();
}

console.log('\nberkas yang dipilih browser:');
for (const [k, v] of picks) console.log(`  ${k.padEnd(24)} ${v}`);

console.log('\n=== hasil ===');
if (problems.length) {
  problems.forEach((p) => console.log('  ✗ ' + p));
  console.log(`\n${problems.length} masalah ditemukan`);
} else {
  console.log('  ✔ semua gambar ter-decode, semua kandidat srcSet valid (DPR 1/2/3)');
}

await browser.close();
process.exit(problems.length ? 1 : 0);
