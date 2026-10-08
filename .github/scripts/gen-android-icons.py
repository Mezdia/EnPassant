#!/usr/bin/env python3
"""Regenerate src-tauri/icons/android/ from the master app icon.

Android masks adaptive icons down to the central 72dp of the 108dp canvas and
only guarantees key art inside a 66dp circle, so the layers are built apart:
the checkerboard becomes a full-bleed background and the pawn is scaled into
the safe zone as the foreground.  Run after changing the master icon:

    python .github/scripts/gen-android-icons.py
"""

from collections import deque

from PIL import Image, ImageChops, ImageDraw, ImageFilter

MASTER = "src-tauri/icons/icon.png"
OUT = "src-tauri/icons/android"

# name -> (legacy launcher px, adaptive canvas px)
DENSITIES = {
    "mdpi": (48, 108),
    "hdpi": (72, 162),
    "xhdpi": (96, 216),
    "xxhdpi": (144, 324),
    "xxxhdpi": (192, 432),
}

# Largest the pawn may grow, as a fraction of the 108dp canvas.  0.66 keeps it
# inside the 66dp safe circle for every launcher mask shape.
SAFE_RATIO = 0.66
BLUE_MIN = 12          # B - max(R,G) at or above this reads as background
GROW_PX = 13           # dilation that also swallows the blue glow around the pawn
RING_INSET = 0.075     # the master art's own border ring, excluded from the board


def _shift(mask, dx, dy):
    # ImageChops.offset wraps, so keep the seam out of the result by clearing
    # the border after every grow/shrink pass.
    return ImageChops.offset(mask, dx, dy)


def grow(mask, px):
    m = mask
    for _ in range(px):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            m = ImageChops.lighter(m, _shift(m, dx, dy))
    return m


def shrink(mask, px):
    m = mask
    for _ in range(px):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            m = ImageChops.darker(m, _shift(m, dx, dy))
    return m


