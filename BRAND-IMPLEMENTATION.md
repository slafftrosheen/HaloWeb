# HaloWeb · Halo Brand Book v1.0

Applied to the existing dependency-free Halo website, including EN/LV/RU copy, Android alpha and real phone screenshots.

## Colors and typography

Canonical palette: Halo Mint `#0CF2BA`, Night Ink `#060330`, Deep Mint `#047A5E`, Cream `#FAFAF4`, Slate `#4A4F63`, Sunrise Apricot `#FF9F6B`, ring highlight `#B4E6D6`. All are centralized in `css/tokens.css`.

Self-hosted SIL OFL 1.1 variable TTF fonts (no CDN, no Google requests):
- `assets/fonts/sora-variable.ttf` (display Latin/Latin Extended, 100–800)
- `assets/fonts/atkinson-hyperlegible-next-variable.ttf` (body Latin/Latin Extended, 200–800)
- `assets/fonts/atkinson-hyperlegible-next-italic-variable.ttf` (italic body)
- `assets/fonts/onest-cyrillic-variable.ttf` (Cyrillic-only fallback, 100–900)

Sources: Google Fonts git `google/fonts` OFL directories `sora`, `atkinsonhyperlegiblenext`, `onest`. License notices are preserved as `assets/fonts/OFL-*.txt`. Onest is deliberately restricted to Cyrillic ranges; Sora / Atkinson do not include Cyrillic in the distributed files.

## Source-derived logo

`assets/brand/halo-ring.svg` and `assets/brand/halo-wordmark.svg` were traced from the **raster** artwork on page 6 of the owner's 20-page *Halo Brand Book (2026)*. These are an approximation derived from the provided identity artwork, not an official editable vector master. Rounded open ring, approximate gradients, original custom lower-case glyph silhouettes. The monochrome wordmark uses Night Ink on light and a CSS-filtered light version on dark. Do not transform, close, recolor, or distort the ring.

## Interface and workflow

Night Ink editorial hero, soft mint lighting, cream/ink alternating sections, generous typography and live Android screenshot. The complete tri-language beta/alpha workflow including GitHub releases, tester files, feedback reporting, and live screenshot carousel remains. Small-screen header layout is deliberately allowed three rows to prevent clipped language/theme controls. Reduced-motion respects user preferences.

## Checks

Run `node --test tests/*.test.mjs` and `python tools/validate_site.py` from repo root. Verify browser behavior at 320/360/768/1440 px, EN/LV/RU, light/dark and reduced-motion. Font loading and visual appearance still require a real deployed-browser pass; no claim is made that these have been run remotely.

## Social previews

`assets/halo-og.png` is a lightweight (600 × 315) Night Ink/mint preview with the open ring, original wordmark silhouette, simple campaign copy and the Android alpha label. The image is static PNG (not SVG) for social crawler compatibility and has a versioned URL in both Open Graph and Twitter metadata. Use `assets/brand/halo-ring.svg` as its source mark. The card is intentionally not loaded in the web page content, only by social preview crawlers.


## Brand/content pass · 2026-10-14

The updated 31-page source book includes mission/audience (pp.3–5), logo and usage (pp.6–10), accessible palette and type (pp.11–14), voice and visual language (pp.15–18) and the presence, icons, kids/onboarding design directions (pp.21–31). The supplied asset ZIP v0.3 includes 21 static state pairs, context/condition badges, 85 icon families, Lottie motion, Mini/Floating Halo, widgets and kids mockups. These are **design specifications**, not proof of implementation on a device. The site's product headline now answers what Halo is first; the tagline remains a secondary line. No unverified design concept was presented as shipped.

## Open-ring presence preview · 2026-10-14

The runtime section now displays four static, localized and accessible state illustrations based on the owner's supplied in-app graphics v0.3 SVG set: IDLE, LISTENING, THINKING and APPROVAL_REQUIRED. The shown artwork follows the kit's 240×240 dimensions and mint/apricot semantic vocabulary. It is a **design preview**, not a live Android-state assertion. The full supplied bundle includes 21 states, 15 animated state pairs and additional icons/surfaces, whose existence is not proof of runtime integration. The preview loads no animation library and respects reduced motion.

## Full brand-book redesign · 2026-10-14

The owner supplied the 38-page `BrandBook.pdf` and the complete `BrandAssets/` graphics kit, and asked for the website to be redesigned around both. The site is still plain HTML, CSS and JavaScript with no framework, package manager, build step, remote font or analytics.

**Chapters.** `index.html` now follows the book's narrative instead of listing features. The hero pairs the live open ring with a real Android capture, and three new chapters precede the previously validated sections: `01 · Mission` (on-device first, open source, your data stays yours), `02 · The open ring` (what the gap, the halo of light, the gradient and the rounded ends mean) and `03 · Halo's presence`. The tested product, phone-tools, workspace, AI, devices, status, runtime, alpha and feedback sections are unchanged below them.

**Presence studio (the states, brought to life).** All 21 states from the kit are selectable and each one changes the large ring, its name and its explanation. Fifteen states play their supplied Lottie animation; the six the kit never animated (planning, acting_phone, preparing_context, recovering, model_loading, permission_missing) are shown as stills and are labelled as stills, so nothing pretends to move. The 02 chapter plays a short one-shot sequence (listening → thinking → acting → success) when it scrolls into view, then holds.

**Vendored kit artwork.** `BrandAssets/` stays the pristine source; the site serves copies under `assets/brand/`:

- `orb/svg/halo_orb_<state>.svg` — 21 state stills (kit artwork, `currentColor`, so one file serves both themes);
- `orb/lottie/halo_orb_<state>.json` — the 15 supplied state animations;
- `icons.svg` — one sprite with 133 of the kit's icon families, styled from `currentColor`;
- `halo-ring.svg` and `halo-wordmark.svg`;
- `presence/` — the four static specimens from the previous pass, kept as history and no longer displayed.

The four-state static preview described above is therefore superseded by the 21-state studio.

**Motion renderer.** `js/vendor/lottie_light.min.js` (lottie-web light build) is vendored with its MIT license in `js/vendor/lottie-web-LICENSE.txt`. No CDN is contacted at runtime. Animation only runs while an orb is on screen (`IntersectionObserver` pauses it off screen) and never runs at all under `prefers-reduced-motion`, where the kit still frame is shown instead. State names and explanations are localized in EN/LV/RU, taken from the kit's own state strings in `BrandAssets/copy/halo_strings_en.json`.

**Tokens and type.** `css/tokens.css` carries the book's palette (Halo Mint, Night Ink, Deep Mint, Cream, Slate, Sunrise Apricot, mint tint, dusk, ember), app surfaces and badges, the 72/40/18 type scale and the motion easings; `css/main.css` keeps the book's Cream/Night Ink alternation so dark chapters stay dark in both themes. `css/main.css` is organised as 19 numbered sections that match `index.html`.

**Evidence boundary.** These are the kit's design specifications, rendered as artwork. Neither the studio nor the sequence asserts that a running Android build produces these states; the chapter says so in its own copy, and `CONTENT-SOURCES.md` records the same boundary.

## Cross-repository parity (Android main, 2026-10-14)

Android `Halo/docs/15-brand/ANDROID-BRAND-PARITY.md` reports source-integrated matching tokens, ring/wordmark vector paths and licensed Sora, Atkinson and Onest fonts. It explicitly records **no Gradle/emulator/device pixel-acceptance sign-off**. HaloWeb and the Android app are aligned at the source/token level, not certified as visually identical in a running build. This is separate from the design-specification-only presence preview shown in the site runtime section.
