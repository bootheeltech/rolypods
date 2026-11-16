// Builds brand/logo/** and brand/favicon/** (SVG masters + PNG exports).
// Run from the repo root: node brand/src/build-logos.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { isopod, iconSvg } from "./mark.mjs";
import { C } from "./colors.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BRAND = path.resolve(HERE, "..");
const O = JSON.parse(fs.readFileSync(path.join(HERE, "outlines.json"), "utf8"));

const fmt = (n) => +n.toFixed(2);

export const VARIANTS = {
  light: { ink: C.bark, dot: C.blush, tag: C.moss, bug: C.bark, label: "for cream or white backgrounds" },
  dark: { ink: C.cream, dot: C.blush, tag: C.creamDark, bug: C.cream, label: "for bark, moss or photo backgrounds" },
  "mono-bark": { ink: C.bark, dot: C.bark, tag: C.bark, bug: C.bark, label: "one color, bark" },
  "mono-black": { ink: "#000000", dot: "#000000", tag: "#000000", bug: "#000000", label: "one color, black (stamps, laser printers)" },
  "mono-white": { ink: "#ffffff", dot: "#ffffff", tag: "#ffffff", bug: "#ffffff", label: "one color, white (reversed out)" },
};

// --- wordmark pieces, in a coordinate space where the wordmark is 100 units tall per em
const F = 0.1; // 1000-unit em -> 100
const wm = O.wordmark, dot = O.dot, tg = O.tagline;
const wmLeft = wm.bbox[0] * F;
const wmRight = (wm.width + dot.bbox[2]) * F;
const wmTop = wm.bbox[1] * F;
const wmBottom = wm.bbox[3] * F;
const wmVisW = wmRight - wmLeft;

/** returns {g, x0, y0, x1, y1} for the wordmark (+ optional tagline) */
export function wordmarkGroup(v, { tagline = false } = {}) {
  let g = `<path fill="${v.ink}" transform="scale(${F})" d="${wm.d}"/>`;
  g += `<path fill="${v.dot}" transform="translate(${fmt(wm.width * F)} 0) scale(${F})" d="${dot.d}"/>`;
  let y1 = wmBottom;
  if (tagline) {
    const tagVisW = (tg.bbox[2] - tg.bbox[0]);
    const ts = wmVisW / tagVisW; // tagline spans the wordmark width
    const capH = tg.capHeight * ts;
    const baseline = wmBottom + 14 + capH;
    g += `<path fill="${v.tag}" transform="translate(${fmt(wmLeft - tg.bbox[0] * ts)} ${fmt(baseline)}) scale(${fmt(ts * 10000) / 10000})" d="${tg.d}"/>`;
    y1 = baseline + tg.bbox[3] * ts;
  }
  return { g, x0: wmLeft, y0: wmTop, x1: wmRight, y1 };
}

function svgDoc(inner, x0, y0, w, h, pad) {
  const vb = [x0 - pad, y0 - pad, w + pad * 2, h + pad * 2].map(fmt);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" width="${vb[2] * 4}" height="${vb[3] * 4}">${inner}</svg>\n`;
}

export function wordmarkSvg(v, opts = {}) {
  const { g, x0, y0, x1, y1 } = wordmarkGroup(v, opts);
  return svgDoc(g, x0, y0, x1 - x0, y1 - y0, 8);
}

/** mark + wordmark side by side */
export function horizontalSvg(v, { tagline = false } = {}) {
  const w = wordmarkGroup(v, { tagline });
  const h = w.y1 - w.y0;
  const bugH = Math.max(h, 110) * 1.08;
  const s = bugH / 456; // bug spans ~y 34..490 in the 512 grid
  const bugW = 300 * s; // bug spans ~x 98..398
  const bx = w.x0 - bugW - 22;
  const by = w.y0 + h / 2 - (262 * s);
  const bug = `<g transform="translate(${fmt(bx - 98 * s)} ${fmt(by)}) scale(${fmt(s * 1e4) / 1e4})">${isopod({ body: v.bug, spots: "knockout", dot: null })}</g>`;
  const top = Math.min(w.y0, by + 34 * s);
  const bottom = Math.max(w.y1, by + 490 * s);
  return svgDoc(bug + w.g, bx, top, w.x1 - bx, bottom - top, 8);
}

export function markSvg(v) {
  return iconSvg({ bg: null, body: v.bug, spots: "knockout", dot: v === VARIANTS.light || v === VARIANTS.dark ? C.blush : v.dot });
}

export const BADGES = {
  "badge-bark": { bg: C.bark, body: C.cream, spots: C.barkDark, dot: C.blush },
  "badge-cream": { bg: C.cream, body: C.bark, spots: "knockout", dot: C.blush },
  "badge-moss": { bg: C.moss, body: C.cream, spots: C.mossDark, dot: C.blush },
  "badge-blush": { bg: C.blush, body: C.cream, spots: C.blushDark, dot: C.bark },
};

async function writePng(svg, file, width, height) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(width, height ?? null, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
}

function icoFromPngs(pngs) {
  // ICO with embedded PNG images (supported by every current browser and Windows)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

async function main() {
  const out = (...p) => {
    const f = path.join(BRAND, ...p);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    return f;
  };
  const jobs = [];
  for (const [name, v] of Object.entries(VARIANTS)) {
    const files = {
      [`rolypods-wordmark-${name}`]: [wordmarkSvg(v), 2000],
      [`rolypods-lockup-${name}`]: [wordmarkSvg(v, { tagline: true }), 2000],
      [`rolypods-horizontal-${name}`]: [horizontalSvg(v), 2400],
      [`rolypods-mark-${name}`]: [markSvg(v), 1024],
    };
    for (const [base, [svg, w]] of Object.entries(files)) {
      fs.writeFileSync(out("logo", "svg", `${base}.svg`), svg);
      jobs.push(writePng(svg, out("logo", "png", `${base}.png`), w));
    }
  }
  for (const [name, b] of Object.entries(BADGES)) {
    for (const shape of ["circle", "rounded"]) {
      const svg = iconSvg({ ...b, shape });
      const base = `rolypods-${name}-${shape}`;
      fs.writeFileSync(out("logo", "svg", `${base}.svg`), svg);
      jobs.push(writePng(svg, out("logo", "png", `${base}.png`), 1024));
    }
  }

  // favicons: bark badge, rounded square for the svg/ico, full-bleed square for Apple
  const fav = iconSvg({ ...BADGES["badge-bark"], shape: "rounded", pad: 0.06 });
  const favSquare = iconSvg({ ...BADGES["badge-bark"], shape: "square", pad: 0.1 });
  const maskable = iconSvg({ ...BADGES["badge-bark"], shape: "square", pad: 0.2 });
  fs.writeFileSync(out("favicon", "favicon.svg"), fav);
  jobs.push(writePng(favSquare, out("favicon", "apple-touch-icon.png"), 180));
  jobs.push(writePng(fav, out("favicon", "icon-192.png"), 192));
  jobs.push(writePng(fav, out("favicon", "icon-512.png"), 512));
  jobs.push(writePng(maskable, out("favicon", "icon-maskable-512.png"), 512));
  const icoPngs = [];
  for (const size of [16, 32, 48]) {
    const buf = await sharp(Buffer.from(fav), { density: 300 }).resize(size, size).png().toBuffer();
    icoPngs.push({ size, buf });
    fs.writeFileSync(out("favicon", `favicon-${size}.png`), buf);
  }
  fs.writeFileSync(out("favicon", "favicon.ico"), icoFromPngs(icoPngs));
  await Promise.all(jobs);
  console.log("logos + favicons written");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
