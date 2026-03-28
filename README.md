<p align="center">
  <img src="docs/logo.png" alt="Decluttr" width="200" />
</p>

<p align="center">
  <strong>Tinder-style tab management. Swipe left to close, right to keep.</strong><br/>
  Clean up 50 tabs in 60 seconds.
</p>

<p align="center">
  <a href="https://getdecluttr.app">Website</a> &middot;
  <a href="PRIVACY.md">Privacy</a> &middot;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/version-0.1.0-green.svg" alt="Version 0.1.0" />
  <img src="https://img.shields.io/badge/chrome-MV3-yellow.svg" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/firefox-MV2-orange.svg" alt="Firefox MV2" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

---

## What is Decluttr?

Decluttr is a free, open-source browser extension that helps you clean up your tabs with a fun, Tinder-style swipe interface. It pulls tabs from all your open windows into a card deck — swipe left to close, swipe right to keep. No more tab hoarding.

Built for knowledge workers who chronically accumulate 30-100+ tabs across projects, research, and rabbit holes.

## Features

- **Swipe to decide** — Intuitive card UI powered by touch, mouse, or keyboard (`←`/`→`, `J`/`K`)
- **All windows, one deck** — Pulls tabs from every open browser window
- **Smart duplicates** — Detects and groups duplicate tabs so you can close extras in one swipe
- **Stale tabs first** — Sorts by least recently used so the tabs you forgot about surface first
- **Undo** — Made a mistake? Hit `U` or `Ctrl+Z` to undo the last swipe
- **Immediate closing** — Tabs close the moment you swipe left. No waiting.
- **Summary stats** — See how many tabs you closed, kept, and how long it took
- **Rescue list** — Review all tabs marked for closing before confirming, rescue any with one click
- **Settings** — Sort order, excluded domains, and more
- **Cross-browser** — Chrome (MV3) and Firefox (MV2) from a single codebase

## Install

### From the stores (coming soon)

<!-- TODO: Replace with actual store URLs once approved -->

| Chrome Web Store | Firefox Add-ons |
|---|---|
| Coming soon | Coming soon |

### From source

```bash
# Clone the repo
git clone https://github.com/CytSoftware/decluttr.git
cd decluttr

# Install dependencies
pnpm install

# Build for Chrome
pnpm --filter @decluttr/extension build:chrome

# Build for Firefox
pnpm --filter @decluttr/extension build:firefox
```

Then load the extension:

- **Chrome**: Go to `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select `apps/extension/dist/chrome`
- **Firefox**: Go to `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select any file in `apps/extension/dist/firefox`

## Development

```bash
# Install dependencies
pnpm install

# Start extension dev server (Chrome)
pnpm --filter @decluttr/extension dev:chrome

# Start extension dev server (Firefox)
pnpm --filter @decluttr/extension dev:firefox

# Start landing page dev server
pnpm --filter @decluttr/landing dev

# Build everything (extension + landing page)
pnpm build

# Package extension zips for store submission
pnpm --filter @decluttr/extension package:all
```

## Project Structure

```
decluttr/
├── apps/
│   ├── extension/          # Browser extension (Chrome + Firefox)
│   │   ├── src/
│   │   │   ├── background/ # Service worker / background script
│   │   │   ├── newtab/     # Swipe UI (React)
│   │   │   ├── options/    # Settings page (React)
│   │   │   ├── lib/        # Tab fetching, settings, constants
│   │   │   └── styles/     # Global CSS + Tailwind
│   │   └── manifest.json   # Cross-browser manifest template
│   └── landing/            # Marketing website (React + Vite)
├── packages/
│   ├── config/             # Shared Tailwind config + color palette
│   ├── types/              # Shared TypeScript types
│   └── ui/                 # Shared UI components
└── tooling/
    ├── eslint/             # Shared ESLint config
    └── tsconfig/           # Shared TypeScript configs
```

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Swipe Engine | react-tinder-card + @react-spring/web |
| Bundler | Vite + vite-plugin-web-extension |
| Cross-browser | webextension-polyfill |
| Monorepo | Turborepo + pnpm workspaces |

## Contributing

Contributions are welcome! Whether it's a bug fix, feature, or documentation improvement — we'd love your help.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

## Privacy

Decluttr runs entirely in your browser. We never collect, transmit, or store your tab data. No analytics, no tracking, no servers. Your tabs are your business.

The `<all_urls>` permission is required solely to read tab metadata (titles, URLs, favicons) across all your open tabs. The source code is fully auditable. Read the full [Privacy Policy](PRIVACY.md).

## Links

- **Website**: [getdecluttr.app](https://getdecluttr.app)
- **Support**: [support@getdecluttr.app](mailto:support@getdecluttr.app)
- **Issues**: [GitHub Issues](https://github.com/CytSoftware/decluttr/issues)

## License

[MIT](LICENSE) &copy; 2026 [CytSoftware](https://github.com/CytSoftware)
