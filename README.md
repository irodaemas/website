<p align="center">
  <img src="assets/img/logo.webp" alt="Sentral Emas logo" width="120">
</p>

<h1 align="center">SENTRAL EMAS WEBSITE</h1>

<p align="center"><em>Empowering COD gold trade with transparent, always-on data for Jabodetabek.</em></p>

<p align="center">
  <a href="https://sentralemas.com"><img src="https://img.shields.io/website?style=for-the-badge&url=https%3A%2F%2Fsentralemas.com&label=Live%20Site" alt="Website status"></a>
  <a href="https://github.com/irodaemas/website/commits/main"><img src="https://img.shields.io/github/last-commit/irodaemas/website?style=for-the-badge&label=Last%20update" alt="Last commit"></a>
  <a href="https://github.com/irodaemas/website"><img src="https://img.shields.io/badge/static%20site-production-blue?style=for-the-badge" alt="Static site"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white" alt="PWA ready">
</p>

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the site locally](#running-the-site-locally)
  - [Testing](#testing)
- [Maintenance Tips](#maintenance-tips)
  - [Updating price data sources](#updating-price-data-sources)
  - [Extending the content search](#extending-the-content-search)
  - [Regenerating the PWA cache](#regenerating-the-pwa-cache)
- [Deployment](#deployment)
- [Support](#support)

## Overview
Sentral Emas is a content-rich Indonesian website that streamlines COD gold, diamond, and luxury watch buyback services across Jabodetabek. This repository contains the production-ready static assets served at [sentralemas.com](https://sentralemas.com), including a pricing hub, educational blog, and offline-friendly PWA experience.

**Live sections**
- Landing page: <https://sentralemas.com/>
- Harga buyback: <https://sentralemas.com/harga/>
- Blog & guides: <https://sentralemas.com/blog/>

## Key Features
- **Real-time gold pricing dashboard** - Fetches buyback data from Pluang, highlights delta trends, renders sparklines, and gracefully falls back to cached prices when connectivity drops.
- **Global spot monitoring** - Aggregates XAU currency endpoints (cdn.jsdelivr currency API) with multi-endpoint fallback logic to keep international references available.
- **Interactive tools** - Includes a WhatsApp-prefilled estimator, calculator grid, and shareable pricing summaries that capture user context.
- **Site-wide search overlay** - Client-side indexed content (`SEARCH_INDEX`) across landing, harga, and blog entries with typo-tolerant normalization.
- **PWA & offline resilience** - Custom service worker (`sw.js`) precaches critical pages, fonts, and imagery, while serving an `offline.html` fallback when the network is unavailable.
- **SEO & analytics ready** - Rich JSON-LD schemas, structured breadcrumbs, Google Tag Manager hooks, and `data-track` attributes for CTA event reporting.
- **Accessibility & performance** - Prefers reduced motion, lazy loading, alternate section backgrounds, and responsive typography for mobile-first browsing.

## Project Structure
```text
.
|-- assets/
|   |-- css/                # Global styles, fonts, responsive breakpoints, animations
|   |-- img/                # Optimised hero and illustration assets
|   |-- js/
|   |   |-- main.js         # All interactive behaviours and data integrations
|   |   `-- main.test.js    # Jest + jsdom test suite for critical UX flows
|   `-- fonts/              # Self-hosted font files referenced by fonts.css
|-- blog/                   # Static blog articles with embedded schema data
|-- harga/                  # Dedicated pricing page and FAQ content
|-- offline.html            # Offline fallback served by the service worker
|-- sw.js                   # Custom service worker with cache/version control
|-- manifest.webmanifest    # PWA manifest and icon declarations
|-- index.html              # Landing page entry point
|-- package.json            # npm scripts (local server, tests) and dev deps
`-- CNAME / robots.txt      # SEO, sitemap, and custom domain configuration
```

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm 9+ (bundled with recent Node releases)
- Optional: a modern browser to test PWA/install flows

### Installation
```bash
git clone https://github.com/irodaemas/website.git
cd website
npm install
```

### Running the site locally
Start a static server on <http://localhost:3000>:

```bash
npm start
```

The script uses `npx http-server` to serve the current directory. Because a service worker is registered, open the site in a fresh private window or clear previously cached SWs when previewing changes.

### Testing
```bash
npm test
```

The Jest suite runs in a jsdom environment and covers search behaviour, calculators, media fallbacks, and the gold price highlight logic. Use `npm test -- --watch` for iterative development.

## Maintenance Tips

### Updating price data sources
- `assets/js/main.js` -> `fetchGoldPrice()` queries `https://data-asg.goldprice.org/dbXRates/IDR`. If the provider changes, update the endpoint and CSP `connect-src` whitelist accordingly.
- Global spot prices rely on `getGlobalGoldEndpoints()` which currently targets CDN Currency API variants. Add or reorder endpoints to fine-tune fallback behaviour.
- When schemas or response shapes change, update the normaliser helpers (`normalizeGlobalGoldPayload`, `prepareLmBaruHistorySeries`) and extend the Jest tests to lock in the expected shape.

### Extending the content search
- The on-device search overlay is seeded by the `SEARCH_INDEX` array near the top of `assets/js/main.js`.
- Add entries for new landing sections or blog posts, ensuring each object includes `id`, `url`, `title`, `description`, and `keywords`.
- Re-run `npm test` to confirm that new entries are discoverable and correctly grouped.

### Regenerating the PWA cache
- Increment `CACHE_NAME` and, if needed, `FONT_CACHE` in `sw.js` whenever you add or rename assets so clients pull the latest bundle.
- Add new critical files to the `CORE_ASSETS` array to ensure they are precached for offline use.
- After publishing, visit `/sw.js` in the browser devtools to verify the updated service worker is active and old caches are removed.

## Deployment
The site is a pure static bundle. Any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, nginx, etc.) can serve it directly:

1. Run `npm start` locally to verify the bundle.
2. Upload the project root (including `sw.js`, `manifest.webmanifest`, and the `assets/` directory) to your host.
3. Preserve the `CNAME` file if you are serving the `sentralemas.com` domain.
4. Invalidate CDN/service-worker caches after deployment so visitors receive the new assets.

## Support
Questions or partnership inquiries can be directed via WhatsApp at [wa.me/6285591088503](https://wa.me/6285591088503).  
For technical issues, open a GitHub issue on this repository.

> [:arrow_upper_left: Back to top](#sentral-emas-website)
