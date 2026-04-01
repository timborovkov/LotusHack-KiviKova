import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, mockListObjects, mockDeleteFile } = vi.hoisted(() => {
  const db: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const m of [
    "select",
    "from",
    "where",
    "orderBy",
    "insert",
    "values",
    "returning",
    "update",
    "set",
    "delete",
    "limit",
  ]) {
    db[m] = vi.fn().mockImplementation(() => db);
  }
  return {
    mockDb: db,
    mockListObjects: vi.fn().mockResolvedValue([]),
    mockDeleteFile: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("@/lib/storage/operations", () => ({
  listObjects: mockListObjects,
  deleteFile: mockDeleteFile,
}));

import { runStorageCleanup } from "./storage-cleanup";

describe("runStorageCleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero when no objects exist", async () => {
    const result = await runStorageCleanup();

    expect(result.deleted).toBe(0);
    expect(mockListObjects).toHaveBeenCalledWith("knowledge/", 500);
    expect(mockListObjects).toHaveBeenCalledWith("recordings/", 500);
  });

  it("deletes orphaned knowledge file when document not found", async () => {
    mockListObjects
      .mockResolvedValueOnce(["knowledge/user1/doc1/file.pdf"])
      .mockResolvedValueOnce([]); // no recordings
    // Not found by s3Key
    mockDb.limit
      .mockResolvedValueOnce([])
      // Not found by docId
      .mockResolvedValueOnce([]);

    const result = await runStorageCleanup();

    expect(result.deleted).toBe(1);
    expect(mockDeleteFile).toHaveBeenCalledWith(
      "knowledge/user1/doc1/file.pdf"
    );
  });

  it("does not delete knowledge file when document exists by s3Key", async () => {
    mockListObjects
      .mockResolvedValueOnce(["knowledge/user1/doc1/file.pdf"])
      .mockResolvedValueOnce([]);
    // Found by s3Key
    mockDb.limit.mockResolvedValueOnce([{ id: "doc1" }]);

    const result = await runStorageCleanup();

    expect(result.deleted).toBe(0);
    expect(mockDeleteFile).not.toHaveBeenCalled();
  });

  it("deletes orphaned recording when meeting not found", async () => {
    mockListObjects
      .mockResolvedValueOnce([]) // no knowledge files
      .mockResolvedValueOnce(["recordings/meeting-123.mp4"]);
    // Not found by recordingKey metadata
    mockDb.limit
      .mockResolvedValueOnce([])
      // Not found by meeting ID
      .mockResolvedValueOnce([]);

    const result = await runStorageCleanup();

    expect(result.deleted).toBe(1);
    expect(mockDeleteFile).toHaveBeenCalledWith("recordings/meeting-123.mp4");
  });

  it("does not delete recording when meeting still exists", async () => {
    mockListObjects
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(["recordings/meeting-123.mp4"]);
    // Not found by recordingKey
    mockDb.limit
      .mockResolvedValueOnce([])
      // But found by meeting ID
      .mockResolvedValueOnce([{ id: "meeting-123" }]);

    const result = await runStorageCleanup();

    expect(result.deleted).toBe(0);
  });
});
