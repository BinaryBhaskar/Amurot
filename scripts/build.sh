#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
DIST_DIR="$ROOT_DIR/dist"
TAILWIND_BIN="$ROOT_DIR/tools/tailwindcss"

bash "$ROOT_DIR/scripts/setup-tailwind.sh"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/assets"

cp "$SRC_DIR/index.html" "$DIST_DIR/index.html"
cp "$SRC_DIR/assets/app.js" "$DIST_DIR/assets/app.js"
cp "$SRC_DIR/assets/logo.svg" "$DIST_DIR/assets/logo.svg"

"$TAILWIND_BIN" \
  -i "$SRC_DIR/input.css" \
  -o "$DIST_DIR/assets/styles.css" \
  --minify \
  --content "$SRC_DIR/index.html"

echo "Built production site in: $DIST_DIR"
