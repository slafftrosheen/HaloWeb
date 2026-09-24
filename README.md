# HaloWeb — Halo landing page

A static, no-build single-page site introducing [Halo](https://github.com/slafftrosheen/Halo),
a local-first, privacy-first **cognitive layer for wearables** — glasses, headphones, watches,
health rings, companion robots and the motorised Halo Platform (tracked base + pan servo that
carries the docked phone around).

## Deployment (Vercel)

`vercel.json` configures the adapter for a static, zero-build site:

- `framework: null`, `buildCommand: null` — nothing to compile; the repo root is deployed as-is
- `outputDirectory: "."` — index.html, css/, js/ and favicon.svg are served directly
- `cleanUrls` — `/index.html` is canonicalized to `/`
- security headers (nosniff, referrer policy, frame options, permissions policy) and
  1-day revalidation caching for `/css/*` and `/js/*`

Import the repo at vercel.com → New Project → framework preset **Other**; the config is picked
up automatically. Test locally with `npx vercel dev` or any static server.

## Structure

```
HaloWeb/
├── index.html        # the whole page
├── favicon.svg
├── vercel.json       # static deployment adapter config
├── css/
│   ├── tokens.css    # design tokens ported from the app's ui/theme/Color.kt
│   └── main.css      # layout + components
└── js/
    ├── presence.js   # canvas port of the app's HaloOrb/HaloPresence renderer
    └── main.js       # theme toggle (System/Light/Dark) + presence playground
```

No build step, no dependencies. Serve statically (any static host works,
e.g. Vercel or GitHub Pages from this repo's root).

## Design

- Visual authority: the user design mockup and `HALO-WORKSPACE-DESIGN.md` in the main repo —
  soft depth and spatial cells; no rings, gauges or glowing-orb clichés.
- Palette: exact values from `app/src/main/java/com/halo/app/ui/theme/Color.kt`
  (light `#F6F7FB`/`#182033`/…, dark `#17191E`/`#20232A`/…, pastel object colors).
- The hero presence is a canvas re-implementation of `HaloOrb.kt`: same cell geometry,
  state shift targets and 280 ms tween; it stops rendering when settled and respects
  reduced motion.
- Theme toggle mirrors the app's System/Light/Dark appearance preference (System default,
  persisted choice, follows OS changes while unset).

## Honesty rules (deliberate)

- Performance numbers are labeled as targets, not results.
- Notebook features are labeled Shipped vs Planned (only notes exist today).
- Device capabilities are described as in active development, with verified behavior only.
- The demo states in the playground are clearly marked as demo — the real app derives
  them from runtime telemetry.
- The Halo Platform (tracked base) is described as a planned/next item, not a shipped product.
