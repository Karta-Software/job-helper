import fs from "node:fs";

export function countPdfPages(pdfPath) {
  return countPdfPagesFromText(fs.readFileSync(pdfPath, "latin1"));
}

export function countPdfPagesFromText(pdfText) {
  const objects = parsePdfObjects(pdfText);
  const catalog = findCatalogObject(objects, pdfText);
  const pageTreeRef = catalog && firstRef(catalog.body, "Pages");

  if (pageTreeRef) {
    const pageTree = objects.get(refKey(pageTreeRef));
    const count = pageTree && firstNumber(pageTree.body, "Count");
    if (Number.isInteger(count) && count >= 0) return count;
  }

  const pageObjectCount = [...objects.values()].filter((object) => /\/Type\s*\/Page(?!s)\b/.test(object.body)).length;
  if (pageObjectCount > 0) return pageObjectCount;

  throw new Error("Could not count pages in PDF.");
}

function parsePdfObjects(pdfText) {
  const objects = new Map();
  const objectPattern = /(\d+)\s+(\d+)\s+obj\b([\s\S]*?)\bendobj\b/g;
  for (const match of pdfText.matchAll(objectPattern)) {
    const ref = { objectNumber: Number(match[1]), generationNumber: Number(match[2]) };
    objects.set(refKey(ref), {
      ...ref,
      body: match[3]
    });
  }
  return objects;
}

function findCatalogObject(objects, pdfText) {
  const rootRef = firstTrailerRootRef(pdfText);
  if (rootRef) {
    const rootObject = objects.get(refKey(rootRef));
    if (rootObject) return rootObject;
  }

  return [...objects.values()].find((object) => /\/Type\s*\/Catalog\b/.test(object.body));
}

function firstTrailerRootRef(pdfText) {
  const rootMatch = pdfText.match(/\/Root\s+(\d+)\s+(\d+)\s+R\b/);
  if (!rootMatch) return undefined;
  return {
    objectNumber: Number(rootMatch[1]),
    generationNumber: Number(rootMatch[2])
  };
}

function firstRef(text, name) {
  const escapedName = escapeRegExp(name);
  const refMatch = text.match(new RegExp(`/${escapedName}\\s+(\\d+)\\s+(\\d+)\\s+R\\b`));
  if (!refMatch) return undefined;
  return {
    objectNumber: Number(refMatch[1]),
    generationNumber: Number(refMatch[2])
  };
}

function firstNumber(text, name) {
  const escapedName = escapeRegExp(name);
  const numberMatch = text.match(new RegExp(`/${escapedName}\\s+(\\d+)\\b`));
  return numberMatch ? Number(numberMatch[1]) : undefined;
}

function refKey(ref) {
  return `${ref.objectNumber} ${ref.generationNumber}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
