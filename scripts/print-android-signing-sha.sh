#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROPS="$ROOT/android/keystore.properties"
KEYSTORE="$ROOT/android/app/mechuri-upload.keystore"
ALIAS="mechuri"

print_sha() {
  local label="$1"
  local keystore="$2"
  local alias="$3"
  local pass="$4"
  echo "--- $label (Play Console용) ---"
  keytool -list -v -keystore "$keystore" -alias "$alias" -storepass "$pass" 2>/dev/null \
    | awk '/SHA1:|SHA256:/{print}'
}

print_kakao_hash() {
  local label="$1"
  local keystore="$2"
  local alias="$3"
  local pass="$4"
  if ! command -v openssl >/dev/null 2>&1; then
    echo "openssl 이 필요합니다 (카카오 키 해시 생성)."
    return
  fi
  local hash
  hash="$(
    keytool -exportcert -alias "$alias" -keystore "$keystore" -storepass "$pass" 2>/dev/null \
      | openssl sha1 -binary \
      | openssl base64 \
      | tr -d '\n'
  )"
  echo "--- $label (카카오 콘솔에 붙여넣기) ---"
  echo "$hash"
  echo "(콜론 SHA-1 이 아닌 Base64 한 줄입니다)"
}

if ! command -v keytool >/dev/null 2>&1; then
  echo "keytool 을 찾을 수 없습니다."
  exit 1
fi

if [[ -f "$PROPS" && -f "$KEYSTORE" ]]; then
  STORE_PASS="$(grep '^storePassword=' "$PROPS" | cut -d= -f2-)"
  KEY_ALIAS="$(grep '^keyAlias=' "$PROPS" | cut -d= -f2-)"
  KEY_ALIAS="${KEY_ALIAS:-$ALIAS}"
  if [[ -n "$STORE_PASS" ]]; then
    print_sha "Upload key" "$KEYSTORE" "$KEY_ALIAS" "$STORE_PASS"
    print_kakao_hash "Upload key" "$KEYSTORE" "$KEY_ALIAS" "$STORE_PASS"
  fi
fi

DEBUG="$ROOT/android/app/debug.keystore"
if [[ -f "$DEBUG" ]]; then
  print_sha "Debug key" "$DEBUG" "androiddebugkey" "android"
  print_kakao_hash "Debug key" "$DEBUG" "androiddebugkey" "android"
fi

if [[ ! -f "$KEYSTORE" && ! -f "$DEBUG" ]]; then
  echo "키스토어가 없습니다. 먼저 yarn android:keystore 를 실행하세요."
  exit 1
fi
