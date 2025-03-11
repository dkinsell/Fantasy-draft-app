import { getServerSidePlayersData } from "../lib/playerApiController";
import { ClientHome } from "../components/client/client-home";

// Add this to skip DB connection during build
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Wrap in try/catch to handle build-time errors gracefully
  try {
    const initialPlayers = await getServerSidePlayersData();
    return <ClientHome initialPlayers={initialPlayers} />;
  } catch (error) {
    console.error("Error fetching players:", error);
    // Return empty array during build
    return <ClientHome initialPlayers={[]} />;
  }
}
