# Halo web · Quiet Light · implementation handoff

Version 1.0 · 19 Oct 2026 · English only · drop-in for `slafftrosheen/HaloWeb` (static HTML/CSS/JS, Vercel, `cleanUrls: true`).

This pack **is** the implementation: the pages in `site/` are production HTML built from `site/src/`. No framework, no package manager, no runtime network calls. A heavier framework isn't recommended: the site is 12 static pages, and the only shared markup (header, footer, macros) is handled by a 200-line Python build script that runs at authoring time.

## 1. What to copy into the repo

| From `site/` | To HaloWeb | Notes |
|---|---|---|
| `index.html` … `design.html` (12 pages) + `kit.html` | repo root | `kit.html` is the living style guide (noindex). Keep it or delete it before release. |
| `src/pages/*.html`, `src/partials/*.html` | `src/` | Edit pages here, never the built HTML. |
| `tools/build_pages.py` | `tools/` | `python tools/build_pages.py` builds; `--check` is the release gate (fails while any “Screenshot required” slot is left). |
| `css/tokens.css`, `css/site.css`, `css/fonts.css` | `css/` | Replace `main.css`, `halo-fx.css` and the old `tokens.css`. |
| `js/site.js`, `js/alpha.js` | `js/` | Replace `main.js`, `halo-fx.js`, `halo-lottie.js`, `i18n*.js`, `translations.js`. Keep `js/vendor/lottie_light.min.js` + licence. |
| `assets/screens/real/` | same | 11 real captures × (480/720/1080 WebP + 720 JPG). |
| `assets/brand/{orb,kids,fx,lottie}/`, `halo-open-ring.svg` | same | Only the motion files the site uses. |
| `copy/en.json` | `copy/` | 700+ keyed English strings for the translation pass. |
| `01_…`–`05_…` test files, favicon, manifest, meta icons | unchanged | Alpha tester kit — filenames and URLs kept exactly. |

**Delete from the repo:** `assets/photos/` (generated), `assets/video/` (simulated playback), `assets/screens/v2/` (design references; keep a copy outside the site if you want them), `assets/screens/*.svg` (hand-drawn mock screens), `assets/screens/*.jpg` (originals now live as optimised files under `real/`), `assets/illustrations/`, `assets/brand/halo-ring.svg` (off-spec gap at the top — use `halo-open-ring.svg`), legacy `assets/halo-og.png`, root `BrandBook.pdf` (9-page old book), `js/i18n*.js`, `js/translations.js`, `tools/translations.tsv` and other tools for the old single page (keep them on a branch for the LV/RU pass).

**Update tests:** `tests/content.test.mjs` and `brand.test.mjs` assert the old single-page sections and the LV/RU bundles. Replace them with: build passes; `--check` passes for release; every `<img>` has `alt`; no `assets/photos|video|screens/v2` references; the five test files are linked from `alpha.html`.

## 2. Pages & sections

| File | URL | Sections (in order) |
|---|---|---|
| index.html | / | Hero · Ask, act, know · Notes/Canvas/Study · Voice · Kids · Your AI · Devices · Privacy & price · What’s real today · Built in the open |
| how-it-works.html | /how-it-works | Journey (5 steps) · Outcomes · Stop/retry/permissions · Halo in other apps · Notifications |
| workspace.html | /workspace | Notebook · Canvas (Keep/Discard sample) · Memory · Study ladder |
| voice.html | /voice | Voice states · Dictation / read aloud / interrupt · Local voices table · Accessibility |
| kids.html | /kids | In-development notice · What’s different · Homework ladder · Make & read · For grown-ups |
| your-ai.html | /your-ai | Three choices (CSS-only selector) · Jobs table · Advanced notes · Honest limits |
| devices.html | /devices | Android phone · Host diagram (planned) · HaloLinux · Optional hardware |
| privacy.html | /privacy | Three zones · Control · Price · Openness |
| status.html | /status | Three lanes · Why this order · Engineering status links |
| developers.html | /developers | Architecture layers · Repositories · Contribute |
| alpha.html | /alpha | Release card · Four steps · Five files · Checklist · Feedback form · Report + template · Notice |
| design.html | /design | Open ring · 12 presence states · Brand basics |

Old anchors: add redirects in `vercel.json` if you want `/#alpha` traffic preserved — anchors don't reach the server, so instead keep a tiny script on `index.html`: `if (location.hash === '#alpha' || location.hash === '#feedback') location.replace('alpha.html' + location.hash)`.

## 3. Grid, breakpoints, spacing

