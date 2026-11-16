// Builds brand/social/** : avatars, banners/covers, post templates (+ example renders).
// Run from the repo root: node brand/src/build-social.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { iconSvg } from "./mark.mjs";
import { BADGES } from "./build-logos.mjs";
import { BRAND, page, scatterSvg } from "./shared.mjs";
import { htmlToPng } from "./render.mjs";

const SOC = path.join(BRAND, "social");
const SRC_HTML = path.join(BRAND, "src", "html");
const photo = (name) => `{{root}}/../public/photos/dairy-cow-isopods-${name}.jpg`;

// ---------- avatars: square image, bug kept inside the circle crop every platform applies
const AVATARS = [
  ["instagram", 1080, "displays at 320, upload 1080"],
  ["facebook", 720, "displays at 176-196, upload 720"],
  ["tiktok", 1080, "displays at 200, upload 1080"],
  ["youtube", 800, "800 x 800"],
  ["x", 400, "400 x 400"],
];

async function avatars() {
  const svg = iconSvg({ ...BADGES["badge-bark"], shape: "square", pad: 0.17 });
  fs.mkdirSync(path.join(SOC, "avatars"), { recursive: true });
  fs.writeFileSync(path.join(SOC, "avatars", "rolypods-avatar.svg"), svg);
  for (const [name, size] of AVATARS) {
    await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path.join(SOC, "avatars", `rolypods-avatar-${name}-${size}.png`));
  }
}

// ---------- banners
const BANNERS = [
  // name, w, h, safe area (w, h) centered
  ["x-header", 1500, 500, [1500, 360]],
  ["facebook-cover", 1640, 624, [1200, 520]],
  ["youtube-banner", 2560, 1440, [1546, 423]],
];

function bannerHtml(w, h, [sw, sh]) {
  const logoW = Math.min(sw * 0.5, sh * 1.75);
  return {
    css: `
html, body { width: ${w}px; height: ${h}px; overflow: hidden; background: var(--bark); }
.wrap { position: relative; width: ${w}px; height: ${h}px; }
.safe { position: absolute; left: ${(w - sw) / 2}px; top: ${(h - sh) / 2}px; width: ${sw}px; height: ${sh}px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${Math.round(logoW * 0.06)}px; }
.safe img { width: ${logoW}px; }
.line { color: var(--cream-dark); font-size: ${Math.round(logoW * 0.04)}px; font-weight: 500; letter-spacing: 0.04em; }
.line b { color: var(--blush); font-weight: 600; }
`,
    body: `<div class="wrap">${scatterSvg(w, h, { count: Math.round((w * h) / 26000), min: Math.min(h, sh * 1.2) * 0.09, max: Math.min(h, sh * 1.2) * 0.16, seed: w })}
<div class="safe"><img src="{{root}}/logo/svg/rolypods-lockup-dark.svg" alt="RolyPods">
<div class="line">Captive-bred isopods, shipped live <b>·</b> rolypods.com</div></div></div>`,
  };
}

// ---------- post templates (1080 x 1350, Instagram/Facebook portrait)
const POST_W = 1080, POST_H = 1350;
const postCss = `
html, body { width: ${POST_W}px; height: ${POST_H}px; overflow: hidden; }
.post { position: relative; width: ${POST_W}px; height: ${POST_H}px; overflow: hidden; }
.pill { display: inline-block; padding: 14px 28px; border-radius: 999px; font-size: 26px; }
`;

