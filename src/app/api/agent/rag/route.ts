import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getRAGContext,
  formatContextForPrompt,
  MeetingNotFoundError,
  EmbeddingError,
} from "@/lib/agent/rag";

const ragSchema = z.object({
  meetingId: z.uuid(),
  query: z.string().min(1, "Query is required"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ragSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { meetingId, query } = parsed.data;

  // Look up meeting owner for userId scoping
  const [meeting] = await db
    .select({ userId: meetings.userId })
    .from(meetings)
    .where(eq(meetings.id, meetingId));

  if (!meeting) {
    return NextResponse.json({ context: "Meeting not found." });
  }

  try {
    const results = await getRAGContext(query, {
      meetingId,
      userId: meeting.userId,
      boostMeetingId: meetingId,
    });
    const context =
      formatContextForPrompt(results) || "No relevant context found.";

    return NextResponse.json({ context });
  } catch (error) {
    if (error instanceof MeetingNotFoundError) {
      return NextResponse.json({ context: "Meeting not found." });
    }
    if (error instanceof EmbeddingError) {
      return NextResponse.json({ context: "Search unavailable." });
    }
    return NextResponse.json({ context: "Error searching context." });
  }
}
