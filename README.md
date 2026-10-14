# HaloWeb

Public landing page for [Halo](https://github.com/slafftrosheen/Halo), an open-source cognitive runtime independent of particular hosts and devices. Android is the first host implementation; no gadget is positioned as the primary device.

HaloWeb is deliberately static: plain HTML, CSS, JavaScript and checked-in UI assets. No framework, package manager, analytics SDK, remote font or build step is required.

## Responsive public-alpha UX polish — 2026-10-13

- Navigation is available on tablet and mobile, with horizontally scrollable section links and **For testers** kept first on narrow screens. There is no JavaScript-only menu; keyboard navigation works even if scripts fail.
- The sticky header is measured with `ResizeObserver`, so section, download and feedback anchors land below it after resizing or switching languages.
- Hero, carousel and Workspace previews preserve the original screenshots' aspect ratios and cap their rendered heights; no screenshot pixels are cropped, reconstructed or relabeled.
- Copy, label sizes, touch targets and feedback/download cards are sized for narrow screens and longer Latvian/Russian text. All three theme modes remain available on mobile.
- Site content stays visible if the interactive script fails; translation catalog and existing alpha kit files remain unchanged.
- `tools/check_browser.cjs` now covers **36 viewport/language/theme combinations** (320, 390, 768, 1024, 1280, 1440 pixels × EN/LV/RU × light/dark) plus navigation visibility, rendered screenshot scale and sticky-header anchor placement. Browser and deploy checks should be run on the release checkout; this documentation records the assertions, not a fresh physical browser test result.

## Brand-book redesign — 2026-10-14

The page was rebuilt around the owner's 38-page *Halo Brand Book* and the supplied `BrandAssets/` graphics kit, keeping the static, dependency-free stack.

- **Three new chapters before the product story:** `01 · Mission`, `02 · The open ring` and `03 · Halo's presence`. They explain why the ring is open, what the ring means, and what Halo is doing — before any feature list.
- **Presence studio:** all 21 kit states are selectable. Each one swaps the large open ring, its localized name and its explanation. Fifteen states play their supplied Lottie animation; the six the kit never animated are shown as stills and labelled as such, so no state fakes motion. The open-ring chapter plays one short sequence (listening → thinking → acting → success) when it scrolls into view, then holds.
- **Vendored artwork:** the site serves the kit from `assets/brand/` — 21 state stills, 15 state animations, a 133-symbol icon sprite, the ring and wordmark. `js/vendor/lottie_light.min.js` (MIT, license included) renders the animations; nothing is fetched from a CDN at runtime.
- **Honest motion:** animations run only while on screen and never under `prefers-reduced-motion`, where the kit still frame is used instead.
- Design documentation and the evidence boundary are recorded in `BRAND-IMPLEMENTATION.md` and `CONTENT-SOURCES.md`.

## Content and visitor journey

The website is for someone who has not heard of Halo before. Lead with what
the Android app does, not with the name of its runtime architecture.

1. **Understand the product:** open-source AI assistant for Android; no glasses required.
2. **See real screens:** Home, Notebook, Canvas, Study and Devices.
3. **Try useful actions:** ask by voice or text and run supported phone tools.
4. **Work with own content:** keep notes and files, then use them in Study.
5. **Choose the model:** device, local network or optional cloud connection.
6. **Add hardware when useful:** wearables are optional, with varying acceptance.
7. **Assess maturity:** distinguish code, unit tests and physical verification.
8. **Try the alpha:** GitHub Releases, the downloadable test kit, and feedback.

Architecture belongs after the product story, in the developers' section.
Do not imply an APK is published until it appears on GitHub Releases.

**Single source of copy:** edit `tools/english-catalog.json` for English
`tNNN` strings and `tools/translations.tsv` for Latvian/Russian counterparts.
Use `tools/workspace_copy.json` for workspace-interaction text,
`tools/annotation_copy.json` for feedback/carousel text, and
`tools/build_translations.py` for metadata and runtime strings. Run
`python tools/build_translations.py` to regenerate `js/translations.js`
and English no-JS HTML fallbacks. Avoid adding copy overrides in the builder.

## Current product truth

The page is synchronized against Halo `main` through commit `faca1ae45cb1fc3ac8d8f7dee5836244e6deebc6` and the preceding September 29 provider/action/runtime batches.

Current public claims intentionally reflect:

- Android is the first host implementation. The architecture is host and device independent; other host implementations remain in development.
- LiteRT-LM is the on-device provider and Qwen 3 0.6B Dynamic INT4 is the deterministic first-run local target.
- Ollama is optional LAN inference.
- Gemini supports Google OAuth in current source, with API-key fallback.
- OpenRouter, OpenAI and Anthropic are configurable remote providers.
- Groq and Cerebras are declared free-tier remote providers.
- xAI, OpenCode Zen, OpenCode Companion and custom OpenAI-compatible endpoints are present in the remote provider fabric.
- Provider connection/setup is separate from active provider/model selection.
- Provider credentials use Android Keystore-backed secret storage.
- Host tools cover phone controls, apps, alarms/timers, communication/navigation, screen observation/control, clipboard, web reading, device insight, files, Notebook, memory and Study.
- Tool discovery is bounded; a model does not receive the complete host tool registry by default.
- Deterministic phone actions and agentic tool execution remain explicit execution routes.
- Tool/action outcomes distinguish success, rejection, failure, external dispatch and unknown completion.
- Notebook contains structured documents, attachments, collections, favorites, conversations, Canvas and explicit working context.
- Study binds to workspace sources, persists attempts before AI feedback and tracks review/mastery evidence.
- HeyCyan is a reference wearable integration, not the product architecture.
- BuddyBot is an experimental embodiment.

## Acceptance wording

Code presence is not presented as release readiness.

The page keeps these boundaries visible:

- local Qwen text inference has physical-phone evidence;
- HeyCyan microphone capture has physical evidence from the supplied hardware run;
- the RUNTIME-050 agentic phone batch has compile/unit evidence;
- newer provider, assistant-role, resource, continuation and hardware-output work still needs the planned physical/HIL acceptance.

`CURRENT-STATE.md` remains authoritative when source presence and acceptance status differ.

## Translation regressions

`node --test tests/i18n.test.mjs` validates the active keyed catalog, accessibility and dynamic strings, metadata, and script load order. It also preserves the upstream legacy-runtime switching regression. The older `js/i18n*.js` files remain in history and this checkout for those regression checks; they are not loaded by the page. Current maintenance is documented under Languages and palette below.

## UI assets

All displayed phone previews are original Android screenshots supplied on 13 October 2026 under `assets/screens/`. No screenshot text or application state has been edited.

Current real phone captures:

- `home.jpg`, `activity.jpg`, `notifications.jpg`
- `notebook.jpg`, `workspace-tools.jpg`, `skills.jpg`, `canvas.jpg`
- `study.jpg`, `devices.jpg`, `settings.jpg`, `access.jpg`, `memory.jpg`

Older SVG reconstructions remain historical assets and are not displayed. Settings shows entry points to Intelligence and Voice, not the provider configuration screen. Screenshots show visible UI and do not establish successful completion of actions.

## Languages and palette

English, Latvian and Russian cover the page, image descriptions, accessibility labels, metadata, checklist progress, clipboard feedback and issue template. Switching language preserves theme and checklist state. `?lang=en`, `?lang=lv` and `?lang=ru` override the saved language. Otherwise the browser language is used, with English as fallback. Screenshots and downloadable test materials retain their original English text, as explained on the page.

Edit `tools/english-catalog.json` and `tools/translations.tsv`, then run `python tools/build_translations.py`. Final English editorial overrides are in that script. `js/translations.js` is generated locally, without a translation service.

Reviewed host/device positioning and feedback/carousel strings are in `tools/annotation_copy.json`; this file overrides the older catalog during generation. All displayed languages are kept in sync.

The product section contains a single manual carousel for all 12 captures, with screen selectors, arrows, native touch scrolling, keyboard arrows/Home/End and full-resolution links. It does not advance automatically.

The Workspace section explains a Save → Connect → Learn flow through three selectable steps, paired with one screenshot and explanation at a time. Its vertical tabs support arrows/Home/End, preserve selection during language changes, and stack above the preview on mobile. A separate context/memory strip explains user control. Without JavaScript, the three previews remain readable as static content. Copy is maintained in `tools/workspace_copy.json`.

## Feedback form

The first-run checklist leads to a localized feedback form for configuration details, feedback category, screen, observations, expected behaviour, reproduction steps and clarity rating. Only the screen and observations are required. Preparing feedback includes the steps marked as tried. Form answers are held in the current page only, not stored or transmitted by the site.

At the user's request, delivery uses a `mailto:` draft addressed to `slaff.trosheen@gmail.com`. The visitor reviews and sends it in their own mail app. The UI reports draft preparation, never successful delivery. A preview and copy option handle visitors without a configured mail app. Screenshots can be attached manually in the mail app. No mail backend, API key or paid service is required.

The palette follows the *Halo Brand Book* (Halo Mint `#0CF2BA` on Night Ink `#060330` with Cream `#FAFAF4`, Deep Mint for mint text on light, Sunrise Apricot for “Halo needs you”, Ember for errors only), not the older Android `Color.kt` values. All colour, type and motion tokens live in `css/tokens.css`.

## Validation

`python -X utf8 tools/validate_site.py` checks page structure, links, assets, merge markers and language coverage. `node --test tests/*.mjs` runs the content, brand and i18n contracts, including the new presence contracts (21 states present with artwork and copy, exactly 15 animated, the six still-only states not claiming motion, the vendored renderer licensed and loaded before the site script, every icon the page references defined in the sprite, and every class the page uses styled).

Serve the site at `127.0.0.1:8765`, then run `node tools/check_browser.cjs` with Playwright available through `NODE_PATH` and Edge installed. Browser checks cover six viewport widths, three languages, both themes, image proportions, the presence studio (state selection, localized captions, animation versus still-only states, theme switching) and the orb motion contract (hero ring animating, reduced motion leaving no renderer and no live animation), plus checklist persistence, clipboard feedback, carousel and workspace keyboard navigation, and no-JavaScript/blocked-storage fallbacks. Review screenshots are saved outside the repository in `../.codex/haloweb-review-20261013/`.

## Structure

```text
HaloWeb/
├── assets/
│   ├── brand/
│   │   ├── icons.svg            (133 kit icon families, one sprite)
│   │   ├── halo-ring.svg
│   │   ├── halo-wordmark.svg
│   │   └── orb/
│   │       ├── svg/             (21 state stills, currentColor)
│   │       └── lottie/          (15 state animations)
│   └── screens/                 (12 real phone screenshots)
├── css/
│   ├── tokens.css
│   ├── fonts.css
│   └── main.css
├── js/
│   ├── vendor/
│   │   ├── lottie_light.min.js
│   │   └── lottie-web-LICENSE.txt
│   ├── main.js
│   └── translations.js
├── tests/                       (content, brand and i18n contracts)
├── tools/                       (copy catalogs, validator, browser check)
├── BRAND-IMPLEMENTATION.md
├── CONTENT-SOURCES.md
├── README.md
├── favicon.svg
├── index.html
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Motion contract

- no permanent animation loop;
- no interactive fake phone;
- no pointer tilt;
- no autoplay demo carousel;
- one-shot content and asset reveals;
- one-shot runtime-flow assembly;
- the presence studio animates only the state a visitor picks, and only while it is on screen;
- the open-ring chapter plays its state sequence once per visit, then holds;
- states the kit never animated stay still and say so;
- `prefers-reduced-motion` collapses motion to static presentation, including the ring artwork, which falls back to the kit still frame.

## Alpha tester programme

The website's [Early Access](https://haloweb.vercel.app/#alpha) section provides a lightweight test route rather than claiming there is already a public Android build. The release button goes to the canonical [Halo Android Releases](https://github.com/slafftrosheen/Halo/releases); no APK is bundled by HaloWeb.

The five example assets are committed **at the repository root** and served by Vercel as static files:

| File | Used for |
| --- | --- |
| `03_halo_alpha_quick_test.pdf` | One-page app-wide checklist |
| `02_study_how_light_affects_plants.pdf` | Study text and citation checks |
| `01_study_basil_observation.png` | Vision and multimodal comparison |
| `04_sample_note.txt` | Notebook / Canvas creation and retrieval |
| `05_copy_paste_prompts.txt` | Reusable questions, expected answers and issue format |

The site uses same-origin download links with HTML's `download` attribute; **do not move or rename these files without updating `index.html`**. The actual image is also used as a preview. Do not duplicate generated PDF contents into the HTML. The files are small, synthetic, and contain no personal information.

Tester checklist state is kept in the visitor's own browser `localStorage` under `halo-web-alpha-steps-v1`. It is a list of steps **tried**, not a grade or telemetry, and works without storage. The issue template uses the browser Clipboard API on user request; copy failures are shown honestly and users can manually select the template.

### Quick regression checks

1. Open `/#alpha` in light and dark themes on narrow and wide screens.
2. Download all five files. Check signatures/types: PNG for the illustration, PDF for the two guides, UTF-8 text for the notes and prompts.
3. Verify that image preview, relative paths and files still work after a static Vercel deployment.
4. Mark several steps, reload, and confirm only browser-local checkmarks persist. Reset the list; verify the count returns to zero.
5. Expand the issue template. Copy it over HTTPS; confirm a failure message appears if clipboard access is rejected.
6. Use keyboard focus and screen reader, then test `prefers-reduced-motion`.
7. Confirm that the release link never silently points to a fictitious APK and issues go to the actual Halo repository.

No API/backend, signup, analytics, or browser-to-Halo data transmission is involved.

## Deployment

Vercel serves the repository root directly as a static site.
