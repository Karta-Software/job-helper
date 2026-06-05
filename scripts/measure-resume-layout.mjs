#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { measureResumeHtmlLayout } from "../src/resumes/layout-utilization.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.html) {
  console.error("Usage: node scripts/measure-resume-layout.mjs --html <resume.html> [--browser <edge-or-chrome-path>] [--out <report.json>]");
  process.exit(2);
}

try {
  const report = measureResumeHtmlLayout({
    htmlPath: args.html,
    browserPath: args.browser
  });

  if (args.out) {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
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
