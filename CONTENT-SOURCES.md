# HaloWeb content sources

This ledger exists to stop the landing page from drifting behind Halo.

Positioning review, 2026-10-13: the user explicitly positions Halo as a host and device independent runtime, with no main gadget. Android is described as the first host implementation; broader host support is an architectural direction and remains under development. This framing is applied to hero text, summary, Devices, runtime section and metadata in EN/LV/RU.

Feedback delivery, 2026-10-13: the user selected a prefilled email in the visitor's own mail app, addressed to `slaff.trosheen@gmail.com`. Preparing a draft is not sending it; the site must not claim delivery. Form text is not persisted in browser storage.

Historical website baseline audit: 2026-09-30
Historical source head: `faca1ae45cb1fc3ac8d8f7dee5836244e6deebc6` (not current acceptance)
Latest source review: 2026-10-14; Halo main `303216f33a7f842faa7d0684ccef52afaeca6d0c`

Visual/localization update: 2026-10-13. All displayed app images now use the 12 original Android JPG screenshots supplied by the user. The `08-46-58-829` capture is Settings, not the Intelligence configuration screen. The images retain English text, app state and original proportions; no captures were retouched. Website captions, accessibility labels and controls are localized into EN/LV/RU. Downloadable test-kit files remain English and are labelled accordingly.

The website follows the updated Halo Brand Book palette (Night Ink, Halo Mint and Cream), not the older Android `Color.kt` tokens. Brand alignment does not prove that the current APK implements the same UI.

## Claim priority

When sources disagree:

1. **Current code** decides what UI/contracts exist.
2. **CURRENT-STATE.md and acceptance docs** decide whether something is verified, source-complete, compiled, unit-tested or physically accepted.
3. **Design/product docs** decide intended framing when code and acceptance do not contradict it.
4. The website uses the most conservative truthful maturity wording.

A UI control present in source may be shown visually even when its end-to-end behavior is still labeled active development.

## Primary files

### Product shell and UI

- `app/src/main/java/com/halo/app/ui/shell/AppShell.kt`
- `app/src/main/java/com/halo/app/ui/screens/home/HomeScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/notebook/NotebookScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/notebook/CanvasEditorScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/notebook/NoteEditorScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/study/StudyScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/devices/DevicesScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/settings/IntelligenceScreen.kt`
- `app/src/main/java/com/halo/app/ui/screens/settings/ProviderMatrixScreen.kt`

### Providers

- `app/src/main/java/com/halo/app/ui/screens/settings/ProviderIds.kt`
- `sdk/provider-sdk/src/main/java/com/halo/sdk/provider/RemoteProviderPresence.kt`
- `app/src/main/java/com/halo/app/di/AndroidProviderFactory.kt`
- LiteRT provider/model catalog under `providers/litert/`

### Tools and agentic execution

- `app/src/main/java/com/halo/app/di/tools/HaloToolDescriptors.kt`
- `app/src/main/java/com/halo/app/di/tools/host/`
- `app/src/main/assets/skills/*.json`
- runtime cognition tool/agent/recovery packages

### Workspace and Study

- `app/src/main/java/com/halo/app/data/notebook/`
- `app/src/main/java/com/halo/app/study/`
- `app/src/main/java/com/halo/app/data/study/`
- `docs/rfc/0002-notebook-editor-and-study.md`

### Acceptance and project truth

- `CURRENT-STATE.md`
- `docs/testing/AGENTIC-PHONE-ACCEPTANCE.md`
- `docs/testing/PHONE-ACCEPTANCE.md`
- `docs/testing/7-day-hardware-test.md`
- `docs/13-engineering/`

## Claims that must stay qualified

- Do not call the current branch “production ready”.
- Do not claim all LiteRT models are physically verified.
- Do not claim HeyCyan speaker output is accepted until a current post-fix hardware run proves it.
- Do not claim remote provider free tiers are permanent quotas.
- Do not imply Google OAuth lets Halo consume a consumer Gemini subscription without the required Google project/API setup.
- Do not imply OpenAI/Anthropic/OpenRouter consumer subscriptions automatically become API access.
- Do not imply a dispatched Android intent is proof the external action completed.
- Do not describe BuddyBot as Halo's primary product.

## 2026-10-14 — updated content review

Read the supplied 31-page Halo Brand Book and Halo in-app graphics v0.3 ZIP. Compared public claims with Halo's CURRENT-STATE.md, AppShell.kt, LOCAL-MODELS.md, FIRST-RUN-SETUP.md and CANVAS-DAILY-FLOW.md. The five Android bottom destinations are Home, Activity, Notebook, Devices and Settings; Study is a separate route. This copy pass gives the visitor a concrete Android-first explanation before the campaign line, distinguishes future hosts from current support, qualifies third-party phone actions and avoids treating UI plans as hardware acceptance. English, Latvian and Russian copy are updated together.

### In-app visual previews — evidence boundary

