import assert from "node:assert/strict";
import test from "node:test";

import { calculatePageUtilization, extractPrintPageBox } from "../src/resumes/layout-utilization.mjs";

test("extracts printable height from Letter page CSS", () => {
  const box = extractPrintPageBox("<style>@page { size: letter; margin: 0.25in; }</style>");

  assert.equal(box.pageHeightPx, 1056);
  assert.equal(box.marginTopPx, 24);
  assert.equal(box.marginBottomPx, 24);
});

test("calculates page utilization and bottom whitespace", () => {
  const result = calculatePageUtilization({
    contentHeightPx: 900,
    pageHeightPx: 1056,
    marginTopPx: 24,
    marginBottomPx: 24
  });

  assert.equal(result.pageContentHeightPx, 1008);
  assert.equal(result.pageUtilizationPercent, 89.29);
  assert.equal(result.bottomWhitespacePercent, 10.71);
  assert.equal(result.overflowPercent, 0);
});

test("reports overflow when content exceeds printable height", () => {
  const result = calculatePageUtilization({
    contentHeightPx: 1100,
    pageHeightPx: 1056,
    marginTopPx: 24,
    marginBottomPx: 24
  });

  assert.equal(result.pageUtilizationPercent, 109.13);
  assert.equal(result.bottomWhitespacePercent, 0);
  assert.equal(result.overflowPercent, 9.13);
});
