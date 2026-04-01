import { db } from "@/lib/db";
import { usageEvents } from "@/lib/db/schema";
import { and, gte, isNull, sql } from "drizzle-orm";

/**
 * Retry failed Polar metered usage ingests.
 * Finds usage_events from the last 7 days that were never synced to Polar
 * (polarSyncedAt IS NULL) and re-attempts the sync.
 */
export async function runBillingRetry() {
  const { isPolarEnabled, getPolar } = await import("@/lib/polar");
  if (!isPolarEnabled()) return { retried: 0, skipped: "polar_disabled" };

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

  const unsynced = await db
    .select({
      id: usageEvents.id,
      userId: usageEvents.userId,
      meetingId: usageEvents.meetingId,
      type: usageEvents.type,
      quantity: usageEvents.quantity,
      costEur: usageEvents.costEur,
    })
    .from(usageEvents)
    .where(
      and(
        isNull(usageEvents.polarSyncedAt),
        gte(usageEvents.createdAt, cutoff),
        sql`${usageEvents.type} IN ('voice_meeting', 'silent_meeting')`
      )
    )
    .limit(50);

  if (unsynced.length === 0) return { retried: 0 };

  // Lazy import to avoid circular deps
  const { users } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const polar = getPolar();
  let retried = 0;

  for (const event of unsynced) {
    if (!event.meetingId) continue;

    try {
      const [user] = await db
        .select({ polarCustomerId: users.polarCustomerId })
        .from(users)
        .where(eq(users.id, event.userId));

      if (!user?.polarCustomerId) continue;

      const hours = Number(event.quantity) / 60;
      const meetingType = event.type === "voice_meeting" ? "voice" : "silent";

      await polar.events.ingest({
        events: [
          {
            name: "meeting_usage",
            externalCustomerId: event.userId,
            externalId: `meeting_${event.meetingId}`,
            metadata: {
              meeting_id: event.meetingId,
              meeting_type: meetingType,
              duration_minutes: Number(event.quantity),
              duration_hours: hours,
              cost_eur: Number(event.costEur),
            },
          },
        ],
      });

      await db
        .update(usageEvents)
        .set({ polarSyncedAt: new Date() })
        .where(eq(usageEvents.id, event.id));

      retried++;
    } catch (err) {
      console.error(`[Billing Retry] Failed to sync event ${event.id}:`, err);
    }
  }

  if (retried > 0) {
    console.log(`[Billing Retry] Re-synced ${retried} usage events to Polar`);
  }
  return { retried };
}
