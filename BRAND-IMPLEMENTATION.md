# HaloWeb — Quiet Light design implementation

**Current implementation:** Halo Brand Book 3.0 + Picsart Quiet Light v1.0, received 19 October 2026.

The authoritative design sources are retained at:
- `halo-web-quiet-light/docs/IMPLEMENTATION.md`
- `halo-web-quiet-light/docs/MOTION-STORYBOARD.md`
- `halo-web-quiet-light/docs/tokens.json`
- `halo-web-quiet-light/docs/screenshot-map.csv`
- `halo-web-quiet-light/kit/` and `renders/` (reference images only)

## Production implementation

Pages are served from the root. Editable sources live in `src/pages/` and `src/partials/`; `tools/build_pages.py` regenerates the public HTML. English is the active language. Previous EN/LV/RU runtime translation scripts were retired in this UI migration; add localized page variants from the source templates in a subsequent coordinated pass.

Visual tokens use Night Ink, Halo Mint, Cream and Deep Mint, Sora display type and Atkinson Hyperlegible Next body type. Brand animations are self-hosted, event-driven, stop when hidden, and honor reduced motion. The 13-page family includes a noindex design kit.

## Source evidence

Real screenshots under `assets/screens/real/` are **October 13 Android test-build captures**. The Home hero, Notebook, Canvas and Study sections use the closest honest capture with dated captions; there are no fake app screenshots. An uncaptured state is an `evidence-card` with official brand-state artwork and a statement that it is not a device screenshot. Do **not** replace these with generated phone renders.

There is one intentionally visible `SR-00` placeholder in the unindexed `kit.html`, demonstrating a component state. All 12 public pages have no capture-request placeholders. The pending physical capture inventory is retained in `halo-web-quiet-light/docs/screenshot-map.csv`; adding new real screenshots and revisiting captions remains a release requirement.

## Evidence and claims

Android: pre-release alpha, not production-stable. Local model support and voices are device/model dependent. Linux: source is actively developed, but deployment/hardware acceptance and private peer sync are not complete. Kids Mode is in development. Windows and private sync are planned. No verified runtime outcome is fabricated.

The existing five tester files, mailto draft feedback, local-only alpha checklist and GitHub Releases route are preserved. Static website has no Halo-hosted inference backend or telemetry. The public repositories currently have no software license file; publicly readable source is not itself an open-source license grant.

## Deployment and maintenance

Vercel serves root HTML without runtime packages or a build command; `.vercelignore` excludes the full design archive and authoring sources. No GitHub Actions/CI workflows are used. Update copy from the source pages; regenerate `copy/en.json` with `tools/build_pages.py` when doing localization or final release gates. The dropped unindexed screenshot slots have been removed from the current English catalog. 
