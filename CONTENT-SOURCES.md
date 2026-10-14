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

### New site metadata · 2026-10-14

The English/Latvian/Russian document descriptions now lead with Android product functionality and model choice rather than future platform promises. The build generator, initial HTML meta, and runtime language bundle are synchronized. Android source head reviewed: `303216f33a7f842faa7d0684ccef52afaeca6d0c`; brand-parity status remains source-integrated but not hardware-signed-off.
