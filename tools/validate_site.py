#!/usr/bin/env python3
"""HaloWeb site validator — Python standard library only.

Run from the repo root before committing:
    python tools/validate_site.py

Checks duplicate IDs, internal anchors, local asset references, mock-screen
consistency (switcher targets, one active bottom-nav tab per screen, tab
matches screen), status vocabulary, forbidden stale text, canonical URL
consistency and OG asset presence. Exits non-zero on any failure.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CANONICAL = "https://haloweb.vercel.app"

errors: list[str] = []
warnings: list[str] = []

APPROVED_STATUSES = {"current", "in development", "planned", "experimental"}
FORBIDDEN_TEXT = [
    r"wake\s*→\s*capture",
    r"#4021",
    r"\b2\.1\s*MB\b",
    r"\b1\.02\s*m\b",
    r"\b09:41:2\d\b",
    r"pill--shipped",
    r"In dev\b",
]


def fail(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def main() -> int:
    html = read("index.html")

    # -- duplicate IDs -------------------------------------------------------
    ids = re.findall(r'id="([^"]+)"', html)
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        fail(f"duplicate HTML ids: {sorted(dupes)}")

    # -- internal anchors resolve -------------------------------------------
    id_set = set(ids)
    for anchor in re.findall(r'href="#([^"]+)"', html):
        if anchor and anchor not in id_set:
            fail(f"internal anchor #{anchor} has no destination")

    # -- referenced local assets exist ---------------------------------------
    refs = re.findall(r'(?:src|href)="([^"]+)"', html)
    for ref in refs:
        if ref.startswith(("http://", "https://", "#", "mailto:")):
            continue
        local = ref.split("?")[0].split("#")[0].lstrip('/')
        if not local:
            continue
        if not (ROOT / local).exists():
            fail(f"referenced asset missing: {ref}")

    # -- mock screens: switcher targets and bottom-nav consistency -----------
    targets = set(re.findall(r'data-screen-target="([^"]+)"', html))
    screens = re.findall(r'data-screen="([^"]+)"', html)
    if targets != set(screens):
        fail(f"host switcher targets {sorted(targets)} != screens {sorted(screens)}")
    for target in targets:
        if f'aria-controls="mock-{target}"' not in html:
            fail(f"switcher button for {target} lacks aria-controls")
        if f'id="mock-{target}"' not in html:
            fail(f"screen mock-{target} has no id")

    # one active nav tab per mock screen, and it must match the screen name
    screen_blocks = re.split(r'(?=<div class="host-screen")', html)
    for block in screen_blocks:
        m = re.search(r'data-screen="([^"]+)"', block)
        if not m:
            continue
        name = m.group(1)
        nav = re.search(r'<div class="mock-bottom-nav">(.*?)</div>', block, re.S)
        if not nav:
            fail(f"mock screen {name} has no bottom nav")
            continue
        active = re.findall(r'mock-tab mock-tab--on">([^<]+)</span>', nav.group(1))
        if len(active) != 1:
            fail(f"mock screen {name}: expected exactly 1 active nav tab, found {active}")
        elif active[0].lower() != name:
            fail(f"mock screen {name}: active nav tab is '{active[0]}' (mismatch)")

    # -- status vocabulary ----------------------------------------------------
    for cls in re.findall(r'class="status(?:-[a-z]+)?\s*status--([a-z-]+)"', html):
        label = cls.replace("--", ":").replace("-", " ")
        # map class to vocabulary
    allowed_classes = {"status--current", "status--development", "status--planned", "status--experimental"}
    for cls in re.findall(r'status--([a-z-]+)', html):
        if f"status--{cls}" not in allowed_classes:
            fail(f"unapproved status class: status--{cls}")

    # -- forbidden stale text --------------------------------------------------
    low = html
    for pattern in FORBIDDEN_TEXT:
        if re.search(pattern, low, re.I):
            fail(f"forbidden text present: /{pattern}/")

    # -- canonical URL consistency --------------------------------------------
    for fname, required in (("robots.txt", f"Sitemap: {CANONICAL}/sitemap.xml"),
                            ("sitemap.xml", f"<loc>{CANONICAL}/</loc>")):
        content = read(fname)
        if required not in content:
            fail(f"{fname} does not match canonical {CANONICAL}")
    if f'href="{CANONICAL}/"' not in html:
        fail("canonical link missing or does not match")
    if f'{CANONICAL}/assets/halo-og.png' not in html:
        fail("og:image does not use the canonical URL")

    # -- OG asset exists and is sane ------------------------------------------
    og = ROOT / "assets" / "halo-og.png"
    if not og.exists():
        fail("assets/halo-og.png missing")
    elif og.stat().st_size > 300_000:
        warn(f"halo-og.png is {og.stat().st_size // 1024} KB — consider optimizing")

    # -- external runtime deps -------------------------------------------------
    if re.search(r'<script[^>]+src="https?://', html):
        fail("external script reference found — HaloWeb must be dependency-free")
    if re.search(r'<link[^>]+rel="stylesheet"[^>]+href="https?://', html):
        fail("external stylesheet reference found")

    # Real device captures replace reconstructed screens throughout the page.
    shots = set(re.findall(r'src="assets/screens/([^"]+)"', html))
    if len(shots) != 12 or any(not shot.endswith('.jpg') for shot in shots):
        fail(f"expected all 12 real JPG captures, found {sorted(shots)}")
    if 'reconstructed from' in html or 'Source-aligned UI capture' in html:
        fail('obsolete reconstruction label')
    for file in ['index.html', 'css/main.css', 'js/main.js', 'CONTENT-SOURCES.md', 'robots.txt', 'sitemap.xml']:
        if re.search(r'^(<<<<<<<|=======|>>>>>>>)', read(file), re.M):
            fail(f'unresolved merge marker in {file}')
    import json
    source = read('js/translations.js')
    catalog = json.loads(source.split('window.HaloTranslations = ', 1)[1].rstrip(';\n'))
    keys = set(re.findall(r'data-i18n(?:-alt|-aria-label)?="([^"]+)"', html))
    for language in ['en', 'lv', 'ru']:
        if not keys.issubset(catalog[language]):
            fail(f'{language}: missing translations {sorted(keys - set(catalog[language]))}')
        if any(not text.strip() for text in catalog[language].values()):
            fail(f'{language}: empty translation')

    # -- translation consistency and interpolation contracts ----------------------
    source_en = json.loads(read('tools/english-catalog.json'))
    rows = [line.split('\t') for line in read('tools/translations.tsv').splitlines()]
    if len(rows) != len(source_en):
        fail(f'translation row count {len(rows)} != English source {len(source_en)}')
    for row in rows:
        if len(row) != 3:
            fail(f'malformed translated row: {row[:1]}')
            continue
        key, lv, ru = row
        if source_en.get(key) != catalog['en'].get(key):
            fail(f'English source mismatch: {key}')
        if catalog['lv'].get(key) != lv or catalog['ru'].get(key) != ru:
            fail(f'localized catalog mismatch: {key}')
    expected_keys = set(catalog['en'])
    for language in ['lv','ru']:
        if set(catalog[language]) != expected_keys:
            fail(f'{language}: dictionary key mismatch with English')
    token = re.compile(r'\{[A-Za-z_][A-Za-z_0-9]*\}')
    for key, value in catalog['en'].items():
        source_tokens = set(token.findall(value))
        for language in ['lv', 'ru']:
            translated = catalog[language].get(key, '')
            if set(token.findall(translated)) != source_tokens:
                fail(f'{language}: interpolation placeholders changed: {key}')

    # -- report ----------------------------------------------------------------
    for w in warnings:
        print(f"warn: {w}")
    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
        return 1
    print(f"OK — all checks passed ({len(warnings)} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
