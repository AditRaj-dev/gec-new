import { getInitiatives } from "@/lib/public-content";
import { InitiativeExplorer } from "./_components/initiative-explorer";
export default async function InitiativesPage() { return <InitiativeExplorer initiatives={await getInitiatives()} />; }
