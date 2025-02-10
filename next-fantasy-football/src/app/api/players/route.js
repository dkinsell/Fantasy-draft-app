import { getAllPlayers } from "@/lib/playerApiController";

export async function GET(request) {
  const result = await getAllPlayers();
  if (result.success) {
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify(result), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
