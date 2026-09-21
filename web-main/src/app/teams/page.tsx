import { getTeams } from "@/lib/public-content";
import { TeamStageManager } from "./_components/team-stage-manager";

export default async function TeamsPage() {
  return <TeamStageManager teams={await getTeams()} />;
}
