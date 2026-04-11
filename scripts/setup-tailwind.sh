#!/usr/bin/env bash
set -euo pipefail

TAILWIND_VERSION="${TAILWIND_VERSION:-v4.0.0}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="$ROOT_DIR/tools"
BIN_PATH="$TOOLS_DIR/tailwindcss"

if [[ -x "$BIN_PATH" ]]; then
  exit 0
fi

mkdir -p "$TOOLS_DIR"

os="$(uname -s)"
arch="$(uname -m)"

case "${os}-${arch}" in
  Darwin-arm64) asset="tailwindcss-macos-arm64" ;;
  Darwin-x86_64) asset="tailwindcss-macos-x64" ;;
  Linux-x86_64) asset="tailwindcss-linux-x64" ;;
  Linux-arm64|Linux-aarch64) asset="tailwindcss-linux-arm64" ;;
  *)
    echo "Unsupported platform: ${os}-${arch}" >&2
    exit 1
    ;;
esac

base="https://github.com/tailwindlabs/tailwindcss/releases/download/${TAILWIND_VERSION}"
bin_url="${base}/${asset}"
sha_url="${base}/sha256sums.txt"

tmp_sha="$(mktemp)"
cleanup() { rm -f "$tmp_sha"; }
trap cleanup EXIT

echo "Downloading Tailwind CLI ${TAILWIND_VERSION} (${asset})..."
curl -fsSL "$bin_url" -o "$BIN_PATH"
curl -fsSL "$sha_url" -o "$tmp_sha"

expected="$(awk -v asset="$asset" '$2 == asset || $2 == ("./" asset) { print $1; exit }' "$tmp_sha")"
if [[ -z "$expected" ]]; then
  echo "Could not find checksum for ${asset}" >&2
  exit 1
fi

sha256() {
  local file="$1"

  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
    return 0
  fi

  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
    return 0
  fi

  echo "Neither 'shasum' nor 'sha256sum' is available to verify downloads" >&2
  return 1
}

actual="$(sha256 "$BIN_PATH")"
if [[ "$expected" != "$actual" ]]; then
  echo "Checksum mismatch for tailwindcss binary" >&2
  echo "Expected: $expected" >&2
  echo "Actual:   $actual" >&2
  exit 1
fi

chmod +x "$BIN_PATH"

# Print a short sanity line (includes version)
"$BIN_PATH" --help | head -n 1
