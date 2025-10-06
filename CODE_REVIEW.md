# Code Review

## 1. Inter bold font points to the regular file
The self-hosted font declarations map both the 400 and 700 weights of Inter to the exact same WOFF2 asset. As a result, text styled with `font-weight: 700` will render using the regular face, so headings and emphasized copy will not look bold. Ship the actual bold cut (or a variable font slice) and reference it in the 700-weight `@font-face` block so that typographic hierarchy is preserved.【F:assets/css/fonts.css†L1-L7】

## 2. GTM loader executes before the encoding is declared
Several pages insert `<script src="/assets/js/gtm-loader.js"></script>` ahead of `<meta charset="utf-8">`. The HTML standard expects the charset declaration to appear first so that the parser knows how to decode everything that follows. Loading a blocking script before the charset can force browsers to assume a fallback encoding and delays first paint. Move the charset to the top (before any script) and add `defer` to the GTM loader so it no longer blocks rendering.【F:harga/index.html†L4-L19】

## 3. Offline WA click tracking points at a missing endpoint
When WhatsApp CTAs are clicked while offline, the service worker registers a background sync that later calls `/track?...` to record the event, and the main bundle can optionally fire the same URL via `navigator.sendBeacon`. This repository only contains static assets, so `/track` resolves to a 404 on typical static hosting, meaning the sync never reports anything and just wastes retries. Either provide a backend endpoint or guard this feature so it is only enabled when the tracking endpoint exists.【F:sw.js†L350-L361】【F:assets/js/main.js†L4537-L4558】【20dd18†L1-L4】
