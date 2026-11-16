// Builds the one-page brand guide (PDF + PNG) and brand/README.md (full asset index).
// Run from the repo root after the other builds: node brand/src/build-guide.mjs  (PowerShell; needs Edge)
import fs from "node:fs";
import path from "node:path";
import { C } from "./colors.mjs";
import { BRAND, page } from "./shared.mjs";
import { htmlToPdf, htmlToPng } from "./render.mjs";

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ");
const SWATCHES = [
  ["Bark", C.bark, "Primary. Wordmark, headlines, dark backgrounds."],
  ["Bark Dark", C.barkDark, "Deep shadows, isopod spots."],
  ["Moss", C.moss, "Secondary. Labels, tagline, care content."],
  ["Moss Dark", C.mossDark, "Moss backgrounds, contrast."],
  ["Cream", C.cream, "Main light background. Text on dark."],
  ["Cream Dark", C.creamDark, "Cards, dividers, quiet text on dark."],
  ["Blush", C.blush, "Accent. The period, calls to action, stickers."],
  ["Blush Dark", C.blushDark, "Pressed states, small accent text on cream."],
];

const ASSETS = [
  ["Logos (logo/svg + logo/png)", [
    "rolypods-wordmark-{light, dark, mono-bark, mono-black, mono-white}",
    "rolypods-lockup-{same 5}  (wordmark + tagline)",
    "rolypods-horizontal-{same 5}  (mark + wordmark)",
    "rolypods-mark-{same 5}  (isopod mark, transparent)",
    "rolypods-badge-{bark, cream, moss, blush}-{circle, rounded}",
  ]],
  ["Favicon (favicon/)", [
    "favicon.svg, favicon.ico (16/32/48), favicon-{16, 32, 48}.png",
    "apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-maskable-512.png",
  ]],
  ["Social (social/)", [
    "avatars: rolypods-avatar.svg + -{instagram-1080, facebook-720, tiktok-1080, youtube-800, x-400}.png",
    "banners: rolypods-{x-header-1500x500, facebook-cover-1640x624, youtube-banner-2560x1440}.png",
    "posts: rolypods-post-{new-drop, restock, waitlist, care-tip}-1080x1350.png",
    "posts/templates: {new-drop, restock, waitlist, care-tip}.html (edit text, re-render)",
  ]],
  ["Print (print/)", [
    "business-card: rolypods-business-card.pdf (3.5 x 2 in + 0.125 bleed, front + back), -front.png, -back.png",
    "packing-insert: rolypods-thank-you-insert-4x6.pdf (+ bleed, front + back), -front.png, -back.png",
    "stickers: rolypods-sticker-live-animals-4x2.pdf + .png, -this-side-up-2in-round.pdf + .png",
    "stickers: rolypods-sticker-live-animals-avery-5163-sheet.pdf (10 per letter sheet)",
    "*/proofs: trim and safe-area guide PNGs for every print side",
  ]],
  ["Guide + source", [
    "rolypods-brand-guide.pdf / .png, README.md (full file list)",
    "fonts/Geist-Variable-latin.woff2, src/ (build scripts, outlines.json)",
  ]],
];

