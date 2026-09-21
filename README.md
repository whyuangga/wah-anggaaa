# WHAS

Portofolio personal. Dibangun dari nol di repo ini — repo lama (`wah-anggaaa`) sudah dihapus.

**Status: hero ✅ · menu overlay ✅ · carousel karya ✅ · overlay detail karya ✅.**
Babak berikutnya: mode List, lalu halaman sisanya.
Lihat `docs/PLANNING-WHAS.md` dan `docs/SPEC-CAROUSEL.md`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit
npm run build      # produksi
```

---

## Yang sudah ada

| Bagian | Keadaan |
|---|---|
| Hero "halaman judul" (struktur Studio DADO, tanpa foto & garis pembelah) | ✅ jadi, sudah direvisi 6× |
| Menu overlay mobile (tombol MENU → panel penuh layar) | ✅ jadi |
| Gerak masuk — garis tergores → huruf naik dari balik mask | ✅ jadi, GSAP, nol fade |
| Lenis smooth scroll — satu loop rAF | ✅ jadi |
| Font General Sans 400/500/700 (subset, 22 kB total) | ✅ jadi, nol italic |
| Logo WHAS (di-trim dari 1,9 MB → 1,1 kB, ke-inline) | ✅ jadi |
| 8 hero projek (webp, warna asli, tanpa crop) | ✅ siap di `assets/works/` |
| Carousel karya — 8 projek, mekanisme curian dari iamrossmason.com | ✅ jadi, terukur (lihat `docs/SPEC-CAROUSEL.md`) |
| Looping tak berujung carousel (wrap per-slide dari sumber) | ✅ jadi, teruji |
| Wordmark `WHAS` selebar halaman (SVG, teks hidup) | ✅ jadi |
| Overlay detail karya — klik karya: FLIP terbang, judul per-huruf, galeri, next project | ✅ jadi, teruji (31 cek, 3 mode gerak) |
| Babak karya · about · contact · notes · 404 | ⏳ belum |

**Ukuran produksi:** JS 114,2 kB gzip (index 11,4 · lenis 5,7 · gsap 27,8 · react 69,2) · CSS 4,7 kB gzip · font 22 kB.
(typecheck bersih · build bersih · nol error konsol di 4 viewport · nol overflow horizontal)

---

## Aturan keras — dan cara kode ini memenuhinya

| # | Aturan | Bukti di kode |
|---|---|---|
| ① | Tanpa marquee | tidak ada elemen bergerak tanpa akhir |
| ② | Tanpa pill background | nol `border-radius`; fokus keyboard = `outline: 1px solid` (index.css) |
| ③ | Hanya 2 warna | `--color-void #0D0D0F` + `--color-ink #FFFFFF`; audit `grep` = nol warna lain |
| ④ | Tanpa italic | berkas italic tidak pernah diunduh + `font-synthesis: none` → peramban **tidak bisa** memiringkan atau menebalkan palsu |
| ⑤ | Font tunggal | General Sans 400/500/700, self-hosted, subset |
| ⑥ | Tanpa efek pada foto | gambar disajikan apa adanya; nol filter/blend/overlay |
| ⑦ | Tanpa crop foto | nol `object-fit: cover`; rasio asli dipertahankan |
| ➕ | **Nol opacity** | auditor: `grep -rn opacity src/` → hanya komentar. Semua elemen 100% |

**Cara reveal tanpa opacity:** semua kemunculan memakai **mask + transform** —
`overflow:hidden` + `yPercent` (huruf naik dari balik garis) dan `clip-path: inset()`
(paragraf tercetak kiri→kanan). Tidak ada satu pun elemen yang "memudar".

---

## Struktur

