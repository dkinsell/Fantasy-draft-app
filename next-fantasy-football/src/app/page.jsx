import { getServerSidePlayersData } from "../lib/playerApiController";
import { ClientHome } from "../components/client/client-home";

export default async function HomePage() {
  // Fetch data on the server
  const initialPlayers = await getServerSidePlayersData();
  
  return <ClientHome initialPlayers={initialPlayers} />;
}
