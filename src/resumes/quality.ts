export type ResumeQualityGateSeverity = "error" | "warning";

export type RangeGateConfig = {
  enabled: boolean;
  minimum?: number;
  idealLow?: number;
  idealHigh?: number;
  maximum?: number;
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type RequiredSectionsGateConfig = {
  enabled: boolean;
  sections: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type KeywordMatchGateConfig = {
  enabled: boolean;
  minimumPercent: number;
  requiredKeywords?: string[];
  ignoredKeywords?: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type AgentPlatformEvidenceDimensionConfig = {
  id: string;
  terms: string[];
  minimumTermMatches?: number;
  evidenceStatus: "supported" | "adjacent" | "project-only" | "do-not-claim" | string;
  evidenceRefs: string[];
};

export type AgentPlatformEvidenceDepthGateConfig = {
  enabled: boolean;
  minimumDimensions: number;
  dimensions: AgentPlatformEvidenceDimensionConfig[];
  supportedStatuses?: string[];
  usageOnlyTerms: string[];
  platformBuildTerms: string[];
  minimumPlatformBuildMatches: number;
  topTextPercent: number;
  architectureTerms: string[];
  minimumArchitectureMatchesInBullet: number;
  outcomePatterns: string[];
  minimumOutcomeMatches?: number;
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type SemanticConceptGroupConfig = {
  id: string;
  terms: string[];
};

export type SemanticBulletReviewGateConfig = {
  enabled: boolean;
  conceptGroups: SemanticConceptGroupConfig[];
  minimumSharedConcepts: number;
  postingPhrases: string[];
  minimumPostingPhraseMatches: number;
  proofPatterns: string[];
  manualReviewStatus: "not-reviewed" | "pass" | "fail";
  manualReviewNotes?: string;
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type PrivateLeakGateConfig = {
  enabled: boolean;
  patterns: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type UnsupportedTermsGateConfig = {
  enabled: boolean;
  terms: string[];
  allowedContexts?: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type TargetBrandingGateConfig = {
  enabled: boolean;
  targetNames: string[];
  checkResumeText?: boolean;
  checkArtifactNames?: boolean;
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type ApprovedSkillClaimsGateConfig = {
  enabled: boolean;
  claimTerms: string[];
  approvedTerms: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type EducationWordingGateConfig = {
  enabled: boolean;
  requiredTerms?: string[];
  forbiddenTerms?: string[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type NumericConsistencyClaimConfig = {
  id: string;
  label?: string;
  pattern: string;
  flags?: string;
  valueGroup?: number;
  required?: boolean;
  unit?: string;
};

export type NumericConsistencyRelationshipConfig = {
  id?: string;
  left?: string;
  operator: ">" | ">=" | "<" | "<=" | "=" | "==" | "sumEquals";
  right?: string | number;
  value?: string | number;
  total?: string | number;
  addends?: string[];
  tolerance?: number;
  message?: string;
};

export type NumericConsistencyForbiddenPatternConfig = {
  id?: string;
  pattern: string;
  flags?: string;
  message?: string;
};

export type NumericConsistencyGateConfig = {
  enabled: boolean;
  claims?: NumericConsistencyClaimConfig[];
  relationships?: NumericConsistencyRelationshipConfig[];
  forbiddenPatterns?: NumericConsistencyForbiddenPatternConfig[];
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
};

export type ReviewerPrincipleTopTextGateConfig = {
  enabled: boolean;
  requiredTerms: string[];
  maxTextPercent: number;
  severity?: ResumeQualityGateSeverity;
  reworkAgent?: string;
};

export type ReviewerPrincipleLedTeamGateConfig = {
  enabled: boolean;
  requiredPatterns: string[];
  severity?: ResumeQualityGateSeverity;
  reworkAgent?: string;
};

export type ReviewerPrincipleEmphasisGateConfig = {
  enabled: boolean;
  mode: "no-emphasis-in-bullets";
  severity?: ResumeQualityGateSeverity;
  reworkAgent?: string;
};

export type ReviewerPrincipleTeamScopeGateConfig = {
  enabled: boolean;
  minimumLeadershipBullets: number;
  leadershipTerms: string[];
  severity?: ResumeQualityGateSeverity;
  reworkAgent?: string;
};

export type ReviewerPrincipleFounderProofGroup = {
  id: string;
  terms: string[];
};

export type ReviewerPrincipleFounderSignalGateConfig = {
  enabled: boolean;
  topTextPercent: number;
  proofTextPercent: number;
  targetRoleTerms: string[];
  founderTerms: string[];
  proofGroups: ReviewerPrincipleFounderProofGroup[];
  minimumProofGroups: number;
  collaborationTerms: string[];
  minimumCollaborationMatches: number;
  technicalTerms: string[];
  minimumTechnicalMatches: number;
  forbiddenTerms: string[];
  forbiddenAttributionPatterns: string[];
  severity?: ResumeQualityGateSeverity;
  reworkAgent?: string;
};

export type ReviewerPrinciplesGateConfig = {
  enabled: boolean;
  severity: ResumeQualityGateSeverity;
  reworkAgent: string;
  leadershipNearTop?: ReviewerPrincipleTopTextGateConfig;
  ledTeamWording?: ReviewerPrincipleLedTeamGateConfig;
  topHalfCarriesReview?: ReviewerPrincipleTopTextGateConfig;
  consistentEmphasis?: ReviewerPrincipleEmphasisGateConfig;
  teamLedWorkNotFlattened?: ReviewerPrincipleTeamScopeGateConfig;
  founderSignalBalance?: ReviewerPrincipleFounderSignalGateConfig;
};

export type ResumeQualityGatesConfig = {
  id: string;
  version: string;
  description?: string;
  gates: {
    pages?: RangeGateConfig;
    words?: RangeGateConfig;
    charactersIncludingSpaces?: RangeGateConfig;
    renderedTextLines?: RangeGateConfig;
    pageUtilizationPercent?: RangeGateConfig;
    visualBottomGapPercent?: RangeGateConfig;
    visualBottomToReferenceMarginRatio?: RangeGateConfig;
    bulletCharacters?: RangeGateConfig;
    achievementBullets?: RangeGateConfig;
    requiredSections?: RequiredSectionsGateConfig;
    keywordMatch?: KeywordMatchGateConfig;
    agentPlatformEvidenceDepth?: AgentPlatformEvidenceDepthGateConfig;
    semanticBulletReview?: SemanticBulletReviewGateConfig;
    privateLeak?: PrivateLeakGateConfig;
    unsupportedTerms?: UnsupportedTermsGateConfig;
    targetBranding?: TargetBrandingGateConfig;
    approvedSkillClaims?: ApprovedSkillClaimsGateConfig;
    educationWording?: EducationWordingGateConfig;
    numericConsistency?: NumericConsistencyGateConfig;
    reviewerPrinciples?: ReviewerPrinciplesGateConfig;
  };
  agentRouting: {
    maxIterations: number;
    defaultReworkSkill: string;
    notifyAgents: string[];
  };
};

export type ResumeQualitySnapshot = {
  resumeText: string;
  postingText?: string;
  pageCount?: number;
  pageCountSource?: "pdf" | "manual" | "unmeasured";
  wordCount: number;
  charactersIncludingSpaces: number;
  renderedTextLineCount?: number;
  renderedTextLineCountSource?: "manual" | "unmeasured";
  pageUtilizationPercent?: number;
  bottomWhitespacePercent?: number;
  visualBottomGapPercent?: number;
  visualBottomToReferenceMarginRatio?: number;
  sourceTextLineCount?: number;
  achievementBullets?: string[];
  bulletCharacterCounts: number[];
  achievementBulletCount: number;
  sectionNames: string[];
  inferredSections?: string[];
  postingKeywords?: string[];
  artifactNames?: string[];
  measurementWarnings?: string[];
};

export type ResumeQualityGateResult = {
  gateId: string;
  passed: boolean;
  severity: ResumeQualityGateSeverity;
  measured?: number;
  expected: string;
  message: string;
  reworkAgent: string;
};

export type AgentNotification = {
  agent: string;
  gateId: string;
  severity: ResumeQualityGateSeverity;
  message: string;
};

export type ResumeQualityReport = {
  passed: boolean;
  results: ResumeQualityGateResult[];
  agentNotifications: AgentNotification[];
  iterationLimit: number;
  defaultReworkSkill: string;
};

export function evaluateResumeQuality(
  config: ResumeQualityGatesConfig,
  snapshot: ResumeQualitySnapshot
): ResumeQualityReport {
  const results: ResumeQualityGateResult[] = [];

  addRangeGateResult(results, "pages", config.gates.pages, snapshot.pageCount);
  addRangeGateResult(results, "words", config.gates.words, snapshot.wordCount);
  addRangeGateResult(
    results,
    "charactersIncludingSpaces",
    config.gates.charactersIncludingSpaces,
    snapshot.charactersIncludingSpaces
  );
  addRangeGateResult(results, "renderedTextLines", config.gates.renderedTextLines, snapshot.renderedTextLineCount);
  addRangeGateResult(results, "pageUtilizationPercent", config.gates.pageUtilizationPercent, snapshot.pageUtilizationPercent);
  addRangeGateResult(results, "visualBottomGapPercent", config.gates.visualBottomGapPercent, snapshot.visualBottomGapPercent);
  addRangeGateResult(results, "visualBottomToReferenceMarginRatio", config.gates.visualBottomToReferenceMarginRatio, snapshot.visualBottomToReferenceMarginRatio);
  addBulletRangeResults(results, config.gates.bulletCharacters, snapshot.bulletCharacterCounts);
  addRangeGateResult(results, "achievementBullets", config.gates.achievementBullets, snapshot.achievementBulletCount);
  addRequiredSectionsResult(results, config.gates.requiredSections, snapshot.sectionNames, snapshot.inferredSections);
  addKeywordMatchResult(results, config.gates.keywordMatch, snapshot);
  addAgentPlatformEvidenceDepthResult(results, config.gates.agentPlatformEvidenceDepth, snapshot);
  addSemanticBulletReviewResult(results, config.gates.semanticBulletReview, snapshot.achievementBullets || []);
  addNumericConsistencyResult(results, config.gates.numericConsistency, snapshot.resumeText);
  addPrivateLeakResult(results, config.gates.privateLeak, snapshot.resumeText);
  addApprovedSkillClaimsResult(results, config.gates.approvedSkillClaims, snapshot.resumeText);
  addEducationWordingResult(results, config.gates.educationWording, snapshot.resumeText);
  addUnsupportedTermsResult(results, config.gates.unsupportedTerms, snapshot.resumeText);
  addTargetBrandingResult(results, config.gates.targetBranding, snapshot.resumeText, snapshot.artifactNames || []);
  addReviewerPrinciplesResult(results, config.gates.reviewerPrinciples, snapshot);

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
    results,
    agentNotifications,
    iterationLimit: config.agentRouting.maxIterations,
    defaultReworkSkill: config.agentRouting.defaultReworkSkill
  };
}

function addRangeGateResult(
  results: ResumeQualityGateResult[],
  gateId: string,
  gate: RangeGateConfig | undefined,
  measured: number | undefined
): void {
  if (!gate?.enabled) return;

  if (measured === undefined) {
    results.push({
      gateId,
      passed: false,
      severity: gate.severity,
      expected: formatRange(gate),
      message: `${gateId} could not be measured.`,
      reworkAgent: gate.reworkAgent
    });
    return;
  }

  const tooLow = gate.minimum !== undefined && measured < gate.minimum;
  const tooHigh = gate.maximum !== undefined && measured > gate.maximum;
  const outsideIdeal =
    gate.idealLow !== undefined &&
    gate.idealHigh !== undefined &&
    (measured < gate.idealLow || measured > gate.idealHigh);

  results.push({
    gateId,
    passed: !tooLow && !tooHigh && !outsideIdeal,
    severity: gate.severity,
    measured,
    expected: formatRange(gate),
    message: formatRangeMessage(gateId, measured, gate, tooLow, tooHigh, outsideIdeal),
    reworkAgent: gate.reworkAgent
  });
}

function addBulletRangeResults(
  results: ResumeQualityGateResult[],
  gate: RangeGateConfig | undefined,
  bulletCharacterCounts: number[]
): void {
  if (!gate?.enabled) return;

  const overMaximum = bulletCharacterCounts.filter((count) => gate.maximum !== undefined && count > gate.maximum);
  const underMinimum = bulletCharacterCounts.filter((count) => gate.minimum !== undefined && count < gate.minimum);
  const failedCount = overMaximum.length + underMinimum.length;
  const outsideIdeal = bulletCharacterCounts.filter(
    (count) =>
      (gate.idealLow !== undefined && count < gate.idealLow) ||
      (gate.idealHigh !== undefined && count > gate.idealHigh)
  );
  const idealRange =
    gate.idealLow !== undefined && gate.idealHigh !== undefined ? `${gate.idealLow}-${gate.idealHigh}` : undefined;

  results.push({
    gateId: "bulletCharacters",
    passed: failedCount === 0,
    severity: gate.severity,
    measured: failedCount,
    expected: `every achievement bullet ${formatHardRange(gate)}`,
    message:
      failedCount === 0
        ? "No achievement bullets violate hard character limits."
        : `${failedCount} achievement bullets are outside hard character limits.`,
    reworkAgent: gate.reworkAgent
  });
  if (idealRange && outsideIdeal.length > 0) {
    results.push({
      gateId: "bulletCharacterIdeals",
      passed: false,
      severity: "warning",
      measured: outsideIdeal.length,
      expected: `achievement bullet ideal ${idealRange}`,
      message: `${outsideIdeal.length} achievement bullets are outside ideal ${idealRange}.`,
      reworkAgent: gate.reworkAgent
    });
  }
}

function addRequiredSectionsResult(
  results: ResumeQualityGateResult[],
  gate: RequiredSectionsGateConfig | undefined,
  sectionNames: string[],
  inferredSections: string[] = []
): void {
  if (!gate?.enabled) return;

  const normalizedSections = new Set(sectionNames.map(normalizeTerm));
  const missing = gate.sections.filter((section) => !normalizedSections.has(normalizeTerm(section)));
  const normalizedRequired = new Set(gate.sections.map(normalizeTerm));
  const inferredRequired = inferredSections.filter((section) => normalizedRequired.has(normalizeTerm(section)));

  results.push({
    gateId: "requiredSections",
    passed: missing.length === 0,
    severity: gate.severity,
    measured: gate.sections.length - missing.length,
    expected: gate.sections.join(", "),
    message:
      missing.length === 0
        ? `All required sections are present${inferredRequired.length > 0 ? `; inferred from resume header: ${inferredRequired.join(", ")}` : ""}.`
        : `Missing sections: ${missing.join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addKeywordMatchResult(
  results: ResumeQualityGateResult[],
  gate: KeywordMatchGateConfig | undefined,
  snapshot: ResumeQualitySnapshot
): void {
  if (!gate?.enabled) return;

  const suppliedPostingKeywords = snapshot.postingKeywords || [];
  const hasConfiguredKeywords = Boolean(gate.requiredKeywords?.length);
  const hasSuppliedPostingKeywords = suppliedPostingKeywords.length > 0;
  const candidateKeywords = hasSuppliedPostingKeywords
    ? suppliedPostingKeywords
    : extractKeywords(snapshot.postingText || "");
  const hasExtractedPostingKeywords = !hasSuppliedPostingKeywords && candidateKeywords.length > 0;
  const sourceLabel = keywordSourceLabel(hasConfiguredKeywords, hasSuppliedPostingKeywords, hasExtractedPostingKeywords);
  const ignored = new Set((gate.ignoredKeywords || []).map(normalizeTerm));
  const keywords = uniqueTerms([...(gate.requiredKeywords || []), ...candidateKeywords]).filter(
    (keyword) => !ignored.has(normalizeTerm(keyword))
  );

  if (keywords.length === 0) {
    results.push({
      gateId: "keywordMatch",
      passed: gate.severity === "warning",
      severity: gate.severity,
      expected: `${gate.minimumPercent}% keyword match against ${sourceLabel}`,
      message: "No configured or posting keywords were available to compare.",
      reworkAgent: gate.reworkAgent
    });
    return;
  }

  const resumeText = normalizeSearchText(snapshot.resumeText);
  const matched = keywords.filter((keyword) => resumeText.includes(normalizeSearchText(keyword)));
  const percent = Math.round((matched.length / keywords.length) * 100);

  results.push({
    gateId: "keywordMatch",
    passed: percent >= gate.minimumPercent,
    severity: gate.severity,
    measured: percent,
    expected: `${gate.minimumPercent}% keyword match against ${sourceLabel}`,
    message:
      percent >= gate.minimumPercent
        ? `Keyword match passed at ${percent}% against ${sourceLabel}.`
        : `Keyword match is ${percent}% against ${sourceLabel}; missing: ${keywords.filter((keyword) => !matched.includes(keyword)).join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addAgentPlatformEvidenceDepthResult(
  results: ResumeQualityGateResult[],
  gate: AgentPlatformEvidenceDepthGateConfig | undefined,
  snapshot: ResumeQualitySnapshot
): void {
  if (!gate?.enabled) return;

  const supportedStatuses = new Set((gate.supportedStatuses || ["supported"]).map(normalizeTerm));
  const supportedDimensions = gate.dimensions.filter((dimension) => {
    const termMatches = dimension.terms.filter((term) => containsSearchTerm(snapshot.resumeText, term));
    const hasSource = dimension.evidenceRefs.some((ref) => ref.trim().length > 0);
    return hasSource &&
      supportedStatuses.has(normalizeTerm(dimension.evidenceStatus)) &&
      termMatches.length >= (dimension.minimumTermMatches ?? 1);
  });
  const missingDimensions = gate.dimensions.filter((dimension) => !supportedDimensions.includes(dimension));
  results.push({
    gateId: "agentPlatformEvidenceDepth",
    passed: supportedDimensions.length >= gate.minimumDimensions,
    severity: gate.severity,
    measured: supportedDimensions.length,
    expected: `at least ${gate.minimumDimensions} source-backed agent-platform evidence dimensions`,
    message:
      supportedDimensions.length >= gate.minimumDimensions
        ? `Source-backed agent-platform evidence covers: ${supportedDimensions.map((dimension) => dimension.id).join(", ")}.`
        : `Only ${supportedDimensions.length} source-backed agent-platform dimensions passed; expected ${gate.minimumDimensions}. Missing or weak: ${missingDimensions.map((dimension) => dimension.id).join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });

  const usageOnlyMatches = gate.usageOnlyTerms.filter((term) => containsSearchTerm(snapshot.resumeText, term));
  const platformBuildMatches = gate.platformBuildTerms.filter((term) => containsSearchTerm(snapshot.resumeText, term));
  const buildingPassed = platformBuildMatches.length >= gate.minimumPlatformBuildMatches;
  results.push({
    gateId: "agentPlatformEvidenceDepth.buildingVsUsing",
    passed: buildingPassed,
    severity: gate.severity,
    measured: platformBuildMatches.length,
    expected: `at least ${gate.minimumPlatformBuildMatches} platform-building signals`,
    message: buildingPassed
      ? `Platform-building signals matched: ${platformBuildMatches.join(", ")}.`
      : `Agent-tool usage${usageOnlyMatches.length > 0 ? ` (${usageOnlyMatches.join(", ")})` : ""} does not prove platform construction; only ${platformBuildMatches.length} platform-building signals matched.`,
    reworkAgent: gate.reworkAgent
  });

  const normalizedResumeText = normalizeSearchText(snapshot.resumeText);
  const topTextEnd = Math.floor(normalizedResumeText.length * (gate.topTextPercent / 100));
  const topText = normalizedResumeText.slice(0, topTextEnd);
  const topBullets = (snapshot.achievementBullets || []).filter((bullet) => {
    const normalizedBullet = normalizeSearchText(bullet);
    const bulletStart = normalizedResumeText.indexOf(normalizedBullet);
    return Boolean(normalizedBullet) && bulletStart >= 0 && bulletStart <= topTextEnd;
  });
  const architectureMatches = topBullets.map((bullet) => ({
    bullet,
    terms: gate.architectureTerms.filter((term) => containsSearchTerm(bullet, term))
  }));
  const strongestArchitectureBullet = architectureMatches
    .sort((left, right) => right.terms.length - left.terms.length)[0];
  const architecturePassed = Boolean(
    strongestArchitectureBullet &&
    strongestArchitectureBullet.terms.length >= gate.minimumArchitectureMatchesInBullet
  );
  results.push({
    gateId: "agentPlatformEvidenceDepth.architectureTopHalf",
    passed: architecturePassed,
    severity: gate.severity,
    measured: strongestArchitectureBullet?.terms.length || 0,
    expected: `one top-${gate.topTextPercent}% bullet with at least ${gate.minimumArchitectureMatchesInBullet} architecture signals`,
    message: architecturePassed
      ? `Top-half architecture bullet matched: ${strongestArchitectureBullet?.terms.join(", ")}.`
      : `No bullet in the top ${gate.topTextPercent}% contains ${gate.minimumArchitectureMatchesInBullet} configured architecture signals.`,
    reworkAgent: gate.reworkAgent
  });

  const topOutcomeText = `${topText} ${topBullets.join(" ")}`;
  const matchedOutcomes = gate.outcomePatterns.filter((pattern) => matchesPatternOrTerm(topOutcomeText, pattern));
  const minimumOutcomeMatches = gate.minimumOutcomeMatches ?? 1;
  results.push({
    gateId: "agentPlatformEvidenceDepth.outcomeTopHalf",
    passed: matchedOutcomes.length >= minimumOutcomeMatches,
    severity: gate.severity,
    measured: matchedOutcomes.length,
    expected: `at least ${minimumOutcomeMatches} measured outcome in the top ${gate.topTextPercent}%`,
    message:
      matchedOutcomes.length >= minimumOutcomeMatches
        ? `Top-half measured outcomes matched: ${matchedOutcomes.join(", ")}.`
        : `No configured measured agent-platform outcome appears in the top ${gate.topTextPercent}% of resume text.`,
    reworkAgent: gate.reworkAgent
  });
}

function addSemanticBulletReviewResult(
  results: ResumeQualityGateResult[],
  gate: SemanticBulletReviewGateConfig | undefined,
  achievementBullets: string[]
): void {
  if (!gate?.enabled) return;

  const duplicatePairs: Array<{ sharedConcepts: SemanticConceptGroupConfig[] }> = [];
  for (let leftIndex = 0; leftIndex < achievementBullets.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < achievementBullets.length; rightIndex += 1) {
      const sharedConcepts = gate.conceptGroups.filter((group) =>
        group.terms.some((term) => containsSearchTerm(achievementBullets[leftIndex], term)) &&
        group.terms.some((term) => containsSearchTerm(achievementBullets[rightIndex], term))
      );
      if (sharedConcepts.length >= gate.minimumSharedConcepts) duplicatePairs.push({ sharedConcepts });
    }
  }
  results.push({
    gateId: "semanticBulletReview.duplicateConcepts",
    passed: duplicatePairs.length === 0,
    severity: gate.severity,
    measured: duplicatePairs.length,
    expected: "no achievement-bullet pair repeats the configured concept threshold",
    message:
      duplicatePairs.length === 0
        ? "No achievement-bullet pair repeats too many configured concepts."
        : `${duplicatePairs.length} bullet pair(s) repeat the same underlying concepts: ${duplicatePairs.map((pair) => pair.sharedConcepts.map((group) => group.id).join("/")).join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });

  const postingEchoes = achievementBullets.filter((bullet) => {
    const phraseMatches = gate.postingPhrases.filter((phrase) => containsSearchTerm(bullet, phrase));
    const hasProof = gate.proofPatterns.some((pattern) => matchesPatternOrTerm(bullet, pattern));
    return phraseMatches.length >= gate.minimumPostingPhraseMatches && !hasProof;
  });
  results.push({
    gateId: "semanticBulletReview.postingEchoWithoutProof",
    passed: postingEchoes.length === 0,
    severity: gate.severity,
    measured: postingEchoes.length,
    expected: "no posting-like bullet without concrete proof",
    message:
      postingEchoes.length === 0
        ? "No achievement bullet echoes multiple posting phrases without concrete proof."
        : `${postingEchoes.length} achievement bullet(s) echo posting language without a configured metric, scope, user, or deployment proof.`,
    reworkAgent: gate.reworkAgent
  });

  const manualReviewPassed = gate.manualReviewStatus === "pass" && Boolean(gate.manualReviewNotes?.trim());
  results.push({
    gateId: "semanticBulletReview.manualReview",
    passed: manualReviewPassed,
    severity: gate.severity,
    measured: manualReviewPassed ? 1 : 0,
    expected: "explicit semantic and voice review marked pass with notes",
    message: manualReviewPassed
      ? `Manual semantic review passed: ${gate.manualReviewNotes?.trim()}`
      : "Manual semantic review is required. Record a pass with notes after checking duplicate meaning, posting mimicry, evidence, and natural voice.",
    reworkAgent: gate.reworkAgent
  });
}

type ExtractedNumericClaim = {
  id: string;
  label: string;
  unit?: string;
  value: number;
  text: string;
};

function addNumericConsistencyResult(
  results: ResumeQualityGateResult[],
  gate: NumericConsistencyGateConfig | undefined,
  resumeText: string
): void {
  if (!gate?.enabled) return;

  const issues: string[] = [];
  const claims = new Map<string, ExtractedNumericClaim>();

  for (const claim of gate.claims || []) {
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

  results.push({
    gateId: "numericConsistency",
    passed,
    severity: gate.severity,
    measured: passed ? claims.size : issues.length,
    expected: "configured numeric claims are clear and mathematically consistent",
    message: passed
      ? `Numeric consistency passed for ${claims.size} configured claims${claimSummary ? `: ${claimSummary}` : ""}.`
      : `Numeric consistency issues: ${issues.join("; ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function extractNumericClaim(
  resumeText: string,
  claim: NumericConsistencyClaimConfig,
  issues: string[]
): ExtractedNumericClaim | undefined {
  if (!claim?.id) {
    issues.push("A numeric claim is missing an id");
    return undefined;
  }
  if (!claim.pattern) {
    issues.push(`Numeric claim ${claim.id} is missing a pattern`);
    return undefined;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(claim.pattern, claim.flags || "i");
  } catch (error) {
    issues.push(`Numeric claim ${claim.id} has an invalid pattern: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }

  const match = regex.exec(resumeText);
  if (!match) {
    if (claim.required !== false) {
      issues.push(`Missing numeric claim ${claim.id}${claim.label ? ` (${claim.label})` : ""}`);
    }
    return undefined;
  }

  const value = parseNumericValue(match[claim.valueGroup ?? 1]);
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

function addNumericForbiddenPatternIssues(
  issues: string[],
  gate: NumericConsistencyGateConfig,
  resumeText: string
): void {
  for (const check of gate.forbiddenPatterns || []) {
    let regex: RegExp;
    try {
      regex = new RegExp(check.pattern, check.flags || "i");
    } catch (error) {
      issues.push(`Forbidden numeric pattern ${check.id || check.pattern} is invalid: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (regex.test(resumeText)) {
      issues.push(check.message || `Forbidden numeric pattern matched: ${check.id || check.pattern}`);
    }
  }
}

function evaluateNumericRelationship(
  issues: string[],
  claims: Map<string, ExtractedNumericClaim>,
  relationship: NumericConsistencyRelationshipConfig
): void {
  const id = relationship.id || relationship.operator || "numeric relationship";
  const tolerance = relationship.tolerance ?? 0;

  if (relationship.operator === "sumEquals") {
    const addends = relationship.addends || [];
    const missing = addends.filter((claimId) => !claims.has(claimId));
    const total = resolveRelationshipValue(claims, relationship.total ?? relationship.right ?? relationship.value);
    if (missing.length > 0 || !total) {
      issues.push(`${id} cannot be checked because numeric claims are missing: ${[...missing, total ? "" : "total"].filter(Boolean).join(", ")}`);
      return;
    }

    const sum = addends.reduce((accumulator, claimId) => accumulator + (claims.get(claimId)?.value || 0), 0);
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

  if (!compareNumericValues(left.value, relationship.operator, right.value, tolerance)) {
    issues.push(relationship.message || `${id} failed: ${left.label} ${formatNumericValue(left.value)} ${relationship.operator} ${right.label} ${formatNumericValue(right.value)}`);
  }
}

function resolveRelationshipValue(
  claims: Map<string, ExtractedNumericClaim>,
  keyOrValue: string | number | undefined
): { label: string; value: number } | undefined {
  if (typeof keyOrValue === "string" && claims.has(keyOrValue)) return claims.get(keyOrValue);
  const value = parseNumericValue(keyOrValue);
  if (!Number.isFinite(value)) return undefined;
  return {
    label: String(keyOrValue),
    value
  };
}

function compareNumericValues(left: number, operator: string, right: number, tolerance: number): boolean {
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

function addPrivateLeakResult(
  results: ResumeQualityGateResult[],
  gate: PrivateLeakGateConfig | undefined,
  resumeText: string
): void {
  if (!gate?.enabled) return;

  const matched = gate.patterns.filter((pattern) => new RegExp(pattern, "i").test(resumeText));

  results.push({
    gateId: "privateLeak",
    passed: matched.length === 0,
    severity: gate.severity,
    measured: matched.length,
    expected: "no private or internal-only text",
    message: matched.length === 0 ? "No private-leak patterns matched." : `Private-leak patterns matched: ${matched.join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addUnsupportedTermsResult(
  results: ResumeQualityGateResult[],
  gate: UnsupportedTermsGateConfig | undefined,
  resumeText: string
): void {
  if (!gate?.enabled) return;

  const matched = gate.terms.filter((term) => containsSearchTerm(resumeText, term));

  results.push({
    gateId: "unsupportedTerms",
    passed: matched.length === 0,
    severity: gate.severity,
    measured: matched.length,
    expected: "no unsupported technology or experience terms",
    message: matched.length === 0 ? "No unsupported terms matched." : `Unsupported terms matched: ${matched.join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addApprovedSkillClaimsResult(
  results: ResumeQualityGateResult[],
  gate: ApprovedSkillClaimsGateConfig | undefined,
  resumeText: string
): void {
  if (!gate?.enabled) return;

  const approved = new Set((gate.approvedTerms || []).map(normalizeSearchText));
  const claimed = uniqueTerms(gate.claimTerms || []).filter((term) => containsSearchTerm(resumeText, term));
  const unapproved = claimed.filter((term) => !approved.has(normalizeSearchText(term)));

  results.push({
    gateId: "approvedSkillClaims",
    passed: unapproved.length === 0,
    severity: gate.severity,
    measured: unapproved.length,
    expected: "no skill/tool claims outside the approved skill inventory",
    message: unapproved.length === 0 ? "All configured skill claims are approved." : `Unapproved skill claims matched: ${unapproved.join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addEducationWordingResult(
  results: ResumeQualityGateResult[],
  gate: EducationWordingGateConfig | undefined,
  resumeText: string
): void {
  if (!gate?.enabled) return;

  const missing = (gate.requiredTerms || []).filter((term) => !containsSearchTerm(resumeText, term));
  const forbidden = (gate.forbiddenTerms || []).filter((term) => containsSearchTerm(resumeText, term));
  const messages: string[] = [];
  if (missing.length > 0) messages.push(`missing required education wording: ${missing.join(", ")}`);
  if (forbidden.length > 0) messages.push(`forbidden education wording matched: ${forbidden.join(", ")}`);

  results.push({
    gateId: "educationWording",
    passed: missing.length === 0 && forbidden.length === 0,
    severity: gate.severity,
    measured: missing.length + forbidden.length,
    expected: "required education wording present and stale degree labels absent",
    message:
      messages.length === 0
        ? "Education wording matched required terms and no forbidden stale degree labels matched."
        : messages.join("; "),
    reworkAgent: gate.reworkAgent
  });
}

function addTargetBrandingResult(
  results: ResumeQualityGateResult[],
  gate: TargetBrandingGateConfig | undefined,
  resumeText: string,
  artifactNames: string[]
): void {
  if (!gate?.enabled) return;

  const targetNames = gate.targetNames || [];
  const textMatches =
    gate.checkResumeText === false
      ? []
      : targetNames.filter((targetName) => containsSearchTerm(resumeText, targetName));
  const filenameMatches =
    gate.checkArtifactNames === false
      ? []
      : artifactNames.flatMap((artifactName) =>
          targetNames
            .filter((targetName) => containsSearchTerm(artifactName, targetName))
            .map((targetName) => `${artifactName} -> ${targetName}`)
        );
  const matched = [
    ...textMatches.map((targetName) => `resume text -> ${targetName}`),
    ...filenameMatches
  ];

  results.push({
    gateId: "targetBranding",
    passed: matched.length === 0,
    severity: gate.severity,
    measured: matched.length,
    expected: "no target company name in applicant-facing resume text or artifact filenames",
    message: matched.length === 0 ? "No target-branding matches found." : `Target-branding matches found: ${matched.join(", ")}.`,
    reworkAgent: gate.reworkAgent
  });
}

function addReviewerPrinciplesResult(
  results: ResumeQualityGateResult[],
  gate: ReviewerPrinciplesGateConfig | undefined,
  snapshot: ResumeQualitySnapshot
): void {
  if (!gate?.enabled) return;

  addTopTextPrincipleResult(
    results,
    "reviewerPrinciples.leadershipNearTop",
    gate,
    gate.leadershipNearTop,
    snapshot.resumeText,
    "configured leadership terms"
  );
  addLedTeamWordingResult(results, gate, gate.ledTeamWording, snapshot.resumeText);
  addTopTextPrincipleResult(
    results,
    "reviewerPrinciples.topHalfCarriesReview",
    gate,
    gate.topHalfCarriesReview,
    snapshot.resumeText,
    "configured high-signal terms"
  );
  addConsistentEmphasisResult(results, gate, gate.consistentEmphasis, snapshot.achievementBullets || []);
  addTeamLedWorkNotFlattenedResult(results, gate, gate.teamLedWorkNotFlattened, snapshot.achievementBullets || []);
  addFounderSignalBalanceResult(results, gate, gate.founderSignalBalance, snapshot.resumeText);
}

function addTopTextPrincipleResult(
  results: ResumeQualityGateResult[],
  gateId: string,
  parentGate: ReviewerPrinciplesGateConfig,
  check: ReviewerPrincipleTopTextGateConfig | undefined,
  resumeText: string,
  label: string
): void {
  if (!check?.enabled) return;

  const misplaced = termsOutsideTextPercent(resumeText, check.requiredTerms, check.maxTextPercent);
  results.push({
    gateId,
    passed: misplaced.length === 0,
    severity: check.severity || parentGate.severity,
    measured: check.requiredTerms.length - misplaced.length,
    expected: `${label} within top ${check.maxTextPercent}% of resume text`,
    message:
      misplaced.length === 0
        ? `${label} appear within the top ${check.maxTextPercent}% of resume text.`
        : `${label} missing from the top ${check.maxTextPercent}% of resume text: ${misplaced.join(", ")}.`,
    reworkAgent: check.reworkAgent || parentGate.reworkAgent
  });
}

function addLedTeamWordingResult(
  results: ResumeQualityGateResult[],
  parentGate: ReviewerPrinciplesGateConfig,
  check: ReviewerPrincipleLedTeamGateConfig | undefined,
  resumeText: string
): void {
  if (!check?.enabled) return;

  const missing = check.requiredPatterns.filter((pattern) => !matchesPatternOrTerm(resumeText, pattern));
  results.push({
    gateId: "reviewerPrinciples.ledTeamWording",
    passed: missing.length === 0,
    severity: check.severity || parentGate.severity,
    measured: check.requiredPatterns.length - missing.length,
    expected: `supportable team wording: ${check.requiredPatterns.join(", ")}`,
    message:
      missing.length === 0
        ? "Supportable team-size wording is present."
        : `Supportable team-size wording is missing: ${missing.join(", ")}.`,
    reworkAgent: check.reworkAgent || parentGate.reworkAgent
  });
}

function addConsistentEmphasisResult(
  results: ResumeQualityGateResult[],
  parentGate: ReviewerPrinciplesGateConfig,
  check: ReviewerPrincipleEmphasisGateConfig | undefined,
  achievementBullets: string[]
): void {
  if (!check?.enabled) return;

  const emphasizedBullets = achievementBullets.filter(hasInlineEmphasis);
  results.push({
    gateId: "reviewerPrinciples.consistentEmphasis",
    passed: emphasizedBullets.length === 0,
    severity: check.severity || parentGate.severity,
    measured: emphasizedBullets.length,
    expected: "no bold or italic emphasis inside achievement bullets",
    message:
      emphasizedBullets.length === 0
        ? "Achievement bullets do not use inline emphasis."
        : `${emphasizedBullets.length} achievement bullets use inline emphasis; keep emphasis consistent outside bullets or apply a deliberate full-section pattern.`,
    reworkAgent: check.reworkAgent || parentGate.reworkAgent
  });
}

function addTeamLedWorkNotFlattenedResult(
  results: ResumeQualityGateResult[],
  parentGate: ReviewerPrinciplesGateConfig,
  check: ReviewerPrincipleTeamScopeGateConfig | undefined,
  achievementBullets: string[]
): void {
  if (!check?.enabled) return;

  const leadershipBulletCount = achievementBullets.filter((bullet) =>
    check.leadershipTerms.some((term) => containsSearchTerm(bullet, term))
  ).length;
  results.push({
    gateId: "reviewerPrinciples.teamLedWorkNotFlattened",
    passed: leadershipBulletCount >= check.minimumLeadershipBullets,
    severity: check.severity || parentGate.severity,
    measured: leadershipBulletCount,
    expected: `at least ${check.minimumLeadershipBullets} leadership or team-scope bullets`,
    message:
      leadershipBulletCount >= check.minimumLeadershipBullets
        ? `${leadershipBulletCount} leadership or team-scope bullets use configured language.`
        : `${leadershipBulletCount} leadership or team-scope bullets found; expected at least ${check.minimumLeadershipBullets} so team-led work is not flattened into lone-IC wording.`,
    reworkAgent: check.reworkAgent || parentGate.reworkAgent
  });
}

function addFounderSignalBalanceResult(
  results: ResumeQualityGateResult[],
  parentGate: ReviewerPrinciplesGateConfig,
  check: ReviewerPrincipleFounderSignalGateConfig | undefined,
  resumeText: string
): void {
  if (!check?.enabled) return;

  const severity = check.severity || parentGate.severity;
  const reworkAgent = check.reworkAgent || parentGate.reworkAgent;
  const topText = textWithinPercent(resumeText, check.topTextPercent);
  const proofText = textWithinPercent(resumeText, check.proofTextPercent);
  const targetMatch = firstTermMatch(topText, check.targetRoleTerms);
  const founderMatch = firstTermMatch(topText, check.founderTerms);
  const targetRolePassed = Boolean(targetMatch && founderMatch && targetMatch.index <= founderMatch.index);

  results.push({
    gateId: "reviewerPrinciples.founderTargetRoleTranslation",
    passed: targetRolePassed,
    severity,
    measured: targetRolePassed ? 1 : 0,
    expected: `target role appears before founder identity within top ${check.topTextPercent}% of resume text`,
    message: targetRolePassed
      ? `Target role ${targetMatch?.term} appears before founder identity ${founderMatch?.term} in the opening.`
      : `Put a configured target role before the founder identity within the top ${check.topTextPercent}% of resume text.`,
    reworkAgent
  });

  const matchedProofGroups = check.proofGroups.filter((group) =>
    group.terms.some((term) => containsSearchTerm(proofText, term))
  );
  results.push({
    gateId: "reviewerPrinciples.founderOperatingProof",
    passed: matchedProofGroups.length >= check.minimumProofGroups,
    severity,
    measured: matchedProofGroups.length,
    expected: `at least ${check.minimumProofGroups} founder operating-proof groups within top ${check.proofTextPercent}% of resume text`,
    message:
      matchedProofGroups.length >= check.minimumProofGroups
        ? `Founder operating proof covers: ${matchedProofGroups.map((group) => group.id).join(", ")}.`
        : `Founder operating proof covers ${matchedProofGroups.length} groups; expected ${check.minimumProofGroups}. Missing options: ${check.proofGroups.filter((group) => !matchedProofGroups.includes(group)).map((group) => group.id).join(", ")}.`,
    reworkAgent
  });

  addFounderTermCountResult(
    results,
    "reviewerPrinciples.founderCollaboration",
    proofText,
    check.collaborationTerms,
    check.minimumCollaborationMatches,
    `collaboration signals within top ${check.proofTextPercent}% of resume text`,
    severity,
    reworkAgent
  );
  addFounderTermCountResult(
    results,
    "reviewerPrinciples.founderTechnicalDepth",
    proofText,
    check.technicalTerms,
    check.minimumTechnicalMatches,
    `technical-depth signals within top ${check.proofTextPercent}% of resume text`,
    severity,
    reworkAgent
  );

  const riskyTerms = check.forbiddenTerms.filter((term) => containsSearchTerm(resumeText, term));
  results.push({
    gateId: "reviewerPrinciples.founderRiskLanguage",
    passed: riskyTerms.length === 0,
    severity,
    measured: riskyTerms.length,
    expected: "no risk-amplifying founder shorthand",
    message:
      riskyTerms.length === 0
        ? "No risk-amplifying founder shorthand found."
        : `Risk-amplifying founder shorthand found: ${riskyTerms.join(", ")}.`,
    reworkAgent
  });

  const attributionMatches = check.forbiddenAttributionPatterns.filter((pattern) =>
    matchesPatternOrTerm(resumeText, pattern)
  );
  results.push({
    gateId: "reviewerPrinciples.founderAttributionBoundaries",
    passed: attributionMatches.length === 0,
    severity,
    measured: attributionMatches.length,
    expected: "no configured lone-hero or unsupported personal-attribution patterns",
    message:
      attributionMatches.length === 0
        ? "Founder attribution stays within configured team and company boundaries."
        : `Founder attribution crosses configured boundaries: ${attributionMatches.join(", ")}.`,
    reworkAgent
  });
}

function addFounderTermCountResult(
  results: ResumeQualityGateResult[],
  gateId: string,
  text: string,
  terms: string[],
  minimum: number,
  label: string,
  severity: ResumeQualityGateSeverity,
  reworkAgent: string
): void {
  const matchedTerms = terms.filter((term) => containsSearchTerm(text, term));
  results.push({
    gateId,
    passed: matchedTerms.length >= minimum,
    severity,
    measured: matchedTerms.length,
    expected: `at least ${minimum} configured ${label}`,
    message:
      matchedTerms.length >= minimum
        ? `Found ${matchedTerms.length} configured ${label}: ${matchedTerms.join(", ")}.`
        : `Found ${matchedTerms.length} configured ${label}; expected at least ${minimum}.`,
    reworkAgent
  });
}

function textWithinPercent(text: string, percent: number): string {
  const normalized = normalizeSearchText(text);
  return normalized.slice(0, Math.floor(normalized.length * (percent / 100)));
}

function firstTermMatch(text: string, terms: string[]): { term: string; index: number } | undefined {
  return terms
    .map((term) => ({ term, index: text.indexOf(normalizeSearchText(term)) }))
    .filter((match) => match.index >= 0)
    .sort((left, right) => left.index - right.index)[0];
}

function formatRange(gate: RangeGateConfig): string {
  const parts: string[] = [];
  if (gate.minimum !== undefined) parts.push(`minimum ${gate.minimum}`);
  if (gate.idealLow !== undefined && gate.idealHigh !== undefined) parts.push(`ideal ${gate.idealLow}-${gate.idealHigh}`);
  if (gate.maximum !== undefined) parts.push(`maximum ${gate.maximum}`);
  return parts.join(", ") || "configured range";
}

function formatHardRange(gate: RangeGateConfig): string {
  const parts: string[] = [];
  if (gate.minimum !== undefined) parts.push(`minimum ${gate.minimum}`);
  if (gate.maximum !== undefined) parts.push(`maximum ${gate.maximum}`);
  return parts.join(", ") || "configured hard limits";
}

function keywordSourceLabel(
  hasConfiguredKeywords: boolean,
  hasSuppliedPostingKeywords: boolean,
  hasExtractedPostingKeywords: boolean
): string {
  const sources: string[] = [];
  if (hasConfiguredKeywords) sources.push("configured required keywords");
  if (hasSuppliedPostingKeywords) sources.push("supplied posting keywords");
  if (hasExtractedPostingKeywords) sources.push("extracted posting keywords");
  return sources.join(" plus ") || "available keywords";
}

function formatRangeMessage(
  gateId: string,
  measured: number,
  gate: RangeGateConfig,
  tooLow: boolean,
  tooHigh: boolean,
  outsideIdeal: boolean
): string {
  if (tooLow) return `${gateId} is ${measured}, below ${gate.minimum}.`;
  if (tooHigh) return `${gateId} is ${measured}, above ${gate.maximum}.`;
  if (outsideIdeal) return `${gateId} is ${measured}, within hard limits but outside ideal ${gate.idealLow}-${gate.idealHigh}.`;
  return `${gateId} is ${measured}, within ${formatRange(gate)}.`;
}

function extractKeywords(text: string): string[] {
  return uniqueTerms(
    text
      .split(/[^A-Za-z0-9+#.]+/)
      .map((term) => term.trim())
      .filter((term) => term.length >= 3)
  );
}

function uniqueTerms(terms: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const term of terms) {
    const normalized = normalizeTerm(term);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(term);
  }
  return output;
}

function normalizeTerm(term: string): string {
  return term.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeSearchText(text: string): string {
  return normalizeTerm(text.replace(/[^A-Za-z0-9+#.]+/g, " "));
}

function containsSearchTerm(value: string, term: string): boolean {
  const haystack = ` ${normalizeSearchText(value)} `;
  const needle = normalizeSearchText(term);
  if (!needle) return false;
  const pattern = new RegExp(`\\s${escapeRegExp(needle).replace(/\s+/g, "\\s+")}\\s`, "i");
  return pattern.test(haystack);
}

function termsOutsideTextPercent(text: string, terms: string[], maxTextPercent: number): string[] {
  const haystack = normalizeSearchText(text);
  const maxIndex = Math.floor(haystack.length * (maxTextPercent / 100));
  return terms.filter((term) => {
    const index = haystack.indexOf(normalizeSearchText(term));
    return index < 0 || index > maxIndex;
  });
}

function matchesPatternOrTerm(text: string, pattern: string): boolean {
  try {
    if (new RegExp(pattern, "i").test(text)) return true;
  } catch {
    // Fall back to normalized term matching for configs that use plain text.
  }
  return containsSearchTerm(text, pattern);
}

function hasInlineEmphasis(value: string): boolean {
  return /(^|[^\\])(\*\*|__|\*|_)|<\/?(strong|b|em|i)\b/i.test(value);
}

function parseNumericValue(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (value === undefined) return Number.NaN;
  return Number(value.replace(/,/g, "").trim());
}

function formatNumericValue(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString("en-US") : String(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
