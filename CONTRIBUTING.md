# Contributing to Decluttr

Thanks for your interest in contributing! Decluttr is open source and we welcome contributions of all kinds — bug fixes, new features, documentation, and ideas.

## Quick Start

### Reporting Bugs

1. Check [existing issues](https://github.com/CytSoftware/decluttr/issues) to avoid duplicates
2. Open a [bug report](https://github.com/CytSoftware/decluttr/issues/new?template=bug_report.md)
3. Include: browser + version, extension version, steps to reproduce, expected vs actual behavior
4. Screenshots or screen recordings are very helpful

### Requesting Features

1. Open a [feature request](https://github.com/CytSoftware/decluttr/issues/new?template=feature_request.md)
2. Describe the problem you're trying to solve, not just the solution
3. We'll discuss the approach before implementation begins

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+

### Getting started

```bash
# Fork and clone the repo
git clone https://github.com/<your-username>/decluttr.git
cd decluttr

# Install dependencies
pnpm install

# Start Chrome extension dev server
pnpm --filter @decluttr/extension dev:chrome

# Start Firefox extension dev server
pnpm --filter @decluttr/extension dev:firefox

# Start landing page dev server
pnpm --filter @decluttr/landing dev

# Build everything
pnpm build
```

### Loading the extension locally

- **Chrome**: `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select `apps/extension/dist/chrome`
- **Firefox**: `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select any file in `apps/extension/dist/firefox`

## Making Changes

### Branch naming

```
feat/short-description    # New features
fix/short-description     # Bug fixes
docs/short-description    # Documentation
refactor/short-description # Refactoring
```

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add tab grouping by domain
fix: handle tabs closed externally during session
docs: update README installation instructions
refactor: extract swipe logic into custom hook
```

### Code style

- **TypeScript** — strict mode, no `any` unless absolutely necessary
- **React** — functional components + hooks only
- **Tailwind CSS** — utility-first, use the shared color palette from `packages/config`
- **Formatting** — consistent with the existing codebase

### Pull request process

1. **Fork** the repo and create your branch from `main`
2. **Make your changes** — keep PRs focused on a single concern
3. **Test manually** — load the extension in Chrome and/or Firefox and verify your changes work
4. **Commit** with a conventional commit message
5. **Push** to your fork and open a PR against `main`
6. **Fill out the PR template** — describe what changed and why
7. A maintainer will review your PR, provide feedback, and merge when ready

### What makes a good PR?

- Solves one problem
- Includes a clear description of what and why
- Has been tested in at least one browser (ideally both Chrome and Firefox)
- Follows existing patterns in the codebase
- Screenshots/recordings for any UI changes

## Project Structure

```
apps/extension/     # The browser extension
apps/landing/       # Marketing website
packages/config/    # Shared Tailwind config
packages/types/     # Shared TypeScript types
packages/ui/        # Shared React components
tooling/            # ESLint + TypeScript configs
```

## Questions?

Open an issue or start a discussion. We're happy to help you get started.
