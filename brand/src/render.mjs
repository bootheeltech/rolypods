// Headless Edge helpers: HTML file -> PNG screenshot or PDF.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const EDGE = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// msedge.exe can return before its browser process has written the output, so wait for the file
function waitForFile(file, timeoutMs = 60000) {
  const t0 = Date.now();
  let last = -1;
  while (Date.now() - t0 < timeoutMs) {
    if (fs.existsSync(file)) {
      const size = fs.statSync(file).size;
      if (size > 0 && size === last) return;
      last = size;
    }
    sleep(250);
  }
  throw new Error(`Edge did not produce ${file}`);
}

function edge(args, outFile) {
  if (fs.existsSync(outFile)) fs.rmSync(outFile);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "rp-edge-"));
  try {
    execFileSync(EDGE, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--allow-file-access-from-files",
      "--virtual-time-budget=4000",
      `--user-data-dir=${profile}`,
      ...args,
    ], { stdio: "pipe", timeout: 120000 });
    waitForFile(outFile);
  } finally {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 }); } catch { /* Edge may still hold it; temp dir */ }
  }
}

/** Screenshot an HTML file at exactly width x height CSS px (scale = device pixel ratio). */
export async function htmlToPng(htmlFile, pngFile, width, height, scale = 1) {
  // headless Edge sometimes captures a few px less than the window; render taller and crop
  fs.mkdirSync(path.dirname(pngFile), { recursive: true });
  const tmp = pngFile + ".tmp.png";
  edge([
    `--window-size=${width},${height + 200}`,
    `--force-device-scale-factor=${scale}`,
    `--screenshot=${tmp}`,
    pathToFileURL(htmlFile).href,
  ], tmp);
  await sharp(tmp)
    .extract({ left: 0, top: 0, width: Math.round(width * scale), height: Math.round(height * scale) })
    .png({ compressionLevel: 9 })
    .toFile(pngFile);
  fs.rmSync(tmp);
}

/** Print an HTML file to PDF; page size comes from the file's @page rule. */
export function htmlToPdf(htmlFile, pdfFile) {
  fs.mkdirSync(path.dirname(pdfFile), { recursive: true });
  edge([
    "--no-pdf-header-footer",
    "--generate-pdf-document-outline=false",
    `--print-to-pdf=${pdfFile}`,
    pathToFileURL(htmlFile).href,
  ], pdfFile);
}
