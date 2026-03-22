import { createRequire } from "module";
import mammoth from "mammoth";

export type FileType = "pdf" | "docx" | "txt" | "md";

/**
 * Extract text from a PDF buffer using pdfjs-dist legacy build.
 * We resolve the worker file from node_modules so pdfjs can run
 * on the main thread inside Next.js server bundles.
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  const require = createRequire(import.meta.url);
  const workerPath = require.resolve(
    "pdfjs-dist/legacy/build/pdf.worker.mjs"
  );

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .filter((item: { str?: string }) => "str" in item)
      .map((item: { str: string }) => item.str)
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n");
}

export async function parseDocument(
  buffer: Buffer,
  fileType: FileType
): Promise<string> {
  switch (fileType) {
    case "pdf":
      return parsePDF(buffer);
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    case "txt":
    case "md":
      return new TextDecoder().decode(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
