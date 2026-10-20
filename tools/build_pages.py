#!/usr/bin/env python3
"""halo web · build_pages.py — assembles the static pages. No dependencies beyond Python 3.9+ (bs4 optional, for copy export).

  python tools/build_pages.py            # writes *.html at the repo root + copy/en.json
  python tools/build_pages.py --check    # also fails if a 'Screenshot required' slot is still present (release gate)

Source: src/pages/<name>.html — first line is a JSON comment: <!--{"title":..., "desc":..., "nav":...}-->
Shared parts: src/partials/head.html, header.html, footer.html. Macros (see MACROS below) keep page sources short.
The output is plain HTML that works without JavaScript; commit it (Vercel serves the repo root, cleanUrls on).
"""
import json, re, sys, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
E = html.escape

# Real captures only. key: (file stem, width, height, screen name, alt text)
SHOTS = {
 'home':      ('halo-home-idle-light-20261020', 1080, 2400, 'Home', 'Idle Home with a paused task and waiting state.'),
 'activity':  ('halo-activity-dispatched-unverified-20261020', 1080, 2400, 'Activity', 'Calculator launch dispatched; effect not verified.'),
 'notifs':    ('halo-notifications-empty-20261013', 1080, 2400, 'Notifications', 'Halo Notifications, private, last 24 hours. Nothing waiting here.'),
 'tools':     ('halo-notebook-seasons-collection-20261020', 1080, 2400, 'Notebook', 'Real Seasons collection including notes, files, chat and Canvas.'),
 'skills':    ('halo-skills-20261013', 1080, 2400, 'Skills', 'Halo Skills screen listing on-device models, model roles and phone actions such as alarms and timers.'),
 'canvas':    ('halo-canvas-group-20261013', 1080, 2400, 'Canvas', 'A Halo canvas titled Alpha demo, Light and growth, with five cards, three connections and a selected group.'),
 'study':     ('halo-study-topic-selection-20261020', 1080, 2400, 'Study', 'New lesson topic, no successful AI response yet.'),
 'study_material': ('halo-study-imported-material-20261020', 1080, 2400, 'Study material', 'Readable imported Seasons text in Study.'),
 'roles': ('halo-model-role-assignments-dark-20261020', 1080, 2400, 'Model roles', 'Real model routing assignments.'),
 'devices':   ('halo-devices-this-phone-20261013', 1080, 2400, 'Devices', 'Halo Devices. This phone manages your conversation. No saved devices: Halo works on this phone. An Add device button.'),
 'settings':  ('halo-settings-20261013', 1080, 2400, 'Settings', 'Halo Settings listing Intelligence, Voice, Language, Appearance and Actions and connections.'),
 'access':    ('halo-settings-access-20261013', 1080, 2400, 'Access & data', 'Halo Access and data settings: Permissions, Memory and learning, Storage and backup, Setup readiness and Android assistant.'),
 'memory':    ('halo-memory-suggest-20261013', 1080, 1960, 'Memory', 'Halo memory settings. Halo may suggest useful memories. Nothing is saved automatically. Local reflection is off by default.'),
}
BUILD_NOTE = 'Android test build, 13 Oct 2026'
CAPTURE_DIR = '/assets/screens/captures-2026-10-20/'
NEW_BUILD_NOTE = 'Halo Android 1.0-RC1 original-device capture, 20 Oct 2026'

def icon(name):
    return f'<svg class="ic" aria-hidden="true" focusable="false"><use href="assets/brand/icons.svg#i-{name}"/></svg>'

