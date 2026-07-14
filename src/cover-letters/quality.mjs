const DEFAULT_THRESHOLDS = { send: 85, revise: 75 };
const REQUIRED_GATE_IDS = [
  "wordCount",
  "pages",
  "targetIdentity",
  "evidenceAnchors",
  "needEvidenceBridges",
  "companySpecificity",
  "motivationReview",
  "resumeComplement",
  "voiceReview",
  "forbiddenPhrases"
];
const REQUIRED_RUBRIC_IDS = [
  "targetAudience",
  "whyCompanyRoleNow",
  "employerProblem",
  "evidenceConnection",
  "resumeComplement",
  "voice",
  "evidenceAccuracy",
  "structure"
];

export function decisionFromScore(score, hardGatesPassed, thresholds = DEFAULT_THRESHOLDS) {
  if (!hardGatesPassed) return "DO NOT SEND";
  if (score >= thresholds.send) return "SEND";
  if (score >= thresholds.revise) return "REVISE";
  return "REWRITE";
}

export function evaluateCoverLetterQuality(config, snapshot) {
  const text = normalize(snapshot.text || "");
  const results = [];
  const gates = config.gates || {};

  const missingGates = REQUIRED_GATE_IDS.filter((gateId) => !gates[gateId]);
  const rubricIds = new Set((config.rubric?.criteria || []).map((criterion) => criterion.id));
  const missingCriteria = REQUIRED_RUBRIC_IDS.filter((criterionId) => !rubricIds.has(criterionId));
  const configurationComplete = missingGates.length === 0 && missingCriteria.length === 0;
  const configurationProblems = [];
  if (missingGates.length > 0) configurationProblems.push(`missing gates: ${missingGates.join(", ")}`);
  if (missingCriteria.length > 0) configurationProblems.push(`missing rubric criteria: ${missingCriteria.join(", ")}`);
  addResult(results, "configCompleteness", configurationComplete, {
    severity: "error",
    reworkAgent: "cover-letter-critic"
  }, configurationComplete
    ? "All required gates and rubric criteria are configured."
    : `Cover-letter quality configuration is incomplete: ${configurationProblems.join("; ")}.`);

  if (gates.wordCount) {
    const { minimum = 0, maximum = Number.POSITIVE_INFINITY } = gates.wordCount;
    const passed = snapshot.wordCount >= minimum && snapshot.wordCount <= maximum;
    addResult(results, "wordCount", passed, gates.wordCount,
      passed
        ? `Word count ${snapshot.wordCount} is within ${minimum}-${maximum}.`
        : `Word count ${snapshot.wordCount} is outside ${minimum}-${maximum}.`);
  }

  if (gates.pages) {
    const measured = Number.isFinite(snapshot.pageCount);
    const passed = measured && snapshot.pageCount <= gates.pages.maximum;
    addResult(results, "pages", passed, gates.pages,
      measured
        ? `Rendered page count ${snapshot.pageCount}; maximum ${gates.pages.maximum}.`
        : "Rendered page count was not measured from a PDF.");
  }

  if (gates.targetIdentity) {
    const missing = missingTerms(text, gates.targetIdentity.requiredTerms || []);
    addResult(results, "targetIdentity", missing.length === 0, gates.targetIdentity,
      missing.length === 0
        ? "Company, role, requisition, and audience terms are present."
        : `Missing target identity terms: ${missing.join(", ")}.`);
  }

  if (gates.evidenceAnchors) {
    const statuses = gates.evidenceAnchors.supportedStatuses || ["supported"];
    let passedCount = 0;
    for (const anchor of gates.evidenceAnchors.anchors || []) {
      const missing = missingTerms(text, anchor.requiredTerms || []);
      const supported = statuses.includes(anchor.evidenceStatus);
      const hasRefs = Array.isArray(anchor.evidenceRefs) && anchor.evidenceRefs.length > 0;
      const passed = missing.length === 0 && supported && hasRefs;
      if (passed) passedCount += 1;
      const reasons = [];
      if (missing.length > 0) reasons.push(`missing wording: ${missing.join(", ")}`);
      if (!supported) reasons.push(`evidence status is ${anchor.evidenceStatus || "missing"}`);
      if (!hasRefs) reasons.push("no evidence reference recorded");
      addResult(results, `evidenceAnchors.${anchor.id}`, passed, gates.evidenceAnchors,
        passed ? `Evidence anchor ${anchor.id} is present and sourced.` : `Evidence anchor ${anchor.id} failed: ${reasons.join("; ")}.`);
    }
    const minimum = gates.evidenceAnchors.minimum ?? (gates.evidenceAnchors.anchors || []).length;
    addResult(results, "evidenceAnchors", passedCount >= minimum, gates.evidenceAnchors,
      `${passedCount} of ${minimum} required evidence anchors passed.`);
  }

  if (gates.needEvidenceBridges) {
    let passedCount = 0;
    const bridgeNotes = [];
    for (const bridge of gates.needEvidenceBridges.bridges || []) {
      const missingNeeds = missingTerms(text, bridge.needTerms || []);
      const missingEvidence = missingTerms(text, bridge.evidenceTerms || []);
      const hasRefs = Array.isArray(bridge.evidenceRefs) && bridge.evidenceRefs.length > 0;
      const passed = missingNeeds.length === 0 && missingEvidence.length === 0 && hasRefs;
      if (passed) passedCount += 1;
      bridgeNotes.push(`${bridge.id}: ${passed ? "pass" : "fail"}`);
    }
    const minimum = gates.needEvidenceBridges.minimum ?? 2;
    addResult(results, "needEvidenceBridges", passedCount >= minimum, gates.needEvidenceBridges,
      `${passedCount} of ${minimum} required employer-need-to-evidence bridges passed. ${bridgeNotes.join("; ")}.`);
  }

  if (gates.companySpecificity) {
    let factCount = 0;
    for (const fact of gates.companySpecificity.requiredFacts || []) {
      if (missingTerms(text, fact.terms || []).length === 0) factCount += 1;
    }
    const minimum = gates.companySpecificity.minimumFacts ?? 1;
    const swapPassed = gates.companySpecificity.companySwapStatus === "pass";
    const hasNotes = hasReviewNotes(gates.companySpecificity.companySwapNotes);
    const passed = factCount >= minimum && swapPassed && hasNotes;
    addResult(results, "companySpecificity", passed, gates.companySpecificity,
      `${factCount} of ${minimum} company-specific facts passed; company-swap review is ${gates.companySpecificity.companySwapStatus || "missing"}; notes ${hasNotes ? "recorded" : "missing"}.`);
  }

  addManualMotivationResult(results, gates.motivationReview);
  addManualReviewResult(results, "resumeComplement", gates.resumeComplement);
  addManualReviewResult(results, "voiceReview", gates.voiceReview);

  if (gates.referral?.enabled) {
    const missing = missingTerms(text, gates.referral.requiredTerms || []);
    const supported = gates.referral.evidenceStatus === "supported";
    const hasRefs = Array.isArray(gates.referral.evidenceRefs) && gates.referral.evidenceRefs.length > 0;
    const passed = missing.length === 0 && supported && hasRefs;
    addResult(results, "referral", passed, gates.referral,
      passed ? "Verified referral or relationship is used appropriately." : "Configured referral is missing, unsupported, or unsourced.");
  }

  if (gates.forbiddenPhrases) {
    const found = (gates.forbiddenPhrases.terms || []).filter((term) => includes(text, term));
    addResult(results, "forbiddenPhrases", found.length === 0, gates.forbiddenPhrases,
      found.length === 0 ? "No configured generic or inflated phrases found." : `Forbidden phrases found: ${found.join(", ")}.`);
  }

  const rubric = evaluateRubric(config.rubric || {});
  addResult(results, "rubricReview", rubric.reviewPassed, {
    severity: "error",
    reworkAgent: "cover-letter-critic"
  }, rubric.reviewPassed
    ? `Rubric review recorded. Score ${rubric.score}/${rubric.maximumScore}.`
    : `Rubric review is incomplete. Score ${rubric.score}/${rubric.maximumScore}.`);

  const errorFailures = results.filter((result) => result.severity === "error" && !result.passed);
  const passed = errorFailures.length === 0;
  const thresholds = config.thresholds || DEFAULT_THRESHOLDS;

  return {
    version: config.version || 1,
    passed,
    decision: decisionFromScore(rubric.score, passed, thresholds),
    score: rubric.score,
    maximumScore: rubric.maximumScore,
    thresholds,
    results,
    rubric: rubric.criteria,
    summary: passed
      ? `All blocking gates passed. Decision: ${decisionFromScore(rubric.score, true, thresholds)}.`
      : `${errorFailures.length} blocking gate(s) failed. Decision: DO NOT SEND.`
  };
}

