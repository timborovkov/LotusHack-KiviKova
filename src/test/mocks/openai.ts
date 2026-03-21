import { vi } from "vitest";

export function createMockOpenAIClient() {
  return {
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0) }],
      }),
    },
  };
}
