// Resizes source photos into web sizes under public/photos.
// Usage: node scripts/import-photos.mjs <source image> [...more]
// Each "name.jpg" becomes public/photos/name.jpg (1600px) and name-sm.jpg (640px), EXIF stripped.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });

for (const src of process.argv.slice(2)) {
  const name = basename(src, extname(src)).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  for (const [suffix, width, quality] of [["", 1600, 80], ["-sm", 640, 78]]) {
    const out = join(OUT, `${name}${suffix}.jpg`);
    const info = await sharp(src)
      .rotate() // respect phone orientation, then drop metadata (GPS etc.)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
