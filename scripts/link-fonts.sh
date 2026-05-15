#!/usr/bin/env bash
# iOS·Android에 커스텀 폰트 복사 (빌드 시 번들에 포함)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONT_SRC="${ROOT}/src/assets/fonts"
IOS_DEST="${ROOT}/ios/Mechuri"
ANDROID_DEST="${ROOT}/android/app/src/main/assets/fonts"

mkdir -p "$IOS_DEST" "$ANDROID_DEST"
cp "$FONT_SRC"/*.ttf "$IOS_DEST/"
cp "$FONT_SRC"/*.ttf "$ANDROID_DEST/"
