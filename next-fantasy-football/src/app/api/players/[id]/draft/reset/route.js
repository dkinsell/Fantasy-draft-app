import { updatePlayerDraftStatus } from "@/lib/playerDraftController";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const result = await updatePlayerDraftStatus(id, null);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to reset player draft status",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
