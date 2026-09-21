# AUDIT v0 — wah:anggaaa
**Catatan pengamatan. Situs lama belum aku ubah satu file pun.**

Kode di `~/wah-anggaaa` (branch `main`, commit `900e126`). Aku jalankan dev server, install
Chromium, lalu potret 10 kondisi layar (desktop 1440×900 + mobile 390×844, iPhone UA):

- `/home/user/audit/contact-sheet.jpg` — semua screenshot dalam satu lembar
- `/home/user/audit/shots/*.png` — versi resolusi penuh, bernomor

Dokumen ini **sengaja cuma berisi temuan**. Arah desain bukan isi dokumen ini.

## 1. Kondisi sekarang (pengamatan)

Situsnya **tidak buruk**. Ini situs portofolio dark-editorial yang rapi: 2 warna
(`#020202` / `#EAE8E1`), 2 font self-hosted, 7 route, Lenis + Motion, GSAP & WebGL
sudah dibuang di refactor sebelumnya, transisi halaman ada, loader ada, focus overlay
ada, keyboard nav ada, `noUnusedLocals` aktif.

Artinya: masalahnya **bukan kualitas**, tapi **identitas**. Kenapa kamu bosen — versi teknisnya:

> `PLAN.md` sendiri mencatat bagian **"Pola curian dari 5 referensi"** (kaviengcreative,
> inspirux, lamalama, hellohello, onoera). Situs ini adalah baju yang dijahit dari 5 lemari
> yang bagus. Hasilnya: enak dilihat, tapi setiap bagiannya bisa ditunjuk "ini punya siapa".
> Tidak ada satu ide tanda tangan yang bikin orang ingat ini situs **kamu**.

Jadi arah refactor-nya bukan "tambah animasi". Arahnya: **pilih satu ide besar, buang sisanya,
lalu eksekusi ide itu sampai ekstrem.**

---

## 2. Temuan (semua terverifikasi dari screenshot / kode)

### A. Masalah yang *kelihatan* — ini yang bikin situs terasa belum selesai

**A1. Rel judul works menabrak section manifesto** — `shots/05-manifesto.png`
Rel `sticky top-28` masih mengapung saat manifesto masuk: judul "Aethelgard /
Cerulean Chic" jatuh tepat di atas `[ MANIFESTO ]` + tagline. Dua layer teks bertumpuk
di satu bidang. Penyebab: `HomeWorks.tsx` tidak punya pembatas scoped, dan
`HomeManifesto.tsx` pakai `pt-32 md:pt-48 pb-8` tanpa jarak pemisah visual.

**A2. Ghost text menembus nav** — `shots/03-works-top.png`, `06-footer.png`
Nav `mix-blend-difference` tanpa scroll-state. Di puncak halaman, judul section
("GLINT") dan teks footer menembus nav. Terlihat seperti bug render, bukan efek.

**A3. Mobile: kolase tampil hampir hitam semua** — `shots/10-mobile-works.png`
Kelas spotlight desktop (`opacity-[0.12]`) ikut ke touch. Di mobile, 10 dari 11 karya
redup; yang terang cuma item yang kebetulan kena scroll-spy. Pengunjung mobile pertama
kali melihat **halaman works yang isinya tidak ada** — padahal ini halaman utama.

**A4. Lubang di kolase desktop** — `shots/04-works-mid.png`
Masonry 3 kolom + 11 item = kolom ketiga menganga kosong di bawah Aethelgard. Terbaca
"layout rusak", bukan "kolase sengaja". Kurasi 11 item di 3 kolom secara matematis
memang tidak akan seimbang — perlu jumlah/komposisi yang dipilih, bukan dibiarkan.

**A5. Void besar di mana-mana** — `shots/05`, `06`
Footer pakai `giant={false}` → area kosong besar di atas footer + rule + baris info,
~200px hanya untuk 4 potong teks kecil. Manifesto: scrub satu kalimat di ruang sepi
dengan CTA didorong `md:ml-[40vw]` ke tengah. Jarak antar babak dihitung per-section
(`pt-32`, `pt-40`, `mt-10`) — tidak ada satu ritme global.

**A6. Bug dev: preload font 404** — `vite.config.ts`
Plugin menyuntik `/src/assets/fonts/general-sans-500.woff2`, padahal dev server
menyajikan di bawah base `/wah-anggaaa/`. Tercatat 404 empat kali saat navigasi
(dicek via response listener). Efek: font LCP tidak pernah ter-preload di dev.

### B. Masalah yang *terasa* — ini yang bikin bosen

**B1. Tak ada ide tanda tangan.** Setiap mekanisme di situs ini ada pencipta aslinya:
kolase+spotlight (Lallé), label kurung (lamalama/lamalama-style), manifesto scrub
(hellohello), ritme about (onoera), drift (inspirux). Yang **milikmu** belum ada di layar.

**B2. Landing = 3 blok bertumpuk, bukan satu pengalaman.**
Hero → Works → Manifesto → Footer dipisah jarak, tanpa satu pun elemen yang hidup
menyeberangi babak. Nol continuity. Di situs pemenang, biasanya ada **satu objek/aksi
yang melanjutkan dirinya** dari hero sampai footer.

**B3. Semua gerak punya berat yang sama.**
`EASE` tunggal itu bagus, tapi semua elemen `opacity + y:24-40px`, dari nav sampai
thumbnail. Tidak ada hierarki: tidak ada *satu* momen sinematik yang menjadi puncak.
Hasilnya: tidak ada yang diingat.

**B4. Tipografi besar tapi ritmenya datar.**
Tagline hero 3 baris semuanya `clamp(2.4rem, 7.4vw, 7rem)` — satu ukuran. Padahal
kalimatnya punya punchline ("taken far too **seriously**"). Tidak ada kontras
besar/kecil *di dalam* satu baris. Skala aman = terasa generik.

**B5. Label `[ ... ]` jadi hiasan default.**
Kurung muncul di: portfolio-vol.01, manifesto, acak!, about, contact, journal, status,
"just for fun", "no client work here", "( loading )", "( 011 )". Alasan aslinya
masuk akal (pengganti pill), tapi kalau dipakai di 11 tempat, ia berhenti jadi bahasa
dan jadi wallpaper. Kurung harus dikembalikan jadi **penanda hal penting saja**.

**B6. Konsep "iseng-iseng / just for fun" diucapkan 6×.**
Label hero, footer, about, contact, status studio, README. Diucapkan sekali = jujur dan
charming. Enam kali = orang berhenti percaya bahwa ini santai.

**B7. Loader tidak nyambung ke hero.**
~3 detik perhatian untuk video 112px (≈2% luas layar), lalu hero muncul tanpa sambungan.
Dua pengalaman terpisah, bukan satu intro. (Mekanikanya sendiri bagus — tinggal
disambungkan.)

### C. Kebersihan repo

- `public/_redirects` (Netlify) + `vercel.json` (rewrites) berdampingan; sitemap/robots
  hardcode URL Vercel, tapi README mengklaim deploy GitHub Pages via Actions —
  **`.github/workflows` tidak ada** di repo.
- README menyebut "tanpa `rounded-full`", padahal `index.css` pakai `border-radius: 9999px`
  untuk cursor ring. Kecil, tapi menandakan dokumen & kode sudah mulai berpisah.
- Hero: `AnimatePresence mode="wait"` + `inline-block` untuk kata berputar → tinggi baris
  berubah saat kata berganti (di mobile terlihat `.` melompat).
- `content/journal/*.md`: hanya 1 artikel. Route `/journal` ada di nav — halaman
  setengah jadi ikut terlihat publik.

---

