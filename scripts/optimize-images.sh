#!/usr/bin/env bash
# Metro·iOS에서 안정적으로 로드되도록 PNG 용량·해상도 정리
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG="${ROOT}/src/assets/images"
ICO="${ROOT}/src/assets/icons"

chmod 644 "${IMG}"/*.png "${ICO}"/*.png 2>/dev/null || true

sips -Z 400 "${IMG}/mechuri.png" --out "${IMG}/mechuri.png" >/dev/null
sips -Z 420 "${IMG}/mechuri_logo_cropped.png" --out "${IMG}/mechuri_logo_cropped.png" >/dev/null
sips -Z 420 "${IMG}/mechuri_logo.png" --out "${IMG}/mechuri_logo.png" >/dev/null
sips -Z 132 "${ICO}/notification.png" --out "${ICO}/notification.png" >/dev/null
sips -Z 132 "${ICO}/notification_red.png" --out "${ICO}/notification_red.png" >/dev/null
if [[ -f "${ICO}/dice_icon.png" ]]; then
  sips -Z 128 "${ICO}/dice_icon.png" --out "${ICO}/dice_icon.png" >/dev/null
fi

echo "Optimized images in src/assets"
