import assert from "node:assert/strict";
import test from "node:test";

import { calculatePdfVisualWhitespace } from "../src/resumes/pdf-visual-whitespace.mjs";

test("calculates visible bottom gap against the top and side margins", () => {
  const ppm = makePpm({
    width: 10,
    height: 12,
    contentBox: { left: 2, top: 2, right: 7, bottom: 8 }
  });

  const result = calculatePdfVisualWhitespace(ppm);

  assert.equal(result.visualLeftGapPx, 2);
  assert.equal(result.visualTopGapPx, 2);
  assert.equal(result.visualRightGapPx, 2);
  assert.equal(result.visualBottomGapPx, 3);
  assert.equal(result.visualReferenceMarginPx, 2);
  assert.equal(result.visualBottomToReferenceMarginRatio, 1.5);
  assert.equal(result.visualBottomGapPercent, 25);
});

test("ignores faint antialiasing above the whiteness threshold", () => {
  const ppm = makePpm({
    width: 5,
    height: 5,
    contentBox: { left: 1, top: 1, right: 3, bottom: 3 },
    faintPixel: { x: 0, y: 4, value: 250 }
  });

  const result = calculatePdfVisualWhitespace(ppm);

  assert.equal(result.visualBottomGapPx, 1);
});

function makePpm({ width, height, contentBox, faintPixel }) {
  const header = Buffer.from(`P6\n${width} ${height}\n255\n`, "ascii");
  const data = Buffer.alloc(width * height * 3, 255);

  for (let y = contentBox.top; y <= contentBox.bottom; y += 1) {
    for (let x = contentBox.left; x <= contentBox.right; x += 1) {
      const offset = (y * width + x) * 3;
      data[offset] = 0;
      data[offset + 1] = 0;
      data[offset + 2] = 0;
    }
  }

  if (faintPixel) {
    const offset = (faintPixel.y * width + faintPixel.x) * 3;
    data[offset] = faintPixel.value;
    data[offset + 1] = faintPixel.value;
    data[offset + 2] = faintPixel.value;
  }

  return Buffer.concat([header, data]);
}
