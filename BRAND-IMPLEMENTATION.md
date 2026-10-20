# HaloWeb — Quiet Light design implementation

**Current implementation:** Halo Brand Book 3.0 + Picsart Quiet Light v1.0, received 19 October 2026.

The authoritative design sources are retained at:
- `halo-web-quiet-light/docs/IMPLEMENTATION.md`
- `halo-web-quiet-light/docs/MOTION-STORYBOARD.md`
- `halo-web-quiet-light/docs/tokens.json`
- `halo-web-quiet-light/docs/screenshot-map.csv`
- `halo-web-quiet-light/kit/` and `renders/` (reference images only)

## Production implementation

Pages are served from the root. Editable sources live in `src/pages/` and `src/partials/`; `tools/build_pages.py` regenerates the public HTML. English is the canonical static source. A compact EN/LV/RU selector and curated locale dictionaries in `js/locale-data.js` and `copy/{lv,ru}.json` translate reviewed text without network calls. Untranslated long-form passages intentionally fall back to English; fully localized static pages, QA and editorial review are still pending.

Visual tokens use Night Ink, Halo Mint, Cream and Deep Mint, Sora display type and Atkinson Hyperlegible Next body type. Brand animations are self-hosted, event-driven, stop when hidden, and honor reduced motion. The 13-page family includes a noindex design kit.

## Source evidence

The current website uses genuine, unedited **20 October 2026** Android screenshots from `assets/screens/captures-2026-10-20/`. Source proof and qualification live in the batch `README.md`, `manifest.json` (APK and PNG SHA-256), and `capture-index.csv`. Captures are original-device Android 1.0-RC1 states; they are not renders.

The Home hero switches between original Dark/Blue and Light/Lilac screenshots based on website/OS theme. The Notebook collection, sample saved note, local save approval, Study topic and import, model catalogue and role assignments, and unverified Calculator launch Activity receipt now appear in the appropriate product pages. Each new capture links to the unedited full-resolution PNG, with eager loading only for the hero. Native resolution is 1080 × 2400; no fabricated device pixels or upscaled render exists. Original 13 October captures remain for states not newly captured.

**Limits are intentional:** Home still has Task paused / Waiting for you; Notebook save approval is not phone-action approval; the Study material sheet is not a successful AI lesson; the Activity launch is dispatched but not externally confirmed; a model appearing in the catalogue does not prove its compatibility. Missing P0 states SR-03, SR-04, SR-06 and SR-13 remain labelled illustrations and requests, not screenshots. Android/Linux/Kids acceptance claims remain separate.

Edit the canonical `src/pages/` and rebuild with `tools/build_pages.py` when changing text, translated copy or macro mapping. Compiled EN/LV/RU static pages are also updated with the same capture imagery, without adding any backend or GitHub Actions.

## Evidence and claims

Android: pre-release alpha, not production-stable. Local model support and voices are device/model dependent. Linux: source is actively developed, but deployment/hardware acceptance and private peer sync are not complete. Kids Mode is in development. Windows and private sync are planned. No verified runtime outcome is fabricated.

The existing five tester files, mailto draft feedback, local-only alpha checklist and GitHub Releases route are preserved. Static website has no Halo-hosted inference backend or telemetry. The public repositories currently have no software license file; publicly readable source is not itself an open-source license grant.

## Deployment and maintenance

Vercel serves root HTML without runtime packages or a build command; `.vercelignore` excludes the full design archive and authoring sources. No GitHub Actions/CI workflows are used. Update copy from the source pages; regenerate `copy/en.json` with `tools/build_pages.py` when doing localization or final release gates. The dropped unindexed screenshot slots have been removed from the current English catalog. 