function addManualMotivationResult(results, gate) {
  if (!gate) return;
  const motivationsPresent = gate.whyCompany === true && gate.whyRole === true && gate.whyNow === true;
  const reviewPassed = gate.manualReviewStatus === "pass" && hasReviewNotes(gate.manualReviewNotes);
  addResult(results, "motivationReview", motivationsPresent && reviewPassed, gate,
    `Why company: ${Boolean(gate.whyCompany)}; why role: ${Boolean(gate.whyRole)}; why now: ${Boolean(gate.whyNow)}; manual review: ${gate.manualReviewStatus || "missing"}; notes ${hasReviewNotes(gate.manualReviewNotes) ? "recorded" : "missing"}.`);
}

function addManualReviewResult(results, gateId, gate) {
  if (!gate) return;
  const passed = gate.manualReviewStatus === "pass" && hasReviewNotes(gate.manualReviewNotes);
  addResult(results, gateId, passed, gate,
    `Manual review is ${gate.manualReviewStatus || "missing"}; notes ${hasReviewNotes(gate.manualReviewNotes) ? "recorded" : "missing"}.`);
}

function evaluateRubric(rubric) {
  const criteria = (rubric.criteria || []).map((criterion) => ({ ...criterion }));
  const score = criteria.reduce((total, criterion) => total + numberOrZero(criterion.score), 0);
  const maximumScore = criteria.reduce((total, criterion) => total + numberOrZero(criterion.maximum), 0);
  const scoresValid = criteria.every((criterion) =>
    Number.isFinite(criterion.score) &&
    Number.isFinite(criterion.maximum) &&
    criterion.score >= 0 &&
    criterion.score <= criterion.maximum &&
    hasReviewNotes(criterion.notes));
  const reviewPassed = rubric.manualReviewStatus === "pass" &&
    hasReviewNotes(rubric.manualReviewNotes) &&
    maximumScore === 100 &&
    scoresValid;
  return { score, maximumScore, criteria, reviewPassed };
}

function addResult(results, gateId, passed, gate, message) {
  results.push({
    gateId,
    passed,
    severity: gate.severity || "error",
    reworkAgent: gate.reworkAgent || "cover-letter-critic",
    message
  });
}

function missingTerms(normalizedText, terms) {
  return terms.filter((term) => !includes(normalizedText, term));
}

function includes(normalizedText, term) {
  return normalizedText.includes(normalize(term));
}

function normalize(value) {
  return String(value).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ").trim();
}

function hasReviewNotes(value) {
  return typeof value === "string" && value.trim().length >= 10;
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}
