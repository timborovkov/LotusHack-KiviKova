# Cron Jobs

> Scheduled tasks that run on a recurring basis outside of user requests.

---

## Overview

Vernix uses HTTP-based cron endpoints under `/api/cron/*`. Each endpoint is a standard Next.js API route that performs a scheduled task when called via GET. All endpoints are protected by a shared `CRON_SECRET` Bearer token to prevent unauthorized access.

These routes are not in the middleware matcher, so they bypass session auth. Authentication is via the `Authorization: Bearer <CRON_SECRET>` header instead.

---

## Setup

### Environment Variable

```bash
CRON_SECRET=your-secret-here  # Generate with: openssl rand -base64 32
```

### Scheduler

Call each endpoint on its schedule using any cron runner:

**Railway (recommended):**
Add a cron service in `railway.json` or via the Railway dashboard. Each job runs `curl` against the endpoint.

**External (Upstash QStash, cron-job.org, etc.):**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://vernix.app/api/cron/trial-warnings
```

**Local development:**

```bash
curl -H "Authorization: Bearer your-cron-secret-here" http://localhost:3000/api/cron/trial-warnings
```

---

## Jobs

### Trial Expiry Warnings

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| **Endpoint** | `GET /api/cron/trial-warnings`             |
| **Schedule** | Daily (once per day, any time)             |
| **Source**   | `src/app/api/cron/trial-warnings/route.ts` |

**What it does:**

1. Queries users whose `trialEndsAt` falls within the next 3 days or 1 day
2. Filters to free-plan users without an active Polar subscription (skips users who already upgraded)
3. Sends a trial expiry warning email via Resend

**Warning schedule:**

- 3 days before trial expires
- 1 day before trial expires

**Idempotency:** Safe to run multiple times per day. Uses date-window queries (midnight to midnight), so the same user gets at most one email per warning tier per day. However, there's no "email already sent" tracking, so if the job runs twice in a day, users could get duplicate emails. For production, consider adding a `lastTrialWarningAt` field to the users table.

**Dependencies:** Requires `CRON_SECRET` and Resend email configuration.

**Response:**

```json
{
  "sent": 5,
  "emails": ["alice@example.com (3d)", "bob@example.com (1d)", ...]
}
```

---

## Adding New Cron Jobs

1. Create a new route at `src/app/api/cron/<job-name>/route.ts`
2. Verify `CRON_SECRET` at the top of the handler
3. Add the job to this document
4. Configure the schedule in your cron runner

### Template

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = request.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ... job logic ...

  return NextResponse.json({ ok: true });
}
```

---

## Future Jobs

- **Usage credit reset** — Reset monthly usage counters at billing period boundaries (currently handled by Polar's billing cycle)
- **Data retention cleanup** — Archive/delete data for churned users per retention policy (30-day read-only, 90-day archive, 180-day delete)
- **Stale meeting cleanup** — Mark meetings stuck in "joining" status for >1 hour as "failed"
- **Usage alerts** — Send email when Pro users hit 80% or 100% of their monthly credit
