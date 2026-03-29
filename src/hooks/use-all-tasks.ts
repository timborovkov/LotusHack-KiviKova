"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";

export interface TaskWithMeeting {
  id: string;
  meetingId: string;
  title: string;
  assignee: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
  meetingTitle: string | null;
}

async function fetchAllTasks(status?: string): Promise<TaskWithMeeting[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`/api/tasks${params}`);
  if (!res.ok) throw new Error("Failed to load tasks");
  const data = await res.json();
  return data.tasks;
}

export function useAllTasks(status?: "open" | "completed") {
  const queryClient = useQueryClient();
  const queryKey = status
    ? [...queryKeys.tasks.all, status]
    : queryKeys.tasks.all;

  const { data: tasks = [], isLoading: loading } = useQuery({
    queryKey,
    queryFn: () => fetchAllTasks(status),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      meetingId,
      taskId,
      updates,
    }: {
      meetingId: string;
      taskId: string;
      updates: { status?: string; title?: string; assignee?: string | null };
    }) => {
      const res = await fetch(`/api/meetings/${meetingId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onMutate: async ({ taskId, updates }) => {
      // Optimistic update: immediately reflect the change in all task caches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      const previousData = queryClient.getQueriesData<TaskWithMeeting[]>({
        queryKey: queryKeys.tasks.all,
      });
      queryClient.setQueriesData<TaskWithMeeting[]>(
        { queryKey: queryKeys.tasks.all },
        (old) => old?.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("Failed to update task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });

  return {
    tasks,
    loading,
    updateTask: (
      meetingId: string,
      taskId: string,
      updates: { status?: string; title?: string; assignee?: string | null }
    ) => updateMutation.mutate({ meetingId, taskId, updates }),
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
  };
}
