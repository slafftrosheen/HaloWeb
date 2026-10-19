# Halo website · Quiet Light · screen pack & handoff (v1.0, 19 Oct 2026)

- `site/` — production static site (12 pages + /kit style guide). Preview: run `python3 -m http.server` inside `site/` and open http://localhost:8000.
  Edit `site/src/`, then `python3 site/tools/build_pages.py` (add `--check` for the release gate).
- `renders/` — 156 full-page renders: `<page>_<width>_<theme>.jpg` for 360/390/768/1024/1440/1920 × light/dark, plus `--longcopy`, `--nojs`, `--zoom200` states.
- `docs/` — IMPLEMENTATION.md (handoff), MOTION-STORYBOARD.md (+csv), screenshot-map.csv, gaps-owner-requests.csv, COPY.md (all English copy, keyed), tokens.json.
- `kit/` — design kit spec renders (light/dark, 390/1440).
- `halo-web-quiet-light-screen-pack.pdf` — the visual summary.

Every image on the site is a real Android capture (13 Oct 2026 test build), an official brand file or an authored diagram. Slots marked "Screenshot required" must be filled with current-build captures before release.
