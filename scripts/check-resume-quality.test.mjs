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

function writeQualityInputs(workspace, pdfContent, extraGates = {}) {
  const resume = path.join(workspace, "resume.md");
  const gates = path.join(workspace, "gates.json");
  const pdf = path.join(workspace, "resume.pdf");

  fs.writeFileSync(resume, "# Test Person\n\nTarget Role\n\n## Professional Experience\n\n- Delivered a concise result.\n");
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
