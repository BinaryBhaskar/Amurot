#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
TAILWIND_BIN="$ROOT_DIR/tools/tailwindcss"

bash "$ROOT_DIR/scripts/setup-tailwind.sh"

mkdir -p "$SRC_DIR/assets"

# Run Tailwind CSS watch in the background
"$TAILWIND_BIN" \
  -i "$SRC_DIR/input.css" \
  -o "$SRC_DIR/_includes/tailwind.css" \
  --watch &
TAILWIND_PID=$!

cleanup() {
  echo "Stopping Tailwind CSS watcher..."
  kill "$TAILWIND_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Starting Jekyll server..."
cd "$ROOT_DIR"
bundle exec jekyll serve --livereload
