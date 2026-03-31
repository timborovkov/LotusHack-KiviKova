import { NextResponse } from "next/server";
import { runUpgradeReminders } from "@/lib/cron/jobs/upgrade-reminders";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization");
  if (!cronSecret || secret !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runUpgradeReminders();
  return NextResponse.json(result);
}
