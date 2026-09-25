import { GEC_TEAMS, type TeamStageData } from '../lib/teamsData';

// Seed + fallback for the `team-stage` entity. teamsData.ts stays the source of the seed values.
export const TEAMS_FALLBACK: TeamStageData[] = GEC_TEAMS;
