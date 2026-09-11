# WAH:ANGGAAA — Portfolio Landing Page

Portfolio satu halaman (+ About & Contact) bertema **gelap, tipografis, dan sinematik**.
Isinya 11 karya fiktif — "taman bermain satu orang": brand khayalan yang digarap serius,
dengan latar WebGL reaktif-scroll, transisi halaman morph, dan micro-interaction
setara standar Awwwards. Dibangun sebagai static SPA yang bisa jalan identik di
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

### Loader (muncul setiap refresh)

Video kinetik kecil (±112–128px) di tengah + **frame counter raksasa**
`00 → 99` yang naik dari kanan-bawah ke kanan-atas mengikuti progres frame
video + garis progres di tepi kanan. Counter mentok di 99 (tak pernah 100),
lalu overlay terangkat 1,2 detik berbarengan konten fade-in kalem.

---

## Tech Stack

| Lapisan              | Teknologi                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| Framework UI         | **React 19** + **TypeScript ~5.8**                                     |
| Build tool           | **Vite 6** (`@vitejs/plugin-react`)                                    |
| Styling              | **Tailwind CSS v4** (via `@tailwindcss/vite`, token di `@theme`)       |
| Routing              | **React Router DOM v7** (basename adaptif mengikuti `BASE_URL`)        |
| Smooth scroll        | **Lenis 1.3**                                                          |
| Animasi scroll/keyframe | **GSAP 3.15** + **ScrollTrigger**                                   |
| Animasi komponen     | **Motion 12** (`motion/react`: AnimatePresence, whileInView)           |
| 3D / background      | **Three.js 0.186** — fullscreen quad + **custom GLSL shader** (fbm noise) |
| Ikon                 | **Lucide React**                                                       |
| Font                 | Self-hosted **woff2**: General Sans (400/500/600) + IBM Plex Mono (400/500) |
| Deploy               | GitHub Pages (Actions build) + Vercel (root) — satu codebase           |

> Dependensi template tak terpakai (`express`, `dotenv`, `@google/genai`,
> `lucide-react`, `tsx`, dll.) sudah dicopot — `package.json` hanya memuat
> yang dipakai situs. Situsnya sendiri murni static SPA.

---

## Animasi Front-End (Detail)

Semua animasi DOM memakai properti murah-GPU (**transform & opacity saja**),
dengan fallback `prefers-reduced-motion`.

### 1. Lenis — smooth scroll + nyawa shader

- Satu instance Lenis global menghaluskan scroll roda mouse; di perangkat
  sentuh dibuat ringan agar scroll native tetap jujur.
- Umpan shader (`sceneBus`): `progress` (0..1) dan `velocity` scroll ditulis
  dari listener scroll **native** — bukan dari Lenis — agar reaktif juga di
  perangkat sentuh (`syncTouch: false` membuat Lenis tak memancarkan event
  saat scroll native). Velocity meluruh ke nol tiap frame via rAF.
- Scroll dikunci (`lenis.stop()`) saat focus overlay works dibuka, lewat
  CustomEvent `works-overlay` yang didengar App.

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
- **State section 3D**: hook `useSceneSections` memakai ScrollTrigger untuk
  menulis section dominan (0 hero, 1 works, 2 manifesto) ke `sceneBus`.
- **Drift horizontal About** (meniru Inspirux): hero masuk dengan dua baris
  konvergen dari sisi berlawanan (`x: ±14% → 0`, Motion); teks recognition
  memakai mesin scrub GSAP (`x: ±35% → 0` desktop, ±12% mobile); tiap baris
  capabilities meluncur `x: 35% → 0` dengan scrub per baris
  (`start: 'top 90%'`, `end: 'bottom +=70%'`).

### 3. GSAP timeline — transisi halaman morph

`TransitionProvider` (`src/lib/transition.tsx`) mencegat navigasi via komponen
`TLink`:

1. Konten lama fade-out + uniform `morph` di-tween 0 → 1 (shader ikut "warp").
2. `navigate()` berjalan di tengah warp.
3. Konten baru fade-in + `morph` kembali 0 (warp reda).

