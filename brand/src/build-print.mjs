// Builds brand/print/** : business card, packing insert, box stickers (PDF + PNG previews).
// Run from the repo root: node brand/src/build-print.mjs   (needs Edge; run from PowerShell)
import path from "node:path";
import { BRAND, page, scatterSvg } from "./shared.mjs";
import { htmlToPdf, htmlToPng } from "./render.mjs";

const PRINT = path.join(BRAND, "print");
const SRC_HTML = path.join(BRAND, "src", "html");
const BLEED = 0.125;
const DPI = 300;
const PX = 96; // CSS px per inch

/**
 * Renders one print piece.
 * sides: { name: htmlBody } ; w/h = trim size in inches (bleed added here)
 */
async function piece({ dir, base, w, h, css, sides, guides = true }) {
  const W = w + BLEED * 2, H = h + BLEED * 2;
  const sheetCss = `
@page { size: ${W}in ${H}in; margin: 0; }
html, body { width: ${W}in; background: #fff; }
.sheet { position: relative; width: ${W}in; height: ${H}in; overflow: hidden; break-after: page; }
.sheet:last-child { break-after: auto; }
.guides { position: absolute; inset: 0; pointer-events: none; }
.guides .trim { position: absolute; inset: ${BLEED}in; outline: 1px dashed #00a3ff; }
.guides .safe { position: absolute; inset: ${BLEED * 2}in; outline: 1px dotted #ff3b30; }
${css}`;
  const wrap = (body, withGuides) =>
    `<div class="sheet">${body}${withGuides ? `<div class="guides"><div class="trim"></div><div class="safe"></div></div>` : ""}</div>`;

  // print PDF: all sides, no guides
  const pdfHtml = page({ file: path.join(SRC_HTML, `${base}.html`), css: sheetCss, body: Object.values(sides).map((b) => wrap(b, false)).join("") });
  htmlToPdf(pdfHtml, path.join(PRINT, dir, `${base}.pdf`));

  // PNG previews per side at 300 dpi, plus a guide overlay version
  const pxW = Math.round(W * PX), pxH = Math.round(H * PX);
  for (const [name, body] of Object.entries(sides)) {
    const f = page({ file: path.join(SRC_HTML, `${base}-${name}.html`), css: sheetCss, body: wrap(body, false) });
    await htmlToPng(f, path.join(PRINT, dir, `${base}-${name}.png`), pxW, pxH, DPI / PX);
    if (guides) {
      const g = page({ file: path.join(SRC_HTML, `${base}-${name}-guides.html`), css: sheetCss, body: wrap(body, true) });
      await htmlToPng(g, path.join(PRINT, dir, "proofs", `${base}-${name}-trim-guides.png`), pxW, pxH, 150 / PX);
    }
  }
}

// ---------------- business card 3.5 x 2
const cardCss = `
.front { position: absolute; inset: 0; background: var(--bark); display: flex; align-items: center; justify-content: center; }
.front img { width: 2.25in; }
.back { position: absolute; inset: 0; background: var(--cream); }
.back .strip { position: absolute; left: 0; right: 0; bottom: 0; height: ${BLEED + 0.09}in; background: var(--blush); }
.back .row { position: absolute; left: ${BLEED + 0.28}in; right: ${BLEED + 0.22}in; top: ${BLEED}in; bottom: ${BLEED + 0.09}in; display: flex; align-items: center; gap: 0.22in; }
.back .row > img { width: 0.95in; flex: none; }
.back .eyebrow { font-size: 5.6pt; color: var(--moss); margin-bottom: 0.07in; letter-spacing: 0.22em; }
.back .site { font-size: 16.5pt; color: var(--bark); line-height: 1; margin-bottom: 0.09in; }
.back .email { font-size: 8pt; color: var(--bark); font-weight: 500; }
.back .tag { font-size: 6.6pt; color: var(--moss); margin-top: 0.14in; line-height: 1.35; }
`;
const cardSides = {
  front: `<div class="front">${scatterSvg(360, 216, { count: 14, min: 18, max: 28, seed: 3, opacity: 0.06 })}<img src="{{root}}/logo/svg/rolypods-lockup-dark.svg" alt="RolyPods"></div>`,
  back: `<div class="back"><div class="row">
    <img src="{{root}}/logo/svg/rolypods-badge-bark-circle.svg" alt="">
    <div>
      <div class="eyebrow caps">Captive-bred isopods</div>
      <div class="site serif">rolypods.com</div>
      <div class="email">support@rolypods.com</div>
      <div class="tag">Shipped live, Monday to Wednesday.<br>Live arrival guaranteed.</div>
    </div></div><div class="strip"></div></div>`,
};

