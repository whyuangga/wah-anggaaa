#!/usr/bin/env bash
# Subset font (opsional, dijalankan manual — butuh Python + fonttools).
#
#   pip install fonttools brotli
#   ./scripts/subset-fonts.sh
#
# Rentang yang dipertahankan:
#   U+0020-00FF  ASCII + Latin-1 (seluruh teks Indonesia + © ® ° ± · × É é)
#   U+2013-2014  – —
#   U+2018-201D  ‘ ’ “ ”
#   U+2022 · U+2026 … · U+2122 ™
#   U+2190 ← U+2192 → U+2193 ↓ U+2197 ↗ · U+2713 ✓
#                (empat panah & centang TIDAK ada di font aslinya; tetap
#                 dideklarasikan supaya ikut kalau fontnya diganti)
#
# Kalau nanti ada teks dengan karakter di luar rentang ini (mis. huruf
# beraksen Vietnam/Polandia), perluas UNICODES di bawah lalu jalankan ulang —
# atau pakai file font asli dari Fontshare/Google Fonts.
set -euo pipefail

UNICODES='U+0020-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2122,U+2190,U+2192,U+2193,U+2197,U+2713'
DIR="$(cd "$(dirname "$0")/.." && pwd)/src/assets/fonts"

command -v pyftsubset >/dev/null || {
  echo "pyftsubset tak ditemukan. Jalankan: pip install fonttools brotli" >&2
  exit 1
}

for font in "$DIR"/*.woff2; do
  before=$(wc -c <"$font")
  pyftsubset "$font" \
    --unicodes="$UNICODES" \
    --flavor=woff2 \
    --layout-features='*' \
    --output-file="$font.tmp"
  mv "$font.tmp" "$font"
  after=$(wc -c <"$font")
  printf '%-28s %5.1fkB → %5.1fkB\n' "$(basename "$font")" \
    "$(echo "$before/1024" | bc -l)" "$(echo "$after/1024" | bc -l)"
done
