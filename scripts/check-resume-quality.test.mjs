import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { countPdfPages, countPdfPagesFromText } from "../src/resumes/pdf-page-count.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkerPath = path.join(repoRoot, "scripts", "check-resume-quality.mjs");

test("counts pages from the catalog page tree", () => {
  assert.equal(countPdfPagesFromText(minimalPdf({ pageCount: 1 })), 1);
  assert.equal(countPdfPagesFromText(minimalPdf({ pageCount: 2 })), 2);
});

test("uses the catalog page count instead of unrelated Count values", () => {
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
2 0 obj
<< /Type /Outlines /Count 99 >>
endobj
3 0 obj
<< /Type /Pages /Count 2 /Kids [4 0 R 5 0 R] >>
endobj
4 0 obj
<< /Parent 3 0 R /MediaBox [0 0 612 792] >>
endobj
5 0 obj
<< /Parent 3 0 R /MediaBox [0 0 612 792] >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;

  assert.equal(countPdfPagesFromText(pdf), 2);
});

test("CLI fails a two-page rendered PDF when max pages is one", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(workspace, minimalPdf({ pageCount: 2 }));
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    assert.equal(report.passed, false);
    assert.equal(report.measurements.pageCount, 2);
    assert.equal(report.measurements.pageCountSource, "pdf");
    assert.match(pageGate(report).message, /above 1/);
  });
});

test("CLI ignores manual page count when rendered PDF is present", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(workspace, minimalPdf({ pageCount: 2 }));
    const run = runChecker(paths, ["--max-pages", "1", "--pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    assert.equal(report.measurements.pageCount, 2);
    assert.equal(report.measurements.pageCountSource, "pdf");
    assert.match(report.measurements.measurementWarnings.join(" "), /manual page count was ignored/);
  });
});

test("CLI passes a one-page rendered PDF when max pages is one", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(workspace, minimalPdf({ pageCount: 1 }));
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    assert.equal(report.passed, true);
    assert.equal(report.measurements.pageCount, 1);
    assert.equal(pageGate(report).passed, true);
  });
});

test("CLI fails browser print header and footer leakage in the PDF artifact", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({
        pageCount: 1,
        extraObject: "file:///C:/Users/Example/Documents/resume.html"
      }),
      {
        privateLeak: {
          enabled: true,
          patterns: ["file://", "resume\\.html"],
          severity: "error",
          reworkAgent: "voice-auditor"
        }
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const leakGate = report.results.find((result) => result.gateId === "privateLeak");
    assert.equal(leakGate.passed, false);
    assert.match(leakGate.message, /file:\/\//);
  });
});

test("CLI fails target company name in applicant-facing resume text", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        targetBranding: {
          enabled: true,
          targetNames: ["Acme"],
          severity: "error",
          reworkAgent: "voice-auditor"
        }
      },
      {
        resumeContent: "# Test Person\n\nTarget Role\n\n## Summary\n\nStrong fit for Acme's backend team.\n\n## Professional Experience\n\n- Delivered a concise result.\n"
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "targetBranding");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /resume text -> Acme/);
  });
});

test("CLI fails target company name in artifact filenames", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        targetBranding: {
          enabled: true,
          targetNames: ["Acme"],
          severity: "error",
          reworkAgent: "voice-auditor"
        }
      },
      {
        pdfName: "Test_Person_Acme_Resume_2026.pdf"
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "targetBranding");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /Test_Person_Acme_Resume_2026\.pdf -> Acme/);
  });
});

test("CLI fails skill claims that are not approved by the skill inventory gate", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        approvedSkillClaims: {
          enabled: true,
          claimTerms: ["TypeScript", "Go", "GraphQL"],
          approvedTerms: ["TypeScript"],
          severity: "error",
          reworkAgent: "evidence-auditor"
        }
      },
      {
        resumeContent: "# Test Person\n\nBackend Engineer\n\n## Technical Skills\n\n- Backend: TypeScript, REST APIs, Go, GraphQL\n\n## Professional Experience\n\n- Delivered a concise result.\n"
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "approvedSkillClaims");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /Go/);
    assert.match(gate.message, /GraphQL/);
    assert.doesNotMatch(gate.message, /TypeScript/);
  });
});

test("CLI fails stale degree labels when configured education wording is generic", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        educationWording: {
          enabled: true,
          requiredTerms: ["Bachelor's Degree in Computer Science"],
          forbiddenTerms: ["Bachelor of Science", "Bachelor of Arts"],
          severity: "error",
          reworkAgent: "resume-writer"
        }
      },
      {
        resumeContent: "# Test Person\n\nSoftware Engineer\n\n## Education\n\nBachelor of Science, Computer Science - State University, 2020\n"
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "educationWording");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /missing required education wording: Bachelor's Degree in Computer Science/);
    assert.match(gate.message, /forbidden education wording matched: Bachelor of Science/);
  });
});