const css = `
@page { size: 8.5in 11in; margin: 0; }
html, body { width: 8.5in; height: 11in; background: var(--cream); color: var(--bark); }
.g { position: relative; width: 8.5in; height: 11in; overflow: hidden; font-size: 7pt; line-height: 1.34; }
header { background: var(--bark); color: var(--cream); padding: 0.24in 0.5in 0.2in; display: flex; justify-content: space-between; align-items: flex-end; }
header img { height: 0.5in; }
header .meta { text-align: right; color: var(--cream-dark); font-size: 7.4pt; }
header .meta b { display: block; font-family: Georgia, serif; font-size: 15pt; color: var(--cream); margin-bottom: 2px; }
main { padding: 0.16in 0.5in 0; }
section { margin-bottom: 0.11in; }
h2 { font-family: Georgia, serif; font-weight: 700; font-size: 11.5pt; margin-bottom: 0.05in; }
h2 small { font-family: Geist, sans-serif; font-weight: 600; font-size: 6.4pt; letter-spacing: .2em; text-transform: uppercase; color: var(--moss); margin-left: 8px; }
.logos { display: grid; grid-template-columns: 1.35fr 1.35fr 1fr; gap: 0.1in; }
.tile { border-radius: 8px; height: 0.78in; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(74,54,38,.12); }
.tile img { max-height: 58%; max-width: 78%; }
.tile.badges { gap: 6px; }
.tile.badges img { height: 0.5in; max-height: none; }
.rules { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.18in; margin-top: 0.06in; }
.rules b { color: var(--bark); }
.rules p { color: #5b4636; }
.sw { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.07in; }
.sw div.chip { height: 0.32in; border-radius: 6px; border: 1px solid rgba(74,54,38,.15); margin-bottom: 4px; }
.sw b { display: block; font-size: 7.4pt; }
.sw span { display: block; font-size: 6.6pt; color: #5b4636; }
.sw em { display: block; font-style: normal; font-size: 6.3pt; color: var(--moss); line-height: 1.3; margin-top: 2px; }
.type { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 0.18in; }
.type .spec { font-size: 22pt; line-height: 1; margin-bottom: 4px; }
.type .lbl { font-weight: 600; font-size: 6.4pt; letter-spacing: .2em; text-transform: uppercase; color: var(--moss); margin-bottom: 3px; }
.voice { display: grid; grid-template-columns: 1fr 1fr 1fr 1.2fr; gap: 0.16in; }
.voice h3 { font-family: Georgia, serif; font-size: 9.5pt; margin-bottom: 2px; }
.voice .say { background: var(--cream-dark); border-radius: 8px; padding: 0.08in 0.1in; }
.voice .say li { margin-left: 0.12in; }
.assets { display: grid; grid-template-columns: 1fr 1fr; gap: 0.02in 0.22in; font-size: 6.3pt; line-height: 1.32; }
.assets h3 { font-size: 7pt; font-weight: 700; margin-top: 0.03in; }
.assets ul { list-style: none; color: #5b4636; }
.assets li { font-family: "Geist", monospace; }
footer { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.22in; display: flex; justify-content: space-between; font-size: 6.8pt; color: var(--moss); border-top: 1px solid var(--cream-dark); padding-top: 0.07in; }
`;

