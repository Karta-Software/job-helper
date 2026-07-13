#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { measureResumeHtmlLayout } from "../src/resumes/layout-utilization.mjs";
import { countPdfPages } from "../src/resumes/pdf-page-count.mjs";
import { measurePdfVisualWhitespace } from "../src/resumes/pdf-visual-whitespace.mjs";

const args = parseArgs(process.argv.slice(2));

if (!args.resume || !args.gates) {
  console.error("Usage: node scripts/check-resume-quality.mjs --resume <file> --gates <file> [--posting <file>] [--pdf <file>] [--html <file>] [--browser <edge-or-chrome-path>] [--ghostscript <gs-path>] [--max-pages 1] [--allow-manual-pages --pages 1] [--allow-manual-lines --lines 80] [--out <file>]");
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

  let pdfVisualWhitespace;
  if (parsedArgs.pdf) {
    try {
      pdfVisualWhitespace = measurePdfVisualWhitespace({
        pdfPath: parsedArgs.pdf,
        ghostscriptPath: parsedArgs.ghostscript
      });
    } catch (error) {
      measurementWarnings.push(`pdfVisualWhitespace could not be measured: ${error.message}`);
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
    visualBottomGapPercent: pdfVisualWhitespace?.visualBottomGapPercent,
    visualBottomToReferenceMarginRatio: pdfVisualWhitespace?.visualBottomToReferenceMarginRatio,
    pdfVisualWhitespace,
    sourceTextLineCount: nonEmpty.length,
    achievementBullets,
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
  addRange(results, "visualBottomGapPercent", gates.gates.visualBottomGapPercent, snapshot.visualBottomGapPercent);
  addRange(results, "visualBottomToReferenceMarginRatio", gates.gates.visualBottomToReferenceMarginRatio, snapshot.visualBottomToReferenceMarginRatio);
  addBulletCharacters(results, gates.gates.bulletCharacters, snapshot.bulletCharacterCounts);
  addRange(results, "achievementBullets", gates.gates.achievementBullets, snapshot.achievementBulletCount);
  addRequiredSections(results, gates.gates.requiredSections, snapshot.sectionNames, snapshot.inferredSections);
  addKeywordMatch(results, gates.gates.keywordMatch, snapshot.resumeText, postingText);
  addMetricSignals(results, gates.gates.metricSignals, snapshot.resumeText);
  addNumericConsistency(results, gates.gates.numericConsistency, snapshot.resumeText);
  addApprovedSkillClaims(results, gates.gates.approvedSkillClaims, snapshot.resumeText);
  addEducationWording(results, gates.gates.educationWording, snapshot.resumeText);
  addUnsupportedTerms(results, gates.gates.unsupportedTerms, snapshot.resumeText);
  addTargetBranding(results, gates.gates.targetBranding, snapshot.resumeText, snapshot.artifactNames);
  addReviewerPrinciples(results, gates.gates.reviewerPrinciples, snapshot);
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

function addMetricSignals(results, gate, resumeText) {
  if (!gate?.enabled) return;
  const minimum = gate.minimumCount ?? 1;
  const patterns = gate.patterns || [];
  const matched = patterns.filter((pattern) => matchesPatternOrTerm(resumeText, pattern));
  results.push(result(
    "metricSignals",
    gate,
    matched.length >= minimum,
    matched.length,
    `at least ${minimum} configured metric or proof signals`,
    matched.length >= minimum
      ? `${matched.length} configured metric or proof signals matched: ${matched.join(", ")}.`
      : `${matched.length} configured metric or proof signals matched, below ${minimum}; missing: ${patterns.filter((pattern) => !matched.includes(pattern)).join(", ")}.`
  ));
}

function addNumericConsistency(results, gate, resumeText) {
  if (!gate?.enabled) return;

  const issues = [];
  const claims = new Map();
  const configuredClaims = gate.claims || [];

  for (const claim of configuredClaims) {
    const extracted = extractNumericClaim(resumeText, claim, issues);
    if (extracted) claims.set(extracted.id, extracted);
  }

  addNumericForbiddenPatternIssues(issues, gate, resumeText);

  for (const relationship of gate.relationships || []) {
    evaluateNumericRelationship(issues, claims, relationship);
  }

  const passed = issues.length === 0;
  const claimSummary = [...claims.values()]
    .map((claim) => `${claim.id}=${formatNumericValue(claim.value)}${claim.unit ? ` ${claim.unit}` : ""}`)
    .join(", ");

  results.push(result(
    "numericConsistency",
    gate,
    passed,
    passed ? claims.size : issues.length,
    "configured numeric claims are clear and mathematically consistent",
    passed
      ? `Numeric consistency passed for ${claims.size} configured claims${claimSummary ? `: ${claimSummary}` : ""}.`
      : `Numeric consistency issues: ${issues.join("; ")}.`
  ));
}

function extractNumericClaim(resumeText, claim, issues) {
  if (!claim?.id) {
    issues.push("A numeric claim is missing an id");
    return undefined;
  }
  if (!claim.pattern) {
    issues.push(`Numeric claim ${claim.id} is missing a pattern`);
    return undefined;
  }

  let regex;
  try {
    regex = new RegExp(claim.pattern, claim.flags || "i");
  } catch (error) {
    issues.push(`Numeric claim ${claim.id} has an invalid pattern: ${error.message}`);
    return undefined;
  }

  const match = regex.exec(resumeText);
  if (!match) {
    if (claim.required !== false) {
      issues.push(`Missing numeric claim ${claim.id}${claim.label ? ` (${claim.label})` : ""}`);
    }
    return undefined;
  }

  const valueGroup = claim.valueGroup ?? 1;
  const value = parseNumericValue(match[valueGroup]);
  if (!Number.isFinite(value)) {
    issues.push(`Numeric claim ${claim.id} matched but did not expose a parseable number`);
    return undefined;
  }

  return {
    id: claim.id,
    label: claim.label || claim.id,
    unit: claim.unit,
    value,
    text: match[0]
  };
}

function addNumericForbiddenPatternIssues(issues, gate, resumeText) {
  for (const check of gate.forbiddenPatterns || []) {
    let regex;
    try {
      regex = new RegExp(check.pattern, check.flags || "i");
    } catch (error) {
      issues.push(`Forbidden numeric pattern ${check.id || check.pattern} is invalid: ${error.message}`);
      continue;
    }
    if (regex.test(resumeText)) {
      issues.push(check.message || `Forbidden numeric pattern matched: ${check.id || check.pattern}`);
    }
  }
}

function evaluateNumericRelationship(issues, claims, relationship) {
  const id = relationship.id || relationship.operator || "numeric relationship";
  const operator = relationship.operator;
  const tolerance = relationship.tolerance ?? 0;

  if (operator === "sumEquals") {
    const addends = relationship.addends || [];
    const missing = addends.filter((claimId) => !claims.has(claimId));
    const total = resolveRelationshipValue(claims, relationship.total ?? relationship.right ?? relationship.value);
    if (missing.length > 0 || !total) {
      issues.push(`${id} cannot be checked because numeric claims are missing: ${[...missing, total ? "" : "total"].filter(Boolean).join(", ")}`);
      return;
    }

    const sum = addends.reduce((accumulator, claimId) => accumulator + claims.get(claimId).value, 0);
    if (Math.abs(sum - total.value) > tolerance) {
      issues.push(relationship.message || `${id} failed: ${addends.join(" + ")} = ${formatNumericValue(sum)}, expected ${formatNumericValue(total.value)}`);
    }
    return;
  }

  const left = resolveRelationshipValue(claims, relationship.left);
  const right = resolveRelationshipValue(claims, relationship.right ?? relationship.value);
  if (!left || !right) {
    issues.push(`${id} cannot be checked because ${!left ? "left" : "right"} numeric value is missing`);
    return;
  }

  if (!compareNumericValues(left.value, operator, right.value, tolerance)) {
    issues.push(relationship.message || `${id} failed: ${left.label} ${formatNumericValue(left.value)} ${operator} ${right.label} ${formatNumericValue(right.value)}`);
  }
}

function resolveRelationshipValue(claims, keyOrValue) {
  if (typeof keyOrValue === "string" && claims.has(keyOrValue)) return claims.get(keyOrValue);
  const value = parseNumericValue(keyOrValue);
  if (!Number.isFinite(value)) return undefined;
  return {
    label: String(keyOrValue),
    value
  };
}

function compareNumericValues(left, operator, right, tolerance) {
  switch (operator) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "=":
    case "==":
      return Math.abs(left - right) <= tolerance;
    default:
      return false;
  }
}

function parseNumericValue(value) {
  if (typeof value === "number") return value;
  if (value === undefined || value === null) return Number.NaN;
  return Number(String(value).replace(/,/g, "").trim());
}

function formatNumericValue(value) {
  return Number.isInteger(value) ? value.toLocaleString("en-US") : String(value);
}

function addUnsupportedTerms(results, gate, resumeText) {
  if (!gate?.enabled) return;
  const matched = gate.terms.filter((term) => containsSearchTerm(resumeText, term));
  results.push(result(
    "unsupportedTerms",
    gate,
    matched.length === 0,
    matched.length,
    "no unsupported technology or experience terms",
    matched.length === 0 ? "No unsupported terms matched." : `Unsupported terms matched: ${matched.join(", ")}.`
  ));
}

function addApprovedSkillClaims(results, gate, resumeText) {
  if (!gate?.enabled) return;
  const approved = new Set((gate.approvedTerms || []).map(normalizeSearch));
  const claimed = unique(gate.claimTerms || []).filter((term) => containsSearchTerm(resumeText, term));
  const unapproved = claimed.filter((term) => !approved.has(normalizeSearch(term)));
  results.push(result(
    "approvedSkillClaims",
    gate,
    unapproved.length === 0,
    unapproved.length,
    "no skill/tool claims outside the approved skill inventory",
    unapproved.length === 0 ? "All configured skill claims are approved." : `Unapproved skill claims matched: ${unapproved.join(", ")}.`
  ));
}

function addEducationWording(results, gate, resumeText) {
  if (!gate?.enabled) return;
  const missing = (gate.requiredTerms || []).filter((term) => !containsSearchTerm(resumeText, term));
  const forbidden = (gate.forbiddenTerms || []).filter((term) => containsSearchTerm(resumeText, term));
  const messages = [];
  if (missing.length > 0) messages.push(`missing required education wording: ${missing.join(", ")}`);
  if (forbidden.length > 0) messages.push(`forbidden education wording matched: ${forbidden.join(", ")}`);
  results.push(result(
    "educationWording",
    gate,
    missing.length === 0 && forbidden.length === 0,
    missing.length + forbidden.length,
    "required education wording present and stale degree labels absent",
    messages.length === 0 ? "Education wording matched required terms and no forbidden stale degree labels matched." : messages.join("; ")
  ));
}

function addTargetBranding(results, gate, resumeText, artifactNames = []) {
  if (!gate?.enabled) return;
  const targetNames = gate.targetNames || [];
  const textMatches = gate.checkResumeText === false
    ? []
    : targetNames.filter((name) => containsSearchTerm(resumeText, name));
  const filenameMatches = gate.checkArtifactNames === false
    ? []
    : artifactNames.flatMap((artifactName) =>
      targetNames
        .filter((name) => containsSearchTerm(artifactName, name))
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

function addReviewerPrinciples(results, gate, snapshot) {
  if (!gate?.enabled) return;

  addLeadershipNearTop(results, gate, gate.leadershipNearTop, snapshot);
  addLedTeamWording(results, gate, gate.ledTeamWording, snapshot.resumeText);
  addTopHalfCarriesReview(results, gate, gate.topHalfCarriesReview, snapshot.resumeText);
  addConsistentEmphasis(results, gate, gate.consistentEmphasis, snapshot.achievementBullets);
  addTeamLedWorkNotFlattened(results, gate, gate.teamLedWorkNotFlattened, snapshot.achievementBullets);
  addFounderSignalBalance(results, gate, gate.founderSignalBalance, snapshot.resumeText);
}

function addLeadershipNearTop(results, parentGate, check, snapshot) {
  if (!check?.enabled) return;
  const maxTextPercent = check.maxTextPercent ?? 35;
  const requiredTerms = check.requiredTerms || [];
  const misplaced = termsOutsideTextPercent(snapshot.resumeText, requiredTerms, maxTextPercent);
  results.push(result(
    "reviewerPrinciples.leadershipNearTop",
    principleGate(parentGate, check),
    misplaced.length === 0,
    requiredTerms.length - misplaced.length,
    `configured leadership terms within top ${maxTextPercent}% of resume text`,
    misplaced.length === 0
      ? `Leadership and team-scope terms appear within the top ${maxTextPercent}% of resume text.`
      : `Leadership and team-scope terms missing from the top ${maxTextPercent}% of resume text: ${misplaced.join(", ")}.`
  ));
}

function addLedTeamWording(results, parentGate, check, resumeText) {
  if (!check?.enabled) return;
  const requiredPatterns = check.requiredPatterns || [];
  const missing = requiredPatterns.filter((pattern) => !matchesPatternOrTerm(resumeText, pattern));
  results.push(result(
    "reviewerPrinciples.ledTeamWording",
    principleGate(parentGate, check),
    missing.length === 0,
    requiredPatterns.length - missing.length,
    `supportable team wording: ${requiredPatterns.join(", ")}`,
    missing.length === 0
      ? "Supportable team-size wording is present."
      : `Supportable team-size wording is missing: ${missing.join(", ")}.`
  ));
}

function addTopHalfCarriesReview(results, parentGate, check, resumeText) {
  if (!check?.enabled) return;
  const maxTextPercent = check.maxTextPercent ?? 50;
  const requiredTerms = check.requiredTerms || [];
  const misplaced = termsOutsideTextPercent(resumeText, requiredTerms, maxTextPercent);
  results.push(result(
    "reviewerPrinciples.topHalfCarriesReview",
    principleGate(parentGate, check),
    misplaced.length === 0,
    requiredTerms.length - misplaced.length,
    `configured high-signal terms within top ${maxTextPercent}% of resume text`,
    misplaced.length === 0
      ? `Top-half review terms appear within the top ${maxTextPercent}% of resume text.`
      : `Top-half review terms missing from the top ${maxTextPercent}% of resume text: ${misplaced.join(", ")}.`
  ));
}

function addConsistentEmphasis(results, parentGate, check, achievementBullets) {
  if (!check?.enabled) return;
  const mode = check.mode || "no-emphasis-in-bullets";
  const emphasizedBullets = achievementBullets.filter(hasInlineEmphasis);
  const passed = mode === "no-emphasis-in-bullets" ? emphasizedBullets.length === 0 : true;
  results.push(result(
    "reviewerPrinciples.consistentEmphasis",
    principleGate(parentGate, check),
    passed,
    emphasizedBullets.length,
    mode === "no-emphasis-in-bullets" ? "no bold or italic emphasis inside achievement bullets" : "configured emphasis mode",
    passed
      ? "Achievement bullets do not use inline emphasis."
      : `${emphasizedBullets.length} achievement bullets use inline emphasis; keep emphasis consistent outside bullets or apply a deliberate full-section pattern.`
  ));
}

function addTeamLedWorkNotFlattened(results, parentGate, check, achievementBullets) {
  if (!check?.enabled) return;
  const leadershipTerms = check.leadershipTerms || [];
  const minimum = check.minimumLeadershipBullets ?? 1;
  const leadershipBulletCount = achievementBullets.filter((bullet) =>
    leadershipTerms.some((term) => containsSearchTerm(bullet, term))
  ).length;
  results.push(result(
    "reviewerPrinciples.teamLedWorkNotFlattened",
    principleGate(parentGate, check),
    leadershipBulletCount >= minimum,
    leadershipBulletCount,
    `at least ${minimum} leadership or team-scope bullets`,
    leadershipBulletCount >= minimum
      ? `${leadershipBulletCount} leadership or team-scope bullets use configured language.`
      : `${leadershipBulletCount} leadership or team-scope bullets found; expected at least ${minimum} so team-led work is not flattened into lone-IC wording.`
  ));
}

function addFounderSignalBalance(results, parentGate, check, resumeText) {
  if (!check?.enabled) return;

  const topTextPercent = check.topTextPercent ?? 35;
  const proofTextPercent = check.proofTextPercent ?? 65;
  const topText = textWithinPercent(resumeText, topTextPercent);
  const proofText = textWithinPercent(resumeText, proofTextPercent);
  const targetMatch = firstTermMatch(topText, check.targetRoleTerms || []);
  const founderMatch = firstTermMatch(topText, check.founderTerms || []);
  const targetRolePassed = targetMatch && founderMatch && targetMatch.index <= founderMatch.index;

  results.push(result(
    "reviewerPrinciples.founderTargetRoleTranslation",
    principleGate(parentGate, check),
    Boolean(targetRolePassed),
    targetRolePassed ? 1 : 0,
    `target role appears before founder identity within top ${topTextPercent}% of resume text`,
    targetRolePassed
      ? `Target role ${targetMatch.term} appears before founder identity ${founderMatch.term} in the opening.`
      : `Put a configured target role before the founder identity within the top ${topTextPercent}% of resume text.`
  ));

  const proofGroups = check.proofGroups || [];
  const matchedProofGroups = proofGroups.filter((group) =>
    (group.terms || []).some((term) => containsSearchTerm(proofText, term))
  );
  const minimumProofGroups = check.minimumProofGroups ?? proofGroups.length;
  results.push(result(
    "reviewerPrinciples.founderOperatingProof",
    principleGate(parentGate, check),
    matchedProofGroups.length >= minimumProofGroups,
    matchedProofGroups.length,
    `at least ${minimumProofGroups} founder operating-proof groups within top ${proofTextPercent}% of resume text`,
    matchedProofGroups.length >= minimumProofGroups
      ? `Founder operating proof covers: ${matchedProofGroups.map((group) => group.id).join(", ")}.`
      : `Founder operating proof covers ${matchedProofGroups.length} groups; expected ${minimumProofGroups}. Missing options: ${proofGroups.filter((group) => !matchedProofGroups.includes(group)).map((group) => group.id).join(", ")}.`
  ));

  addFounderTermCountResult(
    results,
    parentGate,
    check,
    "reviewerPrinciples.founderCollaboration",
    proofText,
    check.collaborationTerms || [],
    check.minimumCollaborationMatches ?? 1,
    `collaboration signals within top ${proofTextPercent}% of resume text`
  );
  addFounderTermCountResult(
    results,
    parentGate,
    check,
    "reviewerPrinciples.founderTechnicalDepth",
    proofText,
    check.technicalTerms || [],
    check.minimumTechnicalMatches ?? 1,
    `technical-depth signals within top ${proofTextPercent}% of resume text`
  );

  const riskyTerms = (check.forbiddenTerms || []).filter((term) => containsSearchTerm(resumeText, term));
  results.push(result(
    "reviewerPrinciples.founderRiskLanguage",
    principleGate(parentGate, check),
    riskyTerms.length === 0,
    riskyTerms.length,
    "no risk-amplifying founder shorthand",
    riskyTerms.length === 0
      ? "No risk-amplifying founder shorthand found."
      : `Risk-amplifying founder shorthand found: ${riskyTerms.join(", ")}.`
  ));

  const attributionPatterns = check.forbiddenAttributionPatterns || [];
  const attributionMatches = attributionPatterns.filter((pattern) => matchesPatternOrTerm(resumeText, pattern));
  results.push(result(
    "reviewerPrinciples.founderAttributionBoundaries",
    principleGate(parentGate, check),
    attributionMatches.length === 0,
    attributionMatches.length,
    "no configured lone-hero or unsupported personal-attribution patterns",
    attributionMatches.length === 0
      ? "Founder attribution stays within configured team and company boundaries."
      : `Founder attribution crosses configured boundaries: ${attributionMatches.join(", ")}.`
  ));
}

function addFounderTermCountResult(results, parentGate, check, gateId, text, terms, minimum, label) {
  const matchedTerms = terms.filter((term) => containsSearchTerm(text, term));
  results.push(result(
    gateId,
    principleGate(parentGate, check),
    matchedTerms.length >= minimum,
    matchedTerms.length,
    `at least ${minimum} configured ${label}`,
    matchedTerms.length >= minimum
      ? `Found ${matchedTerms.length} configured ${label}: ${matchedTerms.join(", ")}.`
      : `Found ${matchedTerms.length} configured ${label}; expected at least ${minimum}.`
  ));
}

function textWithinPercent(text, percent) {
  const normalized = normalizeSearch(text);
  return normalized.slice(0, Math.floor(normalized.length * (percent / 100)));
}

function firstTermMatch(text, terms) {
  return terms
    .map((term) => ({ term, index: text.indexOf(normalizeSearch(term)) }))
    .filter((match) => match.index >= 0)
    .sort((left, right) => left.index - right.index)[0];
}

function termsOutsideTextPercent(text, terms, maxTextPercent) {
  const haystack = normalizeSearch(text);
  const maxIndex = Math.floor(haystack.length * (maxTextPercent / 100));
  return terms.filter((term) => {
    const index = haystack.indexOf(normalizeSearch(term));
    return index < 0 || index > maxIndex;
  });
}

function matchesPatternOrTerm(text, pattern) {
  try {
    if (new RegExp(pattern, "i").test(text)) return true;
  } catch {
    // Fall back to normalized term matching for configs that use plain text.
  }
  return containsSearchTerm(text, pattern);
}

function hasInlineEmphasis(value) {
  return /(^|[^\\])(\*\*|__|\*|_)|<\/?(strong|b|em|i)\b/i.test(value);
}

function principleGate(parentGate, check) {
  return {
    severity: check.severity || parentGate.severity,
    reworkAgent: check.reworkAgent || parentGate.reworkAgent
  };
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
  return normalize(value).replace(/[^A-Za-z0-9+#.]+/g, " ");
}

function containsSearchTerm(value, term) {
  const haystack = ` ${normalizeSearch(value)} `;
  const needle = normalizeSearch(term);
  if (!needle) return false;
  const pattern = new RegExp(`\\s${escapeRegExp(needle).replace(/\s+/g, "\\s+")}\\s`, "i");
  return pattern.test(haystack);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