```
index.html               latar #0D0D0F dipasang lebih dulu (anti kedip putih)
src/
  main.tsx               titik masuk
  App.tsx                kerangka + Lenis (satu loop rAF untuk seluruh situs)
  components/
    Hero.tsx             hero halaman-judul + garis waktu masuk
    Carousel.tsx         seksi karya — mesin --diff/snap + looping (docs/SPEC-CAROUSEL.md)
    Wordmark.tsx         WHAS selebar halaman (SVG dengan viewBox yang diukur ke tinta)
    MenuOverlay.tsx      menu penuh layar untuk mobile (muncul < 768px)
    ProjectOverlay.tsx   overlay detail karya — penerbangan FLIP + reveal (lihat catatan 8)
    Arrow.tsx            panah SVG (General Sans tidak punya glyph panah)
  lib/
    copy.ts              SEMUA TEKS SITUS — ubah kalimat di sini, bukan di komponen
    scroll.ts            satu mesin scroll (Lenis) — stop/start dipakai overlay
    flip.ts              miniatur GSAP Flip: ambilKotak/terbang (padanan getState/from)
    useJakartaTime.ts    jam WIB untuk nav
  index.css              token 2 warna · 5 peran tipografi · font · lenis
  assets/
    fonts/               general-sans-400/500/700.woff2
    brand/               whas-logo-64.png · whas-logo-128.png
assets/
  brand/logo-black.png   logo mentah (arsip)
  works/                 8 hero projek — webp 1600 & 800, warna asli, tanpa crop
    <slug>/              foto galeri overlay per projek (rasio asli, tanpa efek)
    _raw/                PNG mentah 2880×1800 (sumber; di-gitignore)
    _lqip.json           placeholder blur 20px → nol CLS
docs/
  PLANNING-WHAS.md       rencana build
  AUDIT-v0.md            catatan pengamatan situs lama
```
`../screenshots/`      bukti visual tiap fase — DI LUAR folder ini supaya proyek tetap bersih
```

---

## Catatan teknis yang perlu diketahui

**1. Headline diukur terhadap lebar isinya, bukan lebar layar.**
Memakai `vw` membuat "dinding huruf"-nya tidak pernah pas: margin halaman (40px desktop /
20px mobile) memakan porsi berbeda di tiap ukuran, jadi di 1440px hurufnya cuma mengisi 83%
sementara di 390px hampir meluber. Sekarang pakai container query (`.hero-type` +
`.hero-headline` di `index.css`), hasil terukur **90–96,6%** di 10 ukuran layar dari 320px
sampai 1920px, dengan ruang aman di kiri-kanan.

**2. Panah digambar sebagai SVG, bukan ditulis sebagai karakter.**
General Sans **tidak punya glyph panah** (↗ ↓ sudah diperiksa di cmap ketiga beratnya).
Kalau ditulis sebagai karakter, peramban akan meminjam panah dari font lain — bentuk dan
ketebalannya beda, dan aturan "font tunggal" bocor tanpa ketahuan.

**3. `font-synthesis: none`.**
Ini yang benar-benar mengunci aturan ④ dan ⑤: kalau berkas 700 gagal dimuat, peramban tidak
boleh menebalkan paksa; dan `italic` di mana pun akan tampil tegak, bukan miring.

**4. Nav mobile: satu tombol MENU, bukan daftar tautan.**
Di bawah 768px, empat tautan digantikan satu tombol `MENU` di kanan atas → panel
penuh layar (`MenuOverlay.tsx`). Ia **selalu ter-mount** supaya animasi keluarnya bisa
jalan; saat tertutup ia `visibility: hidden` + `pointer-events: none`, jadi tidak ikut
terjangkau keyboard. Esc menutup, fokus dikurung di dalam panel saat terbuka, dan
dikembalikan ke tombol MENU saat ditutup.

Satu jebakan yang sempat kena: efek pengembalian fokus ikut jalan saat halaman
pertama dimuat (`open` bernilai `false`) sehingga cincin fokus muncul di tombol MENU
pada halaman yang baru dibuka. Sekarang ada penanda `pernahDibuka` — fokus hanya
dikembalikan kalau overlay memang pernah dibuka.

**5. Label nav `Playground` belum punya halaman.**
`href`-nya masih `#playground` dan ditandai `placeholder: true` di `src/lib/copy.ts`.
Tautannya sengaja dibiarkan hidup supaya bentuk nav sudah final; tinggal ganti `href`
saat halamannya dibuat.

