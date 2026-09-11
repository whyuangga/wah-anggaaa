# wah:anggaaa — Personal Website · Planning v1

> Status: SELESAI — semua phase dieksekusi dan di-merge ke `main` (2026-09-10).
> Branch `personal-site/build` sudah menyatu ke main; `redesign/landing-dark-editorial` arsip.

## 1. Keputusan yang sudah locked

| Aspek | Keputusan |
|---|---|
| Fokus situs | Creative / Designer portfolio |
| Role line | Designer & Creative Developer |
| Landing (`/`) | Hero + Selected Works + Manifesto |
| Halaman sendiri | `/about`, `/contact` |
| Layout landing | Freeform collage ala kanvas Framer: elemen overlap/tabrak grid, full-bleed, tanpa kotak section, tetap scroll vertikal |
| Motion | Immersive 3D: satu kanvas WebGL kontinu sebagai background + scroll-driven scenes |
| Font (2 saja) | General Sans (Fontshare) + IBM Plex Mono (Google Fonts) |
| Warna (2 saja) | Background `#020202`, teks `#EAE8E1` |
| Larangan | Tanpa pill, tanpa marquee — selamanya |
| Foto & bulan | TIDAK ADA foto portrait, TIDAK ADA motif bulan di mana pun (aset bulan lama dibuang) |
| Status | Bukan open-for-work — situs iseng-iseng. Label hero: `[ just for fun ]`, nada contact kasual ("say hi") |
| Kontak | Placeholder dulu (`halo@wahanggaaa.id` + social `#`) — gampang di-find/replace nanti |

## 1b. Intro & transisi (locked)

- **Intro/loader ala Lallé:** video kecil (±112–128px) di tengah layar void + frame counter raksasa (00 → 99, tak pernah 100) yang naik dari kanan-bawah ke kanan-atas mengikuti progres frame video + garis progres tepi kanan. Tanpa teks brand. Video: `public/videos/loader.mp4` (montage kinetik, 3 dtk, 720p, tanpa audio, fade in/out). Loader selesai mengikuti event `ended` video; fallback timeout 4.5 dtk; reduced-motion → teks saja 0.7 dtk. Muncul setiap refresh. Reveal ala Onoera: nav + routes tidak di-mount sebelum intro selesai, lalu fade-in kalem (1.3–1.6 dtk, geser ≤20px, stagger) berbarengan dengan overlay yang terangkat 1.2 dtk.
- **Transisi antar halaman = 3D morph:** kamera WebGL terbang/bertransisi ke state halaman tujuan + konten lama fade-out → konten baru fade-in. Di mobile: morph disederhanakan (crossfade + sedikit pergerakan kamera) demi 60fps.

## 2. Pola curian dari 5 referensi

- **kaviengcreative** → Selected Works sebagai index bernomor (`001…`), hover memunculkan preview, "scroll to enter".
- **inspirux** → alur landing: loader persen → hero → manifesto → selected works → kontak (diadaptasi ke struktur minimal kita).
- **lamalama** → label kurung `[ … ]` sebagai pengganti pill, tipografi raksasa, baris expandable `(+/−)`.
- **hellohello** → manifesto dengan teks kinetik kata-per-kata mengikuti scroll; daftar awards di `/about`; footer multi-timezone.
- **onoera** → `/about` yang kalem sebagai penyeimbang: whitespace lega, ritme tenang.

## 3. Arsitektur

- **Routing:** `react-router-dom` — `/`, `/about`, `/contact`, `/works/:slug` (URL asli, bisa di-share langsung).
- **Kanvas WebGL:** SATU `<canvas>` fixed full-viewport di belakang semua konten, kontinu antar scroll & antar halaman (scene bertransisi saat pindah route, bukan mount/unmount).
- **Sistem freeform:** grid 12 kolom + elemen absolute yang overlap (gambar di belakang teks, label mono vertikal/diagonal, gambar menabrak viewport edge). Unit berbasis viewport (`clamp`, `vw`) agar collage tetap proporsional di mobile.
- **Pengganti pill/marquee:** label `[brackets]`, garis/rules, kotak sudut tajam, underline animasi. Gerak dekoratif diganti pinned scroll & hover states.

## 4. Konten per halaman

### `/` — Landing (freeform collage)
1. **Hero** — tagline raksasa 3 baris (`A one-man playground for imaginary brands, taken far too seriously.`) + kata terakhir berputar (kinetic words), role `Designer & Creative Developer`, label `[ just for fun ]` + `[ jakarta — wib ]`, CTA ke `/contact`. State 3D: A.
2. **Works grid (ala Grégory Lallé)** — 11 thumbnail dalam satu kolase flowing (masonry CSS) + rel judul; hover/tap judul = spotlight (lainnya meredup); klik sel = focus overlay fullscreen (preview besar + blurb + visit + case-study + prev/next + keyboard). Tombol [ acak! ] mengacak urutan. Mobile: 1 kolom landscape + rel judul sticky kanan + scroll-spy + tap judul melompat ke gambar. State 3D: B.
3. **Manifesto** — 2–4 kalimat, reveal kata-per-kata mengikuti scroll. State 3D: C.
4. **Footer minimal** — link `/about` + `/contact`, timezone, `© 2026`. Kata raksasa cascade per huruf saat masuk viewport + wave saat hover.

