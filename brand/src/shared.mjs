// Shared bits for HTML-rendered brand pieces.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C } from "./colors.mjs";
import { isopod } from "./mark.mjs";

export const BRAND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = path.resolve(BRAND, "..");

/** relative URL prefix from an output html file to the brand/ root */
export function rel(file) {
  return path.relative(path.dirname(file), BRAND).split(path.sep).join("/") || ".";
}

export function baseCss(root) {
  return `
@font-face { font-family: "Geist"; src: url("${root}/fonts/Geist-Variable-latin.woff2") format("woff2"); font-weight: 100 900; }
:root {
  --bark: ${C.bark}; --bark-dark: ${C.barkDark}; --moss: ${C.moss}; --moss-dark: ${C.mossDark};
  --cream: ${C.cream}; --cream-dark: ${C.creamDark}; --blush: ${C.blush}; --blush-dark: ${C.blushDark}; --ink: ${C.ink};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Geist", "Segoe UI", sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }
.serif { font-family: Georgia, "Times New Roman", serif; font-weight: 700; letter-spacing: -0.01em; }
.caps { text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600; }
.dot { color: var(--blush); }
img { display: block; }
`;
}

export function page({ file, css = "", body, title = "RolyPods" }) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const root = rel(file);
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<style>${baseCss(root)}${css.replaceAll("{{root}}", root)}</style></head>
<body>${body.replaceAll("{{root}}", root)}</body></html>
`;
  fs.writeFileSync(file, html);
  return file;
}

// deterministic random
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Inline SVG layer of scattered little isopods (decorative background texture). */
export function scatterSvg(w, h, { count = 40, seed = 7, min = 40, max = 90, color = C.cream, opacity = 0.07 } = {}) {
  const r = rng(seed);
  const sym = `<symbol id="bug" viewBox="0 0 512 512">${isopod({ body: color, spots: "knockout", dot: null })}</symbol>`;
  let uses = "";
  // jittered grid so they spread evenly without overlapping much
  const cols = Math.ceil(Math.sqrt((count * w) / h));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const size = min + r() * (max - min);
      const x = ((i + 0.15 + r() * 0.7) * w) / cols - size / 2;
      const y = ((j + 0.15 + r() * 0.7) * h) / rows - size / 2;
      const rot = Math.round(r() * 360);
      uses += `<use href="#bug" width="${size.toFixed(1)}" height="${size.toFixed(1)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot} ${(size / 2).toFixed(1)} ${(size / 2).toFixed(1)})"/>`;
    }
  }
  return `<svg class="scatter" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0;opacity:${opacity}"><defs>${sym}</defs>${uses}</svg>`;
}