const swatchHtml = SWATCHES.map(([n, h, role]) => `<div><div class="chip" style="background:${h}"></div><b>${n}</b><span>${h.toUpperCase()} · RGB ${hexToRgb(h)}</span><em>${role}</em></div>`).join("");
const assetsHtml = ASSETS.map(([h, items]) => `<div><h3>${h}</h3><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("");

const body = `<div class="g">
<header><img src="{{root}}/logo/svg/rolypods-lockup-dark.svg" alt="RolyPods"><div class="meta"><b>Brand guide</b>rolypods.com · v1 · November 2026</div></header>
<main>
<section><h2>Logo <small>use the files, never retype the wordmark</small></h2>
  <div class="logos">
    <div class="tile" style="background:var(--cream)"><img src="{{root}}/logo/svg/rolypods-lockup-light.svg"></div>
    <div class="tile" style="background:var(--bark)"><img src="{{root}}/logo/svg/rolypods-horizontal-dark.svg"></div>
    <div class="tile badges" style="background:#fff"><img src="{{root}}/logo/svg/rolypods-badge-bark-circle.svg"><img src="{{root}}/logo/svg/rolypods-badge-moss-circle.svg"><img src="{{root}}/logo/svg/rolypods-badge-blush-circle.svg"></div>
  </div>
  <div class="rules">
    <p><b>Versions.</b> Light on cream or white. Dark on bark, moss or busy photos. One-color (bark, black, white) for stamps, engraving and single-ink printing. The mark (a top-down Dairy Cow isopod with its own pink period) is for avatars, favicons and tight spaces.</p>
    <p><b>Space and size.</b> Keep clear space equal to the height of the lowercase "o" on every side. Wordmark at least 1 in or 120 px wide; lockup with tagline at least 1.5 in or 180 px. Mark at least 0.3 in or 16 px.</p>
    <p><b>Don't.</b> Stretch, rotate, outline, add shadows or effects, retype it in another font, or change the period to anything but blush (one-color versions excepted). The period is the brand's wink: give it room.</p>
  </div>
</section>
<section><h2>Color <small>bark, moss, cream, with a blush wink</small></h2><div class="sw">${swatchHtml}</div></section>
<section><h2>Type</h2><div class="type">
  <div><div class="lbl">Headlines + wordmark</div><div class="spec serif">Dairy Cow<span class="dot">.</span></div><p>Georgia Bold. Tight leading, sentence case, end big headlines with a blush period. The wordmark itself is outlined Georgia Bold.</p></div>
  <div><div class="lbl">Body</div><div class="spec" style="font-family:Geist;font-weight:500;font-size:18pt">Geist Aa</div><p>Geist Regular to Semibold for body copy, captions, prices and UI. Free (SIL OFL); a copy is in fonts/.</p></div>
  <div><div class="lbl">Labels</div><div class="spec caps" style="font-size:9pt;padding:7pt 0 5pt;white-space:nowrap">Only for fans of isopods.</div><p>Geist Semibold, all caps, 0.2em letter spacing. Eyebrows, pills, tagline, sticker callouts.</p></div>
</div></section>
<section><h2>Voice <small>a friend who keeps isopods</small></h2><div class="voice">
  <div><h3>Playful</h3><p>The name is a pun and we lean in. One good joke per post beats five okay ones. Pods, colony, fans, cleanup crew.</p></div>
  <div><h3>Knowledgeable</h3><p>Real species names, real care numbers, real photos of our own animals. Teach something every time.</p></div>
  <div><h3>Honest</h3><p>Clear guarantee, clear weather holds, clear stock. No hype words like "rarest" or "best". Never name other shops.</p></div>
  <div class="say"><b>House rules</b><ul><li>No em dashes. Use periods, commas, colons or a middot ( · ).</li><li>Short sentences. Sentence case headlines.</li><li>Lines that sound like us: "The cows are back." "Want first dibs?" "Thanks for being a fan."</li></ul></div>
</div></section>
<section><h2>Every asset <small>in the brand folder</small></h2><div class="assets">${assetsHtml}</div></section>
</main>
<footer><span>RolyPods · rolypods.com · support@rolypods.com</span><span>Live captive-bred isopods, shipped Monday to Wednesday</span></footer>
</div>`;

function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "html" || e.name.startsWith(".") ? [] : listFiles(p, base);
    return [path.relative(base, p).split(path.sep).join("/")];
  });
}

async function main() {
  const f = page({ file: path.join(BRAND, "src", "html", "brand-guide.html"), css, body, title: "RolyPods brand guide" });
  htmlToPdf(f, path.join(BRAND, "rolypods-brand-guide.pdf"));
  await htmlToPng(f, path.join(BRAND, "rolypods-brand-guide.png"), 816, 1056, 150 / 96);

  // README with the explicit file list
  const groups = {};
  for (const file of listFiles(BRAND).sort()) {
    if (file.startsWith("src/") || file === "README.md") continue;
    const g = file.includes("/") ? file.split("/").slice(0, -1).join("/") : "(root)";
    (groups[g] ??= []).push(file);
  }
  const readme = fs.readFileSync(path.join(BRAND, "src", "README.head.md"), "utf8") +
    Object.entries(groups).map(([g, fs_]) => `\n### ${g}\n\n${fs_.map((x) => `- \`${x}\``).join("\n")}\n`).join("");
  fs.writeFileSync(path.join(BRAND, "README.md"), readme);
  console.log("guide + README written");
}

main();