Tombol back/forward browser mendapat fade cepat. Guard `busyRef` mencegah
navigasi ganda; klik link halaman aktif = scroll ke atas.

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

### 5. Three.js — latar shader reaktif (custom GLSL)

Fullscreen quad (`src/canvas/Scene.tsx` + `shaders.ts`) me-render fbm noise
monokrom abstrak. Uniform yang dianimasikan tiap frame:

| Uniform | Sumber | Efek |
| ------- | ------ | ---- |
| `uTime` | clock | aliran noise tak pernah diam |
| `uState` | `sceneTarget()` (route/section, di-lerp) | 5 state visual: hero, works, manifesto, about, contact |
| `uScroll` | `sceneBus.progress` | latar "bernapas" mengikuti kedalaman scroll |
| `uVel` | `sceneBus.velocity` (diredam) | sentakan energi saat scroll cepat |
| `uMorph` | tween GSAP transisi halaman | warp saat pindah route |
| `uOct` | level kualitas adaptif | jumlah oktaf fbm (detail vs hemat GPU) |
| `uRes` | ukuran kanvas × DPR cap | ketajaman retina yang dibatasi |

**Adaptive quality**: DPR dibatasi (≤1 di mobile, ≤1,5–2 di desktop) dan fbm
oktaf dikurangi di `pointer: coarse`. Pengaman satu arah: bila rata-rata
frame (EMA 120 frame) > 26ms, kualitas turun bertahap sampai lancar.

### 6. Loader — frame counter ala Lallé (rAF murni)

`Loader.tsx` menjalankan loop `requestAnimationFrame` sendiri:

- Progres = `video.currentTime / video.duration` (counter benar-benar
  mengikuti frame video; fallback sintetis 3 detik bila durasi tak dikenal).
- Teks = `00–99` via `textContent` langsung (tanpa re-render), `padStart(2)`.
- Posisi dihitung rumus ala Lallé: `y = (tinggiLayar − tinggiAngka − 2×margin)
  × (1 − progres)` — angka naik mulus kanan-bawah → kanan-atas; terkunci di
  `99` saat selesai.
- Garis tepi kanan `scaleY(0 → 1)` sebagai bar progres.
- Selesai mengikuti event `ended` video; fallback 4,5 detik; reduced-motion →
  0,7 detik tanpa counter.

---

## Sistem Desain

