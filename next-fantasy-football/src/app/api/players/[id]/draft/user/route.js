import { updatePlayerDraftStatus } from "@/lib/playerDraftController";

export const PATCH = async (request, context) => {
  try {
    const { params } = context;
    const { id } = await params;
    const result = await updatePlayerDraftStatus(id, "user");
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to mark player as drafted by user",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