### `/about` — Halaman sendiri (ritme tenang, TANPA foto)
Bio tipografis + efek drift horizontal ala Inspirux (hero + recognition: dua baris konvergen; tiap baris capabilities: x 35% → 0 scrub) + capabilities + recognition + colophon. Tidak ada portrait, tidak ada bulan.

### `/contact` — Halaman sendiri (kasual, placeholder)
Judul besar "say hi" + email placeholder + social links placeholder + info base/timezone + status studio (jam Jakarta) + generator brand khayalan. Tanpa form (mailto + links).

## 5. Daftar karya final (11) — milik user, thumbnail self-hosted

| # | Judul | Kategori | URL |
|---|---|---|---|
| 001 | LEXIER® | Experimental Typography | https://lexier.pages.dev/ |
| 002 | AELIAN | High Jewelry Editorial | https://aelian.pages.dev/ |
| 003 | ÉLAN — Issue No. 01 | Fashion Editorial | https://elan-fashion-editorial.pages.dev/ |
| 004 | VIPERA Émeraude | Luxury Watch | https://vipera-emeraude.pages.dev/ |
| 005 | Vroeger Koffiehuis | Brand Storytelling | https://vroeger-koffiehuis.pages.dev/ |
| 006 | Grit & Grace | Jewelry E-commerce | https://grit-and-grace.pages.dev/ |
| 007 | Cerulean Chic | Fashion Boutique | https://cerulean-chic.pages.dev/ |
| 008 | CHERIEL | Jewelry Brand | https://cheriel-landing.pages.dev/ |
| 009 | Aethelgard | Archive / Journal | https://aethelgard-7e0.pages.dev/ |
| 010 | OCULAR | Sci-fi Cinematic | https://ocular-45z.pages.dev/ |
| 011 | GLINT | Eyewear & Jewelry Y2K | https://glint-landing-58i.pages.dev/ |

- **Selected (landing collage):** 001–005 (kurasi: variasi kategori terkuat — typo, high jewelry, fashion, watch, storytelling).
- **Full index:** 001–011.
- **Tahun:** `'26` untuk semua (koleksi 2026; koreksi jika ada yang beda).
- **Thumbnail:** webp self-hosted (`public/images/works/`, maks 1200px) + placeholder blur data-URI dengan filter **grayscale permanen** agar tetap dalam aturan 2 warna.

## 6. Motion system (harus mulus di desktop & mobile)

- **Lenis** untuk smooth scroll (di mobile: smoothing ringan, tetap mengandalkan native momentum agar tidak janky).
- **GSAP + ScrollTrigger** untuk: transisi state 3D antar bagian, reveal, parallax. HANYA properti `transform`/`opacity` — tidak ada animasi `top/left/width/filter` saat scroll.
- **Three.js**: satu scene, satu context, DPR dibatasi (desktop ≤ 1.75, mobile ≤ 1.5), pause saat tab hidden & saat canvas tertutup, fallback frame statis jika `prefers-reduced-motion` atau WebGL gagal. Visual 3D WAJIB monokrom; motif ABSTRAK (partikel/grid/distorsi — BUKAN bulan).
- **Transisi antar halaman:** fade + geser via GSAP (tanpa library tambahan).
- **Budget:** tidak ada postprocessing berat di mobile; route di-lazy-load; gambar di-optimize.

## 7. Token desain

- Warna: `--void: #020202`, `--bone: #EAE8E1`. Hierarki hanya via opacity: `100 / 70 / 45 / 25 / 12`.
- Font: `--sans: "General Sans"` (400/500/600), `--mono: "IBM Plex Mono"` (400/500).
- Sudut: tajam/kecil (maksimal `rounded-xl` untuk media, tidak ada rounded-full).
- Citra: grayscale permanen untuk semua thumbnail karya.

## 8. Struktur file yang diusulkan

```
src/
  App.tsx                 → router + kanvas global + transisi halaman
  data/works.ts           → 11 karya (meta + thumb/blur + slug + story + stats)
  routes/
    Home.tsx              → Hero + Works grid + Manifesto (freeform)
    About.tsx             → bio + drift horizontal ala Inspirux + capabilities
    Contact.tsx           → say hi + placeholder links + generator brand
    WorkCase.tsx          → case-study per karya (/works/:slug)
    Journal.tsx           → daftar tulisan (/journal)
    JournalPost.tsx       → isi tulisan (/journal/:slug)
  canvas/
    Scene.tsx             → satu kanvas fullscreen + adaptive quality
    shaders.ts            → GLSL fbm monokrom (uniform uOct adaptif)
    bus.ts                → sceneBus mutable React → shader
  components/
    Nav.tsx               → navigasi minimal antar halaman
    Footer.tsx
    Reveal.tsx            → helper reveal kinetik
    Loader.tsx            → loader video + frame counter ala Lallé
  styles/tokens.css       → 2 warna + 2 font + base
```

## 9. Fase eksekusi (setelah approval)

- **Phase 0** — Branch baru `personal-site/build` dari `main` (branch lama diarsip, tidak di-reset), hapus kode + aset lama yang melanggar aturan, commit `PLAN.md`.
- **Phase 1** — Fondasi: token, font, router, Lenis, Nav, Loader, kerangka freeform statis.
- **Phase 2** — Kanvas WebGL + state scenes + reveal kinetik + hover preview.
- **Phase 3** — Halaman `/about` + `/contact` + transisi route.
- **Phase 4** — Polish mobile, budget performa, aksesibilitas, final review.
