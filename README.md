# HaloWeb — Halo landing page

A static, no-build single-page site introducing [Halo](https://github.com/slafftrosheen/Halo),
a **host-native personal cognitive runtime** — one persistent intelligence with phones, models,
workspace and devices as interchangeable capabilities around it.

The page is built to *demonstrate Halo's mental model*, not describe it: interactive runtime
scenarios, a capability constellation, a privacy topology diagram, an origin-routing demo and
a scroll-driven Notebook loop — all in the app's visual language.

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
├── index.html          # the whole page (13 sections)
├── favicon.svg
├── vercel.json         # static deployment adapter config
├── css/
│   ├── tokens.css      # design tokens from the app's ui/theme/Color.kt + editorial scale
│   └── main.css        # layout, components, topology/constellation styling
└── js/
    ├── presence.js     # canvas port of the app's HaloOrb/HaloPresence (multi-instance)
    ├── interactions.js # scenario pipelines, notebook loop, continuity routing, reveals
    └── main.js         # theme toggle (System/Light/Dark), motion preference, resize
```

No build step, no dependencies, no framework. Serves statically anywhere.

## Page architecture

1. **Hero** (~92vh) — "Your intelligence shouldn't live inside one device." Presence floats at
   ~500px as the spatial center; capability labels (PHONE, GLASSES, EARPHONES…) orbit it and
   gently lean the cluster on hover. Runtime rail: Listening → Understanding → Reasoning →
   Responding, each with a one-line runtime trace.
2. **What Halo is** — one editorial statement + a simple input→runtime→output diagram.
3. **See it working** — three clickable scenarios (glasses, capture, robot) animated through
   the real pipeline stages with a runtime-terminal trace.
4. **The Android host** — floating phone mockups showing Home/Notebook/Devices surfaces,
   including a live mini presence orb.
5. **Notebook** — scroll-triggered loop: capture → inbox → summary → explicit memory.
6. **Devices** — capability constellation (SVG): devices connect to the capabilities they
   provide. "Halo cares about capabilities, not logos."
7. **Local by architecture** — privacy topology (SVG): everything inside the device box;
   cloud model access drawn as optional and user-chosen.
8. **Continuity** — interactive origin-routing demo with capability toggles and fallbacks.
9. **Beyond the screen** — quiet rover schematic, "Experimental embodiment."
10. **What Halo is not** — big editorial break.
11. **Now / Next / Later** — condensed roadmap; details live on GitHub.
12. **CTA** — GitHub links.

## Design

- Visual authority: the user design mockup and `HALO-WORKSPACE-DESIGN.md` in the main repo —
  soft depth and spatial cells; no rings, gauges or glowing-orb clichés.
- Palette: exact values from `app/src/main/java/com/halo/app/ui/theme/Color.kt`
  (light `#F6F7FB`/`#182033`/…, dark `#17191E`/`#20232A`/…, pastel object colors).
- Motion discipline: presence renders 1:1 with the app (same cell geometry, 280ms tween);
  render loops stop when settled; demo pulses are one-shot 600ms; reduced motion collapses
  everything to instant state changes (CSS media query + JS `data-motion` attribute).
- Theme toggle mirrors the app's System/Light/Dark appearance preference (System default,
  persisted choice, follows OS changes while unset). All presence instances re-theme live.

## Honesty rules (deliberate)

- Every demo trace and pipeline is labeled **illustrative** — the terminal shows the
  architecture, not fabricated benchmarks. No performance numbers are advertised.
- Notebook features shown are the shipped scope (notes/search/lifecycle) plus the planned
  memory promotion, which the demo labels as the mental model, not a shipped flow.
- HeyCyan appears only as a reference implementation, never as the definition of Halo hardware.
- The Halo Platform (tracked base) is explicitly marked experimental and kept visually minor.
- Copy follows the consolidated 2026-09-24 docs (VISION.md, PRD.md, PRINCIPLES.md):
  host-native runtime, standalone phone assistant, capability-driven devices, no mandatory
  account, perpetual ownership, interaction-origin continuity.
