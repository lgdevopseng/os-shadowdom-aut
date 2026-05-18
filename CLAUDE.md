# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands
- `npm run dev`: Start the development server (Vite).
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build locally.
- `npm run test:e2e`: Run E2E tests (refer to README.md, though may require additional setup if missing from package.json).

## Architecture & Structure
This project is a mock "AUT" (Application Under Test) designed to simulate OutSystems UI patterns, specifically targeting challenges with nested and closed Shadow DOMs.

### High-Level Flow
`Screens` $\rightarrow$ `Components` $\rightarrow$ `Actions` $\rightarrow$ `Aggregates` $\rightarrow$ `Services`

### Key Directories
- `src/app`: Application entry, routing, and shell (`AppShell.js`, `Router.js`).
- `src/runtime`: Core framework logic including the event bus (`bus.js`) and reactive state management (`reactive.js`).
- `src/screens`: Top-level page definitions.
- `src/components`: UI elements. 
    - `base/`: Atomic components (e.g., `OsCard`, `OsModal`) often utilizing Shadow DOM.
    - `widgets/`: Complex composite components.
- `src/actions`: Business logic and event handlers (e.g., `SaveCustomer.js`).
- `src/aggregates`: Data fetching logic that wraps services to provide data to the UI.
- `src/services`: Mock API services for data persistence and retrieval.
- `src/styles`: Global CSS and design tokens.

### Shadow DOM Implementation
- The project intentionally uses both `open` and `closed` ShadowRoots to mimic professional low-code platforms.
- `os-app-shell` and `os-block` typically use `closed` roots to simulate a "hard mode" for automation testing.
- Stable test hooks are provided via `data-test-id` attributes.
