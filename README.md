# WAH:ANGGAAA — Portfolio Landing Page

Portfolio satu halaman (+ About & Contact) bertema **gelap, tipografis, dan sinematik**.
Isinya 11 karya fiktif — "taman bermain satu orang": brand khayalan yang digarap serius,
dengan transisi halaman, smooth scroll, dan micro-interaction setara standar
Awwwards. Tanpa WebGL: latar void polos `#020202` dari CSS murni. Dibangun sebagai static SPA yang bisa jalan identik di
GitHub Pages maupun Vercel dari codebase yang sama.

> Status: iseng-iseng, just for fun. Bukan situs open-for-work.

**Live demo**

| Platform     | URL                                              |
| ------------ | ------------------------------------------------ |
| Vercel       | `https://wah-anggaaa.vercel.app`                 |
| GitHub Pages | `https://whyuangga.github.io/wah-anggaaa/`       |

---

## Daftar Isi

- [Fitur per Halaman](#fitur-per-halaman)
- [Tech Stack](#tech-stack)
- [Animasi Front-End (Detail)](#animasi-front-end-detail)
- [Sistem Desain](#sistem-desain)
- [Struktur Proyek](#struktur-proyek)
- [Menjalankan Lokal](#menjalankan-lokal)
- [Build & Deploy](#build--deploy)
- [Performa Mobile](#performa-mobile)
- [Kustomisasi Cepat](#kustomisasi-cepat)

---

## Fitur per Halaman

### `/` — Home (freeform, 3 babak)

1. **Hero** — tagline puitis raksasa (`A one-man playground for imaginary
   brands, taken far too seriously.`, 3 baris stagger), punchline terang
   penuh vs dua baris redup, kata terakhir berputar tiap 2,6 dtk
   (seriously → playfully → obsessively → personally → religiously), label
   `[ portfolio — vol.01 ]`, baris peran di bawah tagline (offset kanan di
   desktop), jam-data meta (11 works, koordinat Jakarta). Semua fade-in
   staggered setelah loader selesai.
2. **Works** — grid ala **Grégory Lallé**: 11 thumbnail dalam satu kolase
   flowing + rel judul sticky. Hover/tap judul = *spotlight* (karya lain
   meredup ke 12%, judul aktif dibungkus `[ brackets ]`). Klik gambar =
   **focus overlay fullscreen** (preview besar + blurb + link visit +
   prev/next + keyboard Esc/←/→, scroll halaman dikunci). Di mobile berubah
   jadi 1 kolom landscape + rel judul sticky di kanan dengan **scroll-spy**
   (judul aktif mengikuti gambar yang terlihat); tap judul = smooth-scroll
   ke gambarnya. Tombol `[ acak! ]`
   mengacak urutan kolase + rel dengan kaskade ulang. Tiap karya punya
   halaman case-study (`/works/:slug`): cerita fiktif, angka ngarang,
   stack, visit, dan nav prev/next.
3. **Manifesto** — satu kalimat besar yang opacity-nya menyala **kata per
   kata mengikuti scroll** (scrub), lalu link ke About + footer raksasa.

### `/about` — About

Profil singkat + daftar capability + "kolofon" (stack situs ini) + link silang
ke Contact. State visual 3D-nya sendiri (state 3).

### `/contact` — Contact

Email placeholder `halo@wahanggaaa.id` + tautan sosial `#` (siap find/replace),
jam Jakarta live (WIB, update per detik), status `[ just for fun ]`.
State visual 3D-nya sendiri (state 4).

### Loader (hanya di `/`, muncul tiap refresh)

Video kinetik kecil 112px di tengah + **frame counter mono** `00 → 99` di
kanan-bawah yang mengikuti progres frame video (mentok di 99, tak pernah 100).
Counter duduk tetap — hanya angkanya yang naik, tanpa garis progres.
Route selain `/` tidak digate loader: kontennya langsung tampil, jadi LCP dan
crawler tidak lagi menunggu intro.

---

## Tech Stack

| Lapisan              | Teknologi                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| Framework UI         | **React 19** + **TypeScript ~5.8**                                     |
| Build tool           | **Vite 6** (`@vitejs/plugin-react`)                                    |
| Styling              | **Tailwind CSS v4** (via `@tailwindcss/vite`, token di `@theme`)       |
| Latar belakang       | **CSS murni** — void polos `#020202` (kanvas WebGL dihapus di refactor Phase 1) |
| Routing              | **React Router DOM v7** (basename adaptif mengikuti `BASE_URL`)        |
| Smooth scroll        | **Lenis 1.3** — diimpor dinamis, menyusul setelah paint pertama         |
| Animasi              | **Motion 12** (`motion/react`: AnimatePresence, whileInView, `animate()`) |
| Scroll-driven        | **rAF manual + IntersectionObserver** — nol pustaka tambahan            |
| Font                 | Self-hosted **woff2**: General Sans (400/500/600) + IBM Plex Mono (400/500) |
| Deploy               | GitHub Pages (Actions build) + Vercel (root) — satu codebase           |

> Dependensi template tak terpakai (`express`, `dotenv`, `@google/genai`,
> `lucide-react`, `tsx`, dll.) sudah dicopot — `package.json` hanya memuat yang
> dipakai situs, dan `three` ikut keluar saat latar WebGL dihapus.
> Situsnya sendiri murni static SPA.

---

## Animasi Front-End (Detail)

Semua animasi DOM memakai properti murah-GPU (**transform & opacity saja**),
dengan fallback `prefers-reduced-motion`.

### 1. Lenis — smooth scroll

- Satu instance Lenis global menghaluskan scroll roda mouse; di perangkat
  sentuh dibuat ringan agar scroll native tetap jujur.
- Digerakkan loop `requestAnimationFrame` sendiri (`lenis.raf(time)` tiap frame).
- Diimpor dinamis: selama belum siap, scroll memakai native — tidak ada momen
  scroll "mati", dan ±10 kB gzip-nya tidak menahan paint pertama.
- Scroll dikunci (`lenis.stop()` → kelas `.lenis-stopped`) saat focus overlay
  works dibuka, lewat CustomEvent `works-overlay` yang didengar App.

### 2. Scroll-driven tanpa pustaka

Tiga animasi yang dulu memakai GSAP + ScrollTrigger sekarang berdiri sendiri —
masing-masing mengukur posisi **live tiap frame** atau memakai observer, sehingga
kebal toolbar mobile yang mengubah tinggi viewport saat scroll:

- **Manifesto scrub** (`HomeManifesto.tsx`): loop rAF memetakan posisi paragraf
  ke opacity tiap kata via mutasi `style` langsung (tanpa state React).
  Rentang atas-paragraf `90% → 60%` layar.
- **Scroll-spy works (mobile)** (`HomeWorks.tsx`): satu `IntersectionObserver`
  dengan pita sempit di tengah viewport (`rootMargin: '-55% 0px -40% 0px'`) →
  spotlight mengikuti gambar yang sedang terlihat. Dulu 11 ScrollTrigger.
- **Drift horizontal About** (`About.tsx`): mesin scrub GSAP ditiru di rAF — dua
  baris konvergen `x: ±35% → 0` (desktop) / `±12%` (mobile), dengan peredaman
  ~0,35 dtk supaya terasa sama "karet" seperti `scrub: 1`. Offset awal dipasang
  di `useLayoutEffect` supaya tidak ada pergeseran layout.

### 3. Transisi halaman (Motion)

`TransitionProvider` (`src/lib/transition.tsx`) mencegat navigasi via komponen
`TLink` dan menggerakkannya dengan `animate()` dari Motion — pustaka yang sudah
ada untuk seluruh UI, jadi tidak ada pustaka animasi kedua yang perlu diunduh:
konten lama fade-out naik 24px (0,32 dtk) → `navigate()` + scroll ke atas →
konten baru fade-in turun (0,7 dtk). Tombol back/forward browser mendapat fade
cepat 0,45 dtk. Guard `busyRef` mencegah navigasi ganda; klik link halaman aktif
= scroll ke atas.

Sejak kanvas WebGL dihapus, tidak ada lagi tween uniform shader. Transform hanya
menyentuh wrapper konten — Nav ada di **luar** wrapper dan overlay works
di-render lewat **portal**, jadi tak ada `position: fixed` yang rusak.

### 4. Motion — enter/exit & reveal saat terlihat

- **Loader**: overlay `exit` fade 1,2 detik (Onoera-calm); video `initial →
  animate` scale 0.94 → 1.
- **Hero**: seluruh blok `initial → animate` dengan stagger delay 0–1 detik,
  durasi 1,3–1,6 detik, geser ≤20px, easing `[0.22, 1, 0.36, 1]`.
- **Works**: tiap sel `whileInView` (sekali, margin −40px); overlay focus
  dibungkus `AnimatePresence` + panel `key`-remount (scale 0.97 → 1) tiap
  ganti karya — termasuk saat prev/next.
- Easing tunggal di seluruh situs: `[0.22, 1, 0.36, 1]` (easeOutExpo-ish).
- **Gelombang footer**: `animate()` Motion dengan `stagger(0.04)`, keyframes
  `y: ['0%','-14%','0%']` — dulu GSAP `yoyo` + `repeat`.
- **Kursor custom** (`Cursor.tsx`, desktop fine-pointer saja): titik + cincin
  `mix-blend-difference` mengikuti mouse via rAF lerp ganda (cepat +
  lambat), membesar di `a`/`button`, menampilkan label dari atribut
  `data-cursor` (`buka ↗`, `racik!`, `kunjungi ↗`). Cursor native
  disembunyikan hanya saat komponen aktif (class `.has-cursor`).

### 5. Latar — void polos

Sebelum refactor ada satu kanvas three.js fullscreen sebagai latar reaktif
(kilau saat scroll + warp saat pindah halaman, dengan uniform adaptif dan
adaptive quality). Setelah diperiksa, shader-nya hanya menggambar void flat
plus efek tipis yang nyaris tak terlihat — dan `uState`, `uProgress`,
`uPointer`, `uOct` bahkan tidak dipakai di dalam GLSL.

Karena itu kanvas, `sceneBus`, `useSceneSections`, dan dependency `three`
dihapus: **−517 kB JS mentah (−130 kB gzip)** untuk hasil visual yang praktis
sama. Latar sekarang `#020202` dari CSS — nol dependency, nol biaya render,
nol risiko konteks WebGL gagal.

### 6. Loader — video kecil + counter (rAF murni)

Muncul **hanya di landing (`/`) dan hanya saat halaman di-refresh**; route lain
langsung menampilkan kontennya (tak ada video 772 kB yang menahan LCP, crawler
selalu melihat konten). `Loader.tsx` menjalankan loop `requestAnimationFrame`
sendiri:

- Progres = `video.currentTime / video.duration` (fallback sintetis 3 dtk bila
  durasi tak dikenal); video diputar `playbackRate = 2` → selesai ±3 dtk.
- Teks = `00–99` via `textContent` langsung (tanpa re-render), `padStart(2)`,
  mentok di `99`.
- Counter duduk tetap di kanan-bawah; hanya angkanya yang naik.
- Selesai mengikuti event `ended` video; fallback 4,5 dtk; error video langsung
  selesai; reduced-motion → 0,7 dtk tanpa video & counter.
- Videonya di-crop persis ke kotak 112px lalu di-encode ulang: **788 kB → 74 kB**
  (240×240, bukan 1280×720) tanpa perubahan yang terlihat — `object-cover` memang
  sudah memotong bagian tengahnya.

---

## Sistem Desain

- **2 warna saja**: `--color-void: #020202` (bg) dan `--color-bone: #EAE8E1`
  (teks). Hierarki hanya lewat opacity (100/70/45/25/12). Semua gambar dalam
  situs grayscale permanen (`.img-mono`), termasuk thumbnail works.
- **2 font saja**: General Sans (display/sans) + IBM Plex Mono (label/meta).
  Self-hosted woff2 — nol request font eksternal, nol FOUT berkedip.
- **Pengganti pill/marquee** (yang dilarang permanen): `[brackets]`, rules,
  kotak tajam, underline animasi. Auto-play infinite loop dilarang — semua
  gerak harus digerakkan user/scroll.
- **Tanpa foto portrait & tanpa motif bulan** di mana pun; brand mark murni teks.

Referensi pola (inspirasi, bukan tiruan): Kavieng, Inspirux, Lamalama,
HelloHello, Onoera — plus grid homepage **Grégory Lallé** untuk section works
dan loader-nya.

---

## Struktur Proyek

```
├── PLAN.md                  → spesifikasi awal (arsip; sebagian sudah usang)
├── README.md                → dokumen ini
├── vercel.json              → rewrite SPA: semua rute → /index.html
├── public/
│   ├── _redirects           → (cadangan redirect SPA)
│   ├── og.jpg               → preview share sosial 1200×630 (monokrom)
│   ├── images/works/        → 11 hero + 29 galeri webp + 11 og jpg (±3,7 MB)
│   ├── robots.txt + sitemap.xml → SEO (sitemap dibuat saat prebuild)
│   └── videos/loader.mp4    → video intro 6 dtk (720p, tanpa audio)
└── src/
    ├── main.tsx             → entry React
    ├── App.tsx              → shell: gate loader (khusus `/`) + Nav + Cursor + Routes + transition
    ├── index.css            → @font-face, token @theme, base, .img-mono, CSS Lenis, kursor, .md-body
    ├── components/
    │   ├── ui.tsx            → primitif bersama: EASE, PAGE_X, CTA, Meta, Reveal, Arrow
    │   ├── Loader.tsx        → intro video + frame counter (rAF)
    │   ├── Nav.tsx           → navigasi fixed (mix-blend-difference)
    │   ├── MenuOverlay.tsx   → menu fullscreen mobile
    │   ├── Cursor.tsx        → kursor custom desktop (lerp + label data-cursor)
    │   ├── WorksFocusOverlay.tsx → overlay focus karya (portal + focus trap)
    │   ├── Footer.tsx        → footer raksasa + jam WIB + status studio
    │   └── Seo.tsx           → title/desc/OG kanonis + JSON-LD per route
    ├── sections/             → babak landing, dipisah dari route-nya
    │   ├── HomeHero.tsx      → hero + kata kinetik
    │   ├── HomeWorks.tsx     → kolase + rel judul + spotlight + scroll-spy
    │   └── HomeManifesto.tsx → manifesto scrub kata-per-kata
    ├── routes/
    │   ├── Home.tsx          → komposisi 3 babak + footer (jadi ±14 baris)
    │   ├── About.tsx         → profil + drift horizontal + capability + kolofon
    │   ├── Contact.tsx       → email + sosial + generator brand khayalan
    │   ├── WorkCase.tsx      → case-study per karya (/works/:slug)
    │   ├── Journal.tsx       → daftar tulisan (/journal)
    │   ├── JournalPost.tsx   → isi tulisan (/journal/:slug)
    │   └── NotFound.tsx      → halaman 404 ("nyasar.")
    ├── data/
    │   ├── works.ts          → 11 karya + kontak: meta, thumb/galeri/blur, cerita, angka
    │   └── image-dims.ts     → OTOMATIS dari scripts/media.mjs (ukuran + varian)
    ├── lib/
    │   ├── journal.ts        → loader + parser markdown jurnal
    │   ├── img.ts            → srcSet + dimensi intrinsik dari image-dims.ts
    │   └── transition.tsx    → TLink + transisi DOM antar halaman
    ├── hooks/
    │   ├── useJakartaTime.ts   → jam WIB live per detik
    │   └── useStudioStatus.ts  → status kocak mengikuti jam Jakarta
    └── assets/fonts/         → 5 woff2 self-hosted (sudah di-subset Latin-1)

scripts/
├── sitemap.mjs               → prebuild: sitemap dari slug works.ts + berkas jurnal
├── media.mjs                 → prebuild: dimensi & varian gambar → src/data/image-dims.ts
└── subset-fonts.sh           → manual: subset font ke Latin-1 (butuh fonttools)
```

Alur data animasi: scroll native → Lenis (loop rAF) → loop scrub / observer yang
menulis `style` langsung, **tanpa state React**. State React hanya untuk UI
diskret (spotlight works, overlay terbuka, urutan acak, route).

---

## Menjalankan Lokal

```bash
npm install
npm run dev      # http://localhost:3000/wah-anggaaa/ (dev menghormati base)
npm run lint     # tsc --noEmit
npm run build    # vite build + salin dist/index.html → dist/404.html (fallback SPA)
```

> Dev server me-redirect `/` → `/wah-anggaaa/` karena `base` Vite — itu normal.

---

## Build & Deploy

Satu codebase, dua target — dibedakan otomatis oleh `vite.config.ts`:

| Target | `base` | Router basename | Fallback SPA |
| ------ | ------ | --------------- | ------------ |
| GitHub Pages | `/wah-anggaaa/` | otomatis via `BASE_URL` | `dist/404.html` (salinan index) |
| Vercel (`VERCEL=1`) | `/` | otomatis via `BASE_URL` | `vercel.json` rewrites |

- **GitHub Pages**: `base` sudah disiapkan, tapi workflow
  `.github/workflows/deploy.yml` **tidak ada di repo ini** — perlu dibuat dulu
  kalau Pages mau dipakai (Pages source = "GitHub Actions").
- **Vercel**: import repo → deploy. Fallback SPA ditangani satu rewrite
  catch-all di `vercel.json`.

---

## Performa

Diukur dengan Chromium + Playwright pada **build produksi statis**, CPU 4× dan
jaringan Slow 4G (1,6 Mbps / RTT 150 ms), n=2 ambil terbaik per sel. Angka
"sebelum" = commit `686de83` di `main`.

| | mobile `/` | mobile `/works/:slug` | mobile `/about` | desktop `/` |
| --- | --- | --- | --- | --- |
| **LCP** | 4.273 → **3.699 ms** (−13%) | 3.140 → **2.124 ms** (−32%) | 3.120 → **2.006 ms** (−36%) | 2.384 → **716 ms** (−70%) |
| **TBT** | 191 → **88 ms** | 136 → **57 ms** | 162 → **62 ms** | 57 → **0 ms** |
| **JS** | 335 → **157 kB** (−53%) | 335 → **155 kB** (−54%) | 335 → **144 kB** (−57%) | 335 → **157 kB** (−53%) |
| **Total transfer** | 737 → **493 kB** (−33%) | 468 → **250 kB** (−47%) | 441 → **221 kB** (−50%) | 1.113 → **701 kB** (−37%) |
| **CLS** | 0.0007 → 0.0007 | 0.11 → **0.0001** | 0.007 → 0.0085 | 0.0187 → 0.0187 |

Yang membuatnya turun:

- **Nol pustaka animasi ekstra di jalur kritis.** GSAP + ScrollTrigger (±45 kB
  gzip) dihapus seluruhnya; empat pemakaiannya diganti rAF /
  IntersectionObserver / `animate()` Motion. three.js (±130 kB gzip) keluar di
  Phase 1.
- **Lenis (±6 kB gzip) & Vercel Analytics (±1,5 kB gzip)** diimpor dinamis.
- **Loader hanya di `/`** dan tidak menahan route lain; video intro 788 → 74 kB.
- **Font di-subset ke Latin-1 + tanda baca yang dipakai:** 96 → 67 kB, dan
  `general-sans-500` di-preload (plugin Vite) supaya tagline LCP tidak menunggu
  CSS selesai diparse.
- **Gambar responsif + dimensi intrinsik:** varian `-800.webp` dipilih browser
  lewat `srcSet`/`sizes` (terverifikasi: 7 dari 11 sel di mobile memakai varian
  800px), dan `width`/`height` dari `scripts/media.mjs` memesan ruang lebih dulu
  → CLS halaman case study turun dari 0,11 ke 0,0001.
- **`manualChunks`** memisahkan vendor (react/motion/router) supaya cache tidak
  batal tiap rilis dan unduhan berjalan paralel.
- Scrub manifesto, counter loader, dan drift About memakai mutasi DOM langsung —
  tanpa state React.

**Sisa yang masih terbuka** (belum dikerjakan, urut potensi):

1. `vendor-motion` masih **45 kB gzip** di jalur kritis. Bisa dipangkas dengan
   `LazyMotion` + `m` (fitur dimuat setelah paint) — perlu uji visual ketat
   karena animasi entrance loader/hero ikut terdampak.
2. `vendor-react` + `vendor-router` = **83 kB gzip** — sulit dihindari tanpa
   ganti kerangka.
3. **Grayscale permanen**: semua gambar dirender lewat `.img-mono`, jadi file
   webp-nya bisa dikonversi ke grayscale sungguhan (−13%, terukur 3,53 → 3,08 MB).
   Tidak dilakukan karena sulit dibalik kalau nanti ada redesign berwarna.
4. OG jpg 11 berkas = 1,0 MB (hanya diambil crawler/platform share, bukan
   pengunjung) — bisa di-encode ulang q76 progressive.
5. `works.ts` 49,9 kB mentah (8,8 kB gzip) sebagian besar base64 blur; bisa
   dipindah ke berkas terpisah, tapi menambah satu perjalanan.

## Kustomisasi Cepat

| Mau ganti…      | File |
| --------------- | ---- |
| Daftar karya    | `src/data/works.ts` |
| Kontak (email & sosial) | `src/data/works.ts` → `CONTACT` |
| Teks hero       | `src/sections/HomeHero.tsx` |
| Kolase works + rel judul | `src/sections/HomeWorks.tsx` |
| Teks manifesto  | `src/sections/HomeManifesto.tsx` → `ManifestoScrub text=` |
| Overlay focus karya | `src/components/WorksFocusOverlay.tsx` |
| Easing / label / reveal / CTA | `src/components/ui.tsx` |
| Video loader    | `public/videos/loader.mp4` |
| Tulisan jurnal  | tambah `content/journal/slug.md` (frontmatter: title/date/desc/tags) |
| Domain SEO      | `src/components/Seo.tsx` (`SITE_URL`) + `scripts/sitemap.mjs` (`SITE`) |
| Warna / font    | `src/index.css` (`@theme`) |
| Tambah/ganti gambar karya | taruh webp di `public/images/works/`, buat varian `-800.webp`, jalankan `npm run media` |
| Regenerasi subset font | `./scripts/subset-fonts.sh` (butuh `pip install fonttools brotli`) |
| Encode ulang video loader | `ffmpeg -i in.mp4 -vf "crop=min(iw\,ih):min(iw\,ih),scale=240:240:flags=area" -c:v libx264 -crf 34 -preset slow -pix_fmt yuv420p -an -movflags +faststart out.mp4` |
| Copy about      | `src/routes/About.tsx` |

---

## Riwayat Refactor

### Phase 2 — kejar performa (21 Sep 2026)

Fokus: angka. Nol perubahan desain, kecuali memperbaiki CLS yang memang bug.

- **GSAP + ScrollTrigger dibuang total** (empat pemakaian): scroll-spy works →
  `IntersectionObserver`; drift About → loop scrub rAF (rasa "karet" sama);
  gelombang footer → `animate()` Motion; transisi halaman → `animate()` Motion
  berurutan. Jalur kritis turun ±45 kB gzip.
- **Lenis & Vercel Analytics jadi impor dinamis**; Lenis digerakkan loop rAF
  sendiri, dan scroll native tetap jalan sebelum Lenis siap.
- **Video loader di-encode ulang** 788 → 74 kB (240×240, crop tengah persis
  seperti yang selama ini dipotong `object-cover`).
- **Gambar responsif**: 27 varian `-800.webp` dengan `srcSet`/`sizes` di kolase,
  overlay, hero & galeri case study; `width`/`height` intrinsik (CLS case study
  0,11 → 0,0001) plus `fetchPriority="high"` untuk hero case study.
- **Font di-subset** ke Latin-1 + tanda baca yang dipakai (96 → 67 kB) dengan
  skrip regenerasi, plus preload satu font lewat plugin Vite (nama ber-hash
  diselesaikan setelah build).
- **`manualChunks`** memisahkan vendor; `scripts/media.mjs` ikut prebuild dan
  memvalidasi ketersediaan varian gambar.

Angka lengkap + sisa pekerjaan ada di bagian [Performa](#performa).

### Phase 1 — struktur + performa (21 Sep 2026)

- **three.js dibuang sepenuhnya.** `src/canvas/` (bus, shaders, Scene),
  `useSceneSections`, dan uniform warp di `lib/transition.tsx` dihapus; latar
  kembali ke void polos `#020202` → −517 kB JS mentah / −130 kB gzip.
- **Loader hanya di `/`.** Route lain tidak lagi digate; kontennya tampil
  langsung tanpa menunggu intro.
- **`Home.tsx` dipecah** dari 519 baris jadi ±14 baris komposisi + `sections/`
  (hero, works, manifesto).
- **Primitif bersama** di `components/ui.tsx`: `EASE` (dulu ditulis ulang di 10
  file), `Meta` (3×), `Reveal` (2×), `CTA`, `PAGE_X`, `Arrow`.
- **Overlay works dirapikan**: di-render lewat portal ke `document.body`
  (tak lagi bergantung `clearProps` untuk memperbaiki `position: fixed`),
  fokus dipindah ke dalam dialog & dikurung saat Tab, Esc/←/→ tetap jalan.
- **Sisa template & dead code**: alias `@/*` yang mati, `experimentalDecorators`,
  duplikat `vite` di `dependencies`, 5 rewrite `vercel.json` yang mubazir,
  import tak terpakai (kini `noUnusedLocals`/`noUnusedParameters` aktif).
- **Dokumen diselaraskan dengan kode**: klaim yang tak pernah ada (counter naik
  ke atas, garis progres, drift capabilities, info timezone di Contact, shader
  fbm, workflow Pages) sudah dikoreksi atau dibuang.

Diverifikasi: `tsc --noEmit` bersih, `npm run build` sukses, dan uji browser
otomatis (Chromium) untuk 7 route + interaksi overlay (buka, Tab, ←/→, Esc,
scroll terkunci) di desktop & mobile — nol error konsol/runtime.

Foto kondisi sebelum refactor (audit lengkap baris per baris) ada di
`deskripsi-landing-page-sebelum-refactor.md`.

---

Dibuat iseng-iseng dengan React + Motion. © 2026 WAH:ANGGAAA.
