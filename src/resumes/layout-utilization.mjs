import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { findBrowserPath, toFileUrl } from "./render-pdf.mjs";

const LETTER_HEIGHT_PX = 11 * 96;

export function measureResumeHtmlLayout({ htmlPath, browserPath }) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const pageBox = extractPrintPageBox(html);
  const browserMetrics = measureHtmlContentHeight({
    html,
    htmlPath,
    browserPath
  });
  return calculatePageUtilization({
    ...browserMetrics,
    ...pageBox
  });
}

export function calculatePageUtilization({ contentHeightPx, pageHeightPx, marginTopPx, marginBottomPx }) {
  const pageContentHeightPx = pageHeightPx - marginTopPx - marginBottomPx;
  const pageUtilizationPercent = (contentHeightPx / pageContentHeightPx) * 100;
  return {
    contentHeightPx: round(contentHeightPx),
    pageHeightPx: round(pageHeightPx),
    marginTopPx: round(marginTopPx),
    marginBottomPx: round(marginBottomPx),
    pageContentHeightPx: round(pageContentHeightPx),
    pageUtilizationPercent: round(pageUtilizationPercent),
    bottomWhitespacePercent: round(Math.max(0, 100 - pageUtilizationPercent)),
    overflowPercent: round(Math.max(0, pageUtilizationPercent - 100))
  };
}

export function extractPrintPageBox(html) {
  const pageRule = html.match(/@page\s*\{([\s\S]*?)\}/i)?.[1] || "";
  const size = pageRule.match(/size\s*:\s*([^;]+);?/i)?.[1]?.trim().toLowerCase() || "letter";
  const margin = pageRule.match(/margin\s*:\s*([^;]+);?/i)?.[1]?.trim() || "0.5in";
  const pageHeightPx = size.includes("letter") ? LETTER_HEIGHT_PX : LETTER_HEIGHT_PX;
  const margins = parseCssMargin(margin);

  return {
    pageHeightPx,
    marginTopPx: margins.top,
    marginBottomPx: margins.bottom
  };
}

function measureHtmlContentHeight({ html, htmlPath, browserPath }) {
  const resolvedBrowserPath = browserPath || findBrowserPath();
  const tempDir = fs.mkdtempSync(path.join(path.dirname(htmlPath), ".layout-metrics-"));
  const tempHtmlPath = path.join(tempDir, "instrumented.html");
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "job-helper-layout-"));
  fs.writeFileSync(tempHtmlPath, injectMeasurementScript(html));

  try {
    const run = spawnSync(
      resolvedBrowserPath,
      [
        "--headless=new",
        "--disable-gpu",
        "--disable-extensions",
        "--no-first-run",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=1000",
        "--window-size=816,1056",
        `--user-data-dir=${userDataDir}`,
        "--dump-dom",
        toFileUrl(tempHtmlPath)
      ],
      { encoding: "utf8" }
    );

    if (run.error) throw run.error;
    if (run.status !== 0) {
      throw new Error(`Browser layout measurement failed with status ${run.status}: ${run.stderr || run.stdout}`);
    }

    const metrics = extractDumpedMetrics(run.stdout);
    if (!metrics) throw new Error("Browser layout measurement did not return metrics.");
    return metrics;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

function injectMeasurementScript(html) {
  const script = `<script>
(() => {
  const measure = () => {
    const bodyRect = document.body.getBoundingClientRect();
    let bottom = 0;
    for (const element of document.body.querySelectorAll("*")) {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      bottom = Math.max(bottom, rect.bottom - bodyRect.top);
    }
    const pre = document.createElement("pre");
    pre.id = "__resume_layout_metrics__";
    pre.textContent = JSON.stringify({
      contentHeightPx: bottom,
      bodyScrollHeightPx: document.body.scrollHeight,
      viewportHeightPx: window.innerHeight
    });
    document.body.appendChild(pre);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", measure);
  } else {
    measure();
  }
})();
</script>`;

  return html.includes("</body>") ? html.replace("</body>", `${script}</body>`) : `${html}${script}`;
}

function extractDumpedMetrics(dumpedDom) {
  const match = dumpedDom.match(/<pre id="__resume_layout_metrics__">([\s\S]*?)<\/pre>/);
  if (!match) return undefined;
  return JSON.parse(unescapeHtml(match[1]));
}

function parseCssMargin(value) {
  const parts = value.split(/\s+/).filter(Boolean).map(cssLengthToPx);
  if (parts.length === 1) {
    return { top: parts[0], bottom: parts[0] };
  }
  if (parts.length === 2) {
    return { top: parts[0], bottom: parts[0] };
  }
  if (parts.length === 3) {
    return { top: parts[0], bottom: parts[2] };
  }
  return { top: parts[0], bottom: parts[2] };
}

function cssLengthToPx(value) {
  const match = value.match(/^([\d.]+)(in|pt|px)?$/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = (match[2] || "px").toLowerCase();
  if (unit === "in") return amount * 96;
  if (unit === "pt") return amount * (96 / 72);
  return amount;
}

function unescapeHtml(value) {
  return value
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function round(value) {
  return Number(value.toFixed(2));
}
