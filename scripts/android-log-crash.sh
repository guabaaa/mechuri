#!/usr/bin/env bash
# 앱 아이콘 탭 직후 크래시 로그 (USB 디버깅 + 폰 연결 필요)
set -euo pipefail
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

if ! command -v adb >/dev/null 2>&1; then
  echo "adb 없음. Android Studio SDK platform-tools PATH 를 설정하세요."
  exit 1
fi

if ! adb devices | grep -q 'device$'; then
  echo "연결된 기기 없음. USB 디버깅을 켜고 adb devices 를 확인하세요."
  exit 1
fi

echo "로그 초기화 후 메추리 앱을 실행하세요..."
adb logcat -c
adb shell am start -n com.mechuri/.MainActivity 2>/dev/null || true
sleep 3
adb logcat -d | grep -iE "FATAL|AndroidRuntime|ReactNative|com\.mechuri" | tail -60
