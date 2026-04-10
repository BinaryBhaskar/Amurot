# Amurot — Landing Site

Premium, minimal single-page website for the Amurot brand.

## Run locally (no Node required)

### 1) Dev (watch Tailwind + local server)

```bash
bash scripts/dev.sh
```

Then open `http://localhost:8080`.

### Live Server (VS Code)

If you're using the VS Code Live Server extension to serve `src/index.html`, run Tailwind in watch mode like this:

```bash
./tools/tailwindcss -i ./src/input.css -o ./src/assets/styles.css --watch --content ./src/index.html
```

### 2) Production build

```bash
bash scripts/build.sh
```

Build output is written to `dist/`.

To preview the production build:

```bash
cd dist
python3 -m http.server 8080
```

## Notes

- DM Sans is loaded from Google Fonts.
- Tailwind is compiled using the official standalone Tailwind CSS v4.0.0 CLI binary (downloaded on first run).
