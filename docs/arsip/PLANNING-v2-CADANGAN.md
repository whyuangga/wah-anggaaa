# PLANNING v2.0 — dibangun dari nol
**wah:anggaaa · situs pribadi · rencana bangun-ulang total**

> **Status: RENCANA SAJA. Nol file kode tersentuh.** `PLAN.md` (v1) tetap utuh sebagai arsip;
> dokumen ini menggantikannya sebagai rencana kerja. Bukti kondisi situs lama ada di
> `docs/AUDIT-v0.md` + 10 screenshot di `audit/shots/`.
>
> Rencana ini ditulis **dari nol**: tidak berangkat dari fitur situs lama, tidak mewarisi
> keputusan desainnya. Situs lama hanya disitir sebagai **bahan mentah** (gambar 11 karya,
> 2 fon, temuan yang membuatnya terasa bosen).

**Keputusan yang sudah dikunci:**
1. Dibangun **dari nol** — bukan desain ulang landing page lama.
2. **Repo tetap ini** (`whyuangga/wah-anggaaa`), branch `main` jadi arsip.
3. **Bebas total** — aturan lama boleh dilanggar.
4. Lingkup: **seluruh situs** (semua route).
5. Belum dibangun sampai ada kata "gas".

---

## 1. Brief dari nol

**Apa:** situs pribadi satu orang. Bukan CV, bukan portofolio yang minta kerja, bukan template.
Bahan yang dimiliki: **11 brand khayalan**, masing-masing punya landing page yang benar-benar
jalan dan bisa dikunjungi; 2 fon; satu obsesi yang jelas terlihat di commit history.

**Untuk siapa:** orang yang suka melihat kerajinan — desainer/developer lain, atau siapa pun yang
dikirim tautannya. Mereka bukan calon klien. Mereka datang untuk melihat *bagaimana satu orang
mengerjakan sebelas hal yang tidak diminta siapa pun, secara serius*.

**Harus terasa:** rapi seperti mesin, tapi hangat seperti buku catatan orang. Tenang, bukan ramai.
Tidak berteriak "lihat saya", tapi tidak bisa dilihat sekali lalu dilupakan.

**Anti-tujuan (ini yang paling menentukan):**
- ❌ Tidak boleh ada satu pun bagian yang bisa ditunjuk "ini punya situs X".
- ❌ Tidak boleh semua elemen bergerak dengan cara yang sama.
- ❌ Tidak boleh ada kata pengantar maaf ("iseng", "just for fun") diulang-ulang.
- ❌ Tidak boleh mobile jadi versi kurus dari desktop.
- ❌ Tidak boleh ada elemen dekoratif yang tidak punya fungsi.

---

## 2. Lima prinsip keras

| # | Prinsip | Artinya kalau bikin keputusan |
|---|---|---|
| P1 | **Satu bahasa, satu penulis** | Semua elemen berasal dari satu metafora. Tidak ada bagian yang "berdiri sendiri" |
| P2 | **Satu hukum gerak** | Semua animasi turun dari satu hukum. Gerak yang tak bisa dijelaskan lewat hukum itu tidak dipakai |
| P3 | **Fungsi sebelum bentuk** | Setiap mark, garis, label punya tugas. Kurung `[ ]`, mis. hanya boleh menandai **nomor plat** |
| P4 | **Mobile setara, bukan versi ringan** | Konsep harus tetap utuh di 390px; interaksi hover diganti interaksi scroll, bukan dihapus |
| P5 | **Aset milik sendiri** | Nol CDN, nol font pihak ketiga, nol gambar stok. 11 karya = gambar yang kamu buat |

---

## 3. Konsep: MESIN CETAK

> Situs ini bukan portofolio berisi karya. Situs ini **percetakan satu orang** yang memproduksi
> brand yang tidak pernah ada.

**Kenapa ini yang dipilih (dari nol, diuji ulang):**

1. **Menjelaskan kenyataanmu tanpa perlu minta maaf.** Kenapa banyak sekali brand? Karena
   percetakan memang mencetak banyak imprint. Fakta "11 brand khayalan" berhenti jadi keanehan
   dan jadi premis.