**6. Carousel: gerakannya satu variabel CSS, bukan 8 animasi.**
Seluruh gerakan (karya yang membesar 2×, tetangga yang menyingkir ±50%, caption yang ikut
bergeser) dikendalikan satu skalar `--diff` yang ditulis tiap frame: `--diff → 0` saat strip
masih bergerak (grid rapat & rata), `--diff → 1` saat berhenti (karya di tengah membesar).
Ini mekanisme asli iamrossmason.com — nama variabel dan kelasnya sengaja tidak diganti supaya
kode bisa dibaca berdampingan dengan sumbernya. Penjelasan lengkap: `docs/SPEC-CAROUSEL.md`.

**7. Hero tidak memakai foto.**
Bukan karena kehabisan ide: foto-fotonya punya luminansi 7,7–228,7 sementara teksmu harus
putih. Untuk foto terang (oskovia 228,7 / onderre 218,8 / glint 143,8) teks putih mustahil
terbaca, dan satu-satunya penopang lazim — gradasi gelap di atas foto — dilarang aturan ⑥.
Jadi foto pindah ke carousel, dan keterangannya duduk **di luar** bidang foto.

**8. Overlay detail karya: foto terbang dua tahap, slot hero dijaga tetap tunggal.**
Transisi masuk meniru halaman case iamrossmason.com satu-satu: T=0 foto yang diklik
di-FLIP dari sel carousel ke stage sambil halaman lama memudar 0,35 s; T=0,35 foto
di-FLIP lagi ke slot hero; T=0,85 judul terungkap per huruf; T=1,35 meta. FLIP-nya
miniatur plugin Flip (`lib/flip.ts`: ukur kotak → animasikan transform, 1 s expo.inOut)
— tidak menambah dependensi.

Satu jebakan yang sempat kena: selama 0–0,35 s pertama, foto terlihat **ganda** —
clone yang sedang terbang *plus* foto statis yang sudah menunggu di slot hero.
Solusinya state `cloneAktif`: selama clone memegang peran, img React di slot
`visibility: hidden` (bukan opacity — aturan nol opacity tetap utuh). Img React juga
TIDAK pernah di-`remove()` dari DOM: kalau dilepas, React tak tahu dan render berikut
(Next project) memperbarui node terlepas → slot hero kosong. Sekarang semua jalur
(animasi, reduced-motion, next 2×) menutup dengan hero yang tampil — diverifikasi
`tools/verify-overlay.mjs` (31 cek: desktop · mobile · reduced-motion).

---

## Alat di `../tools/`

```bash
node shoot-hero.mjs --all     # ambil ulang hero desktop 8 projek (1440×900 @dpr2)
python3 prepare-images.py     # PNG mentah → webp apa adanya + LQIP
node verify-hero.mjs          # screenshot 4 viewport + cek error/overflow (dev server harus jalan)
node ukur-kecil.mjs           # ukur isian headline di 10 ukuran layar
node verify-karya.mjs          # uji mekanisme carousel (diff/snap/skala/wheel/drag) + screenshot
node verify-overlay.mjs        # 31 cek overlay detail (masuk/next/exit · mobile · reduced)
node shoot-karya.mjs           # screenshot seksi karya (1440 · 820 · 390)
node ukur-wordmark.mjs         # ukur metrik tinta "WHAS" (dipakai untuk viewBox SVG)
```

---

## Langkah berikutnya

1. **Mode List** + label toggle di kiri bar bawah (referensi: `Carousel, List`).
2. Babak sisanya: about · contact · notes · footer · 404 (dan halaman Playground saat kamu siap).
