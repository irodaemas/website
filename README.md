# Sentral Emas Static Site

This repository now uses [Eleventy](https://www.11ty.dev/) to compose shared layout pieces. Headers, footers, and other repeating fragments live under `src/_includes/components` so updates to navigation or contact details only need to happen once.

## Prerequisites

- Node.js 18+

## Install & Develop

```bash
npm install
npm run serve
```

The dev server outputs into `dist/` and watches both page templates and assets. Static files that should be copied as-is reside in `src/static`.

## Production Build

```bash
npm run build
```

The compiled site is written to `dist/`.

## Project Layout

- `src/pages` – Page templates (`.njk`). They include shared partials via Nunjucks `{% include %}`.
- `src/_includes/components` – Reusable header, footer, skip-link, and GTM fragments.
- `src/assets` – Styles, scripts, fonts, and images (passthrough copied).
- `src/static` – Root-level files like `sw.js`, `manifest.webmanifest`, etc.

To add a new page, drop a template into `src/pages`, include the relevant header/footer partial, and run `npm run build`.
