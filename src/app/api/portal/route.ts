import { CustomerPortal } from "@polar-sh/nextjs";
import { getEnv } from "@/lib/env";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

const env = getEnv();

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN!,
  returnUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  server: env.POLAR_SERVER as "sandbox" | "production",
  getCustomerId: async (_req: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) return "";

    const [user] = await db
      .select({ polarCustomerId: users.polarCustomerId })
      .from(users)
      .where(eq(users.id, session.user.id));

    return user?.polarCustomerId ?? "";
  },
});
