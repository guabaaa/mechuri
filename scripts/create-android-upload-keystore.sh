#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
KEYSTORE="$ANDROID_DIR/app/mechuri-upload.keystore"
PROPS="$ANDROID_DIR/keystore.properties"
ALIAS="mechuri"

if ! command -v keytool >/dev/null 2>&1; then
  echo "keytool 을 찾을 수 없어요. JDK 또는 Android Studio 를 설치하세요."
  exit 1
fi

if [[ -f "$KEYSTORE" ]]; then
  echo "이미 키스토어가 있습니다: $KEYSTORE"
  echo "SHA 지문만 보려면: yarn android:signing:sha"
  exit 1
fi

if [[ -f "$PROPS" ]]; then
  echo "이미 $PROPS 가 있습니다. 키를 다시 만들려면 두 파일을 삭제한 뒤 다시 실행하세요."
  exit 1
fi

echo "메추리 Play 업로드 키를 만듭니다."
echo "비밀번호는 안전한 곳에 꼭 백업하세요. 잃어버리면 같은 키로 업데이트할 수 없습니다."
echo ""

read -r -s -p "Keystore 비밀번호 (8자 이상 권장): " STORE_PASS
echo ""
read -r -s -p "비밀번호 확인: " STORE_PASS2
echo ""
if [[ "$STORE_PASS" != "$STORE_PASS2" ]]; then
  echo "비밀번호가 일치하지 않습니다."
  exit 1
fi
if [[ ${#STORE_PASS} -lt 8 ]]; then
  echo "비밀번호는 8자 이상을 권장합니다."
  exit 1
fi

read -r -s -p "Key 비밀번호 (Enter = keystore 와 동일): " KEY_PASS
echo ""
if [[ -z "$KEY_PASS" ]]; then
  KEY_PASS="$STORE_PASS"
fi

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$STORE_PASS" \
  -keypass "$KEY_PASS" \
  -dname "CN=Mechuri, OU=Mobile, O=Mechuri, L=Seoul, ST=Seoul, C=KR"

cat >"$PROPS" <<EOF
storeFile=mechuri-upload.keystore
storePassword=${STORE_PASS}
keyAlias=${ALIAS}
keyPassword=${KEY_PASS}
EOF

chmod 600 "$PROPS" 2>/dev/null || true

echo ""
echo "완료."
echo "  Keystore : $KEYSTORE"
echo "  Config   : $PROPS"
echo ""
echo "카카오·Play Console 용 SHA 지문:"
"$ROOT/scripts/print-android-signing-sha.sh"
