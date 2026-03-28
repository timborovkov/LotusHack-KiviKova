import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, isNotNull, lte } from "drizzle-orm";
import { syncBillingFromPolar } from "@/lib/billing/sync";

/**
 * Cron endpoint: reconciles billing state for users whose billing period has ended.
 * Catches cases where webhooks were missed or delayed.
 * Protected by CRON_SECRET.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization");
  if (!cronSecret || secret !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const synced: string[] = [];

  // Find Pro users whose billing period has ended (potential missed revoke)
  const staleProUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      and(
        eq(users.plan, "pro"),
        isNotNull(users.polarCustomerId),
        isNotNull(users.currentPeriodEnd),
        lte(users.currentPeriodEnd, now)
      )
    );

  for (const user of staleProUsers) {
    await syncBillingFromPolar(user.id);
    synced.push(user.email);
  }

  // Find free users with stale trialEndsAt (trial expired, needs cleanup)
  const staleTrialUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      and(
        eq(users.plan, "free"),
        isNotNull(users.polarCustomerId),
        isNotNull(users.trialEndsAt),
        lte(users.trialEndsAt, now)
      )
    );

  for (const user of staleTrialUsers) {
    await syncBillingFromPolar(user.id);
    synced.push(user.email);
  }

  console.log(
    `[Billing Sync Cron] Synced ${synced.length} users:`,
    synced.join(", ") || "none"
  );

  return NextResponse.json({ synced: synced.length, users: synced });
}
