export type Work = {
  index: string;
  title: string;
  category: string;
  year: string;
  url: string;
  /** hotlink milik sendiri; null = fallback blok tipografis */
  thumb: string | null;
};

export const WORKS: Work[] = [
  { index: '001', title: 'LEXIER®', category: 'Experimental Typography', year: "'26", url: 'https://lexier.pages.dev/', thumb: 'https://lexier.pages.dev/og.png' },
  { index: '002', title: 'AELIAN', category: 'High Jewelry Editorial', year: "'26", url: 'https://aelian.pages.dev/', thumb: 'https://aelian.pages.dev/assets/og_image.jpg' },
  { index: '003', title: 'ÉLAN', category: 'Fashion Editorial', year: "'26", url: 'https://elan-fashion-editorial.pages.dev/', thumb: 'https://elan-fashion-editorial.pages.dev/assets/model-main.jpg' },
  { index: '004', title: 'VIPERA Émeraude', category: 'Luxury Watch', year: "'26", url: 'https://vipera-emeraude.pages.dev/', thumb: 'https://vipera-emeraude.pages.dev/images/gallery-embrace.jpg' },
  { index: '005', title: 'Vroeger Koffiehuis', category: 'Brand Storytelling', year: "'26", url: 'https://vroeger-koffiehuis.pages.dev/', thumb: 'https://vroeger-koffiehuis.pages.dev/img/hero-cutout.webp' },
  { index: '006', title: 'Grit & Grace', category: 'Jewelry E-commerce', year: "'26", url: 'https://grit-and-grace.pages.dev/', thumb: 'https://grit-and-grace.pages.dev/asset/still-fullbody.jpg' },
  { index: '007', title: 'Cerulean Chic', category: 'Fashion Boutique', year: "'26", url: 'https://cerulean-chic.pages.dev/', thumb: 'https://cerulean-chic.pages.dev/img/katalog/dress-1.jpg' },
  { index: '008', title: 'CHERIEL', category: 'Jewelry Brand', year: "'26", url: 'https://cheriel-landing.pages.dev/', thumb: 'https://cheriel-landing.pages.dev/img/aurelia.jpg' },
  { index: '009', title: 'Aethelgard', category: 'Archive / Journal', year: "'26", url: 'https://aethelgard-7e0.pages.dev/', thumb: 'https://aethelgard-7e0.pages.dev/assets/aethelgard-hero-v2.webp' },
  { index: '010', title: 'OCULAR', category: 'Sci-fi Cinematic', year: "'26", url: 'https://ocular-45z.pages.dev/', thumb: 'https://ocular-45z.pages.dev/assets/images/proj1.jpg' },
  { index: '011', title: 'GLINT', category: 'Eyewear & Jewelry Y2K', year: "'26", url: 'https://glint-landing-58i.pages.dev/', thumb: 'https://glint-landing-58i.pages.dev/assets/hero.jpg' },
];

/** 5 karya pilihan untuk collage landing */
export const SELECTED = WORKS.slice(0, 5);

export const CONTACT = {
  // PLACEHOLDER — ganti saat sudah ada data asli
  email: 'halo@wahanggaaa.id',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'X / Twitter', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Dribbble', href: '#' },
  ],
};
