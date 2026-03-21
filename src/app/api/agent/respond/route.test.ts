const { mockDb, mockGetRAGContext, mockFormatContext, mockChatCreate } =
  vi.hoisted(() => {
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
    ]) {
      db[m] = vi.fn().mockImplementation(() => db);
    }
    return {
      mockDb: db,
      mockGetRAGContext: vi.fn().mockResolvedValue([]),
      mockFormatContext: vi.fn().mockReturnValue(""),
      mockChatCreate: vi.fn().mockResolvedValue({
        choices: [{ message: { content: "Test answer" } }],
      }),
    };
  });

vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("@/lib/agent/rag", () => ({
  getRAGContext: mockGetRAGContext,
  formatContextForPrompt: mockFormatContext,
}));
vi.mock("@/lib/openai/client", () => ({
  getOpenAIClient: () => ({
    chat: { completions: { create: mockChatCreate } },
  }),
}));

import { POST } from "./route";
import {
  createJsonRequest,
  parseJsonResponse,
  fakeMeeting,
} from "@/test/helpers";

const URL = "http://localhost/api/agent/respond";

describe("POST /api/agent/respond", () => {
  it("returns 400 on malformed JSON body", async () => {
    const req = new Request(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    const { status, data } = await parseJsonResponse(await POST(req));
    expect(status).toBe(400);
    expect(data.error).toMatch(/invalid json/i);
  });

  it("returns 400 on missing meetingId", async () => {
    const req = createJsonRequest(URL, {
      method: "POST",
      body: { question: "test" },
    });
    const { status } = await parseJsonResponse(await POST(req));
    expect(status).toBe(400);
  });

  it("returns 400 on missing question", async () => {
    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" },
    });
    const { status } = await parseJsonResponse(await POST(req));
    expect(status).toBe(400);
  });

  it("returns 400 on invalid UUID", async () => {
    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: "not-a-uuid", question: "test" },
    });
    const { status } = await parseJsonResponse(await POST(req));
    expect(status).toBe(400);
  });

  it("returns 404 when meeting not found", async () => {
    mockDb.where.mockResolvedValueOnce([]);

    const req = createJsonRequest(URL, {
      method: "POST",
      body: {
        meetingId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        question: "test",
      },
    });
    const { status } = await parseJsonResponse(await POST(req));
    expect(status).toBe(404);
  });

  it("returns 200 with answer and sources on success", async () => {
    const meeting = fakeMeeting();
    mockDb.where.mockResolvedValueOnce([meeting]);
    const sources = [
      {
        text: "context",
        speaker: "Alice",
        timestampMs: 1000,
        score: 0.9,
        meetingId: meeting.id,
      },
    ];
    mockGetRAGContext.mockResolvedValueOnce(sources);
    mockFormatContext.mockReturnValueOnce("[Alice] (1000ms): context");
    mockChatCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "The answer" } }],
    });

    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: meeting.id, question: "What was said?" },
    });
    const { status, data } = await parseJsonResponse(await POST(req));

    expect(status).toBe(200);
    expect(data.answer).toBe("The answer");
    expect(data.sources).toHaveLength(1);
    expect(data.sources[0].text).toBe("context");
  });

  it("passes meetingId to getRAGContext", async () => {
    const meeting = fakeMeeting();
    mockDb.where.mockResolvedValueOnce([meeting]);

    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: meeting.id, question: "test" },
    });
    await POST(req);

    expect(mockGetRAGContext).toHaveBeenCalledWith("test", {
      meetingId: meeting.id,
    });
  });

  it("includes RAG context in system prompt", async () => {
    const meeting = fakeMeeting();
    mockDb.where.mockResolvedValueOnce([meeting]);
    mockFormatContext.mockReturnValueOnce("## Context\nSome context");

    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: meeting.id, question: "test" },
    });
    await POST(req);

    const callArgs = mockChatCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain("## Context\nSome context");
  });

  it("returns 500 when chat completion throws", async () => {
    const meeting = fakeMeeting();
    mockDb.where.mockResolvedValueOnce([meeting]);
    mockChatCreate.mockRejectedValueOnce(new Error("LLM down"));

    const req = createJsonRequest(URL, {
      method: "POST",
      body: { meetingId: meeting.id, question: "test" },
    });
    const { status, data } = await parseJsonResponse(await POST(req));

    expect(status).toBe(500);
    expect(data.error).toMatch(/failed/i);
  });
});
