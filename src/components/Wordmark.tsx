import { META } from '../lib/copy';

/**
 * WORDMARK — nama brand selebar halaman isi, duduk rata di kiri-bawah.
 *
 * Di referensi, "ROSSMASON" bukan teks: ia gambar SVG supaya hurufnya boleh
 * dicampur tiga typeface, termasuk satu serif italic. Kita tidak boleh mencampur
 * dan tidak boleh italic (aturan ④⑤) — jadi yang diambil dari cara itu bukan
 * hurufnya, melainkan ketePatannya: digambar sebagai SVG juga, tapi tetap hidup
 * sebagai teks di dalam SVG.
 *
 * KENAPA SVG, bukan teks HTML dengan margin negatif:
 * `line-height` yang lebih rapat dari tinggi kotak huruf membuat tinta keluar
 * dari kotak barisnya — di dalam mask `overflow: hidden` itu berarti hurufnya
 * terpotong, dan sisa ruang di bawah garis dasar harus ditebus dengan margin
 * negatif yang nilainya berubah-ubah (cqw vs vh vs px). Dengan viewBox yang
 * sudah dipotong tepat ke tintanya, KOTAK = TINTA: tidak ada yang terpotong,
 * tidak ada celah, dan lebarnya pasti 100%.
 *
 * Angka viewBox diukur, bukan diterka (General Sans 700, tracking −0,035em,
 * dari canvas `actualBoundingBox` pada font-size 400):
 *   tinta 1222 × 301, garis dasar di y=294.
 * `textLength` memaksa lebar tintanya pas 1222 satuan, `lengthAdjust="spacing"`
 * hanya merapatkan jarak antarhuruf — bentuk hurufnya tidak pernah dimelarkan.
 */
export default function Wordmark() {
  return (
    <div className="wordmark-mask">
      <svg
        className="wordmark"
        data-wm
        viewBox="0 0 1222 301"
        /* xMinYMax: kalau tingginya dibatasi layar pendek, tinta tetap menempel
           di kiri-bawah — tidak pernah mengambang di tengah. */
        preserveAspectRatio="xMinYMax meet"
        role="img"
      >
        <title>{META.brand}</title>
        <text
          className="wordmark-teks"
          x="0"
          y="294"
          textLength="1222"
          lengthAdjust="spacing"
        >
          {META.brand}
        </text>
      </svg>
    </div>
  );
}
