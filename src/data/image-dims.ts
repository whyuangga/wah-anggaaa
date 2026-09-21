/**
 * DIBUAT OTOMATIS oleh scripts/media.mjs — jangan disunting manual.
 * Jalankan `npm run media` setelah menambah/mengganti gambar.
 *
 * w/h     = dimensi intrinsik (untuk atribut width/height <img>)
 * sources = kandidat srcSet, sudah terurut kecil→besar; nama berkasnya dijamin ada di disk
 */
export type ImageSource = { file: string; w: number };
export const IMAGE_META: Record<string, { w: number; h: number; sources: ImageSource[] }> = {
  '001-lexier.webp': { w: 1200, h: 630, sources: [{ file: '001-lexier-800.webp', w: 800 }, { file: '001-lexier.webp', w: 1200 }] },
  '002-aelian.webp': { w: 540, h: 960, sources: [{ file: '002-aelian.webp', w: 540 }] },
  '003-elan-g1.webp': { w: 896, h: 1200, sources: [{ file: '003-elan-g1-800.webp', w: 800 }, { file: '003-elan-g1.webp', w: 896 }] },
  '003-elan-g2.webp': { w: 896, h: 1200, sources: [{ file: '003-elan-g2-800.webp', w: 800 }, { file: '003-elan-g2.webp', w: 896 }] },
  '003-elan-g3.webp': { w: 1200, h: 896, sources: [{ file: '003-elan-g3-800.webp', w: 800 }, { file: '003-elan-g3.webp', w: 1200 }] },
  '003-elan-g4.webp': { w: 896, h: 1200, sources: [{ file: '003-elan-g4-800.webp', w: 800 }, { file: '003-elan-g4.webp', w: 896 }] },
  '003-elan.webp': { w: 896, h: 1200, sources: [{ file: '003-elan-800.webp', w: 800 }, { file: '003-elan.webp', w: 896 }] },
  '004-vipera-g1.webp': { w: 720, h: 1280, sources: [{ file: '004-vipera-g1.webp', w: 720 }] },
  '004-vipera-g2.webp': { w: 768, h: 1376, sources: [{ file: '004-vipera-g2.webp', w: 768 }] },
  '004-vipera.webp': { w: 768, h: 1376, sources: [{ file: '004-vipera.webp', w: 768 }] },
  '005-vroeger-g1.webp': { w: 1000, h: 746, sources: [{ file: '005-vroeger-g1-800.webp', w: 800 }, { file: '005-vroeger-g1.webp', w: 1000 }] },
  '005-vroeger-g2.webp': { w: 657, h: 1376, sources: [{ file: '005-vroeger-g2.webp', w: 657 }] },
  '005-vroeger-g3.webp': { w: 544, h: 1115, sources: [{ file: '005-vroeger-g3.webp', w: 544 }] },
  '005-vroeger-g4.webp': { w: 800, h: 1071, sources: [{ file: '005-vroeger-g4.webp', w: 800 }] },
  '005-vroeger.webp': { w: 736, h: 1171, sources: [{ file: '005-vroeger.webp', w: 736 }] },
  '006-grit-g1.webp': { w: 1080, h: 1920, sources: [{ file: '006-grit-g1-800.webp', w: 800 }, { file: '006-grit-g1.webp', w: 1080 }] },
  '006-grit-g2.webp': { w: 900, h: 900, sources: [{ file: '006-grit-g2-800.webp', w: 800 }, { file: '006-grit-g2.webp', w: 900 }] },
  '006-grit-g3.webp': { w: 900, h: 900, sources: [{ file: '006-grit-g3-800.webp', w: 800 }, { file: '006-grit-g3.webp', w: 900 }] },
  '006-grit-g4.webp': { w: 1080, h: 1920, sources: [{ file: '006-grit-g4-800.webp', w: 800 }, { file: '006-grit-g4.webp', w: 1080 }] },
  '006-grit.webp': { w: 1080, h: 1920, sources: [{ file: '006-grit-800.webp', w: 800 }, { file: '006-grit.webp', w: 1080 }] },
  '007-cerulean-g1.webp': { w: 768, h: 1376, sources: [{ file: '007-cerulean-g1.webp', w: 768 }] },
  '007-cerulean-g2.webp': { w: 928, h: 1152, sources: [{ file: '007-cerulean-g2-800.webp', w: 800 }, { file: '007-cerulean-g2.webp', w: 928 }] },
  '007-cerulean-g3.webp': { w: 768, h: 1376, sources: [{ file: '007-cerulean-g3.webp', w: 768 }] },
  '007-cerulean-g4.webp': { w: 768, h: 1376, sources: [{ file: '007-cerulean-g4.webp', w: 768 }] },
  '007-cerulean.webp': { w: 768, h: 1376, sources: [{ file: '007-cerulean.webp', w: 768 }] },
  '008-cheriel-g1.webp': { w: 1024, h: 1536, sources: [{ file: '008-cheriel-g1-800.webp', w: 800 }, { file: '008-cheriel-g1.webp', w: 1024 }] },
  '008-cheriel-g2.webp': { w: 1024, h: 1536, sources: [{ file: '008-cheriel-g2-800.webp', w: 800 }, { file: '008-cheriel-g2.webp', w: 1024 }] },
  '008-cheriel-g3.webp': { w: 1024, h: 1536, sources: [{ file: '008-cheriel-g3-800.webp', w: 800 }, { file: '008-cheriel-g3.webp', w: 1024 }] },
  '008-cheriel.webp': { w: 1024, h: 1536, sources: [{ file: '008-cheriel-800.webp', w: 800 }, { file: '008-cheriel.webp', w: 1024 }] },
  '009-aethelgard-g1.webp': { w: 768, h: 1376, sources: [{ file: '009-aethelgard-g1.webp', w: 768 }] },
  '009-aethelgard.webp': { w: 928, h: 1152, sources: [{ file: '009-aethelgard-800.webp', w: 800 }, { file: '009-aethelgard.webp', w: 928 }] },
  '010-ocular-g1.webp': { w: 1200, h: 800, sources: [{ file: '010-ocular-g1-800.webp', w: 800 }, { file: '010-ocular-g1.webp', w: 1200 }] },
  '010-ocular-g2.webp': { w: 1200, h: 800, sources: [{ file: '010-ocular-g2-800.webp', w: 800 }, { file: '010-ocular-g2.webp', w: 1200 }] },
  '010-ocular-g3.webp': { w: 1024, h: 1536, sources: [{ file: '010-ocular-g3-800.webp', w: 800 }, { file: '010-ocular-g3.webp', w: 1024 }] },
  '010-ocular-g4.webp': { w: 1024, h: 1536, sources: [{ file: '010-ocular-g4-800.webp', w: 800 }, { file: '010-ocular-g4.webp', w: 1024 }] },
  '010-ocular.webp': { w: 1200, h: 800, sources: [{ file: '010-ocular-800.webp', w: 800 }, { file: '010-ocular.webp', w: 1200 }] },
  '011-glint-g1.webp': { w: 896, h: 1200, sources: [{ file: '011-glint-g1-800.webp', w: 800 }, { file: '011-glint-g1.webp', w: 896 }] },
  '011-glint-g2.webp': { w: 1200, h: 670, sources: [{ file: '011-glint-g2-800.webp', w: 800 }, { file: '011-glint-g2.webp', w: 1200 }] },
  '011-glint-g3.webp': { w: 896, h: 1200, sources: [{ file: '011-glint-g3-800.webp', w: 800 }, { file: '011-glint-g3.webp', w: 896 }] },
  '011-glint.webp': { w: 896, h: 1200, sources: [{ file: '011-glint-800.webp', w: 800 }, { file: '011-glint.webp', w: 896 }] },
};
