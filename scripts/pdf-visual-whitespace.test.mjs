import assert from "node:assert/strict";
import test from "node:test";

import { calculatePdfVisualWhitespace } from "../src/resumes/pdf-visual-whitespace.mjs";

test("ignores decorative horizontal rules when measuring meaningful bottom whitespace", () => {
  const ppm = makePpm(100, 120);
  fill(ppm, 10, 10, 40, 15);
  fill(ppm, 10, 80, 40, 85);
  fill(ppm, 10, 105, 89, 105);

  const result = calculatePdfVisualWhitespace(ppm.buffer);

  assert.equal(result.visualBottomGapPx, 14);
  assert.equal(result.visualBottomToReferenceMarginRatio, 1.4);
  assert.equal(result.visualMeaningfulBottomGapPx, 34);
  assert.equal(result.visualMeaningfulBottomToReferenceMarginRatio, 3.4);
  assert.deepEqual(result.ignoredHorizontalRuleRows, [105]);
});

test("does not mistake dense but discontinuous text pixels for a horizontal rule", () => {
  const ppm = makePpm(100, 120);
  fill(ppm, 10, 10, 40, 15);
  for (let x = 10; x <= 89; x += 3) {
    fill(ppm, x, 105, Math.min(x + 1, 89), 105);
  }

  const result = calculatePdfVisualWhitespace(ppm.buffer);

  assert.equal(result.visualMeaningfulBottomGapPx, 14);
  assert.deepEqual(result.ignoredHorizontalRuleRows, []);
});

function makePpm(width, height) {
  const header = Buffer.from(`P6\n${width} ${height}\n255\n`, "ascii");
  const pixels = Buffer.alloc(width * height * 3, 255);
  return {
    width,
    height,
    dataOffset: header.length,
    buffer: Buffer.concat([header, pixels])
  };
}

function fill(ppm, x1, y1, x2, y2) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) {
      const offset = ppm.dataOffset + ((y * ppm.width + x) * 3);
      ppm.buffer[offset] = 0;
      ppm.buffer[offset + 1] = 0;
      ppm.buffer[offset + 2] = 0;
    }
  }
}
