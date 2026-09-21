# SPEC — Seksi Carousel Karya

Status: **SUDAH DIBANGUN** (2026-09-21). Kode: `src/components/Carousel.tsx` + `src/components/Wordmark.tsx`,
gayanya di `src/index.css` (blok "SEKSI KARYA"). Hasil bedah kode sumber ada di luar repo:
`/home/user/reference/rossmason-riset/` (`CATATAN.md`, `carousel-b15f4c1.pretty.js`, `toggle-list-ebe6993.pretty.js`).

---

## 1. Keputusan yang sudah diambil

| Pertanyaan | Keputusan |
|---|---|
| Teks wordmark bawah (pengganti `ROSSMASON`) | **`WHAS`**, selebar isi halaman, rata kiri-bawah |
| Lebar sel | **100vw / 5** → di 1440px: sel 288×180, karya aktif 576×360 |
| Klik pada karya | **Buka overlay detail karya** — belum dibangun (menyusul; fotonya diambil dari landing page tiap projek) |
| Mode List | **Nanti**, setelah carousel ini dinilai |

## 2. Mekanisme asli iamrossmason.com (inti yang ditiru)

Vue 2/Nuxt + GSAP (`wrap`, `clamp`, `snap`). Bukan scroll halaman: dokumen setinggi satu
layar, roda & geseran ditangkap sebagai satu aliran `scroll(dy)` virtual.

**Trik intinya — satu skalar `--diff` mengendalikan seluruh gerakan**

```css
--x-output:      calc(var(--x) * var(--diff));
--x-text-output: calc(var(--x-text) * var(--diff));
--scale-output:  calc(1 + var(--scale) * var(--diff));

.is-left  { --x:-50%; --x-text:-50%; --scale:0 }
.is-right { --x: 50%; --x-text: 50%; --scale:0 }
.is-big   { --x:0% !important; --x-text:-50%; --scale:1 !important }
.is-not-visible { --x:0%; --x-text:0%; --scale:0 }

.slide__scale { transform: translate3d(var(--x-output),0,0) scale(var(--scale-output));
                transition: transform 1s cubic-bezier(.19,1,.22,1) }
.slide__text  { transform: translate3d(var(--x-text-output),0,0) }
```

- Tiap frame: `tc += (t - tc) * 0.1`, lalu `--diff = clamp(0, 1, 1 - |t - tc| * 0.001)`.
- **Strip masih bergerak → `--diff → 0`** → semua offset & skala mati → grid rapat, rata, seragam.
- **Strip berhenti → `--diff → 1`** → karya di tengah membesar **2×** (origin-top) dan
  tetangganya bergeser **±50%** lebar sel untuk memberi ruang.
- Nol animasi per-item: hanya satu CSS variable per frame. Inilah yang membuat beratnya
  hampir tidak bertambah meski 8 foto sekaligus bergerak.
- Item di luar layar dapat `.is-not-visible` yang **mematikan transisi** — kalau tidak, ia
  "menyusul" terlihat saat masuk kembali.
- Berhenti 130 ms → `snap` ke kelipatan lebar sel terdekat.
- Klik/lepas jari → `closest('[data-to]')` → navigasi ke halaman projek.

## 3. Terjemahan ke WHAS (dan alasannya)

| Aspek | Referensi | WHAS | Alasan |
|---|---|---|---|
| Rasio sel | 4:5 portrait (foto di-crop) | **16:10 rasio asli** | aturan ⑦: foto tidak boleh di-crop |
| Lebar sel | 100vw/7 | **100vw/5** | keputusanmu; 11 slide mereka vs 8 kita |
| Strip | mulai x=0 | **bleed ke tepi** (keluar dari margin 40px) | aritmetika: dengan lebar sel 100vw/5, tepi layar jatuh tepat di tengah sel ke-2 → karya bisa duduk **persis** di tengah saat berhenti. Kalau strip dimulai dari margin, karya besarnya selalu meleset 40px dan sebaran tetangganya tak simetris |
| Posisi gulir | dokumen 1 layar, `dy` virtual | seksi `sticky` setinggi `100vh + jarak tempuh`, gulir vertikal dipetakan **1:1** ke geseran strip | halaman kita panjang; rasionya tetap sama dengan aslinya |
| Caption | di ATAS foto (`bottom-full`) | sama | mengikuti referensi |
| Wordmark | 2 path SVG tangan, 3 typeface campur (termasuk italic) | **SVG, teks tunggal General Sans 700** | aturan ④⑤; lihat §5 |
| Bar bawah | `Carousel, List` + `London, UK HH:MM` | `Karya` + `Jakarta, ID HH:MM` | label mode menyusul bareng mode List |
| Mobile & reduced-motion | tetap carousel | **wadah gulir mendatar asli** (`scroll-snap`) | jangan menjepit halaman di layar kecil / saat pengguna minta gerak minim |

