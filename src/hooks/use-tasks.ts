"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Task } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query-keys";

async function fetchTasks(meetingId: string): Promise<Task[]> {
  const res = await fetch(`/api/meetings/${meetingId}/tasks`);
  if (!res.ok) throw new Error("Failed to load tasks");
  const data = await res.json();
  return data.tasks;
}

export function useMeetingTasks(meetingId: string) {
  const queryClient = useQueryClient();
  const qk = queryKeys.tasks.byMeeting(meetingId);

  const { data: tasks = [], isLoading: loading } = useQuery({
    queryKey: qk,
    queryFn: () => fetchTasks(meetingId),
  });

  // Invalidate all task queries (prefix match covers both byMeeting and all)
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });

  const addMutation = useMutation({
    mutationFn: async (params: { title: string; assignee?: string }) => {
      const res = await fetch(`/api/meetings/${meetingId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Failed to add task");
      return res.json();
    },
    onSuccess: invalidateTasks,
    onError: () => toast.error("Failed to add task"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Pick<Task, "title" | "status" | "assignee">>;
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
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      const previousMeeting = queryClient.getQueryData<Task[]>(qk);
      const previousAll = queryClient.getQueriesData({
        queryKey: queryKeys.tasks.all,
      });

      // Optimistic update on per-meeting tasks
      queryClient.setQueryData<Task[]>(qk, (old) =>
        old?.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      // Optimistic update on all task caches (prefix-matched)
      // For filtered caches (e.g. ["tasks","open"]), remove tasks that no longer match
      const allTaskQueries = queryClient.getQueriesData({
        queryKey: queryKeys.tasks.all,
      });
      for (const [key] of allTaskQueries) {
        queryClient.setQueryData(key, (old: unknown) => {
          if (!Array.isArray(old)) return old;
          const updated = old.map((t: Record<string, unknown>) =>
            t.id === taskId ? { ...t, ...updates } : t
          );
          const filterStatus = key.length > 1 ? key[key.length - 1] : null;
          if (
            updates.status &&
            typeof filterStatus === "string" &&
            (filterStatus === "open" || filterStatus === "completed")
          ) {
            return updated.filter(
              (t: Record<string, unknown>) => t.status === filterStatus
            );
          }
          return updated;
        });
      }
      return { previousMeeting, previousAll };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousMeeting)
        queryClient.setQueryData(qk, context.previousMeeting);
      if (context?.previousAll) {
        for (const [key, data] of context.previousAll) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("Failed to update task");
    },
    onSettled: invalidateTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/meetings/${meetingId}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
    },
    onSuccess: invalidateTasks,
    onError: () => toast.error("Failed to delete task"),
  });

  return {
    tasks,
    loading,
    addTask: (title: string, assignee?: string) =>
      addMutation.mutate({ title, assignee }),
    updateTask: (
      taskId: string,
      updates: Partial<Pick<Task, "title" | "status" | "assignee">>
    ) => updateMutation.mutate({ taskId, updates }),
    deleteTask: (taskId: string) => deleteMutation.mutate(taskId),
    refresh: invalidateTasks,
  };
}
