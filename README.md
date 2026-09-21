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
| Smooth scroll        | **Lenis 1.3**                                                          |
| Animasi scroll/keyframe | **GSAP 3.15** + **ScrollTrigger**                                   |
| Animasi komponen     | **Motion 12** (`motion/react`: AnimatePresence, whileInView)           |
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
- Digerakkan GSAP ticker (`lenis.raf` + `lagSmoothing(0)`); tiap event scroll
  memanggil `ScrollTrigger.update()`.
- Scroll dikunci (`lenis.stop()` → kelas `.lenis-stopped`) saat focus overlay
  works dibuka, lewat CustomEvent `works-overlay` yang didengar App.

### 2. GSAP ScrollTrigger — scrub kata & scroll-spy

- **Manifesto scrub** (`ManifestoScrub`): loop rAF mengukur posisi paragraf
  **live tiap frame** (`getBoundingClientRect`) lalu memetakan ke opacity
  tiap kata via mutasi `style` langsung (tanpa state React → 60fps).
  Pengukuran live dipilih karena trigger persenan yang dihitung sekali
  terbukti rapuh di mobile (toolbar Chrome mengubah tinggi viewport saat
  scroll → tiang gawang bergeser). Rentang atas-paragraf `90% → 60%` layar
  selalu reachable (butuh konten bawah ≥40% viewport).
- **Scroll-spy works (mobile)**: 11 ScrollTrigger `onToggle` (khusus
  `pointer: coarse`) menggerakkan state `focus` yang sama dengan hover
  desktop — spotlight mengikuti gambar yang sedang terlihat.
- **Drift horizontal About** (meniru Inspirux): hero masuk dengan dua baris
  konvergen dari sisi berlawanan (`x: ±14% → 0`, Motion); teks recognition
  memakai mesin scrub GSAP (`x: ±35% → 0` desktop, ±12% mobile); tiap baris
  capabilities meluncur `x: 35% → 0` dengan scrub per baris
  (`start: 'top 90%'`, `end: 'bottom +=70%'`).

### 3. GSAP timeline — transisi halaman (DOM)

`TransitionProvider` (`src/lib/transition.tsx`) mencegat navigasi via komponen
`TLink`: konten lama fade-out naik 24px (0,32 dtk) → `navigate()` + scroll ke
atas + refresh ScrollTrigger → konten baru fade-in turun (0,7 dtk). Tombol
back/forward browser mendapat fade cepat 0,45 dtk. Guard `busyRef` mencegah
navigasi ganda; klik link halaman aktif = scroll ke atas.

Sejak kanvas WebGL dihapus, tidak ada lagi tween uniform shader: transisi murni
DOM. Transform hanya menyentuh wrapper konten — Nav ada di **luar** wrapper dan
overlay works di-render lewat **portal**, jadi tak ada lagi `position: fixed`
yang rusak dan tak perlu tambalan `clearProps`.

### 4. Motion — enter/exit & reveal saat terlihat

- **Loader**: overlay `exit` fade 1,2 detik (Onoera-calm); video `initial →
  animate` scale 0.94 → 1.
- **Hero**: seluruh blok `initial → animate` dengan stagger delay 0–1 detik,
  durasi 1,3–1,6 detik, geser ≤20px, easing `[0.22, 1, 0.36, 1]`.
- **Works**: tiap sel `whileInView` (sekali, margin −40px); overlay focus
  dibungkus `AnimatePresence` + panel `key`-remount (scale 0.97 → 1) tiap
  ganti karya — termasuk saat prev/next.
- Easing tunggal di seluruh situs: `[0.22, 1, 0.36, 1]` (easeOutExpo-ish).
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
    ├── data/works.ts         → 11 karya + kontak: meta, thumb/galeri/blur, cerita, angka
    ├── lib/
    │   ├── journal.ts        → loader + parser markdown jurnal
    │   └── transition.tsx    → TLink + transisi DOM antar halaman
    ├── hooks/
    │   ├── useJakartaTime.ts   → jam WIB live per detik
    │   └── useStudioStatus.ts  → status kocak mengikuti jam Jakarta
    └── assets/fonts/         → 5 file woff2 self-hosted
```

Alur data animasi: scroll native → Lenis (digerakkan GSAP ticker) →
ScrollTrigger atau loop rAF yang menulis `style` langsung, **tanpa state React**.
State React hanya untuk UI diskret (spotlight works, overlay terbuka, urutan
acak, route).

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

- **Tanpa kanvas WebGL**: latar void dari CSS — nol biaya GPU, nol 517 kB JS.
- **Loader hanya di `/`** dan tidak menahan route lain, jadi halaman dalam
  langsung render dari HTML pertama.
- Works mobile tanpa CSS multicol (1 kolom flex) — multicol + gambar adalah
  biang jank scroll Android.
- Gambar: webp self-hosted (maks 1200px, q80) + placeholder blur mungil
  (~1KB data URI) yang fade ke gambar tajam saat `onLoad` + `loading="lazy"`
  + `decoding="async"` + boks aspect-ratio (nol layout shift).
- Meta share: `og:*` + `twitter:card` + canonical menunjuk domain Vercel
  (URL absolut → valid dari kedua platform deploy).
- Scrub manifesto & counter loader memakai mutasi DOM langsung, bukan state
  React.
- Font self-hosted woff2: tanpa render-blocking pihak ketiga.

**Angka bundle (hasil `npm run build`):**

| | JS mentah | JS gzip |
| --- | --- | --- |
| Sebelum refactor Phase 1 | ±1.157 kB | ±340 kB |
| Sesudah | ±639 kB | ±209 kB |

Sisa kerja yang masih terbuka: chunk `index-*.js` (react + gsap + motion +
lenis + router) masih ±546 kB mentah / ±183 kB gzip. Kandidat Phase 2:
`manualChunks` untuk caching, menunda GSAP/ScrollTrigger sampai setelah paint
pertama, dan mengganti animasi reveal yang paling sederhana (fade/translate)
dengan CSS agar `motion` bisa menyusut.

---

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
| Copy about      | `src/routes/About.tsx` |

---

## Riwayat Refactor

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

Dibuat iseng-iseng dengan React + GSAP + Motion. © 2026 WAH:ANGGAAA.