// ---------------- packing insert / thank-you card 4 x 6 portrait
const insertCss = `
.ifront { position: absolute; inset: 0; background: var(--bark); color: var(--cream); }
.ifront .inner { position: absolute; inset: ${BLEED + 0.4}in ${BLEED + 0.35}in; display: flex; flex-direction: column; align-items: center; text-align: center; }
.ifront .mark { width: 1.65in; margin-top: 0.2in; }
.ifront h1 { font-size: 30pt; line-height: 1.04; margin: 0.32in 0 0.18in; }
.ifront p { font-size: 10.5pt; line-height: 1.45; color: var(--cream-dark); max-width: 2.9in; }
.ifront p b { color: var(--blush); font-weight: 600; }
.ifront .logo { position: absolute; bottom: 0; width: 1.7in; }
.iback { position: absolute; inset: 0; background: var(--cream); color: var(--bark); }
.iback .inner { position: absolute; inset: ${BLEED + 0.3}in ${BLEED + 0.3}in; }
.iback h2 { font-size: 17pt; line-height: 1.1; margin-bottom: 0.05in; }
.iback .lede { font-size: 8.2pt; color: var(--moss); margin-bottom: 0.14in; letter-spacing: 0.16em; }
.steps { list-style: none; counter-reset: s; margin-bottom: 0.22in; }
.steps li { counter-increment: s; position: relative; padding-left: 0.42in; margin-bottom: 0.13in; font-size: 8.6pt; line-height: 1.38; }
.steps li::before { content: counter(s); position: absolute; left: 0; top: 0.01in; width: 0.28in; height: 0.28in; border-radius: 50%; background: var(--blush); color: var(--cream); font-weight: 700; font-size: 10pt; display: flex; align-items: center; justify-content: center; }
.steps b { display: block; font-size: 9.6pt; }
.steps .hl { color: var(--blush-dark); font-weight: 700; }
.care { border-top: 1.5px solid var(--cream-dark); padding-top: 0.16in; }
.care ul { list-style: none; }
.care li { font-size: 8.2pt; line-height: 1.38; padding-left: 0.18in; position: relative; margin-bottom: 0.06in; }
.care li::before { content: ""; position: absolute; left: 0.02in; top: 0.055in; width: 0.07in; height: 0.07in; border-radius: 50%; background: var(--moss); }
.iback .foot { position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: flex-end; font-size: 8pt; color: var(--moss); font-weight: 600; }
.iback .foot img { height: 0.3in; }
`;
const insertSides = {
  front: `<div class="ifront">${scatterSvg(408, 600, { count: 24, min: 30, max: 48, seed: 21, opacity: 0.06 })}<div class="inner">
    <img class="mark" src="{{root}}/logo/svg/rolypods-badge-cream-circle.svg" alt="">
    <h1 class="serif">Thanks for being a fan<span class="dot">.</span></h1>
    <p>Your pods just took a trip and would love to stretch their legs (all fourteen of them).<br><br><b>Flip this card</b> before you settle them in.</p>
    <img class="logo" src="{{root}}/logo/svg/rolypods-lockup-dark.svg" alt="RolyPods">
  </div></div>`,
  back: `<div class="iback"><div class="inner">
    <h2 class="serif">Live arrival guarantee<span class="dot">.</span></h2>
    <div class="lede caps">Your first hour checklist</div>
    <ol class="steps">
      <li><b>Open the box within <span class="hl">1 hour</span> of delivery.</b>Check every cup right away, even if you plan to set up later.</li>
      <li><b>Something wrong? Take photos.</b>Get clear photos of any isopods that did not make it, with the shipping box and packing.</li>
      <li><b>Email us within <span class="hl">4 hours</span> of delivery.</b>Send the photos and your order number to support@rolypods.com. We will replace or refund the affected animals, your choice.</li>
    </ol>
    <div class="care">
      <h2 class="serif" style="font-size:13pt;margin-bottom:0.1in">Settling in</h2>
      <ul>
        <li>Moist substrate, leaf litter and rotting hardwood. Skip pine and cedar.</li>
        <li>Keep one side damp and one side dry, with good airflow.</li>
        <li>Room temperature (68-75°F) suits Dairy Cows just fine.</li>
        <li>Mist with dechlorinated water every few days.</li>
        <li>Add a calcium source like crushed cuttlebone.</li>
      </ul>
    </div>
    <div class="foot"><span>Full care guide: rolypods.com/care</span><img src="{{root}}/logo/svg/rolypods-wordmark-light.svg" alt="RolyPods"></div>
  </div></div>`,
};

