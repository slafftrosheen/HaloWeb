# HaloWeb

Public landing page for [Halo](https://github.com/slafftrosheen/Halo), the open-source local-first cognitive runtime.

HaloWeb is deliberately static: HTML, CSS, JavaScript and checked-in visual assets. No framework, package manager, analytics SDK, remote font or build step is required.

## Current direction

The site is product-led rather than demo-led.

- typography and real product surfaces carry the page
- every Android preview is a static screenshot asset under `assets/screens/`
- no interactive HTML phone mockups
- no floating capability toys or decorative dashboard cards
- Halo's pastel palette is reserved for semantic Signal Face identity and small state accents
- architecture sections use restrained graphite surfaces and hairline structure
- motion is viewport-triggered and bounded: content reveal, screenshot mask reveal and one runtime-flow assembly

The screenshot assets are reconstructed from current Compose source because the Halo repository does not yet contain a committed set of emulator/device screen captures. Replace these files with native captures when those become available; the web layout intentionally treats them as ordinary image assets so that swap is trivial.

## Product source of truth

Website UI/content is synchronized against the current Halo source, including:

- `HomeScreen.kt`
- `NotebookScreen.kt`
- `CanvasEditorScreen.kt`
- `NoteEditorScreen.kt`
- `DevicesScreen.kt`
- `IntelligenceScreen.kt`
- `AppShell.kt`
- `CURRENT-STATE.md`
- design docs under `docs/03-design/`

Current notable product changes reflected by HaloWeb:

- Halo Signal Face + unified pixel glyph identity
- embedded **LiteRT-LM** is the default clean-install local inference path
- Ollama remains optional LAN inference
- OpenRouter remains optional remote inference
- Notebook now has source-level structured blocks, attachments, collections, favorites and Canvas support
- Android is the first host; capability contracts are intended to remain host/device independent

Source presence is not presented as physical acceptance. Hardware-dependent paths remain qualified where current Halo documentation says they require real-device validation.

## Structure

```text
HaloWeb/
├── assets/
│   └── screens/
│       ├── home.svg
│       ├── notebook.svg
│       ├── intelligence.svg
│       ├── devices.svg
│       └── canvas.svg
├── css/
│   ├── tokens.css
│   └── main.css
├── js/
│   └── main.js
├── favicon.svg
├── index.html
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Motion contract

- no permanent requestAnimationFrame loop
- no pointer-tilt phone gimmicks
- no hidden autoplay scenario carousel
- one-shot scroll reveals only
- one-shot runtime flow assembly
- `prefers-reduced-motion` collapses all motion to static content

## Deployment

The repository is served directly as a static site by Vercel.