- **2 warna saja**: `--color-void: #0D0D0C` (bg) dan `--color-bone: #EAE8E1`
  (teks). Hierarki hanya lewat opacity (100/70/45/25/12). Thumbnail works
  grayscale permanen (`.img-mono`); motif 3D abstrak monokrom.
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
├── PLAN.md                  → spesifikasi yang disetujui user (acuan kerja)
├── vercel.json              → rewrite SPA per-route + fallback /(.*) ke 404 nyasar
├── public/
│   ├── _redirects           → (cadangan redirect SPA)
│   ├── og.jpg               → preview share sosial 1200×630 (monokrom)
│   ├── images/works/        → 11 hero + 29 galeri webp + 11 og jpg (±3.5MB)
│   ├── robots.txt + sitemap.xml → SEO (sitemap dibuat saat prebuild)
│   └── videos/loader.mp4    → video intro kinetik ±3 dtk (720p, tanpa audio)
└── src/
    ├── main.tsx             → entry: Router + Lenis + Scene + Loader gate
    ├── App.tsx              → shell: Nav, Routes, TransitionProvider, overlay lock
    ├── index.css            → @font-face, token @theme, base, .img-mono
    ├── canvas/
    │   ├── bus.ts           → sceneBus: jembatan mutable React → shader
    │   ├── shaders.ts       → vertex + fragment fbm (uniform uOct adaptif)
    │   └── Scene.tsx        → renderer fullscreen + loop + adaptive quality
    ├── components/
    │   ├── Loader.tsx       → intro video + frame counter rAF + garis progres
    │   ├── Nav.tsx          → navigasi fixed transparan (TLink)
    │   ├── Cursor.tsx       → kursor custom desktop (rAF lerp + label data-cursor)
    │   ├── Footer.tsx       → footer raksasa (cascade huruf + wave hover) + jam + status studio
    │   └── Seo.tsx          → title/desc/OG kanonis + JSON-LD per route
    ├── routes/
    │   ├── Home.tsx         → hero + Works (Lallé grid/spotlight/overlay) + manifesto scrub
    │   ├── About.tsx        → profil + drift horizontal + capability + kolofon
    │   ├── Contact.tsx      → email + sosial + generator brand khayalan + status
    │   ├── WorkCase.tsx     → case-study per karya (/works/:slug)
    │   ├── Journal.tsx        → daftar tulisan (/journal)
    │   ├── JournalPost.tsx    → isi tulisan (/journal/:slug)
    │   └── NotFound.tsx     → halaman 404 ("nyasar.")
    ├── data/works.ts        → 11 karya: meta + thumb/galeri/blur + story + challenge/outcome + stats
    ├── lib/journal.ts       → loader + parser markdown jurnal
    ├── content/journal/       → tulisan *.md + frontmatter (tambah file = terbit)
    ├── hooks/
    │   ├── useSceneSections.ts → ScrollTrigger → section aktif ke sceneBus
    │   ├── useJakartaTime.ts   → jam WIB live per detik
    │   └── useStudioStatus.ts  → status kocak mengikuti jam Jakarta
    ├── lib/transition.tsx   → TLink + morph timeline (GSAP × shader warp)
    └── assets/fonts/        → 5 file woff2 self-hosted
```

Alur data animasi: `scroll native/ScrollTrigger/rAF → sceneBus (mutable,
tanpa re-render) → uniform shader per frame`. React state hanya untuk UI
diskrit (focus works, overlay open, route).

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

- **GitHub Pages**: workflow `.github/workflows/deploy.yml` (build → artifact →
  deploy). Perlu Pages source = "GitHub Actions".
- **Vercel**: import repo → deploy. Rewrite `/about` & `/contact` → `/index.html`
  sudah disiapkan.

---

## Performa Mobile

- Shader: DPR ≤1 + oktaf fbm lebih sedikit di `pointer: coarse`; step-down
  otomatis bila frame > 26ms (EMA).
- Works mobile tanpa CSS multicol (1 kolom flex) — multicol + gambar adalah
  biang jank scroll Android.
- Gambar: webp self-hosted (maks 1200px, q80) + placeholder blur mungil
  (~1KB data URI) yang fade ke gambar tajam saat `onLoad` + `loading="lazy"`
  + `decoding="async"` + boks aspect-ratio (nol layout shift).
- Meta share: `og:*` + `twitter:card` + canonical menunjuk domain Vercel
  (URL absolut → valid dari kedua platform deploy).
- Scrub manifesto & counter loader memakai mutasi DOM langsung, bukan state
  React — PMK (paint murah, kompozitor kenyang).
- Font self-hosted woff2: tanpa render-blocking pihak ketiga.

---

## Kustomisasi Cepat

| Mau ganti…      | File |
| --------------- | ---- |
| Daftar karya    | `src/data/works.ts` |
| Email & sosial  | `src/routes/Contact.tsx` (`halo@wahanggaaa.id`, `#`) |
| Teks manifesto  | `src/routes/Home.tsx` → `ManifestoScrub text=` |
| Video loader    | `public/videos/loader.mp4` |
| Tulisan jurnal  | tambah `content/journal/slug.md` (frontmatter: title/date/desc/tags) |
| Domain SEO      | `src/components/Seo.tsx` (`SITE_URL`) + `scripts/sitemap.mjs` (`SITE`) |
| Warna / font    | `src/index.css` (`@theme`) |
| Copy about      | `src/routes/About.tsx` |

---

Dibuat iseng-iseng dengan React + Three.js. © 2026 WAH:ANGGAAA.