test("CLI passes configured education wording when stale degree labels are absent", () => {
  usingTempWorkspace((workspace) => {
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        educationWording: {
          enabled: true,
          requiredTerms: ["Bachelor's Degree in Computer Science"],
          forbiddenTerms: ["Bachelor of Science", "Bachelor of Arts"],
          severity: "error",
          reworkAgent: "resume-writer"
        }
      },
      {
        resumeContent: "# Test Person\n\nSoftware Engineer\n\n## Education\n\nBachelor's Degree in Computer Science - State University, 2020\n"
      }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "educationWording");
    assert.equal(gate.passed, true);
  });
});

test("CLI fails reviewer principles when leadership is not near the top half", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Built reliable internal products for customers.

## Technical Skills

- TypeScript, Node.js, PostgreSQL, AWS

## Professional Experience

- Built a customer reporting surface with durable TypeScript services.
- Improved deployment safety with repeatable reviews and release notes.
- Led a team of 4 engineers through delivery of the highest-scope product work.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: reviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "reviewerPrinciples.leadershipNearTop");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /top 35%/);
  });
});

test("CLI fails reviewer principles when supportable Led a team wording is missing", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Hands-on technical leader for customer-facing workflow systems.

## Technical Skills

- TypeScript, Node.js, PostgreSQL, AWS

## Professional Experience

- Guided engineering delivery for customer-facing workflow systems.
- Scoped platform reliability work across product, design, and support.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: reviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "reviewerPrinciples.ledTeamWording");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /Led a team of 4 engineers/);
  });
});

test("CLI fails reviewer principles when achievement bullets use inconsistent emphasis", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Led a team of 4 engineers through customer-facing workflow delivery.

## Technical Skills

- TypeScript, Node.js, PostgreSQL, AWS

## Professional Experience

- Led a team of 4 engineers through **customer-facing workflow** delivery.
- Scoped platform reliability work across product, design, and support.
- Reviewed implementation plans with engineers before release.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: reviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "reviewerPrinciples.consistentEmphasis");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /emphasis/);
  });
});

test("CLI fails reviewer principles when team-led work is flattened into lone-IC wording", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Led a team of 4 engineers through customer-facing workflow delivery.

## Technical Skills

- TypeScript, Node.js, PostgreSQL, AWS

## Professional Experience

- Built customer-facing workflow systems with TypeScript and PostgreSQL.
- Implemented release automation for production deployments.
- Added observability for backend APIs and dashboards.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: reviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "reviewerPrinciples.teamLedWorkNotFlattened");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /leadership or team-scope bullets/);
  });
});

test("CLI passes reviewer principles when leadership, top-half proof, emphasis, and team scope are explicit", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Led a team of 4 engineers through customer-facing workflow delivery, reliability, and platform modernization.

## Technical Skills

- TypeScript, Node.js, PostgreSQL, AWS

## Professional Experience

- Led a team of 4 engineers through customer-facing workflow delivery across product, design, and support.
- Scoped platform reliability work across product, design, and support before implementation.
- Reviewed implementation plans with engineers before release.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: reviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    const gates = report.results.filter((result) => result.gateId.startsWith("reviewerPrinciples."));
    assert.equal(gates.length, 5);
    assert.equal(gates.every((gate) => gate.passed), true);
  });
});

test("CLI fails founder signal balance when founder identity dominates and proof is weak", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Founder and CTO

## Summary

Visionary founder who wore many hats and did everything needed to build the company.

## Technical Skills

- JavaScript

## Professional Experience

- Personally generated all company revenue while building the product alone.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: founderReviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const founderGates = report.results.filter((result) =>
      result.gateId.startsWith("reviewerPrinciples.founder")
    );
    assert.deepEqual(
      founderGates.map((gate) => gate.gateId),
      [
        "reviewerPrinciples.founderTargetRoleTranslation",
        "reviewerPrinciples.founderOperatingProof",
        "reviewerPrinciples.founderCollaboration",
        "reviewerPrinciples.founderTechnicalDepth",
        "reviewerPrinciples.founderRiskLanguage",
        "reviewerPrinciples.founderAttributionBoundaries"
      ]
    );
    assert.equal(founderGates.every((gate) => gate.passed === false), true);
  });
});

