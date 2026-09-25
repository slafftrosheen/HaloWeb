# HaloWeb — Halo landing page

A static, no-build single-page site introducing [Halo](https://github.com/slafftrosheen/Halo),
a **host-native personal cognitive runtime**. Your Android phone is the first complete host;
local AI, a persistent Notebook and capability-driven devices extend it.

The page demonstrates Halo's mental model with product-truthful content: the app surface and
routes come first, architecture diagrams support them, and everything future-facing is
visibly labeled **Planned / In development / Experimental**.

## Deployment (Vercel)

`vercel.json` configures the adapter for a static, zero-build site:

- `framework: null`, `buildCommand: null` — nothing to compile; the repo root is deployed as-is
- `outputDirectory: "."` — index.html, css/, js/ and favicon.svg are served directly
- `cleanUrls` — `/index.html` is canonicalized to `/`
- security headers (nosniff, referrer policy, frame options, permissions policy) and
  1-day revalidation caching for `/css/*` and `/js/*` (HTML references carry cache-busting
  `?v=` params)

Import the repo at vercel.com → New Project → framework preset **Other**. Test locally with
`npx vercel dev` or any static server.

## Structure

```
HaloWeb/
├── index.html          # 7 chapters
├── favicon.svg
├── vercel.json         # static deployment adapter config
├── css/
│   ├── tokens.css      # design tokens from the app's ui/theme/Color.kt + editorial scale
│   └── main.css        # layout, components, SVG diagram styling, responsive rules
└── js/
    ├── presence.js     # canvas port of the app's HaloOrb/HaloPresence (bounded motion)
    ├── interactions.js # route pipelines, notebook demo, continuity routing, reveals
    └── main.js         # System/Light/Dark theme, motion preference, resize handling
```

No build step, no dependencies, no framework.

## Page chapters

1. **Hero** — "Your assistant shouldn't live inside one device." Presence at the center,
   orbiting capability *buttons* that pulse the cluster on hover/focus, runtime state rail
   (Ready → Understanding → Reasoning → Responding) with a semantic trace line.
2. **Halo working + Android host** — phone-first. A reconstructed app surface with a
   Home/Notebook/Devices switcher beside three interaction routes with status chips:
   **Ask on phone (Current)**, **Ask through glasses (In dev)**, **Capture from glasses (In dev)**,
   plus a semantic runtime route trace.
3. **Notebook** — the shipped NB-01 path animates once (Capture → Inbox → Organize); the
   memory/Working Set continuation is shown statically with a **Planned** chip.
4. **One runtime, many capabilities** — layered diagram: runtime core (reasoning, workspace,
   speech) inside, physical endpoints around it, cloud provider drawn as optional and
   user-selected. "Halo cares about capabilities, not logos."
5. **Local by architecture + origin continuity** — device-boundary topology, proof chips
   (no account / no cloud required / no helper apps / perpetual ownership), and an
   interactive origin-routing demo with fallbacks.
6. **Beyond the phone** — wearable layer, experimental tracked platform, cross-host future.
7. **Now / Next / Later** — condensed roadmap; GitHub carries the detail. Plus a short
   "Not a chatbot…" editorial band for pacing.

## Motion contract (matches the app's "no permanent idle animation")

- `setState`: one bounded 280ms transition, then RAF stops.
- `activityBurst`: bounded ≤1.5s envelope, then stops.
- `pulse`: one-shot 600ms lean, then stops.
- After load and entrance effects settle, no render loops run.
- Reduced motion is evaluated live; enabling it mid-session cancels loops, renders the
  settled state once and stops. The mini orb in the app mockup renders a static Ready state.

## Theme contract

Three-state System / Light / Dark like the app's AppearanceMode selector. The header control
cycles System → Light → Dark; System removes the persisted override and follows the OS.
All presence instances re-theme with exactly one redraw.

## Honesty rules (deliberate)

- Traces are **semantic** ("INPUT · phone microphone"), never fabricated telemetry —
  no invented timestamps, sizes, receipts or percentages.
- Scenario and pipeline statuses are labeled Current / In development / Planned / Experimental.
- Notebook shows only shipped NB-01 behavior as current; memory promotion is Planned.
- HeyCyan is a reference implementation, never the definition of Halo hardware.
- The tracked platform is explicitly Experimental and visually minor.
- The app mockups are reconstructions of the real Compose surfaces with staged (not live)
  content, and say so.
- Copy follows the consolidated 2026-09-24 Halo docs (CURRENT-STATE, VISION, PRD, PRINCIPLES,
  provider architecture). Performance numbers are not advertised.
