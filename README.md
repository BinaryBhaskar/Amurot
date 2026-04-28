# Amurot — Landing Site

Premium, minimal single-page website for the Amurot brand.

## Run locally

### 1) Install

```bash
npm install
```

### 2) Dev

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

### 3) Production build

```bash
npm run build
```

Build output is written to `dist/`.

To preview the production build:

```bash
npm run preview
```

## Deploy to Vercel

- Import the repo into Vercel.
- The defaults should be auto-detected via [vercel.json](vercel.json):
	- Build Command: `npm run build`
	- Output Directory: `dist`

## Notes

- DM Sans is loaded from Google Fonts.
- The previous Jekyll source is preserved in `legacy-jekyll-src/`.
