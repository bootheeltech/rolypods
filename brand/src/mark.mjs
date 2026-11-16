// The RolyPods isopod mark: a top-down Dairy Cow isopod drawn on a 512 grid.
// Segment gaps are cut with a mask so the mark works on any background.
let uid = 0;

/**
 * @param {object} o
 * @param {string} o.body   shell color
 * @param {string} o.spots  spot color, "knockout" (cut-out spots for one-color marks), or null
 * @param {string} o.dot    blush period color (null = no period)
 * @param {number} [o.detail=0] 0 = primary bold mark, 1 = detailed version for large print
 */
export function isopod({ body, spots, dot, detail = 0 }) {
  const id = `rp${++uid}`;
  const cx = 248;
  // body ellipse
  const by = 294, brx = 128, bry = 162;
  // segment gap lines: bow upward so the sides sweep back like a real isopod
  const gapYs = detail ? [170, 208, 246, 282, 316, 348, 378, 404, 426] : [198, 262, 324, 382];
  const gapW = detail ? 7 : 12;
  const gaps = gapYs
    .map((y) => `<path d="M ${cx - 150} ${y + 26} Q ${cx} ${y - 22} ${cx + 150} ${y + 26}" />`)
    .join("");

  // Holstein patches: chunky, slightly irregular, mirrored loosely
  const spotShapes = detail
    ? [
        "M 190 200 q 14 -10 26 0 q 6 12 -4 20 q -16 6 -24 -4 q -4 -10 2 -16 z",
        "M 286 192 q 16 -6 24 6 q 4 14 -10 18 q -14 2 -18 -8 q -2 -10 4 -16 z",
        "M 226 252 q 18 -8 28 4 q 4 14 -10 18 q -18 4 -22 -8 q -2 -8 4 -14 z",
        "M 160 276 q 10 -10 22 -2 q 6 12 -2 22 q -12 6 -20 -4 q -4 -8 0 -16 z",
        "M 316 268 q 14 -8 22 4 q 2 14 -10 18 q -12 2 -16 -8 q -2 -8 4 -14 z",
        "M 262 318 q 16 -6 24 6 q 2 12 -10 16 q -14 2 -18 -8 q -2 -8 4 -14 z",
        "M 196 336 q 14 -6 22 4 q 2 12 -8 16 q -14 2 -18 -8 q 0 -8 4 -12 z",
        "M 300 360 q 12 -4 18 6 q 0 10 -10 12 q -10 0 -12 -8 q 0 -6 4 -10 z",
        "M 232 392 q 12 -4 18 4 q 0 10 -10 12 q -10 0 -12 -8 q 0 -6 4 -8 z",
      ]
    : [
        "M 186 214 q 22 -14 36 2 q 6 18 -10 26 q -22 6 -30 -8 q -4 -12 4 -20 z",
        "M 280 206 q 22 -8 32 8 q 4 18 -14 24 q -20 2 -24 -12 q -2 -12 6 -20 z",
        "M 222 286 q 24 -10 36 6 q 4 18 -14 24 q -24 4 -28 -12 q -2 -10 6 -18 z",
        "M 296 330 q 18 -6 26 8 q 2 16 -14 20 q -18 2 -20 -12 q 0 -10 8 -16 z",
        "M 190 344 q 18 -6 26 8 q 2 14 -12 18 q -16 2 -20 -10 q 0 -10 6 -16 z",
      ];
  const spotPaths = `<g transform="translate(${cx} 0) scale(1.16 1) translate(${-cx} 0)">${spotShapes.map((d) => `<path d="${d}"/>`).join("")}</g>`;
  const knockout = spots === "knockout";
  const spotsSvg = spots && !knockout
    ? `<g fill="${spots}" clip-path="url(#${id}c)"><g transform="translate(${cx} 0) scale(1.16 1) translate(${-cx} 0)">${spotShapes.map((d) => `<path d="${d}"/>`).join("")}</g></g>`
    : "";

  const sw = detail ? 11 : 16; // antenna stroke
  const antennae = `<g fill="none" stroke="${body}" stroke-width="${sw}" stroke-linecap="round">
    <path d="M ${cx - 30} 104 C ${cx - 56} 70, ${cx - 92} 58, ${cx - 118} 34"/>
    <path d="M ${cx + 30} 104 C ${cx + 56} 70, ${cx + 92} 58, ${cx + 118} 34"/>
  </g>`;

  // uropods (the little tail prongs)
  const uro = `<g fill="${body}">
    <path d="M ${cx - 44} 432 Q ${cx - 62} 470 ${cx - 70} 490 Q ${cx - 46} 478 ${cx - 22} 446 Z"/>
    <path d="M ${cx + 44} 432 Q ${cx + 62} 470 ${cx + 70} 490 Q ${cx + 46} 478 ${cx + 22} 446 Z"/>
  </g>`;

  const silhouette = `<ellipse cx="${cx}" cy="${by}" rx="${brx}" ry="${bry}"/><ellipse cx="${cx}" cy="128" rx="76" ry="38"/>`;

  const dotSvg = dot ? `<circle cx="${cx + 172}" cy="452" r="${detail ? 34 : 44}" fill="${dot}"/>` : "";

  return `<defs>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <rect width="512" height="512" fill="#fff"/>
      <g fill="none" stroke="#000" stroke-width="${gapW}" stroke-linecap="round">${gaps}</g>
      ${knockout ? `<g fill="#000">${spotPaths}</g>` : ""}
      <path d="M ${cx - 110} 160 Q ${cx} 134 ${cx + 110} 160" fill="none" stroke="#000" stroke-width="${gapW + 2}"/>
    </mask>
    <clipPath id="${id}c"><ellipse cx="${cx}" cy="${by}" rx="${brx}" ry="${bry}"/></clipPath>
  </defs>
  ${antennae}
  ${uro}
  <g mask="url(#${id}m)">
    <g fill="${body}">${silhouette}</g>
    ${spotsSvg}
  </g>
  ${dotSvg}`;
}

/** Full 512x512 icon. bg = null for transparent. shape: 'circle' | 'square' | 'rounded' */
export function iconSvg({ bg, body, spots, dot, detail = 0, shape = "square", pad = 0.1 }) {
  const s = 1 - pad * 2;
  const t = 256 - 256 * s;
  let bgSvg = "";
  if (bg) {
    if (shape === "circle") bgSvg = `<circle cx="256" cy="256" r="256" fill="${bg}"/>`;
    else if (shape === "rounded") bgSvg = `<rect width="512" height="512" rx="112" fill="${bg}"/>`;
    else bgSvg = `<rect width="512" height="512" fill="${bg}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${bgSvg}<g transform="translate(${t} ${t}) scale(${s})">${isopod({ body, spots, dot, detail })}</g></svg>`;
}
