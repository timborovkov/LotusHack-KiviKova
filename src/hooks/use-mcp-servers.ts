"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";

export type McpAuthType = "none" | "bearer" | "header" | "basic" | "oauth";

interface McpServerInfo {
  id: string;
  name: string;
  url: string;
  authType: McpAuthType;
  catalogIntegrationId: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddServerParams {
  name: string;
  url: string;
  authType?: McpAuthType;
  authHeaderName?: string;
  authHeaderValue?: string;
  authUsername?: string;
  authPassword?: string;
  catalogIntegrationId?: string;
  // Legacy
  apiKey?: string;
}

async function fetchServers(): Promise<McpServerInfo[]> {
  const res = await fetch("/api/settings/mcp-servers");
  if (!res.ok) throw new Error("Failed to load MCP servers");
  const data = await res.json();
  return data.servers;
}

export function useMcpServers() {
  const queryClient = useQueryClient();

  const { data: servers = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.mcpServers.all,
    queryFn: fetchServers,
    meta: { errorMessage: "Failed to load MCP servers" },
  });

  const addMutation = useMutation({
    mutationFn: async (params: AddServerParams) => {
      const res = await fetch("/api/settings/mcp-servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Failed to add MCP server");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcpServers.all });
      toast.success("MCP server added");
    },
    onError: () => toast.error("Failed to add MCP server"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const res = await fetch(`/api/settings/mcp-servers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("Failed to update server");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcpServers.all });
    },
    onError: () => toast.error("Failed to update server"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/settings/mcp-servers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete server");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcpServers.all });
      toast.success("MCP server removed");
    },
    onError: () => toast.error("Failed to delete server"),
  });

  return {
    servers,
    loading,
    addServer: async (params: AddServerParams) => {
      await addMutation.mutateAsync(params);
    },
    toggleServer: (id: string, enabled: boolean) =>
      toggleMutation.mutate({ id, enabled }),
    deleteServer: (id: string) => deleteMutation.mutate(id),
  };
}
