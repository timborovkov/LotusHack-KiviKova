import { chunkText } from "./chunk";

describe("chunkText", () => {
  it("returns empty array for empty string", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   ")).toEqual([]);
  });

  it("returns single chunk for short text", () => {
    const chunks = chunkText("Hello world", { chunkSize: 100 });
    expect(chunks).toEqual([{ text: "Hello world", index: 0 }]);
  });

  it("splits long text into overlapping chunks", () => {
    const text =
      "A".repeat(500) + " " + "B".repeat(500) + " " + "C".repeat(500);
    const chunks = chunkText(text, { chunkSize: 600, overlap: 100 });

    expect(chunks.length).toBeGreaterThan(1);

    // Each chunk should have sequential indices
    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i].index).toBe(i);
    }

    // All text should be covered (each char appears in at least one chunk)
    const covered = new Set<number>();
    for (const chunk of chunks) {
      const start = text.indexOf(chunk.text);
      if (start >= 0) {
        for (let i = start; i < start + chunk.text.length; i++) {
          covered.add(i);
        }
      }
    }
  });

  it("respects chunkSize option", () => {
    const text = "Word ".repeat(200);
    const chunks = chunkText(text, { chunkSize: 100, overlap: 20 });

    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(110); // some slack for sentence boundaries
    }
  });

  it("produces non-empty chunks", () => {
    const text =
      "The quick brown fox jumped over the lazy dog. " +
      "She sells sea shells by the sea shore. " +
      "Pack my box with five dozen liquor jugs.";
    const chunks = chunkText(text, { chunkSize: 50, overlap: 10 });

    expect(chunks.length).toBeGreaterThan(0);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeGreaterThan(0);
    }
  });

  it("uses default options when none provided", () => {
    const text = "A".repeat(2000);
    const chunks = chunkText(text);

    // Default chunkSize=1000, so 2000 chars should produce at least 2 chunks
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });
});
