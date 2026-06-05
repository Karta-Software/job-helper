#!/usr/bin/env node
import { renderHtmlToPdf } from "../src/resumes/render-pdf.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.html || !args.pdf) {
  console.error("Usage: node scripts/render-resume-pdf.mjs --html <resume.html> --pdf <resume.pdf> [--browser <edge-or-chrome-path>]");
  process.exit(2);
}

try {
  renderHtmlToPdf({
    htmlPath: args.html,
    pdfPath: args.pdf,
    browserPath: args.browser
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      parsed[key.slice(2)] = true;
      continue;
    }
    parsed[key.slice(2)] = value;
    index += 1;
  }
  return parsed;
}
