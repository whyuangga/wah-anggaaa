/**
 * DIBUAT OTOMATIS oleh scripts/media.mjs — jangan disunting manual.
 * Jalankan `npm run media` setelah menambah/mengganti gambar.
 *
 * w/h        = dimensi intrinsik (untuk atribut width/height <img>)
 * widths     = lebar varian yang tersedia di disk (untuk srcSet)
 */
export const IMAGE_META: Record<string, { w: number; h: number; widths: number[] }> = {
  '001-lexier.webp': { w: 1200, h: 630, widths: [800] },
  '002-aelian.webp': { w: 540, h: 960, widths: [] },
  '003-elan-g1.webp': { w: 896, h: 1200, widths: [800] },
  '003-elan-g2.webp': { w: 896, h: 1200, widths: [800] },
  '003-elan-g3.webp': { w: 1200, h: 896, widths: [800] },
  '003-elan-g4.webp': { w: 896, h: 1200, widths: [800] },
  '003-elan.webp': { w: 896, h: 1200, widths: [800] },
  '004-vipera-g1.webp': { w: 720, h: 1280, widths: [] },
  '004-vipera-g2.webp': { w: 768, h: 1376, widths: [] },
  '004-vipera.webp': { w: 768, h: 1376, widths: [] },
  '005-vroeger-g1.webp': { w: 1000, h: 746, widths: [800] },
  '005-vroeger-g2.webp': { w: 657, h: 1376, widths: [] },
  '005-vroeger-g3.webp': { w: 544, h: 1115, widths: [] },
  '005-vroeger-g4.webp': { w: 800, h: 1071, widths: [] },
  '005-vroeger.webp': { w: 736, h: 1171, widths: [] },
  '006-grit-g1.webp': { w: 1080, h: 1920, widths: [800] },
  '006-grit-g2.webp': { w: 900, h: 900, widths: [800] },
  '006-grit-g3.webp': { w: 900, h: 900, widths: [800] },
  '006-grit-g4.webp': { w: 1080, h: 1920, widths: [800] },
  '006-grit.webp': { w: 1080, h: 1920, widths: [800] },
  '007-cerulean-g1.webp': { w: 768, h: 1376, widths: [] },
  '007-cerulean-g2.webp': { w: 928, h: 1152, widths: [800] },
  '007-cerulean-g3.webp': { w: 768, h: 1376, widths: [] },
  '007-cerulean-g4.webp': { w: 768, h: 1376, widths: [] },
  '007-cerulean.webp': { w: 768, h: 1376, widths: [] },
  '008-cheriel-g1.webp': { w: 1024, h: 1536, widths: [800] },
  '008-cheriel-g2.webp': { w: 1024, h: 1536, widths: [800] },
  '008-cheriel-g3.webp': { w: 1024, h: 1536, widths: [800] },
  '008-cheriel.webp': { w: 1024, h: 1536, widths: [800] },
  '009-aethelgard-g1.webp': { w: 768, h: 1376, widths: [] },
  '009-aethelgard.webp': { w: 928, h: 1152, widths: [800] },
  '010-ocular-g1.webp': { w: 1200, h: 800, widths: [800] },
  '010-ocular-g2.webp': { w: 1200, h: 800, widths: [800] },
  '010-ocular-g3.webp': { w: 1024, h: 1536, widths: [800] },
  '010-ocular-g4.webp': { w: 1024, h: 1536, widths: [800] },
  '010-ocular.webp': { w: 1200, h: 800, widths: [800] },
  '011-glint-g1.webp': { w: 896, h: 1200, widths: [800] },
  '011-glint-g2.webp': { w: 1200, h: 670, widths: [800] },
  '011-glint-g3.webp': { w: 896, h: 1200, widths: [800] },
  '011-glint.webp': { w: 896, h: 1200, widths: [800] },
};