test("CLI passes founder signal balance when target role and grounded founder proof are explicit", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Lead Software Engineer | Technical Co-Founder

## Summary

Lead software engineer with nearly six years owning production delivery for customer-facing SaaS. Led a team of 4 engineers while remaining hands-on across TypeScript, Node.js, PostgreSQL, and AWS.

## Professional Experience

- Led technical direction and reviewed delivery plans with engineers across product, customers, and production support.
- Built repeatable testing, deployment, documentation, and mentoring systems for a production platform.
- Helped lead product delivery during a period when the company generated more than $1M in revenue.

## Education

State University
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      { reviewerPrinciples: founderReviewerPrinciplesGate() },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    const founderGates = report.results.filter((result) =>
      result.gateId.startsWith("reviewerPrinciples.founder")
    );
    assert.equal(founderGates.length, 6);
    assert.equal(founderGates.every((gate) => gate.passed), true);
  });
});

test("CLI fails metric signals when reviewer feedback asks for more numbers and too few are present", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

Led customer-facing workflow delivery.

## Professional Experience

- Led a team through a complex platform rebuild.
- Improved operational workflows for customers.
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        metricSignals: {
          enabled: true,
          minimumCount: 3,
          patterns: ["5\\+ years", "4-6 person", "3,700\\+ direct commits", "Techstars 2025"],
          severity: "error",
          reworkAgent: "evidence-auditor"
        }
      },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "metricSignals");
    assert.equal(gate.passed, false);
    assert.equal(gate.measured, 0);
    assert.match(gate.message, /below 3/);
  });
});

test("CLI passes metric signals when enough configured numeric proof points are present", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Summary

5+ years building systems.

## Professional Experience

- Led a 4-6 person team and shipped with 3,700+ direct commits.
- Selected for Techstars 2025.
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        metricSignals: {
          enabled: true,
          minimumCount: 3,
          patterns: ["5\\+ years", "4-6 person", "3,700\\+ direct commits", "Techstars 2025"],
          severity: "error",
          reworkAgent: "evidence-auditor"
        }
      },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "metricSignals");
    assert.equal(gate.passed, true);
    assert.equal(gate.measured, 4);
  });
});

test("CLI fails numeric consistency when a relationship cannot be true", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Professional Experience

- Reviewed 660+ peer-authored merged pull requests, representing 500+ commits inside those PRs.
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        numericConsistency: commitReviewNumericGate()
      },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "numericConsistency");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /commits inside reviewed PRs should be greater than or equal to reviewed PR count/);
  });
});

test("CLI fails numeric consistency when a protected number uses a confusing label", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Professional Experience

- Shipped 3,700+ PRs over 5+ years and reviewed 660+ peer-authored merged pull requests, representing 5,900+ commits inside those PRs.
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        numericConsistency: commitReviewNumericGate()
      },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 1);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "numericConsistency");
    assert.equal(gate.passed, false);
    assert.match(gate.message, /3,700\+ is a direct commit count, not a PR count/);
  });
});

test("CLI passes numeric consistency when commit and PR counts are clearly labeled", () => {
  usingTempWorkspace((workspace) => {
    const resumeContent = `# Test Person

Senior Engineer

## Professional Experience

- Owned product engineering with 3,700+ personal source-control commits over 5+ years.
- Reviewed 660+ peer-authored merged pull requests, representing 5,900+ commits inside those PRs.
`;
    const paths = writeQualityInputs(
      workspace,
      minimalPdf({ pageCount: 1 }),
      {
        numericConsistency: commitReviewNumericGate()
      },
      { resumeContent }
    );
    const run = runChecker(paths, ["--max-pages", "1"]);

    assert.equal(run.status, 0);
    const report = JSON.parse(run.stdout);
    const gate = report.results.find((result) => result.gateId === "numericConsistency");
    assert.equal(gate.passed, true);
    assert.equal(gate.measured, 3);
  });
});

function runChecker(paths, extraArgs) {
  const run = spawnSync(
    process.execPath,
    [
      checkerPath,
      "--resume",
      paths.resume,
      "--gates",
      paths.gates,
      "--pdf",
      paths.pdf,
      ...extraArgs
    ],
    {
      cwd: repoRoot,
      encoding: "utf8"
    }
  );
  assert.equal(run.stderr, "");
  return run;
}

function writeQualityInputs(workspace, pdfContent, extraGates = {}, options = {}) {
  const resume = path.join(workspace, "resume.md");
  const gates = path.join(workspace, "gates.json");
  const pdf = path.join(workspace, options.pdfName || "resume.pdf");

  fs.writeFileSync(
    resume,
    options.resumeContent || "# Test Person\n\nTarget Role\n\n## Professional Experience\n\n- Delivered a concise result.\n"
  );
  fs.writeFileSync(gates, JSON.stringify({
    id: "test-gates",
    version: "test",
    gates: {
      pages: {
        enabled: true,
        minimum: 1,
        maximum: 1,
        severity: "error",
        reworkAgent: "resume-writer"
      },
      ...extraGates
    },
    agentRouting: {
      maxIterations: 1,
      defaultReworkSkill: "tailor-resume",
      notifyAgents: ["resume-writer"]
    }
  }));
  fs.writeFileSync(pdf, pdfContent, "latin1");

  return { resume, gates, pdf };
}

