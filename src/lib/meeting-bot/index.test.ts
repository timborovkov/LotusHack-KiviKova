import { MockProvider } from "./mock";
import { RecallProvider } from "./recall";

describe("getMeetingBotProvider", () => {
  it("returns MockProvider when env is 'mock'", async () => {
    vi.stubEnv("MEETING_BOT_PROVIDER", "mock");
    const { getMeetingBotProvider } = await import("./index");
    const provider = getMeetingBotProvider();
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it("returns RecallProvider when env is 'recall'", async () => {
    vi.stubEnv("MEETING_BOT_PROVIDER", "recall");
    const { getMeetingBotProvider } = await import("./index");
    const provider = getMeetingBotProvider();
    expect(provider).toBeInstanceOf(RecallProvider);
  });

  it("throws on unknown provider", async () => {
    vi.stubEnv("MEETING_BOT_PROVIDER", "unknown");
    const { getMeetingBotProvider } = await import("./index");
    expect(() => getMeetingBotProvider()).toThrow(
      "Unknown meeting bot provider"
    );
  });
});
