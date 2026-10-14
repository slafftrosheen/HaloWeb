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