def shot(key, note='', size='md', sizes='(max-width: 52rem) 72vw, 22rem'):
    stem, w, h, name, alt = SHOTS[key]
    fresh = stem.endswith('20261020')
    cls = 'shot' + (' shot--sm' if size == 'sm' else '')
    if fresh:
        p = CAPTURE_DIR + stem + '.png'
        ids = {'home':'SR-02','activity':'SR-07','tools':'SR-11','study':'SR-16-goal','study_material':'SR-16-material','roles':'SR-21-roles'}
        media = (f'<a class="shot-open" href="{p}" target="_blank" rel="noopener" aria-label="Open full-size screenshot"><picture>'
                 f'<img src="{p}" width="{w}" height="{h}" alt="{E(alt)}" loading="lazy" decoding="async"></picture></a>')
        note_build = NEW_BUILD_NOTE
        capture_attr = f' data-capture-key="{ids[key]}"'
    else:
        p = 'assets/screens/real/' + stem
        media = (f'<picture><source type="image/webp" srcset="{p}-480.webp 480w, {p}-720.webp 720w, {p}-1080.webp 1080w" sizes="{sizes}">'
                 f'<img src="{p}-720.jpg" width="{w}" height="{h}" alt="{E(alt)}" loading="lazy" decoding="async"></picture>')
        note_build = BUILD_NOTE
        capture_attr = ''
    cap = f'<b>Real capture</b> · {E(name)} · {note_build}' + (f'. {note}' if note else '')
    return (f'<figure class="{cls}" style="--ratio:{w}/{h}"{capture_attr}>{media}'
            f'<figcaption class="captag">{icon("verify")}<span>{cap}</span></figcaption></figure>')

def slot(sid, what, ratio='1080/2400'):
    return (f'<figure class="shot" style="--ratio:{ratio}" data-required="{sid}"><div class="slot" role="img" aria-label="Screenshot required: {E(what)}">'
            f'<span class="slot-id">{sid}</span><b>Screenshot required</b><span>{E(what)}</span></div>'
            f'<figcaption class="captag">{icon("info")}<span><b>Screenshot required</b> · from the current Android build</span></figcaption></figure>')

def ring(state, cls='', mode='', extra=''):
    still = f'assets/brand/orb/svg/halo_orb_{state}.svg'
    lot = f'assets/brand/orb/lottie/halo_orb_{state}.json'
    has_lottie = (ROOT / lot).exists()
    attrs = f' data-lottie="{lot}"' if has_lottie else ''
    if mode: attrs += f' data-play="{mode}"'
    return f'<span class="ring {cls}"{attrs}{extra} aria-hidden="true"><img src="{still}" alt="" width="240" height="240" loading="lazy" decoding="async"></span>'

def kring(state, cls='', mode=''):
    base = f'assets/brand/kids/svg/halo_kids_orb_{state}'
    lot = f'assets/brand/kids/lottie/halo_kids_orb_{state}_{{theme}}.json'
    m = f' data-play="{mode}"' if mode else ''
    return (f'<span class="ring {cls}" data-themed data-lottie="{lot}"{m} aria-hidden="true">'
            f'<img src="{base}_light.svg" data-src-light="{base}_light.svg" data-src-dark="{base}_dark.svg" alt="" width="240" height="240" loading="lazy"></span>')

def fx(name, still, cls='', mode=''):
    m = f' data-play="{mode}"' if mode else ''
    s = f'assets/brand/fx/svg/{still}'
    return (f'<span class="ring {cls}" data-themed data-lottie="assets/brand/fx/lottie/halo_fx_{name}_{{theme}}.json"{m} aria-hidden="true">'
            f'<img src="{s}_light.svg" data-src-light="{s}_light.svg" data-src-dark="{s}_dark.svg" alt="" width="240" height="240" loading="lazy"></span>')

STATUS_TXT = {'available': 'Available in the alpha', 'dev': 'In development', 'planned': 'Planned', 'research': 'Research', 'exp': 'Experimental'}
def status(kind, text=''):
    return f'<span class="status status--{kind}">{E(text or STATUS_TXT[kind])}</span>'

MACROS = [
 (r'\{\{I:([\w]+)\}\}', lambda m: icon(m.group(1))),
 (r'\{\{SHOT:([\w]+)(?:\|([^|}]*))?(?:\|(sm))?\}\}', lambda m: shot(m.group(1), m.group(2) or '', m.group(3) or 'md')),
 (r'\{\{SLOT:([\w-]+)\|([^}]*)\}\}', lambda m: slot(m.group(1), m.group(2))),
 (r'\{\{RING:([\w]+)(?:\|([^|}]*))?(?:\|([\w]*))?\}\}', lambda m: ring(m.group(1), m.group(2) or '', m.group(3) or '')),
 (r'\{\{KRING:([\w]+)(?:\|([^|}]*))?(?:\|([\w]*))?\}\}', lambda m: kring(m.group(1), m.group(2) or '', m.group(3) or '')),
 (r'\{\{FX:([\w]+)\|([\w]+)(?:\|([^|}]*))?(?:\|([\w]*))?\}\}', lambda m: fx(m.group(1), m.group(2), m.group(3) or '', m.group(4) or '')),
 (r'\{\{STATUS:([\w]+)(?:\|([^}]*))?\}\}', lambda m: status(m.group(1), m.group(2) or '')),
]
def expand(s):
    for pat, fn in MACROS:
        s = re.sub(pat, fn, s)
    return s

