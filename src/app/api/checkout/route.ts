import { Checkout } from "@polar-sh/nextjs";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN!,
  successUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/settings?billing=success&checkout_id={CHECKOUT_ID}`,
  server: env.POLAR_SERVER as "sandbox" | "production",
});
