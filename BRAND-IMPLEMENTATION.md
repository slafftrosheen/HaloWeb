# HaloWeb · Halo Brand Book v1.0 implementation

Applied to the existing static website, including EN/LV/RU copy, Android alpha and real device screenshots.

**Canonical tokens:** Halo Mint `#0CF2BA`, Night Ink `#060330`, Deep Mint `#047A5E`, Cream `#FAFAF4`, Slate `#4A4F63`, Sunrise Apricot `#FF9F6B`, ring highlight `#B4E6D6` in `css/tokens.css`.

**Typography:** Sora display and Atkinson Hyperlegible Next body are declared, with local fallbacks. Webfont binaries are **not yet bundled**; the site retains its dependency-free, privacy-first no-font-CDN policy. Exact font rendering on machines without those faces requires later self-hosted WOFF2 files with appropriate licenses.

**Logo:** `assets/brand/halo-ring.svg` and `favicon.svg` implement the open rounded ring (mint to mint-cloud). SVG is a geometric reconstruction; replace with official master logo vector and wordmark once exported separately from the supplied brand book. Do not close, stretch, rotate or recolor the mark.

**Visual language:** Cream and Night Ink foundations, large type, real Android screenshots, gentle mint radial light. No robotic eye, circuit-grid motif, hologram or purple-blue sci-fi palette. Home hero is always Night Ink in both themes; the rest retains theme switching.

**Content:** Brand headline and privacy promise are localized through `tools/english-catalog.json`, `tools/translations.tsv` and generated `js/translations.js`. The product paragraph stays explicit about current Android alpha limitations and optional glasses. Functional tester checklists, file downloads and reporting remain present.

**Verification:** `node --test tests/*.test.mjs`, `python tools/validate_site.py`. Inspect 360/768/1440px, both themes, three languages and reduced motion.