The new gallery demonstrates four open-ring states based on the supplied v0.3 graphics bundle. It is labelled design-only and does not claim runtime integration. The book's four-screen onboarding concept (PDF p.31) is a design direction; the Android FIRST-RUN-SETUP document describes the implemented nine-step guided setup. The website does not present the mockups as released app behavior.

## 2026-10-14 — brand-book redesign

The owner supplied the full 38-page `BrandBook.pdf` and the complete `BrandAssets/` graphics kit and asked for the site to be rebuilt around them. The design half of that work is recorded in `BRAND-IMPLEMENTATION.md`; this ledger records what the new artwork may and may not claim.

- **State artwork is design specification, not runtime evidence.** Every ring shown in the presence studio and the open-ring chapter is the kit's own file. Copy states that the animation set comes from the Halo graphics kit and not from a running Android session, and that the studio is not a verified app feature. Selecting a state is a preview of the kit, not a report from a device.
- **Still versus animated is stated, not implied.** Fifteen states have supplied animations and are shown moving; planning, acting_phone, preparing_context, recovering, model_loading and permission_missing have none, so they are shown as stills and the page says six are stills. No state is animated that the kit did not animate.
- **State names reuse the kit's own strings.** The 21 state names and explanations come from `BrandAssets/copy/halo_strings_en.json` (the app's standard register) and were translated into Latvian and Russian alongside the rest of the page. The kids register was not used on the public site.
- **Third-party code.** The only vendored dependency is the MIT-licensed lottie-web light build in `js/vendor/`, with its license text committed next to it. No font, script or animation is fetched from a CDN at runtime.
- **Unchanged product claims.** The redesign changed narrative order and visuals, not maturity wording: the Android/alpha, provider, phone-action, HeyCyan, BuddyBot and acceptance qualifications below still apply, and the previously validated carousel, workspace, checklist, feedback form and no-JavaScript behaviour are intact.

### New site metadata · 2026-10-14

The English/Latvian/Russian document descriptions now lead with Android product functionality and model choice rather than future platform promises. The build generator, initial HTML meta, and runtime language bundle are synchronized. Android source head reviewed: `303216f33a7f842faa7d0684ccef52afaeca6d0c`; brand-parity status remains source-integrated but not hardware-signed-off.

## 2026-10-14 — current Android source refresh and product-first editorial pass

Reviewed Halo main `d1a713d4926dd4b83c7bbe9db408511cb5adcf8d` and the recent `be11bd25` brand/feature commit, with AppShell, KidsModeScreen, HaloSetupScreen, PresenceArtwork, and CURRENT-STATE (still topped by Oct 11 records). Explicit source integration is not device acceptance. Updated Android-first copy, LiteRT model discovery and roles, voice model separation, Notebook/Canvas media, source-linked Study, guided setup, experimental Kids Mode, screenshot age, and cautious claims in EN/LV/RU. Moved three lengthy identity/design sections after alpha testing so product information appears first; removed conflicting section numbers from identity labels. The three new quick-start cards explain first-run choices, voice/models, and experimental Kids Mode without claiming production safety.

## 2026-10-14 — Brand Book 45-page update and Android devices/settings parity
Reviewed supplied 45-page BrandBook(1).pdf, especially pp.39–45 (tools, actions, Devices, pairing, Settings, voice/privacy). The brand artwork was present in HaloWeb's BrandAssets directory after commit f161829d; it is now shown as **design reference** beside the older Oct 13 **real test-build screenshots**, never conflated with a live APK. Cross-checked Halo Android main at 75d08faf (HALO-BRAND-064) including PhoneCapabilityGroups.kt (seven categories), PairingScreen.kt and IntelligenceScreen.kt. Phone capability reporting is NOT permission grant; the app specifically presents Available/Not reported, not Allowed/Ask first/Blocked. Pairing is scan/select/connect and still needs permission and deliberate capture controls. EN/LV/RU are maintained together. The website does not assert untested runtime visual parity.

### Language tooling regression (2026-10-14)

The generator previously indexed main-page `en` when updating no-JavaScript fallbacks, including keys supplied by `annotation_copy.json` and `workspace_copy.json`, and incorrectly looked for metadata keys in the main catalog. It now reads the fully merged `catalog['en']`, validates EN/LV/RU key parity and interpolation placeholders, and retains metadata from the dedicated extras block. The dependency-free site validator also checks the translation TSV and bundles for source parity and placeholder drift.

### Responsive design-board review — 2026-10-14
The four uploaded BrandAssets devices/settings design images are each 2400×1500 PNG. They remain visual references, not app-build screenshots. The website now exposes the original source file through focusable, localized full-size links. CSS preserves native 8:5 aspect ratios, uses a single column at ≤600px, prevents 320px copy overflow and adds keyboard focus treatment. Main navigation now follows section reading order, with the design-system Presence section after the alpha route. Dynamic Russian feedback/template copy uses the same polite form as the website. This is a static source pass; browser-level visual acceptance remains pending.
