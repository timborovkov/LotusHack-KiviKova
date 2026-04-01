import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";

import { auth } from "@/lib/auth";
import {
  getIntegrations,
  CATEGORIES,
  type Integration,
} from "@/lib/integrations/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getIntegrations().map((i) => ({ slug: i.id }));
}

function findIntegration(slug: string): Integration | undefined {
  return getIntegrations().find((i) => i.id === slug);
}

function getCategoryLabel(category: Integration["category"]): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

const AUTH_LABELS: Record<string, string> = {
  oauth: "One-click OAuth",
  token: "API token",
  api_key: "API key",
  url_key: "API key (in URL)",
  none: "No authentication",
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vernix.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const integration = findIntegration(slug);
  if (!integration) return {};

  const title = `Vernix + ${integration.name} Integration`;
  const description = `Connect ${integration.name} to your video calls with Vernix. ${integration.description}`;

  return {
    title: `${title} — Vernix`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/integration/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const integration = findIntegration(slug);
  if (!integration) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const ctaHref = isLoggedIn ? "/dashboard/integrations" : "/register";
  const ctaText = isLoggedIn
    ? `Connect ${integration.name}`
    : `Get Started with ${integration.name}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Vernix + ${integration.name}`,
    applicationCategory: "BusinessApplication",
    description: `Connect ${integration.name} to your video calls with Vernix. ${integration.description}`,
    url: `${BASE_URL}/integration/${slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/features/integrations"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All integrations
      </Link>

      <header className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
            <Image
              src={integration.logo}
              alt={`${integration.name} logo`}
              width={40}
              height={40}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Vernix + {integration.name}
              </h1>
              {integration.status === "coming-soon" && (
                <Badge variant="secondary">Coming Soon</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-lg">
              Connect {integration.name} to your video calls.{" "}
              {integration.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {getCategoryLabel(integration.category)}
          </Badge>
          {integration.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* What you can do */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <MessageSquareText className="text-muted-foreground h-5 w-5" />
          What you can do
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Ask Vernix questions like these during your calls and get live answers
          from {integration.name}:
        </p>
        <ul className="space-y-3">
          {integration.examplePrompts.map((prompt) => (
            <li
              key={prompt}
              className="bg-muted rounded-lg border px-4 py-3 text-sm"
            >
              &ldquo;{prompt}&rdquo;
            </li>
          ))}
        </ul>
      </section>

      {/* How it looks */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="text-muted-foreground h-5 w-5" />
          How it looks
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Vernix responds with real data pulled from {integration.name}:
        </p>
        <ul className="space-y-3">
          {integration.sampleResponses.map((response) => (
            <li
              key={response}
              className="rounded-r-lg border-l-4 border-l-violet-500 bg-violet-500/5 px-4 py-3 text-sm"
            >
              {response}
            </li>
          ))}
        </ul>
      </section>

      {/* Getting started */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Zap className="text-muted-foreground h-5 w-5" />
          Getting started
        </h2>
        <div className="border-border divide-border divide-y rounded-lg border">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-muted-foreground text-sm">
              Connection method
            </span>
            <span className="text-sm font-medium">
              {AUTH_LABELS[integration.authMode] ?? integration.authMode}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-muted-foreground text-sm">Setup</span>
            <span className="text-sm">{integration.setupInstructions}</span>
          </div>
          {integration.docsUrl && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-muted-foreground text-sm">
                Documentation
              </span>
              <a
                href={integration.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ring hover:text-ring/80 inline-flex items-center gap-1.5 text-sm transition-colors"
              >
                {integration.name} docs
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge
              variant={
                integration.status === "available" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {integration.status === "available"
                ? "Available now"
                : "Coming soon"}
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="border-border rounded-lg border p-8 text-center">
        <p className="mb-2 text-lg font-semibold">
          Bring {integration.name} into your next call
        </p>
        <p className="text-muted-foreground mb-6 text-sm">
          {integration.status === "coming-soon"
            ? `${integration.name} integration is coming soon. Sign up to get notified.`
            : `Connect ${integration.name} and start getting live answers during your video calls.`}
        </p>
        <Button variant="accent" size="lg" render={<Link href={ctaHref} />}>
          {ctaText}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Footer nav */}
      <div className="border-border mt-8 border-t pt-8">
        <Link
          href="/features/integrations"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          See all integrations
        </Link>
      </div>
    </article>
  );
}
