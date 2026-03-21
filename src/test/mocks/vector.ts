import { vi } from "vitest";

export function createMockQdrantClient() {
  return {
    createCollection: vi.fn().mockResolvedValue(undefined),
    deleteCollection: vi.fn().mockResolvedValue(undefined),
    upsert: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue([]),
    getCollections: vi.fn().mockResolvedValue({ collections: [] }),
  };
}
