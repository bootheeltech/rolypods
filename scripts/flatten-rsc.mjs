// Post-build fix for `output: "export"` on Cloudflare Pages.
// Next 16 writes client-navigation segment payloads as nested folders, e.g.
//   out/care/__next.care/__PAGE__.txt
// but the router requests the dotted form:
//   /care/__next.care.__PAGE__.txt
// Static hosts 404 on that, which makes every in-site link fall back to a full page load.
// This copies each nested payload to its dotted filename next to the folder.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(dir, full);
    else if (name !== "_next") walk(full);
  }
}

function flatten(parent, segDir) {
  const visit = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) visit(full);
      else if (name.endsWith(".txt")) {
        const dotted = relative(parent, full).split(sep).join(".");
        const target = join(parent, dotted);
        if (!existsSync(target)) {
          copyFileSync(full, target);
          copied++;
        }
      }
    }
  };
  visit(segDir);
}

if (existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-rsc: wrote ${copied} dotted segment files`);
}
