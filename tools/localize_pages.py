#!/usr/bin/env python3
"""Regenerate localized HaloWeb static pages after tools/build_pages.py.

No external packages, services or web access. The English root HTML is
canonical, and copy/lv.json + copy/ru.json are curated phrase catalogs.
The language-independent Android screenshot pixels are never modified.

Usage (authoring only):
  python tools/build_pages.py
  python tools/localize_pages.py

The output is committed to Git; Vercel has no build step.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ('index', 'how-it-works', 'workspace', 'voice', 'kids',
         'your-ai', 'devices', 'privacy', 'status', 'developers',
         'alpha', 'design', 'kit')
BASE = 'https://halo-web-blue.vercel.app'
TEXT = re.compile(r'(?<=>)[^<>]+(?=<)')
ATTR = re.compile(r'\b(alt|aria-label|placeholder|title|content)="([^"]*)"')

def norm(value):
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()

def translate_html(source, language, catalog, name):
    def text_replace(match):
        raw = match.group()
        original = norm(raw)
        localized = catalog.get(original)
        if localized is None:
            return raw
        lead = re.match(r'^\s*', raw).group()
        trail = re.search(r'\s*$', raw).group()
        return lead + html.escape(localized, quote=False) + trail

    def attr_replace(match):
        key, value = match.groups()
        localized = catalog.get(norm(value))
        if localized is None:
            return match.group()
        return key + '="' + html.escape(localized, quote=True) + '"'

    # Script source code must never be translated or changed by text regex.
    scripts = []
    def stash_script(match):
        scripts.append(match.group())
        return '___HALO_SCRIPT_' + str(len(scripts)-1) + '___'

    output = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', stash_script, source, flags=re.I)
    output = TEXT.sub(text_replace, output)
    output = ATTR.sub(attr_replace, output)
    for i, script in enumerate(scripts):
        output = output.replace('___HALO_SCRIPT_' + str(i) + '___', script)
    output = output.replace('<html lang="en">', '<html lang="' + language + '">', 1)

    # An English page's relative assets must be root-relative when copied
    # to /lv/ or /ru/. This also handles SVG use href and srcset values.
    output = re.sub(r'(?<!/)(?<![\w-])(assets/|css/|js/)', r'/\1', output)
    output = re.sub(r'\bhref="([\w-]+\.html)(#[^"]*)?"',
                    lambda m: 'href="/' + language + '/' + m.group(1) + (m.group(2) or '') + '"', output)

    canonical = BASE + '/' + language + '/' + ('' if name == 'index' else name)
    output = re.sub(r'(<link\s+[^>]*rel="canonical"\s+href=")[^"]+',
                    lambda m: m.group(1) + canonical, output)
    # English hreflang stays on the site root; other entries keep their paths.
    # Every source page is also available without JavaScript.
    return output

def main():
    for lang in ('lv', 'ru'):
        strings = json.loads((ROOT / 'copy' / (lang + '.json')).read_text(encoding='utf-8'))
        target = ROOT / lang
        target.mkdir(exist_ok=True)
        for page in PAGES:
            source = (ROOT / (page + '.html')).read_text(encoding='utf-8')
            output = translate_html(source, lang, strings, page)
            (target / (page + '.html')).write_text(output, encoding='utf-8')
        print('Localized', len(PAGES), 'pages for', lang)

if __name__ == '__main__':
    main()
