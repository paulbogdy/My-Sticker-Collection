# My Sticker Collection

A local-first PWA for tracking sticker albums on mobile.

## First version

- FIFA World Cup 2026 Standard Edition seed data
- Collection and duplicate quantities tracked separately
- LastSticker-style comma-separated import/export, for example `MEX11, SUI20, FWC1`
- Local IndexedDB persistence through Dexie
- Installable PWA manifest and offline service worker
- GitHub Pages-ready Vite config

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

The GitHub Actions workflow builds the app and uploads the `dist/` folder to GitHub Pages.
In the repository settings, set Pages to deploy from GitHub Actions.
