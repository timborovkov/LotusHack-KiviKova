import { withApiAuth } from "@/lib/api/middleware";
import { apiSuccess, handleServiceError } from "@/lib/api/response";
import {
  getMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/lib/services/meetings";

export const GET = withApiAuth(
  async (_request, user, { params }) => {
    const { id } = await params;
    try {
      const meeting = await getMeeting(user.id, id);
      return apiSuccess(meeting);
    } catch (error) {
      return handleServiceError(error);
    }
  },
  { endpoint: "meetings:get" }
);

export const PATCH = withApiAuth(
  async (request, user, { params }) => {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const { apiError } = await import("@/lib/api/response");
      return apiError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const { title, joinLink, agenda, silent, muted, noRecording } =
      body as Record<string, unknown>;

    try {
      const updated = await updateMeeting(user.id, id, {
        title: typeof title === "string" ? title : undefined,
        joinLink: typeof joinLink === "string" ? joinLink : undefined,
        agenda: typeof agenda === "string" ? agenda : undefined,
        silent: typeof silent === "boolean" ? silent : undefined,
        muted: typeof muted === "boolean" ? muted : undefined,
        noRecording: typeof noRecording === "boolean" ? noRecording : undefined,
      });
      return apiSuccess(updated);
    } catch (error) {
      return handleServiceError(error);
    }
  },
  { endpoint: "meetings:update" }
);

export const DELETE = withApiAuth(
  async (_request, user, { params }) => {
    const { id } = await params;
    try {
      await deleteMeeting(user.id, id);
      return apiSuccess({ deleted: true });
    } catch (error) {
      return handleServiceError(error);
    }
  },
  { endpoint: "meetings:delete" }
);
