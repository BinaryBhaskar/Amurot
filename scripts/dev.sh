#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
TAILWIND_BIN="$ROOT_DIR/tools/tailwindcss"

bash "$ROOT_DIR/scripts/setup-tailwind.sh"

mkdir -p "$SRC_DIR/assets"

"$TAILWIND_BIN" \
  -i "$SRC_DIR/input.css" \
  -o "$SRC_DIR/assets/styles.css" \
  --watch \
  --content "$SRC_DIR/index.html" &
TAILWIND_PID=$!

cleanup() {
  kill "$TAILWIND_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Serving http://localhost:8080 (src/)"
cd "$SRC_DIR"
python3 -m http.server 8080
