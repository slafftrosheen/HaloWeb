# HaloWeb

Static landing page for [Halo](https://github.com/slafftrosheen/Halo), the open-source personal cognitive runtime.

The site intentionally stays dependency-free: plain HTML, CSS and JavaScript, deployed directly on Vercel with no build step.

## Current visual direction

HaloWeb follows the current Halo app identity introduced by RUNTIME/UI-024:

- **Halo Signal Face** — semantic outer state halo + graphite OLED-style inner display
- **HaloGlyph** — shared 16×16 pixel pictograms across navigation, devices and runtime surfaces
- airy light workspace / charcoal dark companion themes
- pastel color is semantic/accent color, not generic card decoration
- bounded motion only: state transitions, interaction pulses and scroll entrances; no permanent web animation loop

The previous spatial-cell / pearl-orb web identity is intentionally retired.

## Page flow

1. **Hero** — "One runtime. Every surface." Interactive Signal Face and capability satellites.
2. **Product** — faithful Android-host reconstruction (Home / Notebook / Devices) plus semantic interaction routes.
3. **Runtime** — capability-driven runtime board showing stable runtime contracts around replaceable surfaces.
4. **Notebook** — persistent workspace and visible context maturity, with current/in-development/planned boundaries.
5. **Local-first** — native llama.cpp default path, optional network providers and interaction-origin routing.
6. **Direction** — Now / Next / Later plus the experimental embodiment track.
7. **CTA** — GitHub and project docs.

## Product-truth rules

Halo changes quickly, so public claims are deliberately conservative.

- UI depiction follows current source (HomeScreen.kt, NotebookScreen.kt, DevicesScreen.kt, AppShell.kt).
- Maturity claims follow current-state / delivery documentation.
- When code exists but full acceptance is incomplete, HaloWeb says **In development**.
- No fabricated latency, benchmark, battery, receipt or success telemetry is shown.
- HeyCyan is a reference hardware track, not the definition of Halo.
- BuddyBot/robot embodiment is explicitly experimental.
- Native llama.cpp is the clean-install/default inference path; Ollama and OpenRouter are optional configured providers.
- No Halo account or Halo-operated cloud is required for the core local path.

## Structure

```text
HaloWeb/
├── index.html
├── favicon.svg
├── vercel.json
├── css/
│   ├── tokens.css
│   └── main.css
└── js/
    ├── presence.js      # Signal Face + 16×16 HaloGlyph renderer
    ├── interactions.js  # routes, app surfaces, continuity, bounded reveals
    └── main.js          # theme, scroll progress, active nav
```

## Motion contract

The website is deliberately quieter than a demo reel.

- Signal Face state swap: bounded CSS transition
- user-triggered Signal pulse: < 1 second
- route animation: only after explicit scenario selection
- scroll reveal: once per section
- no idle requestAnimationFrame loop
- prefers-reduced-motion collapses motion to static state changes

## Deployment

vercel.json serves the repo root directly.

There are no npm packages, runtime dependencies, analytics packages or external fonts.

To preview locally, serve the repository root with any static HTTP server.
