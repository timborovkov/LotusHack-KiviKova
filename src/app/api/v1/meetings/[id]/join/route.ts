import { withApiAuth } from "@/lib/api/middleware";
import { apiSuccess, handleServiceError } from "@/lib/api/response";
import { joinMeeting } from "@/lib/services/agent";

export const POST = withApiAuth(
  async (_request, user, { params }) => {
    const { id } = await params;
    try {
      const result = await joinMeeting(user.id, id);
      return apiSuccess(result);
    } catch (error) {
      return handleServiceError(error);
    }
  },
  { endpoint: "meetings:join", ratePerMinute: 10 }
);
