"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  X,
  ArrowRight,
  Zap,
  Search,
  MessageSquare,
  Plug,
} from "lucide-react";
import { useBilling } from "@/hooks/use-billing";
import { PLANS, PRICING } from "@/lib/billing/constants";
import { getCheckoutUrl } from "@/lib/billing/checkout-url";

const STORAGE_KEY = "vernix_trial_prompt";
const SHOW_EVERY_N_VISITS = 3;
const DISMISS_COOLDOWN_DAYS = 7;

interface PromptState {
  visits: number;
  dismissedAt: number | null;
}

function getState(): PromptState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { visits: 0, dismissedAt: null };
}

function setState(state: PromptState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface TrialPromptBannerProps {
  hasCompletedMeetings?: boolean;
}

export function TrialPromptBanner({
  hasCompletedMeetings = false,
}: TrialPromptBannerProps) {
  const { billing, loading } = useBilling();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || !billing) return;

    // Pro users (non-trialing) never see this
    const isPro = billing.plan === PLANS.PRO;
    if (isPro && !billing.trialing) return;

    // Trialing users always see it (retention message)
    if (billing.trialing) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    // Free users: periodic prompt
    const state = getState();
    const newVisits = state.visits + 1;

    if (state.dismissedAt) {
      const daysSinceDismiss =
        (Date.now() - state.dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) {
        setState({ ...state, visits: newVisits });
        return;
      }
    }

    const shouldShow = newVisits % SHOW_EVERY_N_VISITS === 0;
    setState({ ...state, visits: newVisits, dismissedAt: null });

    if (shouldShow) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [billing, loading]);

  if (!visible || !billing) return null;

  const dismiss = () => {
    setVisible(false);
    if (!billing.trialing) {
      const state = getState();
      setState({ ...state, dismissedAt: Date.now() });
    }
  };

  const checkoutUrl = getCheckoutUrl();

  // Trialing user: retention message
  if (billing.trialing) {
    return (
      <Card className="border-ring/20 bg-ring/5 mb-6">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="bg-ring/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Zap className="text-ring h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              Pro trial: {billing.trialDaysRemaining} day
              {billing.trialDaysRemaining !== 1 ? "s" : ""} left
            </p>
            <p className="text-muted-foreground text-xs">
              Keep voice agent, cross-meeting search, and 200 queries/day after
              your trial. €{PRICING[PLANS.PRO].monthly}/mo.
            </p>
          </div>
          <Button
            size="sm"
            variant="accent"
            onClick={() => {
              window.location.href = "/dashboard/settings";
            }}
          >
            Keep Pro
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={dismiss}
            className="text-muted-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Free user who has completed meetings: value-based upgrade
  if (hasCompletedMeetings) {
    return (
      <Card className="border-ring/20 bg-ring/5 mb-6">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="bg-ring/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Mic className="text-ring h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              Want the voice agent on your next call?
            </p>
            <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                Answers live
              </span>
              <span className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                Cross-meeting search
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                200 queries/day
              </span>
              <span className="flex items-center gap-1">
                <Plug className="h-3 w-3" />
                Integrations
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="accent"
            onClick={() => {
              window.location.href = checkoutUrl;
            }}
          >
            Try free for 14 days
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={dismiss}
            className="text-muted-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Free user, no completed meetings: simple trial prompt
  return (
    <Card className="border-ring/20 bg-ring/5 mb-6">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="bg-ring/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Mic className="text-ring h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            Try the voice agent free for 14 days
          </p>
          <p className="text-muted-foreground text-xs">
            Ask questions out loud during meetings. Then €
            {PRICING[PLANS.PRO].monthly}/mo. Cancel anytime.
          </p>
        </div>
        <Button
          size="sm"
          variant="accent"
          onClick={() => {
            window.location.href = checkoutUrl;
          }}
        >
          Start trial
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={dismiss}
          className="text-muted-foreground shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
