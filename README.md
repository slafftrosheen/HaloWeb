# HaloWeb

Public landing page for [Halo](https://github.com/slafftrosheen/Halo), the open-source local-first Android assistant and cognitive runtime.

HaloWeb is deliberately static: plain HTML, CSS, JavaScript and checked-in UI assets. No framework, package manager, analytics SDK, remote font or build step is required.

## Product framing

The landing page answers the product questions in human order:

1. What is Halo?
2. What can it actually do on an Android phone?
3. Where does the AI run?
4. What are Notebook and Study for?
5. How do glasses and other devices fit in?
6. Why does Halo have a runtime layer?
7. What is physically verified versus still under acceptance?

The runtime architecture remains important, but it no longer appears before the user can understand the product.

## Current product truth

The page is synchronized against Halo `main` through commit `faca1ae45cb1fc3ac8d8f7dee5836244e6deebc6` and the preceding September 29 provider/action/runtime batches.

Current public claims intentionally reflect:

- Android is the first complete host; wearables are optional extensions.
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

## UI assets

All phone previews are separate static assets under `assets/screens/`; no phone UI is rebuilt in HTML.

Current source-aligned captures:

- `home.svg`
- `notebook.svg`
- `study.svg`
- `intelligence.svg`
- `devices.svg`
- `canvas.svg`

The Halo repository still does not contain a canonical checked-in emulator/device screenshot set. These assets are therefore source-aligned reconstructions, clearly labeled as such on the site. They can be replaced one-for-one with real captures later without changing the layout.

## Structure

```text
HaloWeb/
├── assets/
│   └── screens/
│       ├── home.svg
│       ├── notebook.svg
│       ├── study.svg
│       ├── intelligence.svg
│       ├── devices.svg
│       └── canvas.svg
├── css/
│   ├── tokens.css
│   └── main.css
├── js/
│   └── main.js
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
- `prefers-reduced-motion` collapses motion to static presentation.

## Deployment

Vercel serves the repository root directly as a static site.
