#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { evaluateCoverLetterQuality } from "../src/cover-letters/quality.mjs";
import { countPdfPages } from "../src/resumes/pdf-page-count.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.letter || !args.gates) {
  console.error("Usage: node scripts/check-cover-letter-quality.mjs --letter <file> --gates <file> [--pdf <file>] [--out <file>]");
  process.exit(2);
}

const raw = fs.readFileSync(args.letter, "utf8");
const config = JSON.parse(fs.readFileSync(args.gates, "utf8"));
const text = textFromMarkup(raw);
const words = text.match(/\b[\w'+-]+\b/g) || [];
const pageCount = args.pdf ? countPdfPages(args.pdf) : undefined;
const measurements = {
  wordCount: words.length,
  pageCount,
  pageCountSource: args.pdf ? "pdf" : "unmeasured",
  letterPath: path.resolve(args.letter),
  pdfPath: args.pdf ? path.resolve(args.pdf) : null
};

const report = {
  ...evaluateCoverLetterQuality(config, {
    text,
    wordCount: words.length,
    pageCount,
    pageCountSource: measurements.pageCountSource
  }),
  measurements
};

if (args.out) {
  fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
  fs.writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 1);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) {
      parsed[key.slice(2)] = true;
      continue;
    }
    parsed[key.slice(2)] = next;
    index += 1;
  }
  return parsed;
}

function textFromMarkup(raw) {
  return raw
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[>*_`~]/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}