2. **Memberi struktur, bukan cuma gaya.** Percetakan itu sistem produksi yang nyata: ada plat,
   register, slug, edisi, kolofon. Semua bagian situs dapat tugas tanpa aku mengarang komponen
   dekoratif.
3. **Membuat 2 warna jadi wajib, bukan kemiskinan.** Mesin ini mencetak dengan 2 tinta. Palet
   `#020202` + `#EAE8E1` jadi keputusan teknis, bukan sisa aturan lama.
4. **Memberi satu hukum gerak yang tidak dipakai orang lain** (§5).
5. **Nol kebutuhan WebGL.** Semua efeknya bisa dicapai `clip-path` + `mix-blend-mode` (gratis).

**Dua arah yang aku tolak**, biar jelas ini dipilih bukan karena tidak ada pilihan:
- *Darkroom / negatif film* — indah, tapi berhenti di estetika; tidak menjelaskan kenapa isinya banyak.
- *Arsip / museum* — bisa, tapi sudah arah "Arah A" di rencana sebelumnya dan gampang jatuh ke
  gaya web arsip yang sudah banyak.

**Kamus mesin** (dipakai konsisten di seluruh situs):

| Istilah | Di situs |
|---|---|
| **plat** | karya · `PLAT 001 — LEXIER®` |
| **⊕ register mark** | penanda posisi; elemen datang melenceng lalu snap ke register |
| **trim mark** | garis potong di sudut blok media |
| **slug** | baris keterangan gambar: no · judul · kategori · tahun · tinta |
| **cakupan tinta** | % yang **dihitung dari gambarmu** (rata-rata luminansi) saat build |
| **oplag** | `EDISI 01 · 011 PLAT · 2 WARNA TINTA` |
| **kolofon** | penutup: dicetak di mana, mesin apa, tinta apa |
| **cetakan ke-n** | kunjungan ke-2 dst (localStorage) → `CETAKAN KE-2 DARI 4` |
| **lembar nyasar** | 404 |
| **overprint** | dua lapis tinta bertumpuk — satu momen kacau terkendali di manifesto |

**Batas supaya tidak jadi gimmick:** mekanika cetak hidup di **tiga tempat saja** —
**mark, slug, counter**. Di luar itu situsnya cuma tipografi + gambar, disiplin. Maksimum
4 mark per layar.

---

## 4. Peta situs & perjalanan

### 4.1 `/` — Lembar (`scenes/`)

```
KEPALA HALAMAN (sticky, latar solid — tidak ada teks menembus nav)
┌────────────────────────────────────────────────────────────────────────┐
│ wah:anggaaa®        plat   mesin   kontak            JKT 20:32  001/011│
├────────────────────────────────────────────────────────────────────────┤
│ ⊕                                            (tepi lembar 1px)      ⊕  │
│                                                                        │
│  EDISI 01 · 011 PLAT · 2 WARNA TINTA                                   │
│                                                                        │
│  Percetakan kecil milik satu orang                                     │
│  untuk brand yang tidak pernah ada.          ← dicetak baris per baris │
│                                                                        │
│  [ lihat plat ↓ ]      [ tentang mesin ]                               │
│                                                                        │
│ ⊕                                                                   ⊕  │
├─ BABAK 2 ──────────────────────────────────────────────────────────────┤
│  PLAT                                    total tinta: 78%   [kocok]    │
│                                                                        │
│  001  LEXIER®           experimental typography   '26   87%  ┌──────┐  │
│  002  AELIAN            high jewelry editorial    '26   64%  │ bukti│  │
│  003  ÉLAN              fashion editorial         '26   72%  │ ⊕    │  │
│  ▸ hover baris → jendela bukti berganti                       │      │  │
│  ▸ klik baris  → lembaran plat mencetak dirinya               └──────┘  │
├─ BABAK 3 ──────────────────────────────────────────────────────────────┤
│  Tidak ada klien. Tidak ada brief.                                     │
│  Cuma mesin, tinta, dan obsesi.        ← baris 2 menimpa baris 3        │
│  Semuanya fiktif. Semuanya selesai.    ← OVERPRINT                     │
├─ KOLOFON ──────────────────────────────────────────────────────────────┤
│  wah:anggaaa                                                           │
│  Dicetak di Jakarta. Kertas #020202, tinta #EAE8E1.                    │
│  Mesin: React · Vite · Motion.   CETAKAN KE-2 — iseng, tapi diukur.    │
└────────────────────────────────────────────────────────────────────────┘
```