function usingTempWorkspace(callback) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "resume-quality-"));
  try {
    callback(workspace);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
}

function pageGate(report) {
  return report.results.find((result) => result.gateId === "pages");
}

function reviewerPrinciplesGate() {
  return {
    enabled: true,
    severity: "error",
    reworkAgent: "resume-writer",
    leadershipNearTop: {
      enabled: true,
      requiredTerms: ["Led a team of 4 engineers"],
      maxTextPercent: 35
    },
    ledTeamWording: {
      enabled: true,
      requiredPatterns: ["Led a team of 4 engineers"]
    },
    topHalfCarriesReview: {
      enabled: true,
      requiredTerms: ["Led a team of 4 engineers"],
      maxTextPercent: 50
    },
    consistentEmphasis: {
      enabled: true,
      mode: "no-emphasis-in-bullets"
    },
    teamLedWorkNotFlattened: {
      enabled: true,
      minimumLeadershipBullets: 2,
      leadershipTerms: ["Led", "Scoped", "Reviewed", "Mentored"]
    }
  };
}

function founderReviewerPrinciplesGate() {
  return {
    enabled: true,
    severity: "error",
    reworkAgent: "resume-writer",
    founderSignalBalance: {
      enabled: true,
      topTextPercent: 35,
      proofTextPercent: 65,
      targetRoleTerms: ["Lead Software Engineer", "Senior Software Engineer"],
      founderTerms: ["Founder", "Co-Founder", "CTO"],
      proofGroups: [
        { id: "tenure", terms: ["nearly six years", "6 years"] },
        { id: "team", terms: ["team of 4", "4 engineers"] },
        { id: "operating", terms: ["production", "customers", "customer-facing"] },
        { id: "business", terms: ["revenue", "$1M"] }
      ],
      minimumProofGroups: 3,
      collaborationTerms: ["led", "reviewed", "with engineers", "mentoring"],
      minimumCollaborationMatches: 2,
      technicalTerms: ["TypeScript", "Node.js", "PostgreSQL", "AWS"],
      minimumTechnicalMatches: 3,
      forbiddenTerms: [
        "wore many hats",
        "did everything",
        "visionary founder",
        "serial entrepreneur",
        "used to being my own boss"
      ],
      forbiddenAttributionPatterns: [
        "personally generated all company revenue",
        "built the product alone"
      ]
    }
  };
}

function commitReviewNumericGate() {
  return {
    enabled: true,
    severity: "error",
    reworkAgent: "evidence-auditor",
    claims: [
      {
        id: "personalCommits",
        label: "personal source-control commits",
        pattern: "([0-9][0-9,]*)\\+\\s+personal source-control commits",
        unit: "commits"
      },
      {
        id: "reviewedPeerPrs",
        label: "peer-authored merged pull requests",
        pattern: "([0-9][0-9,]*)\\+\\s+peer-authored merged pull requests",
        unit: "pull requests"
      },
      {
        id: "reviewedPrCommits",
        label: "commits inside reviewed PRs",
        pattern: "([0-9][0-9,]*)\\+\\s+commits inside those PRs",
        unit: "commits"
      }
    ],
    relationships: [
      {
        id: "reviewedPrCommitsAtLeastReviewedPrs",
        left: "reviewedPrCommits",
        operator: ">=",
        right: "reviewedPeerPrs",
        message: "commits inside reviewed PRs should be greater than or equal to reviewed PR count"
      }
    ],
    forbiddenPatterns: [
      {
        id: "personalCommitsAsPrs",
        pattern: "3,700\\+\\s+(?:merged\\s+)?PRs",
        message: "3,700+ is a direct commit count, not a PR count"
      },
      {
        id: "reviewedPrCommitsAsPrs",
        pattern: "5,900\\+\\s+(?:peer-authored\\s+)?(?:merged\\s+)?PRs(?!\\s+commits)",
        message: "5,900+ is a commit count inside reviewed PRs, not a PR count"
      }
    ]
  };
}

function minimalPdf({ pageCount, extraObject = "" }) {
  const pageRefs = Array.from({ length: pageCount }, (_, index) => `${index + 3} 0 R`).join(" ");
  const pageObjects = Array.from({ length: pageCount }, (_, index) => `${index + 3} 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj`).join("\n");
  const extra = extraObject ? `
${pageCount + 3} 0 obj
<< /Type /Metadata /Note (${extraObject}) >>
endobj` : "";

  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count ${pageCount} /Kids [${pageRefs}] >>
endobj
${pageObjects}
${extra}
trailer
<< /Root 1 0 R >>
%%EOF`;
}
