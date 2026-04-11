#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
DIST_DIR="$ROOT_DIR/_site"
TAILWIND_BIN="$ROOT_DIR/tools/tailwindcss"

bash "$ROOT_DIR/scripts/setup-tailwind.sh"

echo "Building Tailwind CSS..."
"$TAILWIND_BIN" \
  -i "$SRC_DIR/input.css" \
  -o "$SRC_DIR/assets/styles.css" \
  --minify

echo "Building Jekyll site..."
cd "$ROOT_DIR"
bundle exec jekyll build

echo "Built production site in: $DIST_DIR"
