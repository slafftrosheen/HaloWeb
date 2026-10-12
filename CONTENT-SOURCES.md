# HaloWeb content sources

Halo moves fast. This ledger keeps HaloWeb from drifting.

## Rule

1. **UI depiction follows current source.** If the current app visibly renders
   something (e.g. the Working Set line in `NotebookScreen.kt`), the reconstructed
   app mockup may render it.
2. **Capability/acceptance claims follow current-state documentation.** Never call
   something shipped merely because some source exists — use `CURRENT-STATE.md`,
   `NOTEBOOK-DELIVERY.md` and maturity labels.
3. When the two conflict, use conservative wording: **In development**.

## Ledger

| Claim / surface on HaloWeb | Halo source of truth |
|---|---|
| Primary navigation (Home/Activity/Notebook/Devices/Settings) | `app/src/main/java/com/halo/app/ui/shell/AppShell.kt` (`bottomNavItems`) |
| Home layout (title, presence + mic, Ready, hint, Context · N, More, composer) | `app/src/main/java/com/halo/app/ui/screens/home/HomeScreen.kt` |
| Notebook layout (header/New, context line, search, NotebookFilter set, rows with Add/Remove context) | `app/src/main/java/com/halo/app/ui/screens/notebook/NotebookScreen.kt` |
| Devices layout (header + Add, Connected/Saved groups, cards with Battery/Seen/Auto) | `app/src/main/java/com/halo/app/ui/screens/devices/DevicesScreen.kt` |
| Default inference (native llama.cpp; Ollama optional LAN; OpenRouter optional remote; assistant = handoff only) | `docs/08-providers/ARCHITECTURE.md`, `docs/08-providers/SETUP.md` |
| Current maturity of everything | `CURRENT-STATE.md` |
| Notebook maturity (NB-01 vs Working Set/memory slices) | `docs/02-product/NOTEBOOK-DELIVERY.md` |
| Working Set UI visible, NB-02 flow in development | `NotebookScreen.kt` (visual) + `NOTEBOOK-DELIVERY.md` (acceptance) |
| Vision/positioning | `PROJECT-DIRECTION.md`, `docs/01-vision/VISION.md`, `docs/01-vision/PRINCIPLES.md` |
| Visual language (palette, presence, no rings/gauges) | `docs/03-design/HALO-WORKSPACE-DESIGN.md`, `app/src/main/java/com/halo/app/ui/theme/Color.kt` |
| Presence geometry/motion | `app/src/main/java/com/halo/app/ui/presence/HaloOrb.kt` |
| Roadmap themes | `docs/14-roadmap/ROADMAP.md`, `docs/14-roadmap/NEXT-PHASE-2027.md` |
| Robot / Halo Platform maturity | Experimental — user direction; no production claims |
| Performance | No numbers advertised until measured and published |

## Status vocabulary

`CURRENT` · `IN DEVELOPMENT` · `PLANNED` · `EXPERIMENTAL` — nothing else for maturity labels.

## Canonical URL

`https://haloweb.vercel.app/` (update `robots.txt`, `sitemap.xml`, canonical and OG
tags together if the domain changes).