**Mobile 390px** — urutan sama, tata letak satu kolom: kepala halaman jadi nav ringkas;
tepi lembar pindah ke margin 12px; tabel plat jadi **kartu baris** dengan **bukti inline**
yang tercetak saat masuk pita tengah layar (pengganti hover, bukan penghapusan).

### 4.2 Route lain

| Route | Isi | Bahasa visual |
|---|---|---|
| `/plat/:slug` | detail plat: register besar, cerita, peran·stack·tahun·tinta, galeri bukti, `kunjungi ↗`, plat sebelum/berikutnya | table + lemma, sama seperti indeks |
| `/mesin` | tentang: operator, cara kerja, alat, apa yang tidak dikerjakan | spec sheet: label kiri, nilai kanan |
| `/kontak` | email, sosial, jam Jakarta live, status mesin | satu lembar pendek, tanpa form (mailto ber-subject) |
| `/catatan` | catatan cetak + `/catatan/:slug` | sama; **muncul di nav hanya jika isinya ≥3** (ditentukan saat build) |
| `*` | lembar nyasar | satu lembar salah potong + jalan pulang |

Transisi antar-halaman: **lembar baru masuk dari atas (feed)** — bukan fade. Nav tetap di luar
wrapper transform (aturan lama yang benar, tetap dipakai).

---

## 5. Hukum gerak & token

> **Tidak ada yang fade-in. Semua datang melenceng, lalu masuk register.**

Tiga keadaan setiap elemen: **melenceng** (offset 3–8px, opacity 0.2) → **register** (posisi mati,
opacity penuh, `cubic-bezier(.2,.9,.1,1)`) → **jejak** (plat hantu tersisa ±1px @0.08).

| Token | Durasi | Easing | Properti (murah GPU) | Dipakai |
|---|---|---|---|---|
| `register-in` | 340ms | `.2,.9,.1,1` | translate 3–8px + opacity | semua elemen masuk |
| `print-wipe` | 620ms | `linear` (step halus) | `clip-path: inset()` | tipografi & garis |
| `clamp` | 180ms | `ease-out` | `scaleY` garis 1px | hentakan tiap plat selesai |
| `feed` | 420ms | `.2,.9,.1,1` | translateY lembar | transisi route |
| `overprint` | 900ms | `ease-in-out` | `mix-blend-mode` + opacity | manifesto |
| `counter` | rAF | — | `textContent` langsung | angka plat/tinta |

**Aturan:** hanya `transform`/`opacity`/`clip-path`/`mix-blend-mode`. Tidak ada animasi properti
layout. `prefers-reduced-motion` → semua token jadi 0 ms dan elemen langsung di posisi register
(isi tetap 100% terbaca). Satu momen lunak per babak sebagai pereda dari gerak mekanik.

---

## 6. Sistem desain

**Grid register:** 12 kolom · gutter 24 · margin 40 (desktop) / 20 (mobile) · lebar maks 1440.
Setiap blok media **wajib** selaras kolom + trim mark. Tidak ada masonry (penyebab lubang di
situs lama).

**Tipografi — 5 peran (bukan satu ukuran untuk semua):**

| Peran | Font | Ukuran / detail | Tempat |
|---|---|---|---|
| `display` | sans 600, tracking −0.03em | clamp besar | 3 momen: imprint, `PLAT`, kolofon |
| `statement` | sans 500, tracking −0.01em | 1 tingkat di bawah | tagline, manifesto, judul plat |
| `body` | sans 400 | 16–17px / 1.65 | cerita plat, mesin |
| `slug` | mono 400, 10–11px, tracking .16em, uppercase | — | semua keterangan |
| `machine` | mono 500, tabular-nums | — | counter, register, jam, tinta% |

