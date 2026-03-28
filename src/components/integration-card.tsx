"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Check, Clock, ChevronDown, ExternalLink } from "lucide-react";
import type { Integration } from "@/lib/integrations/catalog";

interface IntegrationCardProps {
  integration: Integration;
  connected: boolean;
  onConnect: (integration: Integration) => void;
  onDisconnect: (integration: Integration) => void;
}

export function IntegrationCard({
  integration,
  connected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const isComingSoon = integration.status === "coming-soon";
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Card
        className={`transition-colors ${connected ? "border-ring/30" : ""}`}
      >
        <CardContent className="p-0">
          <button
            type="button"
            className="flex w-full items-start gap-3 p-4 text-left"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <Image
                src={integration.logo}
                alt={integration.name}
                width={24}
                height={24}
                className="opacity-80"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{integration.name}</p>
                {connected && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-600"
                  >
                    <Check className="mr-0.5 h-3 w-3" />
                    Connected
                  </Badge>
                )}
                {isComingSoon && (
                  <Badge variant="outline">
                    <Clock className="mr-0.5 h-3 w-3" />
                    Soon
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                {integration.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          {expanded && (
            <div className="border-t px-4 pt-3 pb-4">
              {integration.examplePrompts.length > 0 && (
                <div className="mb-3">
                  <p className="text-muted-foreground mb-1.5 text-[11px] font-medium tracking-wide uppercase">
                    Example prompts
                  </p>
                  <div className="space-y-1">
                    {integration.examplePrompts.map((prompt) => (
                      <p
                        key={prompt}
                        className="text-muted-foreground text-xs italic"
                      >
                        &quot;{prompt}&quot;
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {connected ? (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDisconnect(true);
                    }}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    variant={isComingSoon ? "outline" : "default"}
                    disabled={isComingSoon}
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnect(integration);
                    }}
                  >
                    {isComingSoon ? "Soon" : "Connect"}
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(integration.docsUrl, "_blank", "noopener");
                  }}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Docs
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmDisconnect}
        onOpenChange={setConfirmDisconnect}
        title={`Disconnect ${integration.name}?`}
        description="The agent will no longer have access to this integration during calls."
        confirmLabel="Disconnect"
        onConfirm={() => {
          setConfirmDisconnect(false);
          onDisconnect(integration);
        }}
      />
    </>
  );
}