- Container 1240 px (`--container: 77.5rem`) + fluid gutter 20 → 56 px.
- Designed and checked at **320, 360, 390, 768, 1024, 1440, 1920**. Key switches: 30 rem (480), 40 rem (640), 52 rem (832: two-column → one), 64 rem (1024: inline nav ↔ menu; hero two-column).
- Header switches to the menu automatically whenever the inline nav would not fit (long labels, large text) — `ResizeObserver` in `site.js`; without JS the media query decides.
- 8-pt spacing scale `--s1…--s10`; section rhythm `--section-y` 64 → 128 px.
- Every size is in `rem`, so browser text size changes scale the whole layout; checked at 200 % zoom.

## 4. Components & states

| Component | Class | States |
|---|---|---|
| Button | `.btn--pri`, `.btn--sec`, `.btn--sm`, `.link-btn`, `.link-arrow` | default · hover · focus-visible (3 px ring) · active · disabled; ≥48 px tall |
| Status chip | `.status--available / --dev / --planned / --research / --exp` | shape-coded (solid / half / dashed / dotted / grey), readable without colour |
| Real capture | `{{SHOT:key|note}}` → `figure.shot` | lazy, fixed aspect ratio (no layout shift), caption below, never text on the image |
| Screenshot slot | `{{SLOT:SR-xx|what}}` → `.slot` | design-only; release gate fails if present |
| Open ring | `{{RING:state|class|view}}`, `{{KRING:…}}`, `{{FX:…}}` | still SVG → Lottie on event → still |
| Journey | `[data-journey]` | step pressed / not pressed; play / pause; no-JS list |
| Outcome legend | `.outcome.o-*` | proposed · approved · running · confirmed · failed · not verified |
| Draft sample | `[data-draft]` | draft · saved (after Keep) · discarded; reset |
| Ladder | `[data-ladder]` | reached · current · not yet (dashed) |
| AI selector | `.choices-wrap` + radios | CSS `:has()` — works without JS |
| Privacy zones | `.zone.z-stays / z-choose / z-never` | static |
| Lanes | `.lane` | `.compact-lanes` shows 4 items on Home |
| Forms | `.form`, `.fgrid`, `.checklist` | focus · invalid (native) · disabled until JS |

## 5. Motion contract (see MOTION-STORYBOARD.md for every effect)

One play per event · no permanent loops · `lottie.freeze()` when the tab is hidden · off-screen rings pause · no tilt or parallax · nothing blocks content · `prefers-reduced-motion` keeps the SVG still and never loads Lottie · no-JS shows the final state of every sequence.

## 6. Images & performance

- Captures: `srcset` 480/720/1080 WebP, 720 JPG fallback, `width`/`height` set, `loading="lazy"`; hero slot gets `fetchpriority="high"` when SR-01 lands.
- New capture pipeline: PNG from the phone → `halo-<area>-<state>-<yyyymmdd>` → WebP q82 at 480/720/1080 + JPG q84 at 720 (same script as this pack, `tools/screens.py` recipe in this file’s appendix).
- Fonts: two WOFF2 preloads, `font-display: swap`.
- Budget per page (mobile, first view): HTML+CSS+JS ≤ 90 KB gzip excluding Lottie runtime; Lottie runtime (165 KB, gzip ≈ 45 KB) is `defer`; first capture ≤ 60 KB.
- No third-party requests. Keep the existing security headers in `vercel.json`.

## 7. Accessibility (checked)

axe-core WCAG 2.2 AA: 0 violations on all 12 pages, light and dark, at 390 and 1440 px. Skip link; one `h1` per page; landmarks; visible focus; ≥48 px targets; live regions for steppers and forms; captions and alt text on every capture; text-only fallbacks for diagrams; checked without JS and at 200 %.

## 8. Localisation

All strings carry `data-k` keys (`page.NNN`, `nav.NNN`, `footer.NNN`) and are exported to `copy/en.json`. Components use flexible widths (no fixed-width buttons, wrapping chips, tables that stack on mobile); long-copy renders (+40 % text) are in the pack. When translating, build per-locale folders (`/lv/…`) from the same sources rather than swapping text at runtime.

## Appendix · capture optimisation recipe

```python
from PIL import Image
im = Image.open('in.png').convert('RGB'); W, H = im.size
for w in (480, 720, 1080):
    im.resize((w, round(H*w/W)), Image.LANCZOS).save(f'{stem}-{w}.webp', quality=82, method=6)
im.resize((720, round(H*720/W)), Image.LANCZOS).save(f'{stem}-720.jpg', quality=84, optimize=True, progressive=True)
```
