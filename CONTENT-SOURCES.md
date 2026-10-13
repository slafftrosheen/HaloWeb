# HaloWeb content sources

This ledger exists to stop the landing page from drifting behind Halo.

Positioning review, 2026-10-13: the user explicitly positions Halo as a host and device independent runtime, with no main gadget. Android is described as the first host implementation; broader host support is an architectural direction and remains under development. This framing is applied to hero text, summary, Devices, runtime section and metadata in EN/LV/RU.

Feedback delivery, 2026-10-13: the user selected a prefilled email in the visitor's own mail app, addressed to `slaff.trosheen@gmail.com`. Preparing a draft is not sending it; the site must not claim delivery. Form text is not persisted in browser storage.

Last source audit: 2026-09-30
Halo source head used: `faca1ae45cb1fc3ac8d8f7dee5836244e6deebc6`

Visual/localization update: 2026-10-13. All displayed app images now use the 12 original Android JPG screenshots supplied by the user. The `08-46-58-829` capture is Settings, not the Intelligence configuration screen. The images retain English text, app state and original proportions; no captures were retouched. Website captions, accessibility labels and controls are localized into EN/LV/RU. Downloadable test-kit files remain English and are labelled accordingly.

The website palette follows the current `app/src/main/java/com/halo/app/ui/theme/Color.kt`: `HaloPrimary #7DE2B1`, `DarkBackground #131B19`, `DarkSurface #1D2723`, `LightBackground #F7F8F4`. The existing capability/acceptance audit below remains dated; the screenshot update does not re-certify those integrations.

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