## 4. Hasil verifikasi (`tools/verify-karya.mjs`)

Dijalankan di 1440×900 · 1280×800 · 820×1180 · 390×844 + satu jalan reduced-motion. **Nol keluhan.**

- `--diff` terukur **0,71–0,83 saat strip bergerak**, kembali **1,00 saat diam** ✓
- snap mendarat **0,01–0,03 px** dari kelipatan lebar sel ✓
- karya aktif benar-benar membesar **2,00×** dan itu selalu slide terdekat ke tengah ✓
- roda tetikus & geseran tetikus dua-duanya menggerakkan strip ✓
- rasio foto **1,600** di semua viewport (tidak ada crop) ✓
- caption selalu duduk di atas foto ✓
- nol overflow horizontal · nol error konsol ✓
- reduced-motion: tanpa penjepitan, `transform: none`, strip jadi wadah gulir asli ✓
- wordmark: kotak **100% lebar isi**, rata bawah (bawah kotak = tepi bawah panel) ✓

## 5. Wordmark: kenapa SVG

Referensi menggambar "ROSSMASON" sebagai path SVG supaya hurufnya boleh dicampur tiga
typeface (ABC Diatype Medium + Inferi Normal Italic + Respira Black Italic). Kita tidak boleh
mencampur dan tidak boleh italic, jadi yang diambil bukan hurufnya melainkan **ketePatannya**:
wordmark kita juga SVG, tapi berisi teks hidup.

Angka `viewBox` **diukur, bukan diterka** (`tools/ukur-wordmark.mjs`, canvas
`actualBoundingBox` pada font-size 400): General Sans 700 + tracking −0,035em → tinta
**1222 × 301**, garis dasar di `y=294`. `textLength="1222"` + `lengthAdjust="spacing"`
memaksa lebarnya pas tanpa pernah memelarkan bentuk huruf.

Efek sampingnya: **kotak = tinta**, jadi tidak ada celah di bawah garis dasar dan tidak ada
risiko terpotong saat reveal (mask `overflow: hidden`).

> Jebakan yang sempat kena: `Range.getBoundingClientRect()` atas `<text>` di dalam SVG
> mengembalikan **satuan viewBox**, bukan piksel layar — pengukuran pertama melaporkan tinggi
> tinta 303 di layar 182. Ukur dari kotak elemennya.

## 6. Posisi band dihitung, bukan ditebak

Tinggi karya aktif = 2 × (lebar sel × 10/16), dan tinggi blok bawah (bar + wordmark) berubah
di tiap ukuran layar. Margin tetap akan bertabrakan di satu ukuran dan menyisakan lubang di
ukuran lain. Jadi di `ukur()` (Carousel.tsx): blok "caption + karya besar" ditaruh tepat di
tengah ruang antara tepi atas panel dan garis bar, lalu **dijepit** supaya caption tidak
keluar ke atas dan foto tidak menabrak bar. Hasilnya ditulis ke `--strip-atas`.

## 7. Yang belum

1. **Mode List** + label toggle di kiri bar bawah.
2. Uji `--diff` di perangkat asli (Chrome Android/Safari iOS) — sejauh ini hanya peramban
   headless desktop & emulasi mobile.

## 8. Overlay detail karya (SUDAH DIBANGUN, 2026-09-22)

Klik karya membuka `ProjectOverlay.tsx`: foto di-FLIP dua tahap (carousel → stage →
slot hero, `lib/flip.ts`), judul per huruf, baris meta, pernyataan, galeri rasio asli,
dan blok [Next project] yang menerbangkan foto preview. Klik ditangkap di `onUp`
carousel (gerak < 6 px = klik, bukan geser); `data-slug` di tiap `<article>` jadi kunci.
Mesin carousel dijeda lewat prop `jeda` selama overlay terbuka. Verifikasi lengkap:
`tools/verify-overlay.mjs` (31 cek — desktop · mobile · reduced-motion).
