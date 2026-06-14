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
    privateLeak?: PrivateLeakGateConfig;
    unsupportedTerms?: UnsupportedTermsGateConfig;
    targetBranding?: TargetBrandingGateConfig;
    approvedSkillClaims?: ApprovedSkillClaimsGateConfig;
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
  addPrivateLeakResult(results, config.gates.privateLeak, snapshot.resumeText);
  addApprovedSkillClaimsResult(results, config.gates.approvedSkillClaims, snapshot.resumeText);
  addUnsupportedTermsResult(results, config.gates.unsupportedTerms, snapshot.resumeText);
  addTargetBrandingResult(results, config.gates.targetBranding, snapshot.resumeText, snapshot.artifactNames || []);

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
