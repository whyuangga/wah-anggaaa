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

/* ============================================================================
   DETAIL KARYA — isi overlay saat sebuah karya dibuka.

   Struktur meniru halaman case di iamrossmason.com:
     judul besar + (tahun)  →  baris meta (Kategori / Peran · Status)
     →  foto hero           →  pernyataan  →  galeri  →  next project.
   Foto diambil dari landing page tiap projek (lihat assets/works/<slug>/).
   Teks pernyataan adalah DRAF — kamu yang menyetujuinya nanti.
   ========================================================================== */

/** letak sebuah foto di galeri: penuh lebar · menyamping (inset) · dua bersebelahan */
export type LetakGaleri = 'penuh' | 'senja' | 'pasangan';

export type FotoGaleri = {
  file: string;
  w: number;
  h: number;
  letak: LetakGaleri;
};

export type DetailKarya = {
  /** judul pernyataan (padanan h2 .h3 di case mereka) */
  pernyataan: string;
  /** paragraf pernyataan (padanan .txt) */
  paragraf: string[];
  galeri: FotoGaleri[];
};

const f = (file: string, w: number, h: number, letak: LetakGaleri): FotoGaleri => ({
  file,
  w,
  h,
  letak,
});

export const DETAIL: Record<string, DetailKarya> = {
  oskovia: {
    pernyataan: 'Lima proyek, satu bahasa.',
    paragraf: [
      'Oskovia adalah studio desain khayalan dengan lima proyek berhalaman kasus masing-masing — Meridian Press, Kertas Atelier, Sonder Type, Halftone Club, dan Terrazzo House.',
      'Kertas krem, angka raksasa, dan nomor berkas yang jadi bintang. Hierarki datang dari ukuran dan spasi, bukan dari warna.',
    ],
    galeri: [f('oskovia/pr-01.webp', 1600, 1600, 'penuh'), f('oskovia/pr-02.webp', 1600, 1600, 'senja'), f('oskovia/pr-03.webp', 1600, 1600, 'pasangan'), f('oskovia/pr-04.webp', 1600, 1600, 'pasangan'), f('oskovia/pr-05.webp', 1600, 1600, 'penuh')],
  },
  vesusia: {
    pernyataan: 'Ruang gelap, mark yang menyala.',
    paragraf: [
      'Rumah produksi dengan sedikit kata: Karya, Studio, Talenta, Kontak. Situs lebih banyak berdiam daripada menjelaskan — persis seperti ruang rekaman.',
      'Nama-namanya sengaja belum terisi. Sebuah produksi rumah bukan katalog; ia moodboard yang menunggu tayangan.',
    ],
    galeri: [
      f('vesusia/logo-vesusia.png', 1774, 887, 'penuh'),
      // foto "melayang" di landing-nya dirender di canvas (WebGL) — tidak bisa
      // diambil sebagai aset, jadi yang masuk galeri adalah tangkapannya.
      f('vesusia/babak-01.png', 1600, 900, 'senja'),
    ],
  },
  onderre: {
    pernyataan: 'Objects with a point of view.',
    paragraf: [
      'Tiga objek disusun per babak bernomor — Form 01, Material Study, Object 03 — lalu arsip material yang disengaja tidak selesai.',
      'Motto-nya sendiri: not everything needs to explain itself.',
    ],
    galeri: [f('onderre/hero-onderre.webp', 928, 1152, 'senja'), f('onderre/object-01.webp', 928, 1152, 'pasangan'), f('onderre/object-02.webp', 1312, 816, 'pasangan'), f('onderre/object-03.webp', 928, 1152, 'penuh'), f('onderre/archive-01.webp', 928, 1152, 'senja'), f('onderre/archive-02.webp', 1024, 1024, 'senja')],
  },
  lexindra: {
    pernyataan: 'Sepuluh koleksi cahaya.',
    paragraf: [
      'Kaca patri buatan tangan sejak 2012: sepuluh koleksi dari Aurea sampai Rosea, aplikasi jendela sampai fasad, dan proyek arsitektur dari Villa Serambi ke Chapel of Light.',
      'Situs paling dalam dari delapan — sebuah arsip cahaya yang bisa digali, bukan sekadar dilihat.',
    ],
    galeri: [f('lexindra/hero-craft.jpg', 1376, 768, 'penuh'), f('lexindra/hero-heritage.jpg', 1376, 768, 'senja'), f('lexindra/col-aurea.jpg', 896, 1200, 'pasangan'), f('lexindra/world-villa-serambi.jpg', 896, 1200, 'pasangan'), f('lexindra/hero-bespoke.jpg', 1376, 768, 'penuh'), f('lexindra/app-windows.jpg', 1376, 768, 'senja')],
  },
  glint: {
    pernyataan: 'Dua perspektif, satu kilauan.',
    paragraf: [
      'Kacamata dan perhiasan bertema Y2K. Morning Glint sebagai drop perdana, Evening Glint untuk malam.',
      'Silver wire frame dan chrome hoop, dipajang seperti kampanye — bukan katalog.',
    ],
    galeri: [f('glint/lookbook.jpg', 1376, 768, 'penuh'), f('glint/sunglasses.jpg', 896, 1200, 'pasangan'), f('glint/earrings.jpg', 896, 1200, 'pasangan'), f('glint/hero.jpg', 896, 1200, 'senja')],
  },
  ocular: {
    pernyataan: 'Narasi sinematik prostetik.',
    paragraf: [
      'Sebuah dunia sci-fi yang diceritakan lewat lensa: mata sibernetik, visor mode, dan detail kaca yang dipesan satu per satu.',
      'Setiap frame disusun seperti shot list, bukan galeri — versi final, bukan rough cut.',
    ],
    galeri: [f('ocular/proj1.jpg', 1536, 1024, 'penuh'), f('ocular/proj2.jpg', 1536, 1024, 'senja'), f('ocular/proj3.jpg', 1024, 1536, 'pasangan'), f('ocular/proj3-detail1.jpg', 1024, 1536, 'pasangan'), f('ocular/proj1-detail1.jpg', 1536, 1024, 'penuh')],
  },
  aethelgard: {
    pernyataan: 'The language of forgotten gardens.',
    paragraf: [
      'Arsip botani yang dikumpulkan dengan niat: benda langka, jurnal, dan ritual kecil.',
      'Curated, considered — tenang, dan tidak perlu menjelaskan dirinya sendiri.',
    ],
    galeri: [f('aethelgard/foreground.png', 768, 1376, 'senja'), f('aethelgard/hero-v2.webp', 928, 1152, 'senja')],
  },
  elan: {
    pernyataan: 'Mood, bukan tren.',
    paragraf: [
      'Editorial mode Issue No. 01. Style is not what you wear — it\'s how you arrive.',
      'Look utilitarian, detail mata dan kain yang diperbesar, ditutup campaign final. Sepatu tidak pernah muncul; mood yang berpose.',
    ],
    galeri: [f('elan/model-main.jpg', 896, 1200, 'senja'), f('elan/look-01.jpg', 896, 1200, 'pasangan'), f('elan/look-02.jpg', 896, 1200, 'pasangan'), f('elan/detail-eyes.jpg', 1200, 896, 'penuh'), f('elan/detail-fabric.jpg', 1200, 896, 'senja'), f('elan/look-03.jpg', 896, 1200, 'pasangan'), f('elan/finale-campaign.jpg', 896, 1200, 'pasangan')],
  },
};
