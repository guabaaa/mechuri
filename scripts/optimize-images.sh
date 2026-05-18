#!/usr/bin/env bash
# Metro·앱 번들용 이미지·영상 용량 정리
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG="${ROOT}/src/assets/images"
ICO="${ROOT}/src/assets/icons"
VID="${ROOT}/src/assets/video"

chmod 644 "${IMG}"/*.png "${ICO}"/*.png 2>/dev/null || true

sips -Z 320 "${IMG}/mechuri.png" --out "${IMG}/mechuri.png" >/dev/null
sips -Z 360 "${IMG}/mechuri_logo.png" --out "${IMG}/mechuri_logo.png" >/dev/null
if [[ -f "${IMG}/mechuri_logo_cropped.png" ]]; then
  sips -Z 360 "${IMG}/mechuri_logo_cropped.png" --out "${IMG}/mechuri_logo_cropped.png" >/dev/null
fi
sips -Z 128 "${ICO}/notification.png" --out "${ICO}/notification.png" >/dev/null
sips -Z 128 "${ICO}/notification_red.png" --out "${ICO}/notification_red.png" >/dev/null
if [[ -f "${ICO}/dice_icon.png" ]]; then
  sips -Z 128 "${ICO}/dice_icon.png" --out "${ICO}/dice_icon.png" >/dev/null
fi
if [[ -f "${ICO}/face_icon.png" ]]; then
  sips -Z 128 "${ICO}/face_icon.png" --out "${ICO}/face_icon.png" >/dev/null
fi

if [[ -f "${VID}/e_e_mp_.mp4" ]] && command -v ffmpeg >/dev/null 2>&1; then
  TMP="${VID}/e_e_mp_.optimized.mp4"
  ffmpeg -y -i "${VID}/e_e_mp_.mp4" \
    -vf "scale='min(480,iw)':-2" \
    -c:v libx264 -preset slow -crf 28 \
    -an -movflags +faststart \
    "$TMP" >/dev/null 2>&1
  mv "$TMP" "${VID}/e_e_mp_.mp4"
  echo "Compressed splash video"
fi

echo "Optimized images in src/assets"
