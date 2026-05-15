#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REQ="--require ${ROOT}/scripts/metro-node-polyfills.cjs"
if [[ -n "${NODE_OPTIONS:-}" ]]; then
  export NODE_OPTIONS="${REQ} ${NODE_OPTIONS}"
else
  export NODE_OPTIONS="${REQ}"
fi
exec "${ROOT}/node_modules/.bin/react-native" "$@"