// ---------------- stickers
const stickerCss = `
.la { position: absolute; inset: 0; background: var(--blush); color: var(--cream); }
.la .inner { position: absolute; inset: ${BLEED + 0.16}in ${BLEED + 0.2}in; display: flex; align-items: center; gap: 0.2in; }
.la .inner > img { height: 1.38in; flex: none; }
.la .t1 { font-size: 28pt; font-weight: 800; letter-spacing: 0.04em; line-height: 0.95; }
.la .t2 { font-size: 10pt; font-weight: 600; letter-spacing: 0.16em; margin: 0.07in 0 0.07in; }
.la .t3 { font-size: 7.4pt; line-height: 1.35; color: #fbe3ec; }
.la .arrows { margin-top: 0.09in; font-size: 7.4pt; font-weight: 700; letter-spacing: 0.18em; }
.up { position: absolute; inset: 0; background: var(--bark); }
.up svg { position: absolute; inset: 0; width: 100%; height: 100%; }
`;
const liveAnimals = (bleed = BLEED) => `<div class="la"><div class="inner" style="inset:${bleed + 0.16}in ${bleed + 0.2}in">
  <img src="{{root}}/logo/svg/rolypods-mark-dark.svg" alt="">
  <div><div class="t1">LIVE<br>ANIMALS</div><div class="t2 caps">Handle with care</div>
  <div class="t3">Live isopods inside. Bring indoors promptly.<br>Keep from extreme heat and cold.</div>
  <div class="arrows">&#8593; THIS SIDE UP &#8593;</div></div>
  </div></div>`;

function thisSideUp() {
  // 2in round sticker on a 2.25in square (bleed). Units: 1in = 100.
  const c = 112.5, rText = 68;
  return `<div class="up"><svg viewBox="0 0 225 225" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="arcTop" d="M ${c - rText} ${c} A ${rText} ${rText} 0 0 1 ${c + rText} ${c}"/>
      <path id="arcBot" d="M ${c - rText - 9} ${c} A ${rText + 9} ${rText + 9} 0 0 0 ${c + rText + 9} ${c}"/>
    </defs>
    <circle cx="${c}" cy="${c}" r="88" fill="none" stroke="#f6f1e4" stroke-width="1.6" stroke-dasharray="3 4" opacity=".55"/>
    <text font-family="Geist" font-weight="700" font-size="15.5" letter-spacing="3.2" fill="#f6f1e4"><textPath href="#arcTop" startOffset="50%" text-anchor="middle">THIS SIDE UP</textPath></text>
    <text font-family="Geist" font-weight="600" font-size="9.5" letter-spacing="2.6" fill="#e7dcc4"><textPath href="#arcBot" startOffset="50%" text-anchor="middle">LIVE ISOPODS INSIDE</textPath></text>
    <path d="M ${c} 70 L ${c + 30} 104 L ${c + 12} 104 L ${c + 12} 150 L ${c - 12} 150 L ${c - 12} 104 L ${c - 30} 104 Z" fill="#d1477a"/>
  </svg></div>`;
}

// Avery 5163 / 8163 (2 x 4 in, 10 per US letter sheet)
const AVERY = { top: 0.5, left: 0.15625, w: 4, h: 2, colPitch: 4.1875, rowPitch: 2, cols: 2, rows: 5 };
function averySheet() {
  let cells = "";
  for (let r = 0; r < AVERY.rows; r++) for (let c = 0; c < AVERY.cols; c++) {
    cells += `<div class="cell" style="left:${AVERY.left + c * AVERY.colPitch}in;top:${AVERY.top + r * AVERY.rowPitch}in">${liveAnimals(0)}</div>`;
  }
  return {
    css: `@page { size: 8.5in 11in; margin: 0; }
html, body { width: 8.5in; height: 11in; background: #fff; }
.cell { position: absolute; width: ${AVERY.w}in; height: ${AVERY.h}in; overflow: hidden; border-radius: 0.06in; }
${stickerCss}`,
    body: `<div style="position:relative;width:8.5in;height:11in">${cells}</div>`,
  };
}

async function main() {
  await piece({ dir: "business-card", base: "rolypods-business-card", w: 3.5, h: 2, css: cardCss, sides: cardSides });
  await piece({ dir: "packing-insert", base: "rolypods-thank-you-insert-4x6", w: 4, h: 6, css: insertCss, sides: insertSides });
  await piece({ dir: "stickers", base: "rolypods-sticker-live-animals-4x2", w: 4, h: 2, css: stickerCss, sides: { sticker: liveAnimals() } });
  await piece({ dir: "stickers", base: "rolypods-sticker-this-side-up-2in-round", w: 2, h: 2, css: stickerCss, sides: { sticker: thisSideUp() } });

  const sheet = averySheet();
  const f = page({ file: path.join(SRC_HTML, "avery-5163-live-animals.html"), ...sheet });
  htmlToPdf(f, path.join(PRINT, "stickers", "rolypods-sticker-live-animals-avery-5163-sheet.pdf"));
  await htmlToPng(f, path.join(PRINT, "stickers", "proofs", "rolypods-sticker-live-animals-avery-5163-sheet.png"), 816, 1056, 1);
  console.log("print written");
}

main();