def flood_background(bgish):
    """Mark every background-ish pixel that is reachable from the canvas edge."""
    px = bgish.load()
    w, h = bgish.size
    seen = [bytearray(w) for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if px[x, y] and not seen[y][x]:
                seen[y][x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if px[x, y] and not seen[y][x]:
                seen[y][x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny]:
                seen[ny][nx] = 1
                q.append((nx, ny))
    out = Image.new("L", (w, h), 0)
    op = out.load()
    for y in range(h):
        row = seen[y]
        for x in range(w):
            if not row[x]:
                op[x, y] = 255
    return out


def largest_component(mask):
    """Keep only the biggest blob, dropping stray background speckles."""
    px = mask.load()
    w, h = mask.size
    seen = [bytearray(w) for _ in range(h)]
    best, best_n = None, 0
    for y0 in range(h):
        for x0 in range(w):
            if not px[x0, y0] or seen[y0][x0]:
                continue
            comp = [(x0, y0)]
            seen[y0][x0] = 1
            q = deque(comp)
            while q:
                x, y = q.popleft()
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and not seen[ny][nx]:
                        seen[ny][nx] = 1
                        comp.append((nx, ny))
                        q.append((nx, ny))
            if len(comp) > best_n:
                best, best_n = comp, len(comp)
    out = Image.new("L", (w, h), 0)
    op = out.load()
    for x, y in best or ():
        op[x, y] = 255
    return out, best_n


def pawn_mask(art):
    """Isolate the pawn: it is the one big region the edge flood cannot reach."""
    r, g, b = art.convert("RGB").split()
    blueness = ImageChops.subtract(b, ImageChops.lighter(r, g)).filter(
        ImageFilter.MedianFilter(3)
    )
    bgish = blueness.point(lambda v: 255 if v >= BLUE_MIN else 0)
    enclosed = flood_background(bgish)
    mask, npx = largest_component(enclosed)
    print("pawn area", npx, "px of", art.width * art.height)
    return grow(shrink(mask, 1), GROW_PX)


def background_plate(art, mask):
    """Rebuild the board without the pawn.

    Every masked pixel copies its nearest unmasked neighbour in the same row,
    which preserves the board's vertical split and its top-to-bottom gradient
    instead of inventing a flat fill.
    """
    w, h = art.size
    src = art.load()
    m = mask.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        carry = None
        left = [None] * w
        for x in range(w):
            if not m[x, y]:
                carry = x
            left[x] = carry
        carry = None
        for x in range(w - 1, -1, -1):
            if not m[x, y]:
                carry = x
            if not m[x, y]:
                op[x, y] = src[x, y]
                continue
            r = carry
            l = left[x]
            if l is None and r is None:
                op[x, y] = src[x, y]
            elif l is None:
                op[x, y] = src[r, y]
            elif r is None:
                op[x, y] = src[l, y]
            else:
                op[x, y] = src[l if x - l <= r - x else r, y]
    return out


def place(foreground, canvas, ratio):
    """Centre `foreground` on a transparent canvas, capped at `ratio` of it."""
    side = canvas * ratio
    src = foreground
    if max(src.size) > side:
        s = side / max(src.size)
        src = src.resize(
            (max(1, round(src.width * s)), max(1, round(src.height * s))),
            Image.LANCZOS,
        )
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    out.paste(src, ((canvas - src.width) // 2, (canvas - src.height) // 2), src)
    return out


def adaptive_xml():
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        "  <foreground android:drawable=\"@mipmap/ic_launcher_foreground\"/>\n"
        "  <background android:drawable=\"@mipmap/ic_launcher_background\"/>\n"
        "  <monochrome android:drawable=\"@mipmap/ic_launcher_monochrome\"/>\n"
        "</adaptive-icon>"
    )


def main():
    import os
    import shutil

    art = Image.open(MASTER).convert("RGBA")
    if art.width != art.height:
        raise SystemExit(f"{MASTER} must be square, got {art.size}")

    mask = pawn_mask(art)
    bbox = mask.getbbox()
    print("pawn bbox", bbox, "canvas", art.size)

    pawn = art.crop(bbox)
    pawn.putalpha(mask.crop(bbox))
    silhouette = Image.new("RGBA", pawn.size, (0, 0, 0, 255))
    silhouette.putalpha(mask.crop(bbox))

    # The master art carries its own rounded border ring; the adaptive
    # background must be borderless, so drop everything outside the ring.
    inset = round(art.width * RING_INSET)
    board = background_plate(art, mask).crop(
        (inset, inset, art.width - inset, art.height - inset)
    )

    legacy_base = art
    round_base = art.copy()
    circle = Image.new("L", art.size, 0)
    ImageDraw.Draw(circle).ellipse((0, 0, art.width - 1, art.height - 1), fill=255)
    round_base.putalpha(ImageChops.multiply(art.split()[3], circle))

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    for name, (legacy, canvas) in DENSITIES.items():
        d = os.path.join(OUT, f"mipmap-{name}")
        os.makedirs(d)
        board.resize((canvas, canvas), Image.LANCZOS).save(
            os.path.join(d, "ic_launcher_background.png"), optimize=True
        )
        place(pawn, canvas, SAFE_RATIO).save(
            os.path.join(d, "ic_launcher_foreground.png"), optimize=True
        )
        place(silhouette, canvas, SAFE_RATIO).save(
            os.path.join(d, "ic_launcher_monochrome.png"), optimize=True
        )
        legacy_base.resize((legacy, legacy), Image.LANCZOS).save(
            os.path.join(d, "ic_launcher.png"), optimize=True
        )
        round_base.resize((legacy, legacy), Image.LANCZOS).save(
            os.path.join(d, "ic_launcher_round.png"), optimize=True
        )
        print(f"  {name}: legacy {legacy}px, canvas {canvas}px")

    anydpi = os.path.join(OUT, "mipmap-anydpi-v26")
    os.makedirs(anydpi)
    for f in ("ic_launcher.xml", "ic_launcher_round.xml"):
        with open(os.path.join(anydpi, f), "w", newline="\n") as fh:
            fh.write(adaptive_xml())
    print("wrote", OUT)


if __name__ == "__main__":
    main()
