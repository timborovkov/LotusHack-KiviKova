import { NextResponse } from "next/server";
import { runMeetingRecovery } from "@/lib/cron/jobs/meeting-recovery";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization");
  if (!cronSecret || secret !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runMeetingRecovery();
  return NextResponse.json(result);
}
