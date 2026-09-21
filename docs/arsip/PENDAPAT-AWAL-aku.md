# CADANGAN — isi yang aku keluarkan dari audit

Ini **pendapat & usulan aku** yang aku tulis sebelum kamu sempat menjelaskan maumu.
Diparkir di sini, tidak dihapus, tidak dipakai sampai kamu bilang perlu.

---

2. Yang harus dipertahankan (fondasinya mahal)

| Hal | Alasan |
|---|---|
| Arsitektur Vite + React 19 + TS + Tailwind v4 token | bersih, chunk dipecah, route lazy |
| Font self-hosted (General Sans + IBM Plex Mono) | cepat, gratis, karakternya sudah pas |
| Palet 2 warna + hierarki via opacity | justru ini yang bikin situs ini "terlihat mahal" |
| Loader kecil (video 112px + counter mono, ~3 dtk, hanya di `/`) | tasteful, jarang ada yang begini kalem |
| Works focus overlay + keyboard nav + scroll-spy touch | interaksi terkuat di situs ini |
| Scrub kata manifesto & scroll-spy tanpa library | hemat, tahan toolbar mobile |
| Disiplin media (video 74 kB, srcSet terverifikasi) | jarang dimiliki portofolio pribadi |

---


## 4. Arah desain — 3 pilihan (pilih satu, ini bukan menu)

Ketiganya berangkat dari bahan yang sudah ada (11 karya fiktif, palet 2 warna,
fon yang sudah dipilih). Bedanya: **apa yang jadi tulang punggungnya.**

### Arah A — "ARSIP" · katalog brand yang tidak pernah ada
Situs ini berhenti jadi portofolio, jadi **arsip**. Setiap karya punya nomor katalog,
kartu data, cap tahun, cross-reference. Babak: `INVENTARIS → KARTU → CATATAN KURATOR → KOLOFON`.
- **Tanda tangan:** kartu katalog yang *terbang* dari tempatnya di indeks ke tengah layar
  saat dibuka (bukan overlay fade) — dan bisa dibalik.
- **Yang diperbaiki:** A1 (rel jadi indeks arsip yang selalu hidup dan punya akhir jelas),
  A4 (indeks tidak lagi bergantung masonry), B2 (indeks = benang yang hidup antar babak).
- Nada: dingin, presisi, monumental. Paling *"museum"*, paling mudah dijual ke orang awam.

### B — "GRID YANG MEMBERONTAK" · struktural, motion-first
Satu grid 12 kolom dipakai di seluruh landing. Tiap babak **melanggarnya dengan cara berbeda**,
lalu kembali ke garis. Hero: tiap baris jalan dengan kecepatan parallax sendiri.
- **Tanda tangan:** transisi yang **memindahkan grid** (baris teks & gambar ditata ulang
  sebagai bagian dari gerak yang sama), bukan halaman fade.
- **Yang diperbaiki:** B3 (motion punya satu aturan jelas, bukan fade seragam), B4 (grid
  memaksa kontras ukuran), A5 (ritme ditentukan grid, bukan padding manual).
- Nada: analitis, keras, arsitektural. Paling "template Awwwards" — risiko: kalau eksekusi
  tidak rapi, langsung terlihat seperti klon.

### C — "DUNIA KECIL" · satu adegan kontinu, tanpa sekat
Buang batas section. Landing = **satu adegan** tempat tipografi dan 11 karya hidup:
gambar bergerak di rail terus-menerus, manifesto adalah gerak *zoom masuk* ke dalamnya,
footer adalah tempat adegan itu mengendap.
- **Tanda tangan:** tidak ada section — pengunjung merasa berada *di dalam* sesuatu,
  bukan menggulir brosur.
- **Yang diperbaiki:** B2 paling tuntas (tidak ada blok, karena tidak ada babak), A5
  (void hilang karena ruang dipakai gambar).
- Nada: imersif, sinematik. Paling berani, paling berisiko di mobile — butuh disiplin
  performa yang tinggi (transform/opacity saja, gambar terbatas di DOM).

> Catatan: ketiganya bisa dikerjakan **tanpa WebGL**. Kalau kamu mau efek berat
> (distorsi gambar, partikel, morph) aku perlu izin menambah `three`/`ogl` kembali —
> dan itu berarti budget JS naik ±130 kB gzip. Situs ini sudah pernah membuang WebGL
> karena hasilnya nyaris tak terlihat; aku hanya mau mengembalikannya kalau ada ide
> yang membenarkan biayanya.

---


## 5. Rekomendasi aku (kalau kamu serahkan ke aku)

**Arah A**, dengan satu elemen dari B: grid sebagai *bahasa gerak*, kartu katalog sebagai
*tanda tangan*. Alasannya: kamu punya 11 karya fiktif + 1 jurnal — bahan mentah yang
persis dibutuhkan sebuah arsip. Ini juga satu-satunya arah yang membuat kelemahan
terbesarmu ("iseng, brand khayalan") justru jadi **konsepnya**, bukan alasan minta maaf.

Eksekusi: buang dulu, jangan tambal. Loader disambung ke hero, works dirombak jadi indeks,
footer jadi kolofon, lalu `/about` `/contact` `/journal` diturunkan dari bahasa yang sama.

---


## 6. Yang aku butuh darimu sebelum menulis satu baris kode

1. **Arah mana** (A / B / C, atau kombinasi).
2. **Scope**: hanya landing `/`, atau seluruh situs?
3. **Kebebasan**: identitas sekarang (2 warna, 2 font, tanpa foto, tanpa marquee/pill,
   nada "iseng") — mana yang tetap mengikat, mana yang boleh aku langgar?
4. **Konten**: 11 karya + 1 jurnal + copy lama tetap dipakai apa adanya, atau boleh aku
   tulis ulang (copy dulu yang bikin situs ini terdengar seperti banyak situs lain)?

Setelah itu aku kirim **rencana refactor** (fase, file, urutan commit) — bukan langsung
menulis kode. Baru setelah kamu setuju, aku mulai dari 0.
