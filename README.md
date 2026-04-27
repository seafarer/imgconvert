# Image Crop & Export

A client-side tool for preparing website images before uploading them to a CMS. Upload a source image, adjust crops for predefined site ratios, and export optimized `.webp` files as a ZIP.

## How it works

1. Drop or select a source image (JPEG, PNG, or WebP)
2. Adjust crop position and zoom for each preset
3. Click **Export All as ZIP** to download the cropped images

Everything runs in the browser — no server, no uploads, no data leaves your machine.

## Presets

| Preset   | Dimensions   | Suffix     |
| -------- | ------------ | ---------- |
| Hero     | 1600 × 1000  | `-hero`    |
| Card     | 1200 × 900   | `-card`    |
| Portrait | 900 × 1100   | `-portrait`|

Add or modify presets in `src/presets.ts`.

## Output

For a source file named `classroom photo.jpg`, the export produces:

```
classroom-photo-hero.webp
classroom-photo-card.webp
classroom-photo-portrait.webp
```

Whitespace in filenames is replaced with hyphens. On browsers that don't support WebP canvas export, PNG is used as a fallback.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS
- [react-easy-crop](https://github.com/ValentinH/react-easy-crop) for crop UI
- Canvas API for rendering crops
- [JSZip](https://stuk.github.io/jszip/) + [FileSaver.js](https://github.com/nicksavill/FileSaver.js) for bundled download

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy anywhere that serves static files (Vercel, Netlify, etc.).
