#!/usr/bin/env python3
"""Generate assets/halo-og.png (1200x630) in Halo's visual language.

Uses the same pastel palette and spatial-cell geometry as the web presence
(see js/presence.js, ported from the app's HaloOrb.kt). Run from repo root:
    python tools/generate_og.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (246, 247, 251)        # LightBackground #F6F7FB
SURFACE = (255, 255, 255)   # LightSurface #FFFFFF
INK = (24, 32, 51)          # LightOnBackground #182033
SLATE = (105, 113, 132)     # LightOnSurfaceVariant #697184
ACTION = (91, 141, 239)     # HaloAction #5B8DEF
OUTLINE = (217, 222, 232)   # LightOutline #D9DEE8
LIGHT_BREAK = (176, 186, 197)

PASTELS = [  # Color.kt workspace object colors
    (166, 235, 216),  # mint
    (185, 217, 255),  # blue
    (213, 200, 255),  # lilac
    (243, 192, 217),  # pink
    (247, 223, 163),  # yellow
    (244, 190, 169),  # coral
]

PEARL_CELLS = [
    (0.24, 0.22, 0.42, 0.40), (0.47, 0.18, 0.65, 0.36),
    (0.68, 0.34, 0.80, 0.48), (0.19, 0.46, 0.37, 0.63),
    (0.42, 0.43, 0.62, 0.61), (0.64, 0.56, 0.78, 0.73),
    (0.35, 0.67, 0.54, 0.81),
]


def font(size, bold=False):
    candidates = (
        ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"]
        if bold
        else ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"]
    )
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_presence(draw, cx, cy, d):
    """The Halo Presence: matte pearl with 7 pastel cells + light-break."""
    r = d * 0.47
    # matte body: concentric rings approximate the radial gradient falloff
    steps = 36
    for i in range(steps, 0, -1):
        t = i / steps
        rr = r * min(1.0, t / 0.85)
        blend = min(1.0, max(0.0, (0.85 - t) / 0.85)) if t < 0.85 else 0.0
        col = tuple(int(BG[k] + (INK[k] - BG[k]) * 0.12 * blend) for k in range(3))
        draw.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=col)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=SURFACE)
    # cells
    for i, (l, t0, rt, b) in enumerate(PEARL_CELLS):
        alpha = 0.45 if i == 4 else 0.8
        col = tuple(int(SURFACE[k] + (PASTELS[i % 6][k] - SURFACE[k]) * alpha) for k in range(3))
        x0, y0 = cx + (l - 0.5) * d, cy + (t0 - 0.5) * d
        x1, y1 = cx + (rt - 0.5) * d, cy + (b - 0.5) * d
        draw.rounded_rectangle([x0, y0, x1, y1], radius=d * 0.045, fill=col)
    # light-break signature on the upper-right edge (light gray, never black)
    lw = max(3, int(d * 0.014))
    draw.line([(cx + d * 0.33, cy - d * 0.34), (cx + d * 0.38, cy - d * 0.28)],
              fill=LIGHT_BREAK, width=lw)


def main():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # pastel washes
    wash = Image.new("RGB", (W, H), BG)
    wdraw = ImageDraw.Draw(wash)
    wdraw.ellipse([-320, -280, 660, 320], fill=(240, 250, 247))
    wdraw.ellipse([660, 340, 1520, 960], fill=(240, 245, 252))
    img = Image.blend(img, wash, 0.5)
    draw = ImageDraw.Draw(img)

    # brand mark + name
    mark = [(6, 5, 8, 8, 0), (12, 3, 7, 7, 1), (16, 9, 6, 6, 2),
            (4, 11, 7, 7, 3), (9, 10, 8, 8, 4), (12, 15, 6, 6, 5)]
    for (x, y, w, h, ci) in mark:
        draw.rounded_rectangle([44 + x * 2.1, 42 + y * 2.1, 44 + (x + w) * 2.1,
                                42 + (y + h) * 2.1], radius=4, fill=PASTELS[ci])
    draw.text((104, 52), "Halo", font=font(30, bold=True), fill=INK)

    # left column: headline (kept clear of the presence at x>=660)
    draw.text((72, 168), "Your assistant", font=font(54, bold=True), fill=INK)
    draw.text((72, 232), "shouldn't live inside", font=font(54, bold=True), fill=INK)
    draw.text((72, 296), "one device.", font=font(54, bold=True), fill=INK)

    draw.text((72, 386), "Halo is a personal cognitive runtime —",
              font=font(21), fill=SLATE)
    draw.text((72, 416), "your phone, local AI, workspace and devices,",
              font=font(21), fill=SLATE)
    draw.text((72, 446), "one open-source assistant.",
              font=font(21), fill=SLATE)

    # value chips: one compact row, sized to their text
    chip_font = font(16, bold=True)
    x = 72
    for label in ["Local-first", "Open source", "No account", "No required cloud"]:
        w = draw.textlength(label, font=chip_font)
        draw.rounded_rectangle([x, 500, x + w + 32, 538], radius=19,
                               fill=SURFACE, outline=OUTLINE, width=1)
        draw.text((x + 16, 509), label, font=chip_font, fill=INK)
        x += w + 48

    # GitHub pill sized to its text
    gh = "github.com/slafftrosheen/Halo"
    gh_font = font(18, bold=True)
    gw = draw.textlength(gh, font=gh_font)
    draw.rounded_rectangle([72, 566, 72 + gw + 52, 610], radius=22, fill=ACTION)
    draw.text((98, 576), gh, font=gh_font, fill=(255, 255, 255))

    # right: presence + capability labels
    cx, cy, d = 905, 320, 360
    draw_presence(draw, cx, cy, d)
    label_font = font(15)
    dot_r = 4
    positions = [
        (cx + 6, cy - d * 0.62, "PHONE"),
        (cx + d * 0.52, cy - d * 0.16, "GLASSES"),
        (cx + d * 0.47, cy + d * 0.38, "EARPHONES"),
        (cx + 10, cy + d * 0.62, "NOTEBOOK"),
        (cx - d * 0.46, cy + d * 0.40, "MODEL"),
        (cx - d * 0.50, cy - d * 0.10, "ROBOT"),
    ]
    for (x, y, label) in positions:
        w = draw.textlength(label, font=label_font)
        draw.ellipse([x - w / 2 - 20, y + 3, x - w / 2 - 20 + 2 * dot_r, y + 3 + 2 * dot_r],
                     fill=ACTION)
        draw.text((x - w / 2, y), label, font=label_font, fill=SLATE)

    out = os.path.join(os.path.dirname(__file__), "..", "assets", "halo-og.png")
    img.save(out, optimize=True)
    print("halo-og.png written (%.1f KB)" % (os.path.getsize(out) / 1024))


if __name__ == "__main__":
    main()
