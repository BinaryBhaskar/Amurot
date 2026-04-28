# Amurot — Commands

This repo is now a Vite + React + Tailwind (v4) app.

## One-time setup

```bash
npm install
```

## Development

Start the dev server (Tailwind is handled automatically via Vite):

```bash
npm run dev
```

- Vite will print the local URL (typically `http://localhost:5173`).

### Dev (bash wrapper)

If you prefer the original bash entrypoint:

```bash
bash scripts/dev.sh
```

## Production build

Build to `dist/`:

```bash
npm run build
```

### Build (bash wrapper)

```bash
bash scripts/build.sh
```

## Preview production build

Serve the built `dist/` bundle locally:

```bash
npm run preview
```

By default this runs on `http://localhost:8080`.

## Deploy (Vercel)

- Build command: `npm run build`
- Output directory: `dist`