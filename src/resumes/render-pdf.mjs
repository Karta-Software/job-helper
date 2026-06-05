import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_BROWSER_PATHS = [
  "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
  "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
];

export function renderHtmlToPdf({ htmlPath, pdfPath, browserPath }) {
  const resolvedBrowserPath = browserPath || findBrowserPath();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "job-helper-pdf-"));
  const args = buildChromiumPdfArgs({
    htmlPath,
    pdfPath,
    userDataDir
  });

  try {
    const run = spawnSync(resolvedBrowserPath, args, {
      encoding: "utf8"
    });

    if (run.error) throw run.error;
    if (run.status !== 0) {
      throw new Error(`Browser PDF render failed with status ${run.status}: ${run.stderr || run.stdout}`);
    }
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Browser PDF render did not create ${pdfPath}`);
    }
  } finally {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

export function buildChromiumPdfArgs({ htmlPath, pdfPath, userDataDir }) {
  return [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=1000",
    `--user-data-dir=${userDataDir}`,
    "--no-pdf-header-footer",
    "--print-to-pdf-no-header",
    `--print-to-pdf=${toBrowserPath(pdfPath)}`,
    toFileUrl(htmlPath)
  ];
}

export function findBrowserPath() {
  const browserPath = DEFAULT_BROWSER_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!browserPath) {
    throw new Error("Could not find Edge or Chrome. Pass --browser <path>.");
  }
  return browserPath;
}

export function toFileUrl(filePath) {
  const absolutePath = path.resolve(filePath);
  if (absolutePath.startsWith("/mnt/") && absolutePath[6] === "/") {
    const drive = absolutePath[5].toUpperCase();
    const windowsPath = absolutePath.slice(7).split(path.sep).map(encodeURIComponent).join("/");
    return `file:///${drive}:/${windowsPath}`;
  }
  return new URL(`file://${absolutePath}`).href;
}

export function toBrowserPath(filePath) {
  const absolutePath = path.resolve(filePath);
  if (absolutePath.startsWith("/mnt/") && absolutePath[6] === "/") {
    const drive = absolutePath[5].toUpperCase();
    return `${drive}:\\${absolutePath.slice(7).split(path.sep).join("\\")}`;
  }
  return absolutePath;
}
