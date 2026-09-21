/**
 * PANAH — digambar sebagai SVG, bukan ditulis sebagai karakter.
 *
 * Alasannya teknis: General Sans TIDAK punya glyph panah (↗ ↓ → sudah aku cek
 * di cmap-nya). Kalau ditulis sebagai karakter, peramban akan meminjam panah
 * dari font lain — bentuknya beda, tebalnya beda, dan aturan "font tunggal"
 * bocor tanpa ketahuan. SVG membuat panah selalu sama di semua perangkat.
 */

type ArrowProps = { className?: string; size?: number };

/** panah diagonal kanan-atas: ↗ */
export function ArrowNE({ className = '', size = 9 }: ArrowProps) {
  return (
    <svg
      className={`inline-block ${className}`}
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.1 7.9 7.9 2.1M7.9 2.1H3.5M7.9 2.1v4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** panah horizontal kanan: → */
export function ArrowE({ className = '', size = 9 }: ArrowProps) {
  return (
    <svg
      className={`inline-block ${className}`}
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.2 5h7.6M8.8 5 5.7 1.9M8.8 5 5.7 8.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** panah bawah: ↓ */
export function ArrowDown({ className = '', size = 9 }: ArrowProps) {
  return (
    <svg
      className={`inline-block ${className}`}
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 1.2v7.6M5 8.8 1.9 5.7M5 8.8l3.1-3.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}
