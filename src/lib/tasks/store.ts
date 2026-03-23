import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import type { ExtractedTask } from "./extract";

/**
 * Store extracted action items for a meeting.
 * Deletes existing tasks first (idempotent for re-extraction).
 */
export async function storeExtractedTasks(
  meetingId: string,
  userId: string,
  items: ExtractedTask[]
): Promise<void> {
  // Clear previous auto-extracted tasks for this meeting
  await db.delete(tasks).where(eq(tasks.meetingId, meetingId));

  if (items.length === 0) return;

  await db.insert(tasks).values(
    items.map((item) => ({
      meetingId,
      userId,
      title: item.title,
      assignee: item.assignee,
    }))
  );
}
