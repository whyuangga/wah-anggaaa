/**
 * SEMUA TEKS SITUS ADA DI SINI.
 *
 * Sengaja dipisah dari komponen: supaya kamu bisa mengubah kalimat tanpa
 * menyentuh satu baris pun kode tata letak. Bahasa: campur — headline & label
 * pakai Inggris, isi pakai Indonesia (keputusanmu).
 */

export const META = {
  brand: 'WHAS',
  /** jumlah karya — dipakai di nav sebagai superskrip ("Index⁰⁸") dan nanti di babak karya */
  totalWorks: 8,
  base: 'Jakarta',
  coords: "6.2°S 106.8°E",
};

/**
 * Angka di nav ditulis sebagai SUPERSKRIP, jadi label dan angkanya dipisah
 * di sini (bukan satu string "Index 08"). Angkanya diambil dari META.totalWorks
 * supaya tidak pernah meleset kalau jumlah karya berubah.
 *
 * `placeholder: true` → halaman tujuannya BELUM ada. Tautannya sengaja dibiarkan
 * hidup (bukan dimatikan) supaya bentuk nav-nya sudah final; isinya menyusul.
 * TODO: bangun halaman /playground, lalu ganti href-nya.
 */
export const NAV: { label: string; href: string; sup?: string; placeholder?: boolean }[] = [
  { label: 'Index', sup: String(META.totalWorks).padStart(2, '0'), href: '#karya' },
  { label: 'Playground', href: '#playground', placeholder: true },
  { label: 'Notes', href: '#notes' },
  { label: 'Contact', href: '#contact' },
];

/** Teks menu overlay (mobile). */
export const MENU = {
  open: 'Menu',
  close: 'Tutup',
};

export const HERO = {
  /** label di kiri bawah — satu baris saja */
  label: 'Portofolio personal',
  /** label kecil di kiri paragraf (mengikuti referensi), sekaligus tautan ke bagian about */
  introLabel: 'About',
  introHref: '#about',
  /** paragraf band info */
  intro:
    'Tempat saya mengerjakan brand yang tidak ada: riset sendiri, desain sendiri, kode sendiri, sampai selesai.',
  /** tautan kanan */
  link: 'lihat karya',
  /** headline 3 baris, persis seperti milikmu */
  headline: ['A one-man playground', 'for imaginary brands,', 'taken far too playfully.'],
  /** satu baris penutup di bawah headline */
  closing: 'iseng yang diselesaikan delapan kali.',
};

/**
 * SEKSI KARYA (carousel).
 *
 * Referensi menaruh dua hal di bar bawah: label mode di kiri ("Carousel, List")
 * dan jam kota di kanan ("London, UK 10:50"). Kita baru yang kanan — label mode
 * menyusul bareng mode List-nya.
 */
export const CAROUSEL = {
  /** label seksi di kiri bawah */
  label: 'Karya',
  /** awalan jam di kanan bawah */
  kota: 'Jakarta, ID',
};

/**
 * 8 KARYA.
 *
 * `category`, `role`, `year`, dan `blurb` untuk 4 projek pertama (Vercel) adalah
 * DRAF yang aku susun setelah membaca isi situsnya — belum kamu setujui.
 * Yang 4 terakhir (GLINT · OCULAR · AETHELGARD · ÉLAN) memakai metadata lama
 * yang kamu tulis sendiri, jadi statusnya sudah pasti.
 */
export type Work = {
  slug: string;
  title: string;
  category: string;
  year: string;
  url: string;
  role: string;
  blurb: string;
  /** draf = belum kamu setujui */
  draf?: boolean;
};

export const WORKS: Work[] = [
  {
    slug: 'oskovia',
    title: 'OSKOVIA',
    category: 'Independent Design Studio',
    year: "'26",
    url: 'https://oskovia.vercel.app/',
    role: 'Design + Code',
    blurb:
      'Studio desain khayalan dengan lima proyek berhalaman kasus masing-masing. Kertas krem, angka raksasa, dan nomor berkas yang jadi bintang.',
    draf: true,
  },
  {
    slug: 'vesusia',
    title: 'VESUSIA',
    category: 'Production House / Talent',
    year: "'26",
    url: 'https://vesusia.vercel.app/',
    role: 'Design + Code',
    blurb:
      'Rumah produksi di ruang gelap: gambar-gambar melayang, mark yang menyala, dan navigasi Karya · Studio · Talenta · Kontak.',
    draf: true,
  },
  {
    slug: 'onderre',
    title: 'ONDERRE',
    category: 'Objects / Industrial Design',
    year: "'26",
    url: 'https://onderre.vercel.app/',
    role: 'Design + Code',
    blurb:
      'Objek dan material, disusun per babak bernomor. Motto-nya sendiri: objects with a point of view.',
    draf: true,
  },
  {
    slug: 'lexindra',
    title: 'LEXINDRA',
    category: 'Handmade Stained Glass',
    year: "'26",
    url: 'https://lexindra.vercel.app/',
    role: 'Design + Code',
    blurb:
      'Kaca patri buatan tangan sejak 2012: sepuluh koleksi, komisi, restorasi, sampai proyek arsitektur. Situs paling dalam dari delapan.',
    draf: true,
  },
  {
    slug: 'glint',
    title: 'GLINT',
    category: 'Eyewear & Jewelry Y2K',
    year: "'26",
    url: 'https://glint-landing-58i.pages.dev/',
    role: 'Design',
    blurb: 'Kacamata dan perhiasan bertema Y2K.',
  },
  {
    slug: 'ocular',
    title: 'OCULAR',
    category: 'Sci-fi Cinematic',
    year: "'26",
    url: 'https://ocular-45z.pages.dev/',
    role: 'Design + Code',
    blurb: 'Narasi sinematik bertema prostetik sibernetik.',
  },
  {
    slug: 'aethelgard',
    title: 'AETHELGARD',
    category: 'Archive / Journal',
    year: "'26",
    url: 'https://aethelgard-7e0.pages.dev/',
    role: 'Story + Code',
    blurb: 'Arsip botani: benda langka dan penemuan yang tenang.',
  },
  {
    slug: 'elan',
    title: 'ÉLAN',
    category: 'Fashion Editorial',
    year: "'26",
    url: 'https://elan-fashion-editorial.pages.dev/',
    role: 'Design',
    blurb: 'Editorial mode Issue No. 01: mood, bukan tren.',
  },
];
