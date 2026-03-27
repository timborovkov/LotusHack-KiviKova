import { Webhooks } from "@polar-sh/nextjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PLANS } from "@/lib/billing/constants";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionCreated: async (payload) => {
    const customerId = payload.data.customerId;
    const externalId = payload.data.customer?.externalId;
    if (!externalId) {
      console.error(
        "[Polar Webhook] No external customer ID on subscription.created"
      );
      return;
    }

    await db
      .update(users)
      .set({
        plan: PLANS.PRO,
        polarCustomerId: customerId,
        polarSubscriptionId: payload.data.id,
        currentPeriodStart: new Date(payload.data.currentPeriodStart),
        currentPeriodEnd: new Date(payload.data.currentPeriodEnd),
        updatedAt: new Date(),
      })
      .where(eq(users.id, externalId));

    console.log(`[Polar Webhook] Subscription created for user ${externalId}`);
  },

  onSubscriptionActive: async (payload) => {
    const externalId = payload.data.customer?.externalId;
    if (!externalId) return;

    await db
      .update(users)
      .set({
        plan: PLANS.PRO,
        polarSubscriptionId: payload.data.id,
        currentPeriodStart: new Date(payload.data.currentPeriodStart),
        currentPeriodEnd: new Date(payload.data.currentPeriodEnd),
        updatedAt: new Date(),
      })
      .where(eq(users.id, externalId));
  },

  onSubscriptionUpdated: async (payload) => {
    const externalId = payload.data.customer?.externalId;
    if (!externalId) return;

    await db
      .update(users)
      .set({
        currentPeriodStart: new Date(payload.data.currentPeriodStart),
        currentPeriodEnd: new Date(payload.data.currentPeriodEnd),
        updatedAt: new Date(),
      })
      .where(eq(users.id, externalId));
  },

  onSubscriptionCanceled: async (payload) => {
    const externalId = payload.data.customer?.externalId;
    if (!externalId) return;

    // Subscription remains active until period end, then revoked
    console.log(
      `[Polar Webhook] Subscription canceled for user ${externalId}, active until ${payload.data.currentPeriodEnd}`
    );
  },

  onSubscriptionRevoked: async (payload) => {
    const externalId = payload.data.customer?.externalId;
    if (!externalId) return;

    await db
      .update(users)
      .set({
        plan: PLANS.FREE,
        polarSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, externalId));

    console.log(`[Polar Webhook] Subscription revoked for user ${externalId}`);
  },

  onCustomerCreated: async (payload) => {
    const externalId = payload.data.externalId;
    if (!externalId) return;

    await db
      .update(users)
      .set({
        polarCustomerId: payload.data.id,
        updatedAt: new Date(),
      })
      .where(eq(users.id, externalId));
  },
});
