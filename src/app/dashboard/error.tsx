"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="container mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <TriangleAlert className="text-destructive h-8 w-8" />
      </div>
      <h1 className="mb-2 text-lg font-medium">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="text-muted-foreground mb-4 font-mono text-xs">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Back to dashboard
        </Button>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