const TEMPLATES = {
  "new-drop": ({ label, title, sub, cta, img }) => ({
    css: postCss + `
.post { background: var(--bark); }
.photo { position: absolute; inset: 0 0 auto 0; height: 840px; background: url("${img}") center 40% / cover; }
.photo::after { content: ""; position: absolute; inset: auto 0 0 0; height: 180px; background: linear-gradient(transparent, var(--bark)); }
.pill { position: absolute; top: 56px; left: 56px; background: var(--blush); color: var(--cream); }
.panel { position: absolute; left: 72px; right: 72px; bottom: 64px; }
h1 { color: var(--cream); font-size: 112px; line-height: 1.0; margin-bottom: 22px; }
.sub { color: var(--cream-dark); font-size: 34px; line-height: 1.4; margin-bottom: 56px; }
.foot { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid rgba(246,241,228,.18); padding-top: 34px; }
.cta { color: var(--blush); font-size: 34px; font-weight: 600; }
.foot img { height: 58px; }
`,
    body: `<div class="post">
  <div class="photo"></div>
  <div class="pill caps"><!-- EDIT label -->${label}</div>
  <div class="panel">
    <h1 class="serif"><!-- EDIT title -->${title}</h1>
    <p class="sub"><!-- EDIT subline -->${sub}</p>
    <div class="foot"><span class="cta"><!-- EDIT call to action -->${cta}</span><img src="{{root}}/logo/svg/rolypods-wordmark-dark.svg" alt="RolyPods"></div>
  </div>
</div>`,
  }),

  "restock-waitlist": ({ label, title, body, cta, accent }) => ({
    css: postCss + `
.post { background: var(--cream); }
.bigbug { position: absolute; right: -30px; bottom: 10px; width: 600px; transform: rotate(-18deg); }
.content { position: absolute; left: 80px; top: 96px; right: 80px; }
.pill { background: ${accent}; color: var(--cream); margin-bottom: 64px; }
h1 { color: var(--bark); font-size: 128px; line-height: 0.98; margin-bottom: 44px; }
p.body { color: var(--bark); font-size: 38px; line-height: 1.42; max-width: 760px; }
.foot { position: absolute; left: 80px; bottom: 80px; }
.foot img { height: 72px; margin-bottom: 18px; }
.cta { color: var(--moss); font-size: 30px; font-weight: 600; }
`,
    body: `<div class="post">
  <img class="bigbug" src="{{root}}/logo/svg/rolypods-mark-light.svg" alt="">
  <div class="content">
    <div class="pill caps"><!-- EDIT label -->${label}</div>
    <h1 class="serif"><!-- EDIT headline -->${title}</h1>
    <p class="body"><!-- EDIT body -->${body}</p>
  </div>
  <div class="foot"><img src="{{root}}/logo/svg/rolypods-wordmark-light.svg" alt="RolyPods"><div class="cta"><!-- EDIT call to action -->${cta}</div></div>
</div>`,
  }),

  "care-tip": ({ num, title, body, left, right, cta }) => ({
    css: postCss + `
.post { background: var(--moss); color: var(--cream); }
.content { position: absolute; left: 80px; right: 80px; top: 96px; }
.pill { background: var(--cream); color: var(--moss-dark); margin-bottom: 60px; }
.pill span { color: var(--blush); }
h1 { font-size: 112px; line-height: 1.0; margin-bottom: 44px; }
p.body { font-size: 38px; line-height: 1.45; color: var(--cream); opacity: .92; }
.split { position: absolute; left: 80px; right: 80px; bottom: 236px; height: 170px; display: flex; border-radius: 28px; overflow: hidden; border: 3px solid rgba(246,241,228,.35); }
.split div { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.split .a { background: var(--moss-dark); }
.split .b { background: #6d8a6f; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 80px; display: flex; justify-content: space-between; align-items: center; }
.foot img { height: 84px; }
.cta { font-size: 30px; font-weight: 600; color: var(--cream-dark); }
`,
    body: `<div class="post">
  ${scatterSvg(POST_W, POST_H, { count: 22, min: 70, max: 120, seed: 11, opacity: 0.06 })}
  <div class="content">
    <div class="pill caps">Care tip <span>#<!-- EDIT number -->${num}</span></div>
    <h1 class="serif"><!-- EDIT headline -->${title}</h1>
    <p class="body"><!-- EDIT body -->${body}</p>
  </div>
  <div class="split"><div class="a caps"><!-- EDIT left label -->${left}</div><div class="b caps"><!-- EDIT right label -->${right}</div></div>
  <div class="foot"><img src="{{root}}/logo/svg/rolypods-horizontal-dark.svg" alt="RolyPods"><div class="cta"><!-- EDIT link -->${cta}</div></div>
</div>`,
  }),
};

const POSTS = [
  ["new-drop", "new-drop", { label: "New drop", title: "Dairy Cow Isopods<span class=\"dot\">.</span>", sub: "<i>Porcellio laevis</i> · captive-bred · containers of 25. Big, fast, and patched like tiny Holsteins.", cta: "Shop at rolypods.com", img: photo("2-closeup") }],
  ["restock-waitlist", "restock", { label: "Back in stock", title: "The cows<br>are back<span class=\"dot\">.</span>", body: "Dairy Cow isopods are restocked. Containers of 25, shipping Monday through Wednesday so nobody spends a weekend in a warehouse.", cta: "rolypods.com/shop", accent: "var(--blush)" }],
  ["restock-waitlist", "waitlist", { label: "Waitlist open", title: "Want first<br>dibs<span class=\"dot\">?</span>", body: "Powder Blue, Zebra and Rubber Ducky isopods are waitlist only for now. Join the list and we will email you the moment they are ready.", cta: "rolypods.com/shop · tap Join waitlist", accent: "var(--moss)" }],
  ["care-tip", "care-tip", { num: "01", title: "One side damp, one side dry<span class=\"dot\">.</span>", body: "Isopods like to pick their own comfort zone. Keep half the enclosure moist and half drier, mist with dechlorinated water every few days, and keep the air moving.", left: "Damp side", right: "Dry side", cta: "rolypods.com/care" }],
];

async function main() {
  await avatars();

  for (const [name, w, h, safe] of BANNERS) {
    const file = path.join(SRC_HTML, `banner-${name}.html`);
    page({ file, ...bannerHtml(w, h, safe) });
    await htmlToPng(file, path.join(SOC, "banners", `rolypods-${name}-${w}x${h}.png`), w, h);
  }

  for (const [tpl, name, data] of POSTS) {
    const file = path.join(SOC, "posts", "templates", `${name}.html`);
    page({ file, title: `RolyPods post: ${name}`, ...TEMPLATES[tpl](data) });
    await htmlToPng(file, path.join(SOC, "posts", `rolypods-post-${name}-1080x1350.png`), POST_W, POST_H);
  }
  console.log("social written");
}

main();
