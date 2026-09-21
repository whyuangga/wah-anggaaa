# PLANNING — WHAS v1
### Portofolio personal editorial · rencana build
**Status: RENCANA. Belum ada kode. Tunggu keputusanmu di §15.**
Bahan & alat sudah siap di `~/whas` — lihat `README.md` folder itu.

---

## 1. Brief & aturan keras

| Aspek | Ketentuanmu |
|---|---|
| Jenis | Portofolio **personal editorial** |
| Brand | **WHAS** — logo di header **semua halaman** |
| Headline | `A one-man playground for imaginary brands, taken far too playfully.` |
| Warna UI | latar **#0D0D0F**, teks **#FFFFFF** |
| Font | **General Sans** saja · 400/500/**700** · nol italic |
| Tech | framework modern + **GSAP + Lenis** |
| Referensi | `gilhuybrecht.com` · `studiodado.com` — struktur hero |
| Karya | **8 projek** (4 Vercel + 4 Cloudflare Pages) — 11 karya lama **sudah dihapus** |
| Notes | tetap di nav |

### Aturan keras

| # | Aturan | Konsekuensi operasional |
|---|---|---|
| ① | **Tanpa marquee** | Nol strip berjalan. Gerak = mask-reveal, parallax, scale-in, wipe diagonal, rule menggambar |
| ② | **Tanpa pill background** | Nol `border-radius`; fokus keyboard = outline kotak 1px |
| ③ | **Hanya 2 warna untuk UI** | `#0D0D0F` + `#FFFFFF`. Nol warna lain di CSS |
| ④ | **Tanpa italic** | Nol `font-style: italic/oblique`, `skewX`, nol `<em>` yang mencetak miring |
| ⑤ | **Font tunggal** | General Sans saja |
| ⑥ | **Tanpa efek pada foto** | Nol grayscale, filter, duotone, overlay, blend mode. **Foto = warna asli** |
| ⑦ | **Tanpa crop foto** | Rasio asli utuh. Nol `object-fit: cover`. Di mobile **diperkecil, bukan dipotong** |

Catatan ④: kemiringan 10° pada **logo WHAS** adalah bentuk huruf di dalam aset yang kamu berikan.

---

## 2. Struktur halaman depan (terkunci)

```
   HERO ── solid #0D0D0F, murni tipografi. Tanpa foto.
           Struktur DADO: stasiun nav, rule 1px, band info, headline 3 baris di dasar.
             ↓
   CAROUSEL ── section tepat setelah hero. Isinya 8 hero projekmu.
               Gerak & tata letaknya MENUNGGU referensimu (§14).
             ↓
   TENTANG SINGKAT ── beberapa baris + tautan ke /about
             ↓
   FOOTER ── wordmark WHAS besar
```

### 2.1 Hero tanpa foto menyelesaikan tabrakan aturan

Kalau foto ditaruh di hero, aturan ⑥ melarang satu-satunya cara membuat teks terbaca di atas
foto terang. Buktinya dari hasil ukur 8 hero:

| Kelompok | Projek | Luminansi | Teks putih di atasnya? |
|---|---|---|---|
| terang | oskovia, onderre, glint | 143–229 | mustahil terbaca; penopang gradasi **dilarang ⑥** |
| sedang | elan | 102 | berisiko |
| gelap | aethelgard, lexindra, ocular, vesusia | 7–65 | terbaca, tapi ocular & vesusia justru menyatu dengan latar |

Dengan hero solid, semuanya hilang: **foto pindah ke carousel**, dan di sana keterangan
(judul · kategori · tahun) duduk **di luar bidang foto** — bukan menumpang di atasnya.

### 2.2 Hero = halaman judul

```
  WHAS (logo)                      Index 08        Notes                 JKT 20:32
                                    About          Contact
 ────────────────────────────────────────────────────────────────────────────────  ← rule 1px @ 33% viewport
  Jakarta —                                                                        ← label 2 baris
  portofolio personal              [ paragraf band info, x 44%, lebar ~36% ]    [ lihat karya ↗ ]

                                        (kekosongan — bidang kosong #0D0D0F)

   A ONE-MAN PLAYGROUND
   FOR IMAGINARY BRANDS, TAKEN FAR TOO PLAYFULLY.        ← 3 baris, dasar layar
   iseng yang diselesaikan delapan kali.                 ← satu baris penutup
```

**Mobile 390×844:** nav jadi 2 stasiun + menu teks; rule di ~42%; paragraf lebar penuh;
headline 3 baris margin 20px. Anatomi sama, bukan versi kurus.

### 2.3 Foto apa adanya — konsekuensi teknis

- Semua foto **rasio asli 16:10** (semuanya diambil 1440×900). Tidak ada bingkai rasio paksa.
- Keterangan **di luar** bidang foto. Nol teks di atas foto.
- Nol `cover`, nol gradasi, nol blur di atas foto.
- **vesusia (7,7) & ocular (12,1)** menyatu dengan latar `#0D0D0F` (≈13) → dipisahkan **garis tepi
  1px**. Garis adalah elemen struktur situs ini, bukan efek pada foto.
- Mobile: lebar penuh, tinggi mengikuti rasio (≈244px di 390px). Diperkecil.

---

## 3. Yang aku baca dari logomu (hasil ukur)

| Ukuran | Hasil |
|---|---|
| Rasio wordmark | **4,96 : 1** · area tinta 1591×321 px |
| Tinta mengisi kanvas | **24,4%** → wajib di-trim |
| Berat berkas | 1,9 MB PNG → harus dioptimasi |
| Kemiringan | ≈ **10°** |
| Bentuk | **100% poligonal** — nol lengkung, potongan 45° |

**Bahasa bentuk situs:** `border-radius: 0` (sekalian memenuhi ②), potongan **diagonal 45°** untuk
mask/hover/transisi, **garis 1px sebagai elemen struktur utama**, kemiringan 10° hemat satu tempat.

---

## 4. Dari dua referensimu

**DADO** (hero): rule 1px @ 33,6% viewport · nav **stasiun** dengan item bertumpuk dua-dua ·
band info (label kiri, paragraf x 44% lebar 36%, link kanan x 92%) · headline di dasar, tinggi
huruf ±11,6% viewport · pemisah babak berupa garis. → dipakai di §2.2 (tanpa foto).

**Gil** (karya): hampir tanpa teks; judul + gambar besar. Seragam 3:4 hasil crop **tidak bisa
dipakai** (⑦). Keseragaman digantikan oleh **lebar bidang, jarak, dan garis tepi**.

---

## 5. Sistem desain (ringkas)

`--bg #0D0D0F` · `--ink #FFFFFF` (+ opacity bila §15-D disetujui).
Foto: warna asli, tanpa perlakuan apa pun.

| Peran | Bobot | Pemakaian |
|---|---|---|
| `display` | **700** | headline hero, wordmark footer |
| `statement` | 500 | paragraf band info, intro, judul babak |
| `label` | 500, uppercase, tracking 0.08–0.12em, 11–12px | nav, caption, kategori, tahun |
| `body` | 400, 16–17px/1.6 | teks panjang |
| `figure` | 500, tabular | nomor, jam |

**Grid:** 12 kolom · gutter 24 · margin 40/20 · maks 1440 · skala `4 · 8 · 12 · 20 · 32 · 52 · 84 · 136`.
**Bentuk:** radius 0 · diagonal 45° · garis 1px.

---

## 6. Gerak — satu mesin: GSAP + Lenis

`motion` dicabut; GSAP satu-satunya mesin animasi (ScrollTrigger + SplitText), Lenis satu loop
`rAF` terpusat. (GSAP 100% gratis termasuk plugin bonus.)

| Bagian | Gerak |
|---|---|
| Hero masuk | rule **menggambar** (scaleX 0→1) → label naik → paragraf fade → **headline mask per baris** (y 110%→0, stagger 0,08) |
| Carousel | ✅ **jadi** — mekanisme iamrossmason.com (§14 terjawab) |
| Karya | bidang foto: mask diagonal + `scale` 1,03 → 1; keterangan menyusul |
| Judul babak | kata-per-kata (SplitText), sekali |
| Rule antar babak | garis menggambar dari kiri |
| Footer | wordmark direveal dari balik garis |
| Transisi halaman | **rule jadi alat transisi**: garis turun dari atas, halaman berganti di baliknya |
| Reduced motion | Lenis mati, semua animasi ke keadaan akhir |

---

## 7. Aset 8 karya — **sudah selesai & terverifikasi**

Hero desktop kedelapan situs sudah diambil **1440×900 @ dpr 2** (2880×1800), networkidle +
8 dtk, dan **ditunggu sampai layar diam** sebelum disimpan (dua frame berturut identik) supaya
situs dengan slideshow otomatis tidak tertangkap di tengah transisi.

**Temuan proses:** LEXINDRA butuh 13 percobaan sebelum stabil (animasi panjang);
**AETHELGARD & VESUSIA tidak pernah sepenuhnya diam** (ada animasi kontinu) — untuk keduanya
frame terakhir dipakai, dan hasilnya sudah aku periksa: bersih, tanpa elemen menggantung.

| slug | judul (dari halaman) | nada | luminansi | saturasi | webp 1600 |
|---|---|---|---|---|---|
| `oskovia` | OSKOVIA — Independent Design Studio | terang | 228,7 | 1,9 | 22,7 kB |
| `vesusia` | VESUSIA | gelap | 7,7 | 4,2 | 25,8 kB |
| `onderre` | ONDERRE | terang | 218,8 | 8,8 | 32,8 kB |
| `lexindra` | Lexindra — Handmade Stained Glass | gelap | 32,3 | 20,6 | 74,3 kB |
| `glint` | GLINT — See the Light. Wear the Shine. | terang | 143,8 | 28,1 | 146,9 kB |
| `ocular` | OCULAR — Final Cinematic Version | gelap | 12,1 | 1,3 | 41,1 kB |
| `aethelgard` | Aethelgard — The Hidden Archive | gelap | 64,9 | **51,9** | 198,3 kB |
| `elan` | ÉLAN — New Mood | sedang | 102,0 | 6,5 | 68,7 kB |

**Total 601 kB untuk 8 webp 1600px** (+ varian 800px untuk mobile) — semua tanpa crop, tanpa efek,
bisa dilacak balik ke `_raw/` baris per piksel. LQIP ada di `_lqip.json` → nol CLS.

Lembar review: `whas/assets/works/_semua-8-hero.jpg`

**Catatan dari hasil screenshot** (tidak mempengaruhi aturan kita, tapi perlu kamu tahu):

- **GLINT & AETHELGARD** memakai **warna** kuat (biru / merah marun) di hero-nya; **ÉLAN**
  memakai teks **italic** dan **LEXINDRA** memakai **italic + pill** di nav-nya. Keempatnya situs
  mandiri yang kamu buat dengan aturannya sendiri; di WHAS tidak akan ada keduanya (aturan ④②).
- **ÉLAN** hero-nya berganti otomatis (siklus `02/03`); yang tersimpan adalah frame tenang pertama
  pada siklusnya — konsisten setiap kali diambil ulang.

### 7.1 Yang belum ada: metadata 4 projek baru

Metadata lengkap (kategori, tahun, role, stack, cerita) **hanya ada untuk 4 projek yang kebetulan
masuk repo lama**: `elan`, `aethelgard`, `ocular`, `glint` — sudah aku selamatkan ke
`reference/works-meta.json` sebelum repo lama dihapus.

Untuk 4 projek Vercel (`oskovia`, `vesusia`, `onderre`, `lexindra`) aku baru punya judul + screenshot.
→ **§15-C**: kamu kirim kategori/tahun/deskripsi singkatnya, atau aku ajukan draf untuk kamu koreksi.

---

## 8. Peta halaman

| Route | Isi |
|---|---|
| `/` | hero judul (§2.2) → **carousel 8 projek** (§14) → tentang singkat → footer wordmark |
| `/works` | 8 karya, bidang besar, keterangan di luar foto |
| `/works/:slug` | gambar asli utuh · judul + kategori + tahun · satu paragraf · `kunjungi ↗` · karya sebelum/berikutnya |
| `/about` | tentang: siapa, cara kerja, alat · tanpa foto portrait |
| `/contact` | email + sosial + jam Jakarta · tanpa form |
| `/notes`, `/notes/:slug` | jurnal (1 tulisan) — **tetap di nav** |
| `*` | 404 dalam bahasa yang sama |

---

## 9. Tech stack & anggaran

| Lapisan | Pilihan |
|---|---|
| Framework | **Vite + React 19 + TypeScript + Tailwind v4** — ditulis ulang dari nol |
| Animasi / scroll | **GSAP 3** (ScrollTrigger + SplitText) · **Lenis** |
| Font | General Sans 400 / 500 / **700** — Italic tidak diunduh |
| Dibuang | `motion` · video loader · IBM Plex Mono · `_redirects` · repo lama (sudah dihapus) |
| Deploy | Vercel + GitHub Pages dari satu codebase |

**Anggaran:** JS awal ≤ 150 kB gzip · LCP ≤ 1,8 dtk (emulasi 4G) · CLS 0 · nol error konsol ·
nol animasi properti layout.

---

## 10. Fase kerja (1 fase = 1 commit + screenshot bukti)

| Fase | Keluaran | Selesai bila |
|---|---|---|
| ~~**0 · Fondasi**~~ ✅ | **SELESAI** — logo di-trim (1,9 MB → 1,1 kB), 3 berat General Sans di-subset (22 kB), token 2 warna, 5 peran tipografi, GSAP + Lenis, struktur `src/` | ✅ build & `tsc` bersih |
| ~~**1 · Hero**~~ ✅ | **SELESAI** — hero halaman-judul: garis tergores → huruf naik dari balik mask, nol fade | ✅ 4 viewport bersih, nol overflow, reduced-motion lolos, JS 106,7 kB gzip |
| **2 · Carousel** | ✅ **jadi** — 8 projek, sel 100vw/5, snap per sel, wordmark `WHAS` | `docs/SPEC-CAROUSEL.md` |
| **3 · Karya & halaman karya** | `/works` 8 karya + `/works/:slug` + transisi rule | nol foto terpotong · keyboard & reduced-motion lolos |
| **4 · Sisa halaman** | `/about`, `/contact`, notes, 404 | 7 route × 2 viewport, nol error |
| **5 · Poles** | mobile, a11y, performa, README baru | angka §9 terpenuhi |

---

## 11. Paragraf band info — 2 kandidat (kamu pilih, §15-E)

**Kandidat A** — tegas, tanpa pembelaan diri
> Delapan situs yang tidak diminta siapa pun. Dibuat malam-malam, diselesaikan seperti proyek betulan.

**Kandidat B** — lebih tenang, soal cara kerja
> Tempat saya mengerjakan brand yang tidak ada: riset sendiri, desain sendiri, kode sendiri, sampai selesai.

Versi Inggris: **A** — *Eight sites nobody asked for. Built at night, finished like real work.*
**B** — *Where I build brands that don't exist: research, design, and code — all the way to done.*

---

## 12. Sudah terkunci

✅ WHAS di header semua halaman · headline persis milikmu · `#0D0D0F` + `#FFFFFF`
✅ General Sans saja (400/500/700) · nol italic · nol efek & nol crop pada foto
✅ **Hero solid murni tipografi** · **carousel tepat setelah hero** · notes tetap di nav
✅ **8 karya**: oskovia · vesusia · onderre · lexindra · glint · ocular · aethelgard · élan
✅ Ke-8 hero sudah diambil & diolah (§7) · 11 karya lama + repo lama sudah dihapus
✅ GSAP + Lenis · Motion dicabut
✅ **Bahasa: campur** — headline & label Inggris, isi Indonesia
✅ **NOL opacity** — hierarki teks murni dari ukuran/bobot/tracking; semua putih 100%
✅ **Reveal tanpa opacity** — mask (`yPercent`) + `clip-path`, bukan fade
✅ Metadata 4 projek Vercel: **draf dari aku**, ditandai `draf: true` di `src/lib/copy.ts`
✅ **Nav mobile = menu overlay** penuh layar (tombol MENU di kanan atas), bukan daftar tautan
✅ **Nav `About` → `Playground`** — halaman tujuannya BELUM ada (`href: '#playground'`, ditandai
   `placeholder`). Pending: rancang & bangun halaman Playground

## 13. Ruang kerja

`~/whas` (proyek) dan `~/tools` (alat: `shoot-hero.mjs`, `prepare-images.py`).
Repo lama `wah-anggaaa` sudah **dihapus** sesuai permintaanmu; yang masih berharga sudah
diselamatkan lebih dulu (font 400/500, logo, LQIP, metadata 4 karya, dokumen).

## 14. MENUNGGU: referensi carousel

Kamu sedang mencari referensinya — **aku tidak menyusun apa pun untuk bagian ini.** Yang nanti
aku butuh: tautannya (atau screenshot) + bagian mana yang kamu suka (geraknya, tata letaknya,
atau cara berpindahnya). Setelah itu aku ajukan satu spec, sekaligus menjawab kebutuhan three.js.

---

## 15. Yang aku tunggu darimu

| # | Keputusan | Rekomendasiku |
|---|---|---|
| ⚠️ **A** | **Mulai Fase 0 + 1 sekarang** (fondasi + hero — dua-duanya tidak tergantung carousel), lalu carousel menyusul saat referensimu siap? | **Mulai sekarang** |
| ⚠️ **B** | **Bahasa isi**: Indonesia, Inggris, atau campur (headline Inggris + isi Indonesia)? | **Campur** seperti yang kamu pakai sekarang |
| ⚠️ **C** | **Metadata 4 projek Vercel** (§7.1): kirim kategori/tahun/deskripsi, atau aku ajukan draf untuk kamu koreksi? | **Aku ajukan draf** |
| **D** | **Hierarki teks**: putih dengan opacity (menghasilkan abu-abu) atau benar-benar nol abu-abu? | **Opacity putih** |
| **E** | **Paragraf band info**: kandidat A, B, atau kalimatmu sendiri? (§11) | **A** |
| **F** | **Kekosongan di hero**: dibiarkan kosong, atau diisi daftar 8 nama sebagai tautan ke carousel? | **Dibiarkan kosong** |
| **G** | **three.js**: tidak dulu, atau langsung ada? | **Tidak dulu**; putuskan bersama spec carousel |

**Kalau kamu jawab "ikut rekomendasi" untuk A–G, aku langsung mulai Fase 0.**
