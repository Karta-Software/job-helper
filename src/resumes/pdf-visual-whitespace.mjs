import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_DENSITY = 144;
const DEFAULT_THRESHOLD = 245;

export function measurePdfVisualWhitespace({
  pdfPath,
  ghostscriptPath,
  density = DEFAULT_DENSITY,
  threshold = DEFAULT_THRESHOLD
}) {
  const resolvedGhostscriptPath = ghostscriptPath || findGhostscriptPath();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "job-helper-pdf-visual-"));
  const ppmPath = path.join(tempDir, "page.ppm");

  try {
    const run = spawnSync(
      resolvedGhostscriptPath,
      [
        "-dSAFER",
        "-dBATCH",
        "-dNOPAUSE",
        "-sDEVICE=ppmraw",
        `-r${density}`,
        "-dFirstPage=1",
        "-dLastPage=1",
        `-sOutputFile=${ppmPath}`,
        pdfPath
      ],
      { encoding: "utf8" }
    );

    if (run.error) throw run.error;
    if (run.status !== 0) {
      throw new Error(`Ghostscript visual whitespace render failed with status ${run.status}: ${run.stderr || run.stdout}`);
    }

    return calculatePdfVisualWhitespace(fs.readFileSync(ppmPath), { threshold });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

export function calculatePdfVisualWhitespace(ppmBuffer, { threshold = DEFAULT_THRESHOLD } = {}) {
  const ppm = parsePpm(ppmBuffer);
  const rowLongestNonWhiteRuns = new Uint32Array(ppm.height);
  let minX = ppm.width;
  let minY = ppm.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < ppm.height; y += 1) {
    let currentNonWhiteRun = 0;
    for (let x = 0; x < ppm.width; x += 1) {
      const offset = ppm.dataOffset + ((y * ppm.width + x) * 3);
      const r = ppmBuffer[offset];
      const g = ppmBuffer[offset + 1];
      const b = ppmBuffer[offset + 2];
      if (Math.min(r, g, b) >= threshold) {
        currentNonWhiteRun = 0;
        continue;
      }

      currentNonWhiteRun += 1;
      rowLongestNonWhiteRuns[y] = Math.max(rowLongestNonWhiteRuns[y], currentNonWhiteRun);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX === -1) {
    throw new Error("No visible non-white content found in rendered PDF page.");
  }

  const gaps = {
    left: minX,
    top: minY,
    right: ppm.width - 1 - maxX,
    bottom: ppm.height - 1 - maxY
  };
  const referenceMarginPx = median([gaps.left, gaps.top, gaps.right]);
  const ignoredHorizontalRuleRows = [];
  let meaningfulMaxY = -1;
  for (let y = 0; y < ppm.height; y += 1) {
    if (rowLongestNonWhiteRuns[y] === 0) continue;
    if (rowLongestNonWhiteRuns[y] / ppm.width >= 0.5) {
      ignoredHorizontalRuleRows.push(y);
      continue;
    }
    meaningfulMaxY = y;
  }
  if (meaningfulMaxY === -1) meaningfulMaxY = maxY;
  const meaningfulBottomGapPx = ppm.height - 1 - meaningfulMaxY;

  return {
    visualPageWidthPx: ppm.width,
    visualPageHeightPx: ppm.height,
    visualContentBoxPx: {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    },
    visualTopGapPx: gaps.top,
    visualRightGapPx: gaps.right,
    visualBottomGapPx: gaps.bottom,
    visualLeftGapPx: gaps.left,
    visualReferenceMarginPx: round(referenceMarginPx),
    visualBottomGapPercent: round((gaps.bottom / ppm.height) * 100),
    visualBottomToReferenceMarginRatio: round(gaps.bottom / referenceMarginPx),
    visualMeaningfulBottomGapPx: meaningfulBottomGapPx,
    visualMeaningfulBottomGapPercent: round((meaningfulBottomGapPx / ppm.height) * 100),
    visualMeaningfulBottomToReferenceMarginRatio: round(meaningfulBottomGapPx / referenceMarginPx),
    ignoredHorizontalRuleRows
  };
}

function parsePpm(buffer) {
  let index = 0;
  const magic = readToken(buffer, index);
  if (magic.token !== "P6") throw new Error(`Unsupported PPM format: ${magic.token}`);
  index = magic.nextIndex;

  const width = readToken(buffer, index);
  index = width.nextIndex;
  const height = readToken(buffer, index);
  index = height.nextIndex;
  const maxValue = readToken(buffer, index);
  index = maxValue.nextIndex;

  if (Number(maxValue.token) !== 255) throw new Error(`Unsupported PPM max value: ${maxValue.token}`);
  return {
    width: Number(width.token),
    height: Number(height.token),
    dataOffset: index
  };
}

function readToken(buffer, startIndex) {
  let index = startIndex;
  while (index < buffer.length) {
    const char = String.fromCharCode(buffer[index]);
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (char === "#") {
      while (index < buffer.length && String.fromCharCode(buffer[index]) !== "\n") index += 1;
      continue;
    }
    break;
  }

  const tokenStart = index;
  while (index < buffer.length && !/\s/.test(String.fromCharCode(buffer[index]))) index += 1;
  const token = buffer.subarray(tokenStart, index).toString("ascii");
  while (index < buffer.length && /\s/.test(String.fromCharCode(buffer[index]))) {
    index += 1;
    break;
  }
  return { token, nextIndex: index };
}

function findGhostscriptPath() {
  const candidates = process.platform === "win32"
    ? ["gswin64c", "gswin32c", "gs"]
    : ["gs"];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error("Could not find Ghostscript. Pass --ghostscript <path>.");
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function round(value) {
  return Number(value.toFixed(2));
}
