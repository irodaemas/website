# Repository Guidelines

## Project Structure & Module Organization
The site is served as static HTML from the repo root; `index.html`, `offline.html`, and `404.html` define core pages while `blog/` and `harga/` hold section-specific content. Reusable assets live under `assets/`, with `assets/js/` for behavior (`main.js`, `web-vitals.js`, `gtm-loader.js`), `assets/css/` for styling, and `assets/img/`, `fonts/`, `video/` for media. Service-worker logic (`sw.js`) and the PWA manifest (`manifest.webmanifest`) sit at the top level. Keep new scripts or styles in the existing asset folders and mirror the current naming pattern.

## Build, Test, and Development Commands
Run `npm install` once to pull dev dependencies. Use `npm start` (alias for `npx http-server . -p 3000`) to serve the site locally; static routes resolve relative to the repo root. Execute `npm test` to launch Jest in `--runInBand` mode against the DOM-oriented suite; append `-- --watch` when iterating quickly.

## Coding Style & Naming Conventions
Match the legacy-friendly JavaScript style: two-space indentation, semicolons, `var` declarations in runtime code, and module-scoped helper functions. Prefer single quotes in strings and guard DOM access with feature checks as done in `assets/js/main.js`. Place shared utilities in `assets/js/` and export via global assignments rather than ES modules unless you introduce a bundler.

## Testing Guidelines
Jest with `jsdom` powers the current tests (`assets/js/main.test.js`). Name new files `*.test.js` beside the code under test to keep discovery simple. Focus on DOM behavior, accessibility toggles, and analytics loaders; stub `window` APIs rather than hitting the network. Aim to cover new branches and edge cases for user interactions before opening a PR.

## Commit & Pull Request Guidelines
Write commits in the imperative mood (“Align dark mode toggle copy”) and keep messages under ~72 characters; squash incidental debug changes before committing. Each PR should describe the change set, list manual verification steps (e.g., `npm start` smoke checks), and link any related tickets. Include screenshots or recordings whenever you alter UI or animation timing.
