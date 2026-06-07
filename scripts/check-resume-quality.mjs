#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { measureResumeHtmlLayout } from "../src/resumes/layout-utilization.mjs";
import { countPdfPages } from "../src/resumes/pdf-page-count.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.resume || !args.gates) {
  console.error("Usage: node scripts/check-resume-quality.mjs --resume <file> --gates <file> [--posting <file>] [--pdf <file>] [--html <file>] [--max-pages 1] [--allow-manual-pages --pages 1] [--allow-manual-lines --lines 80] [--out <file>]");
  process.exit(2);
}

const resumeRaw = fs.readFileSync(args.resume, "utf8");
const gates = JSON.parse(fs.readFileSync(args.gates, "utf8"));
applyRuntimeOverrides(gates, args);
const postingRaw = args.posting ? fs.readFileSync(args.posting, "utf8") : "";
const resumeText = textFromMarkup(resumeRaw);
const postingText = textFromMarkup(postingRaw);
const snapshot = buildSnapshot(resumeRaw, resumeText, args);
const report = evaluate(gates, snapshot, postingText, args);

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
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
  if (parsed.pages !== undefined) parsed.pages = Number(parsed.pages);
  if (parsed["max-pages"] !== undefined) parsed["max-pages"] = Number(parsed["max-pages"]);
  if (parsed.lines !== undefined) parsed.lines = Number(parsed.lines);
  return parsed;
}

function applyRuntimeOverrides(gates, parsedArgs) {
  if (parsedArgs["max-pages"] !== undefined) {
    gates.gates.pages = gates.gates.pages || {
      enabled: true,
      severity: "error",
      reworkAgent: "resume-writer"
    };
    gates.gates.pages.maximum = parsedArgs["max-pages"];
  }
}

