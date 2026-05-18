#!/usr/bin/env bash
# iOS·Android에 제목용 Jua 폰트만 복사 (본문은 시스템 폰트 → 용량 절감)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONT_SRC="${ROOT}/src/assets/fonts/Jua-Regular.ttf"
IOS_DEST="${ROOT}/ios/Mechuri"
ANDROID_DEST="${ROOT}/android/app/src/main/assets/fonts"

mkdir -p "$IOS_DEST" "$ANDROID_DEST"
cp "$FONT_SRC" "$IOS_DEST/"
cp "$FONT_SRC" "$ANDROID_DEST/"

# 이전 빌드에 남은 Gowun Dodum 제거
rm -f "$IOS_DEST/GowunDodum-Regular.ttf" "$ANDROID_DEST/GowunDodum-Regular.ttf"