NAV = [('how-it-works', 'product'), ('workspace', 'product'), ('voice', 'product'), ('kids', 'product'),
       ('your-ai', 'your-ai'), ('devices', 'devices'), ('privacy', 'privacy'), ('status', 'status'), ('developers', 'developers'), ('alpha', 'alpha')]

def build(check=False):
    head = (SRC / 'partials/head.html').read_text()
    header = (SRC / 'partials/header.html').read_text()
    footer = (SRC / 'partials/footer.html').read_text()
    copy, missing = {}, []
    for f in sorted((SRC / 'pages').glob('*.html')):
        raw = f.read_text()
        meta = json.loads(re.match(r'<!--(.*?)-->', raw, re.S).group(1))
        body = raw[raw.index('-->') + 3:]
        name = f.stem
        hd = head.replace('{{TITLE}}', E(meta['title'])).replace('{{DESC}}', E(meta['desc'])).replace('{{PATH}}', '' if name == 'index' else name)
        if name == 'kit': hd = hd.replace('<meta name="color-scheme"', '<meta name="robots" content="noindex">\n<meta name="color-scheme"')
        hd = hd.replace('{{EXTRA_JS}}', '<script src="js/alpha.js" defer></script>' if name == 'alpha' else '')
        hr = header
        for page, group in NAV:
            cur = ' aria-current="page"' if page == name else ''
            hr = hr.replace(f'href="{page}.html"', f'href="{page}.html"{cur}')
        if meta.get('nav') == 'product':
            hr = hr.replace('<details class="nav-product">', '<details class="nav-product" data-current>')
        out = '<!doctype html>\n<html lang="en">\n' + hd + '<body>\n' + expand(hr) + '<main id="main">\n' + expand(body) + '</main>\n' + expand(footer) + '</body>\n</html>\n'
        if name != 'kit': missing += [(name, s) for s in re.findall(r'data-required="([\w-]+)"', out)]
        out, page_copy = key_copy(out, name)
        copy.update(page_copy)
        (ROOT / f'{name}.html').write_text(out)
    (ROOT / 'copy').mkdir(exist_ok=True)
    (ROOT / 'copy/en.json').write_text(json.dumps(copy, ensure_ascii=False, indent=1))
    print(f'built {len(list((SRC / "pages").glob("*.html")))} pages · {len(copy)} copy keys · {len(missing)} screenshot slots open')
    if check and missing:
        print('RELEASE GATE: screenshot slots still open:', ', '.join(f'{p}:{s}' for p, s in missing)); sys.exit(1)

TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'dt', 'dd', 'th', 'td', 'figcaption', 'summary', 'legend', 'label', 'button', 'option', 'a', 'b', 'small', 'span', 'strong']
def key_copy(doc, page):
    """Give every leaf text element a stable translation key (data-k="page.N") and export the English strings."""
    try:
        from bs4 import BeautifulSoup, NavigableString
    except ImportError:
        return doc, {}
    soup = BeautifulSoup(doc, 'html.parser')
    copy = {}
    for region, prefix in ((soup.find('header'), 'nav'), (soup.find('main'), page), (soup.find('footer', class_='site-footer'), 'footer')):
        if region is None: continue
        n = 0
        for el in region.find_all(TEXT_TAGS):
            direct = ''.join(t for t in el.contents if isinstance(t, NavigableString)).strip()
            if not direct or el.find_parent(attrs={'data-k': True}):
                continue
            if el.name == 'span' and 'vh' not in (el.get('class') or []) and el.find_parent(['h1','h2','h3','p','li','b','a','button','label']):
                continue
            n += 1
            k = f'{prefix}.{n:03d}'
            el['data-k'] = k
            copy[k] = el.decode_contents().strip()
    return str(soup), copy

if __name__ == '__main__':
    build('--check' in sys.argv)
