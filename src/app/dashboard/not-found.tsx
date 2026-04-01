import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <div className="bg-ring/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <FileQuestion className="text-ring h-8 w-8" />
      </div>
      <h1 className="mb-2 text-lg font-medium">Page not found</h1>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Button render={<Link href="/dashboard" />}>Back to dashboard</Button>
    </div>
  );
}
