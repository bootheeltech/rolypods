# Converts the brand type (Georgia Bold wordmark, Geist tagline) to SVG path
# outlines so the logo files never depend on installed fonts.
# Needs: pip install fonttools brotli uharfbuzz
# Run:   python brand/src/outline.py   (writes brand/src/outlines.json)
import json, os, io
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
GEORGIA_BOLD = r"C:\Windows\Fonts\georgiab.ttf"
GEIST = os.path.join(HERE, "..", "fonts", "Geist-Variable-latin.woff2")


def load(path, wght=None):
    f = TTFont(path)
    if wght is not None and "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght})
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    data = buf.getvalue()
    return TTFont(io.BytesIO(data)), data


def outline(path, text, wght=None, tracking=0.0):
    """Return path data scaled to a 1000-unit em, baseline at y=0, y down.
    tracking is extra space per glyph in em (e.g. 0.2 = 0.2em)."""
    font, data = load(path, wght)
    upem = font["head"].unitsPerEm
    s = 1000.0 / upem
    face = hb.Face(data)
    hbfont = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": False})
    gs = font.getGlyphSet()
    order = font.getGlyphOrder()
    x = 0.0
    parts = []
    bounds = None
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(gs)
        tpen = TransformPen(pen, (s, 0, 0, -s, x + pos.x_offset * s, -pos.y_offset * s))
        gs[name].draw(tpen)
        bp = BoundsPen(gs)
        gs[name].draw(TransformPen(bp, (s, 0, 0, -s, x + pos.x_offset * s, -pos.y_offset * s)))
        if bp.bounds:
            b = bp.bounds
            bounds = b if bounds is None else (min(bounds[0], b[0]), min(bounds[1], b[1]), max(bounds[2], b[2]), max(bounds[3], b[3]))
        d = pen.getCommands()
        if d:
            parts.append(d)
        x += pos.x_advance * s + tracking * 1000
    if tracking:
        x -= tracking * 1000  # no trailing tracking
    os2 = font["OS/2"]
    return {
        "d": " ".join(parts),
        "bbox": [round(v, 2) for v in bounds],  # minX, minY, maxX, maxY (y down)
        "width": round(x, 2),
        "capHeight": round(getattr(os2, "sCapHeight", 0) * s, 2),
        "xHeight": round(getattr(os2, "sxHeight", 0) * s, 2),
        "ascender": round(font["hhea"].ascent * s, 2),
        "descender": round(font["hhea"].descent * s, 2),
    }


def main():
    out = {
        # wordmark body and the blush period are separate so they can take different colors
        "wordmark": outline(GEORGIA_BOLD, "RolyPods"),
        "wordmarkWithDot": outline(GEORGIA_BOLD, "RolyPods."),
        "dot": outline(GEORGIA_BOLD, "."),
        "R": outline(GEORGIA_BOLD, "R"),
        "RDot": outline(GEORGIA_BOLD, "R."),
        "tagline": outline(GEIST, "ONLY FOR FANS OF ISOPODS.", wght=600, tracking=0.2),
    }
    with open(os.path.join(HERE, "outlines.json"), "w") as fh:
        json.dump(out, fh, indent=1)
    for k, v in out.items():
        print(k, v["width"], v["capHeight"])


if __name__ == "__main__":
    main()