2 fon dipertahankan (General Sans + IBM Plex Mono) karena sudah self-hosted, ter-subset, dan pas.

**Tinta & kertas:** 2 warna, tanpa aksen. `kertas #020202` · `tinta #EAE8E1`.
Hierarki hanya via opacity `100/70/45/25/12`. Aturan baru dari temuan audit:
**tidak ada yang diredupkan sebagai nilai awal** — hanya baris aktif yang dinaikkan.

**Spacing scale mesin** (satu skala untuk seluruh situs, menggantikan `pt-32/pt-40/mt-10`):
`4 · 8 · 12 · 20 · 32 · 52 · 84 · 136` px.

**Komponen milik sendiri** (`src/kit/`): `Mark` (register/trim/rule) · `Sheet` (lembar+kolom+skala) ·
`Slug` · `Plate` (baris & lembaran) · `Proof` (jendela bukti) · `Machine` (counter, tinta, edisi).

---

## 7. Model konten & pipeline build

```ts
type Plate = {
  no: string;            // "001" — nomor plat, ikut ke URL
  slug: string;          // "lexier"
  title: string; category: string; year: string;
  url: string;           // landing page karya yang benar-benar jalan
  story: string[]; role: string; stack: string[];
  stats: [string, string][];
  proofs: { src: string; blur: string }[];   // galeri bukti
  tinta: number;         // DIHITUNG saat build (0–100)
};
```

- **11 plat** = 11 karya sekarang, dimigrasikan apa adanya. Tidak ada karya yang dibuang.
- **`tinta`** dihitung skrip build dari luminansi rata-rata tiap webp → muncul di slug, di indeks,
  dan sebagai "total tinta" lembar. Data asli dari gambarmu, bukan angka hiasan.
- **Varian gambar**: `-800` (sudah ada) + `-400` baru untuk bukti/inline. `srcSet` tetap
  dihasilkan skrip yang memverifikasi berkas di disk (fondasi lama ini bagus — dipertahankan).
- **`catatan`**: 1 tulisan lama ditulis ulang dalam bahasa v2; nav menampilkannya hanya jika ≥3.

---

## 8. Teknologi, anggaran, aksesibilitas

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Stack | Vite 6 + React 19 + TypeScript + Tailwind v4 (`@theme`) | sudah tepat, nol alasan ganti |
| Gerak | Motion 12 saja | cukup; tidak ada pustaka animasi kedua |
| Smooth scroll | Lenis, **disentralkan** di `kit/scroll.ts` | sekarang tiap komponen punya loop rAF sendiri |
| **WebGL** | **Tidak dipakai** | register/wipe/overprint tercapai via CSS; hemat ±130 kB gzip |
| Video loader | **Diarsipkan** (tetap di `main`, tidak dipakai v2) | loader v2 murni tipografi + mark → LCP lebih cepat |
| Routing | React Router 7, basename mengikuti `BASE_URL` | dual-deploy tetap satu codebase |
| Deploy | Vercel + GitHub Pages | `_redirects` Netlify dibuang; satu sumber rewrite |

**Anggaran (aku pegang sendiri, diukur tiap fase):**
JS awal ≤ 120 kB gzip · LCP ≤ 1,8 dtk (emulasi 4G) · CLS 0 · INP < 200ms(emu) ·
nol error konsol di 7 route × 2 viewport · nol animasi properti layout.

**Aksesibilitas:** kontras tinta/kertas ±15:1 (AAA) · fokus 1px tinta + offset 3px ·
seluruh navigasi keyboard (termasuk ←/→/Esc di lembaran plat) · fokus terkunci di dialog ·
`prefers-reduced-motion` → statis tapi lengkap · target sentuh ≥ 44px · hierarki heading benar.

---

## 9. Fase kerja

Setiap fase = **1 commit, 1 hal yang bisa kamu lihat**, dan aku kirim **screenshot buktinya**
(1440 / 768 / 390), bukan klaim.