function buildSnapshot(raw, text, parsedArgs) {
  const words = text.match(/\b[\w'+-]+\b/g) || [];
  const achievementBullets = bulletsForSection(raw, "Professional Experience", "Education");
  const sectionNames = extractSectionNames(raw);
  const inferredSections = [];

  if (raw.match(/^#\s+\S+/m)) inferredSections.push("Contact");
  const nonEmpty = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  if (nonEmpty.length > 1 && !nonEmpty[1].startsWith("#")) inferredSections.push("Headline");

  const measurementWarnings = [];
  let pageCount;
  let pageCountSource = "unmeasured";
  if (parsedArgs.pdf) {
    pageCount = countPdfPages(parsedArgs.pdf);
    pageCountSource = "pdf";
  } else if (parsedArgs["allow-manual-pages"] && parsedArgs.pages !== undefined) {
    pageCount = parsedArgs.pages;
    pageCountSource = "manual";
  }

  let renderedTextLineCount;
  let renderedTextLineCountSource = "unmeasured";
  if (parsedArgs["allow-manual-lines"] && parsedArgs.lines !== undefined) {
    renderedTextLineCount = parsedArgs.lines;
    renderedTextLineCountSource = "manual";
  }

  if (!parsedArgs.pdf) {
    measurementWarnings.push("pageCount was not measured from a rendered PDF.");
  }
  if (parsedArgs.pages !== undefined && pageCountSource !== "manual") {
    measurementWarnings.push("manual page count was ignored because --allow-manual-pages was not set or a PDF measurement was available.");
  }
  if (pageCountSource === "manual") {
    measurementWarnings.push("pageCount used a manual override.");
  }
  if (renderedTextLineCount === undefined) {
    measurementWarnings.push("renderedTextLineCount was not measured; sourceTextLineCount is reported separately.");
  }
  if (parsedArgs.lines !== undefined && renderedTextLineCountSource !== "manual") {
    measurementWarnings.push("manual rendered line count was ignored because --allow-manual-lines was not set.");
  }
  if (renderedTextLineCountSource === "manual") {
    measurementWarnings.push("renderedTextLineCount used a manual override.");
  }

  let pageUtilization;
  if (parsedArgs.html) {
    try {
      pageUtilization = measureResumeHtmlLayout({
        htmlPath: parsedArgs.html,
        browserPath: parsedArgs.browser
      });
    } catch (error) {
      measurementWarnings.push(`pageUtilizationPercent could not be measured: ${error.message}`);
    }
  }

  return {
    resumeText: text,
    pageCount,
    pageCountSource,
    wordCount: words.length,
    charactersIncludingSpaces: text.length,
    renderedTextLineCount,
    renderedTextLineCountSource,
    pageUtilizationPercent: pageUtilization?.pageUtilizationPercent,
    bottomWhitespacePercent: pageUtilization?.bottomWhitespacePercent,
    layoutMeasurement: pageUtilization,
    sourceTextLineCount: nonEmpty.length,
    bulletCharacterCounts: achievementBullets.map((bullet) => bullet.length),
    achievementBulletCount: achievementBullets.length,
    sectionNames: unique([...sectionNames, ...inferredSections]),
    inferredSections: unique(inferredSections),
    artifactNames: artifactNamesFromArgs(parsedArgs),
    measurementWarnings
  };
}

function evaluate(gates, snapshot, postingText, parsedArgs) {
  const results = [];
  addRange(results, "pages", gates.gates.pages, snapshot.pageCount);
  addRange(results, "words", gates.gates.words, snapshot.wordCount);
  addRange(results, "charactersIncludingSpaces", gates.gates.charactersIncludingSpaces, snapshot.charactersIncludingSpaces);
  addRange(results, "renderedTextLines", gates.gates.renderedTextLines, snapshot.renderedTextLineCount);
  addRange(results, "pageUtilizationPercent", gates.gates.pageUtilizationPercent, snapshot.pageUtilizationPercent);
  addBulletCharacters(results, gates.gates.bulletCharacters, snapshot.bulletCharacterCounts);
  addRange(results, "achievementBullets", gates.gates.achievementBullets, snapshot.achievementBulletCount);
  addRequiredSections(results, gates.gates.requiredSections, snapshot.sectionNames, snapshot.inferredSections);
  addKeywordMatch(results, gates.gates.keywordMatch, snapshot.resumeText, postingText);
  addUnsupportedTerms(results, gates.gates.unsupportedTerms, snapshot.resumeText);
  addTargetBranding(results, gates.gates.targetBranding, snapshot.resumeText, snapshot.artifactNames);
  addPrivateLeak(results, gates.gates.privateLeak, snapshot.resumeText, parsedArgs.pdf);

  const blockingFailures = results.filter((result) => !result.passed && result.severity === "error");
  const agentNotifications = results
    .filter((result) => !result.passed)
    .map((result) => ({
      agent: result.reworkAgent,
      gateId: result.gateId,
      severity: result.severity,
      message: result.message
    }));

  return {
    passed: blockingFailures.length === 0,
    checkedAt: new Date().toISOString(),
    measurements: snapshot,
    results,
    agentNotifications,
    iterationLimit: gates.agentRouting.maxIterations,
    defaultReworkSkill: gates.agentRouting.defaultReworkSkill
  };
}

function addRange(results, gateId, gate, measured) {
  if (!gate?.enabled) return;

  if (measured === undefined || Number.isNaN(measured)) {
    results.push(result(gateId, gate, false, measured, "measurement required", `${gateId} could not be measured.`));
    return;
  }

  const tooLow = gate.minimum !== undefined && measured < gate.minimum;
  const tooHigh = gate.maximum !== undefined && measured > gate.maximum;
  const outsideIdeal = gate.idealLow !== undefined && gate.idealHigh !== undefined && (measured < gate.idealLow || measured > gate.idealHigh);
  results.push(result(gateId, gate, !tooLow && !tooHigh && !outsideIdeal, measured, describeRange(gate), rangeMessage(gateId, gate, measured, tooLow, tooHigh, outsideIdeal)));
}

function addBulletCharacters(results, gate, counts) {
  if (!gate?.enabled) return;
  const failed = counts.filter((count) => (gate.minimum !== undefined && count < gate.minimum) || (gate.maximum !== undefined && count > gate.maximum));
  const outsideIdeal = counts.filter((count) => (gate.idealLow !== undefined && count < gate.idealLow) || (gate.idealHigh !== undefined && count > gate.idealHigh));
  const idealRange = gate.idealLow !== undefined && gate.idealHigh !== undefined ? `${gate.idealLow}-${gate.idealHigh}` : undefined;
  const hardExpected = describeHardRange(gate);
  results.push(result(
    "bulletCharacters",
    gate,
    failed.length === 0,
    failed.length,
    `every achievement bullet ${hardExpected}`,
    failed.length === 0 ? "No achievement bullets violate hard character limits." : `${failed.length} achievement bullets are outside hard character limits.`
  ));
  if (idealRange && outsideIdeal.length > 0) {
    results.push(result(
      "bulletCharacterIdeals",
      { ...gate, severity: "warning" },
      false,
      outsideIdeal.length,
      `achievement bullet ideal ${idealRange}`,
      `${outsideIdeal.length} achievement bullets are outside ideal ${idealRange}.`
    ));
  }
}

function addRequiredSections(results, gate, sectionNames, inferredSections = []) {
  if (!gate?.enabled) return;
  const available = new Set(sectionNames.map(normalize));
  const missing = gate.sections.filter((section) => !available.has(normalize(section)));
  const inferredRequired = inferredSections.filter((section) => gate.sections.map(normalize).includes(normalize(section)));
  results.push(result(
    "requiredSections",
    gate,
    missing.length === 0,
    gate.sections.length - missing.length,
    gate.sections.join(", "),
    missing.length === 0
      ? `All required sections are present${inferredRequired.length > 0 ? `; inferred from resume header: ${inferredRequired.join(", ")}` : ""}.`
      : `Missing sections: ${missing.join(", ")}.`
  ));
}

function addKeywordMatch(results, gate, resumeText, postingText) {
  if (!gate?.enabled) return;
  const usedConfiguredKeywords = Boolean(gate.requiredKeywords?.length);
  const keywords = usedConfiguredKeywords ? gate.requiredKeywords : extractKeywords(postingText);
  const ignored = new Set((gate.ignoredKeywords || []).map(normalize));
  const filtered = unique(keywords).filter((keyword) => !ignored.has(normalize(keyword)));

  if (filtered.length === 0) {
    results.push(result("keywordMatch", gate, false, undefined, `${gate.minimumPercent}% keyword match`, "No keywords were available to compare."));
    return;
  }

  const haystack = normalizeSearch(resumeText);
  const matched = filtered.filter((keyword) => haystack.includes(normalizeSearch(keyword)));
  const percent = Math.round((matched.length / filtered.length) * 100);
  results.push(result(
    "keywordMatch",
    gate,
    percent >= gate.minimumPercent,
    percent,
    `${gate.minimumPercent}% keyword match against ${usedConfiguredKeywords ? "configured required keywords" : "extracted posting keywords"}`,
    percent >= gate.minimumPercent
      ? `Keyword match passed at ${percent}% against ${usedConfiguredKeywords ? "configured required keywords" : "extracted posting keywords"}.`
      : `Keyword match is ${percent}% against ${usedConfiguredKeywords ? "configured required keywords" : "extracted posting keywords"}; missing: ${filtered.filter((keyword) => !matched.includes(keyword)).join(", ")}.`
  ));
}

function addUnsupportedTerms(results, gate, resumeText) {
  if (!gate?.enabled) return;
  const haystack = normalizeSearch(resumeText);
  const matched = gate.terms.filter((term) => haystack.includes(normalizeSearch(term)));
  results.push(result(
    "unsupportedTerms",
    gate,
    matched.length === 0,
    matched.length,
    "no unsupported technology or experience terms",
    matched.length === 0 ? "No unsupported terms matched." : `Unsupported terms matched: ${matched.join(", ")}.`
  ));
}

function addTargetBranding(results, gate, resumeText, artifactNames = []) {
  if (!gate?.enabled) return;
  const targetNames = gate.targetNames || [];
  const textMatches = gate.checkResumeText === false
    ? []
    : targetNames.filter((name) => normalizeSearch(resumeText).includes(normalizeSearch(name)));
  const filenameMatches = gate.checkArtifactNames === false
    ? []
    : artifactNames.flatMap((artifactName) =>
      targetNames
        .filter((name) => normalizeSearch(artifactName).includes(normalizeSearch(name)))
        .map((name) => `${artifactName} -> ${name}`)
    );
  const matched = [
    ...textMatches.map((name) => `resume text -> ${name}`),
    ...filenameMatches
  ];
  results.push(result(
    "targetBranding",
    gate,
    matched.length === 0,
    matched.length,
    "no target company name in applicant-facing resume text or artifact filenames",
    matched.length === 0 ? "No target-branding matches found." : `Target-branding matches found: ${matched.join(", ")}.`
  ));
}

function addPrivateLeak(results, gate, resumeText, pdfPath) {
  if (!gate?.enabled) return;
  const artifactText = pdfPath ? fs.readFileSync(pdfPath, "latin1") : "";
  const textToCheck = `${resumeText}\n${artifactText}`;
  const matched = gate.patterns.filter((pattern) => new RegExp(pattern, "i").test(textToCheck));
  results.push(result(
    "privateLeak",
    gate,
    matched.length === 0,
    matched.length,
    "no private or internal-only text",
    matched.length === 0 ? "No private-leak patterns matched." : `Private-leak patterns matched: ${matched.join(", ")}.`
  ));
}

function result(gateId, gate, passed, measured, expected, message) {
  return {
    gateId,
    passed,
    severity: gate.severity,
    measured,
    expected,
    message,
    reworkAgent: gate.reworkAgent
  };
}

function bulletsForSection(raw, startSection, endSection) {
  const lines = raw.split("\n");
  const output = [];
  let active = false;
  for (const line of lines) {
    if (line.startsWith(`## ${startSection}`)) {
      active = true;
      continue;
    }
    if (active && line.startsWith(`## ${endSection}`)) break;
    if (active && line.trim().startsWith("- ")) output.push(line.trim().slice(2));
  }
  return output;
}

function extractSectionNames(raw) {
  const names = [];
  for (const match of raw.matchAll(/^##\s+(.+)$/gm)) names.push(match[1].trim());
  return names;
}

function textFromMarkup(raw) {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function artifactNamesFromArgs(parsedArgs) {
  return unique([
    parsedArgs.resume,
    parsedArgs.html,
    parsedArgs.pdf,
    parsedArgs.out,
    parsedArgs["artifact-name"]
  ]
    .filter(Boolean)
    .map((filePath) => path.basename(String(filePath))));
}

function describeRange(gate) {
  const parts = [];
  if (gate.minimum !== undefined) parts.push(`minimum ${gate.minimum}`);
  if (gate.idealLow !== undefined && gate.idealHigh !== undefined) parts.push(`ideal ${gate.idealLow}-${gate.idealHigh}`);
  if (gate.maximum !== undefined) parts.push(`maximum ${gate.maximum}`);
  return parts.join(", ") || "configured range";
}

function describeHardRange(gate) {
  const parts = [];
  if (gate.minimum !== undefined) parts.push(`minimum ${gate.minimum}`);
  if (gate.maximum !== undefined) parts.push(`maximum ${gate.maximum}`);
  return parts.join(", ") || "configured hard limits";
}

function rangeMessage(gateId, gate, measured, tooLow, tooHigh, outsideIdeal) {
  if (tooLow) return `${gateId} is ${measured}, below ${gate.minimum}.`;
  if (tooHigh) return `${gateId} is ${measured}, above ${gate.maximum}.`;
  if (outsideIdeal) return `${gateId} is ${measured}, within hard limits but outside ideal ${gate.idealLow}-${gate.idealHigh}.`;
  return `${gateId} is ${measured}, within ${describeRange(gate)}.`;
}

function extractKeywords(text) {
  return unique(text.split(/[^A-Za-z0-9+#.]+/).map((term) => term.trim()).filter((term) => term.length >= 3));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalize(value) {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeSearch(value) {
  return normalize(value).replace(/[^\w+#.]+/g, " ");
}
