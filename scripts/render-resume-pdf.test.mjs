import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { buildChromiumPdfArgs, toBrowserPath, toFileUrl } from "../src/resumes/render-pdf.mjs";

test("converts WSL paths into browser file URLs", () => {
  assert.equal(
    toFileUrl("/mnt/c/Users/example/Documents/Career/resume.html"),
    "file:///C:/Users/example/Documents/Career/resume.html"
  );
});

test("converts WSL paths into Windows browser output paths", () => {
  assert.equal(
    toBrowserPath("/mnt/c/Users/example/Documents/Career/resume.pdf"),
    "C:\\Users\\example\\Documents\\Career\\resume.pdf"
  );
});

test("builds Chromium args that disable print headers and footers", () => {
  const args = buildChromiumPdfArgs({
    htmlPath: "/mnt/c/Users/example/Documents/resume.html",
    pdfPath: "/mnt/c/Users/example/Documents/resume.pdf",
    userDataDir: path.join("/tmp", "profile")
  });

  assert.ok(args.includes("--no-pdf-header-footer"));
  assert.ok(args.includes("--print-to-pdf-no-header"));
  assert.ok(args.some((arg) => arg.startsWith("--print-to-pdf=C:\\Users\\example\\Documents\\resume.pdf")));
  assert.equal(args.at(-1), "file:///C:/Users/example/Documents/resume.html");
});
