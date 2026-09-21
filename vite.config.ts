import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Preload font yang dipakai elemen LCP (tagline hero memakai weight 500).
 * Tanpa ini browser baru menemukan font setelah CSS selesai diparse — satu
 * perjalanan bolak-balik yang tertunda. Hanya SATU berkas yang di-preload:
 * menambah lebih banyak berarti berebut bandwidth dengan JS di koneksi lambat.
 *
 * Nama berkas font mengandung hash dan baru diketahui setelah bundling selesai,
 * jadi:
 * - dev  → tag disuntik lewat `transformIndexHtml` (path sumber, tanpa hash);
 * - build → `index.html` hasil build ditambal di `closeBundle`, saat seluruh
 *   aset sudah pasti ada di disk (hook transform HTML bisa berjalan sebelum
 *   plugin CSS selesai meng-emit font).
 */
function preloadCriticalFont(): Plugin {
  const DEV_FONT = '/src/assets/fonts/general-sans-500.woff2';
  const FONT_PREFIX = 'general-sans-500-'; // Vite menyambung hash dengan '-'
  let base = '/';
  let outDir = 'dist';
  let isBuild = false;

  return {
    name: 'preload-critical-font',
    configResolved(config) {
      base = config.base;
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html) {
        if (isBuild) return; // ditangani closeBundle (di sini aset font belum tentu ter-emit)
        return {
          html: _html,
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: DEV_FONT, crossorigin: 'anonymous' },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
    closeBundle() {
      if (!isBuild) return;
      const htmlPath = path.join(outDir, 'index.html');
      const assetsDir = path.join(outDir, 'assets');
      if (!fs.existsSync(htmlPath) || !fs.existsSync(assetsDir)) return;

      const font = fs.readdirSync(assetsDir).find((f) => f.startsWith(FONT_PREFIX) && f.endsWith('.woff2'));
      if (!font) {
        this.warn(`font ${FONT_PREFIX}*.woff2 tak ditemukan — preload dilewati`);
        return;
      }

      const html = fs.readFileSync(htmlPath, 'utf8');
      const tag = `<link rel="preload" as="font" type="font/woff2" href="${base}assets/${font}" crossorigin="anonymous">`;
      if (html.includes(tag)) return;
      fs.writeFileSync(htmlPath, html.replace('</head>', `  ${tag}\n  </head>`));
    },
  };
}

export default defineConfig(() => {
  return {
    // Base adaptif per platform:
    // - Vercel (root domain)        → '/'
    // - GitHub Pages (project page) → '/wah-anggaaa/'
    // Router basename di App.tsx otomatis mengikuti via BASE_URL.
    base: process.env.VERCEL ? '/' : '/wah-anggaaa/',
    plugins: [react(), tailwindcss(), preloadCriticalFont()],
    build: {
      rollupOptions: {
        output: {
          /**
           * Vendor dipisah per pustaka:
           * 1. caching — naik versi aplikasi tidak membatalkan cache react/motion;
           * 2. unduhan paralel — satu chunk raksasa dipecah jadi beberapa.
           * Yang masuk daftar ini ikut jalur kritis. `lenis` & analytics tidak,
           * karena keduanya diimpor dinamis (menyusul setelah paint pertama).
           */
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/'))
              return 'vendor-react';
            if (
              id.includes('/motion-dom/') ||
              id.includes('/motion-utils/') ||
              id.includes('/motion/') ||
              id.includes('/framer-motion/')
            )
              return 'vendor-motion';
            if (id.includes('/react-router')) return 'vendor-router';
            if (id.includes('/lenis/')) return 'vendor-lenis';
            if (id.includes('/@vercel/')) return 'vendor-analytics';
            return 'vendor-misc';
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