| Fase | Keluaran | Kriteria selesai |
|---|---|---|
| **0 · Fondasi** | branch `rebuild/zero`, `src/kit/` (Mark, Sheet, Slug, register, scroll), token tipografi/warna, satu lembar kosong | grid + mark benar di 3 breakpoint; `tsc` & build bersih; font preload 0× 404 (temuan A6) |
| **1 · Imprint** | pemanasan mesin → imprint; copy & tipografi terkunci | loader→hero satu adegan; reduced-motion & LCP lolos |
| **2 · Indeks plat** | tabel register + jendela bukti + lembaran plat (buka/tutup, kunci scroll, ←/→/Esc) | nol redup by default; hover hanya `@media (hover:hover)`; keyboard & ARIA bersih |
| **3 · Overprint & kolofon** | manifesto menimpa → kolofon + `cetakan ke-n` | 60fps saat scroll cepat; copy "iseng" muncul **1× saja** |
| **4 · Sisa situs** | `/plat/:slug`, `/mesin`, `/kontak`, `/catatan`, lembar nyasar | 5 route × 2 viewport; nol error konsol |
| **5 · Poles** | pass mobile, a11y, anggaran performa, laporan sebelum/sesudah | semua angka §8 terpenuhi; `docs/AUDIT-v2.md` ditulis |

**Tak ada fase yang dimulai sebelum kamu setuju fase sebelumnya beres.**

---

## 10. Kriteria selesai proyek

- [ ] Nol bagian yang bisa ditunjuk "ini punya situs lain" — bahasa visual milik sendiri
- [ ] Satu hukum gerak dipakai konsisten; tidak ada elemen yang geraknya beda sendiri
- [ ] Mobile utuh secara konsep (bukan versi kurus), semua route
- [ ] Angka §8 terpenuhi, diukur bukan diklaim
- [ ] `README.md` v2 menggantikan v1; `PLAN.md` v1 jadi arsip; `docs/` memuat audit + laporan akhir
- [ ] Commit history bersih: satu fase satu commit, pesan jelas
- [ ] Kamu buka situsnya dan tidak bosen. Itu satu-satunya kriteria yang tidak bisa aku ukur sendiri.

---

## 11. Lampiran — temuan situs lama, ditutup oleh konsep

Bukan ditambal satu-satu; semuanya tertutup karena strukturnya diganti. (Bukti: `docs/AUDIT-v0.md`)

| Temuan (situs lama) | Ditutup oleh |
|---|---|
| Rel judul works menabrak section manifesto | §4 indeks = tabel, tanpa rel sticky; §5 satu lembar |
| Teks menembus nav (`mix-blend-difference`) | Kepala halaman dengan latar solid + rule (bukan blend) |
| Mobile: 10 dari 11 karya redup 12% | Aturan baru: **tidak ada redup by default**; hover hanya `@media (hover:hover)` |
| Kolom ketiga masonry menganga kosong | Grid register 12 kolom, blok media wajib selaras |
| Void besar antar babak + `md:ml-[40vw]` | Satu skala jarak mesin di `Sheet` (§6) |
| Preload font 404 di dev | Fondasi baru: preload sadar `BASE_URL` (kriteria Fase 0) |
| Semua gerak `opacity + y 24–40px` seragam | Satu hukum gerak + token (§5) |
| Kurung `[ ]` dipakai 11 tempat | Kurung hanya menandai nomor plat (P3) |
| "Iseng / just for fun" diucapkan 6× | Muncul **1×**, di kolofon (anti-tujuan §1) |
| Loader tidak nyambung ke hero | Pemanasan mesin → imprint jadi satu adegan (Fase 1) |

---

## 12. Pertanyaan terakhir (kecil, tidak menghambat)

1. **Nama label:** indeks karya disebut `PLAT` (konsep) atau tetap `WORKS`/`KARYA`? — usulanku `PLAT`.
2. **Kata berputar di imprint** (kinetic word): dipertahankan dengan kata bertema mesin
   (`dicetak · diukur · disimpan`) atau dibuang supaya lebih tenang? — usulanku dipertahankan, 3 kata.
3. **`/catatan`** dibiarkan di nav meski baru 1 tulisan, atau ikut aturan "muncul jika ≥3"? — usulanku ≥3.

Kalau tiga ini kamu jawab "ikut usulan", aku mulai **Fase 0** tanpa nanya lagi.
