# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Dashboard

```bash
python launch.py
```

Opens `index.html` as a Chrome app (borderless window, always-on-top). No build step, no server, no dependencies — it runs directly from the filesystem as `file:///`.

Optional: `pip install pywin32` for always-on-top support on Windows.

## Architecture

This is a single-page, fully client-side dashboard with no framework, bundler, or backend. All files are loaded via plain `<script src>` tags (not ES modules), so every function and variable declared in any JS file is a global accessible to all others.

### File layout

- **`index.html`** — HTML structure only. No inline CSS or JS.
- **`styles.css`** — All styles.
- **`js/`** — Feature modules, loaded in dependency order at the bottom of `<body>`:

| File | Responsibility |
|------|---------------|
| `utils.js` | `rand`, `randi`, `pick`, `pad2`, `toast()` — used by everything |
| `header.js` | Clock, status bar fluctuation, bank account simulation |
| `crypto-ticker.js` | Scrolling crypto price strip |
| `radar.js` | Canvas radar animation, threat blips, radar log |
| `blackjack.js` | Blackjack game logic and rendering |
| `flight-tracker.js` | Canvas world map, plane movement, flight info cards |
| `marketplace.js` | FB Marketplace conversation feed |
| `reddit.js` | Generated Reddit post feed with voting |
| `funding-modal.js` | Funding request pop-up modal |
| `news-ticker.js` | Bottom scrolling news ticker |
| `app.js` | Cross-module resize handler (`setupRadar` + `drawFlightMap`) |

### Key globals shared across modules

- `rand`, `randi`, `pick`, `pad2`, `toast` — defined in `utils.js`, used everywhere
- `bjWins`, `bjLosses` — blackjack stats referenced by `reddit.js` post templates
- `threatCount` — radar blip counter, mutated by `funding-modal.js` on approval
- `drawFlightMap`, `setupRadar` — called by `app.js` resize handler

### Canvas modules

Both `radar.js` and `flight-tracker.js` use `requestAnimationFrame` loops started at load time. The radar sizes itself to its panel via `setupRadar()`. The flight canvas sizes itself to its parent element on every `drawFlightMap()` call.

### Adding new content

- **New threat labels**: add strings to `THREATS` array in `radar.js`
- **New crypto**: add an entry to `cryptos` array in `crypto-ticker.js`
- **New planes/routes**: add to `PLANES` / `CITIES` in `flight-tracker.js`
- **New FB conversations**: add to `CONVOS` array in `marketplace.js`
- **New Reddit templates**: add arrow functions to `TMPLS` in `reddit.js`
- **New funding requests**: add to `FUNDING_REQUESTS` in `funding-modal.js`
- **New ticker items**: edit the `TICK` template string in `news-ticker.js`

### Script load order matters

`utils.js` must be first (defines globals everything else uses). `app.js` must be last (calls functions from radar and flight-tracker). The order in `index.html` is the correct dependency order — maintain it when adding new modules.
