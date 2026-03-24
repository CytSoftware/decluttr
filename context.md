Building a cross-browser extension (Chrome, Firefox, Edge, etc.) uses the WebExtensions API standard, making it developer-friendly with one codebase for 95%+ compatibility via Manifest V3. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)

## Core Requirements
Start with `manifest.json` (V3): Define permissions ("tabs", "bookmarks"), popup/background/content scripts. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- Use `browser.*` namespace (standard) or polyfill `chrome.*` for Chrome. [npmjs](https://www.npmjs.com/package/webextension-polyfill)
- Permissions: Match needs exactly to pass reviews. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)

## Essential Tools & Frameworks
- **webextension-polyfill**: NPM lib for Promise-based APIs across browsers; include in all scripts. [github](https://github.com/mozilla/webextension-polyfill/)
- **Vite + vite-plugin-webext**: Modern bundler/HMR for React/TS/Tailwind; auto-generates builds per browser. [github](https://github.com/oviirup/vite-webext)
- **Parcel + @parcel/config-webextension**: Zero-config bundling; `parcel build manifest.json`. [parceljs](https://parceljs.org/recipes/web-extension/)
- **web-ext**: Mozilla CLI for Firefox dev/reload/signing (`web-ext run`). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- **CRXJS**: Chrome-specific Vite/Rollup plugin for MV3 service workers. [github](https://github.com/oviirup/vite-webext)

## UI & Swipe Libraries
For Tinder-style:
- Swiper.js or Hammer.js (gestures). [github](https://github.com/valnub/tindercardsjs)
- React/Vue/Svelte via Vite for popup (HTML/JS/CSS). [github](https://github.com/oviirup/vite-webext)

## Development Workflow
1. Scaffold: `npm init vite@latest --template vanilla-ts`, add vite-webext. [github](https://github.com/oviirup/vite-webext)
2. Local test: Chrome (chrome://extensions/ load unpacked), Firefox (about:debugging). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
3. Build: One command outputs zip/CRX/XPI. [github](https://github.com/oviirup/vite-webext)
4. Debug: Console in popup/background; Firefox web-ext lint. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)

## Publishing
- Chrome Web Store: $5 fee, review 1-7 days. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- Firefox Add-ons: Free, faster review; auto-publish updates. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- Edge: Reuse Chrome zip. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)

## Pitfalls & Best Practices
- Async: All APIs Promise-based (Chrome 121+ full). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)
- Incompat: Check MDN tables (e.g., devtools lags); avoid browser.tabs.connect for simple tabs. [webdocs](https://webdocs.dev/en-us/docs/mozilla/add-ons/webextensions/chrome_incompatibilities)
- MV3: Service workers (no persistent bg); use alarms/storage. [extensionworkshop](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- Icons: 128x128 PNG per browser. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension)

| Tool | Use Case | Stars/Usage |
|------|----------|-------------|
| webextension-polyfill | API shim  [npmjs](https://www.npmjs.com/package/webextension-polyfill) | 238+ projects |
| vite-webext | React/TS builds  [github](https://github.com/oviirup/vite-webext) | MV3 + HMR |
| web-ext | Firefox dev  [developer.mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension) | Official |

Your full-stack/Django/Next.js skills transfer perfectly—prototype popup in React, deploy in hours. [github](https://github.com/oviirup/vite-webext)
