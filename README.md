# HaloWeb — Quiet Light

Official public-facing static website for Halo, built using the **Quiet Light** design handoff delivered 19 October 2026 and Halo Brand Book 3.0.

The website is a product introduction and accurate alpha programme, not a remote Halo assistant. No Halo backend, account system, telemetry endpoint, build framework or hosted AI model is used by the website.

## Pages

- / — Halo ecosystem and Android-first experience
- /how-it-works — intent, approvals, phone actions, real outcomes
- /workspace — Notebook, Canvas, Memory, Study
- /voice — hands-free input, read-aloud, speech controls
- /kids — voice-first Kids Mode development direction
- /your-ai — local, LAN and optional third-party provider choices
- /devices — Android host, emerging HaloLinux host, experimental hardware
- /privacy — local data, optional remote calls and price direction
- /status — implemented vs in-development vs planned
- /developers — architecture and repositories
- /alpha — verified release link, test kit and private feedback draft
- /design — real brand language and motion presence
- /kit — noindex implementation design system reference

## Edit workflow

Edit `src/pages/*.html` and `src/partials/*.html`. Use `tools/build_pages.py` to regenerate the checked-in HTML and `copy/en.json`. English is the only new design language; translate in a separate coordinated pass.

`css/tokens.css`, `css/site.css`, `css/fonts.css`, `js/site.js`, `js/alpha.js` and the self-hosted Lottie renderer implement the delivered design. Responsive output is pure HTML/CSS/JS with no package manager or client API.

Motion plays on action/visibility, then stops; reduced-motion presents the final SVG. All displayed phone images must be real, labelled captures, not design-reference screens or generated photos.

## Asset and status boundaries

- Actual phone captures: `assets/screens/real/` (13 October 2026 alpha test build; newer build evidence not automatically assumed).
- Current state/reference: `https://github.com/slafftrosheen/Halo` and `https://github.com/slafftrosheen/HaloLinux`.
- The complete Picsart source handoff, 156 reference renders and guidance are retained at `halo-web-quiet-light/`. This folder is excluded from Vercel via `.vercelignore`.
- Missing capture state requirements are listed in `halo-web-quiet-light/docs/screenshot-map.csv`; do not replace them with fabricated user interfaces.
- HaloLinux is an actively developed host. Peer-to-peer sync, Windows host and robotics are not marketed as shipping features.
- The owner has not yet committed a software license to the source repos. Visibility on GitHub alone does not grant a reusable open-source license; site wording therefore points to the available source code, not a granted license.

## Alpha / tester safety

The five test files remain at their original root filenames. Checklist data stays in this browser; feedback prepares a mailto draft to the configured owner address, **not** a confirmed submission. No signup or data upload is operated by HaloWeb.

## Deployment

Vercel serves the repository root with `cleanUrls: true` and no build step. Do not run GitHub Actions or install a CI service. Release review must confirm captures, absence of broken links, reduced-motion, real accessibility and the five alpha file downloads; source presence is not equivalent to device acceptance.
