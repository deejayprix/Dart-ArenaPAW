export interface TournamentPlayer {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  round: number;
  sequence: number;
  playerAId: string;
  playerBId: string;
  status: "pending" | "active" | "completed";
  winnerId?: string;
  legsPlayerA: number;
  legsPlayerB: number;
  setsPlayerA: number;
  setsPlayerB: number;
}

export interface StandingsEntry {
  playerId: string;
  playerName: string;
  wins: number;
  losses: number;
  legsFor: number;
  legsAgainst: number;
  setsFor: number;
  setsAgainst: number;
  points: number;
  legDiff: number;
  setDiff: number;
}

export interface TournamentState {
  phase: "setup" | "active" | "completed";
  players: TournamentPlayer[];
  schedule: Match[];
  activeMatchId: string | null;
  standings: Record<string, StandingsEntry>;
}

export interface TournamentConfig {
  startingScore: "301" | "501" | "701";
  numberOfLegs: number;
  numberOfSets: number;
  inMode: "standard" | "double" | "master";
  outMode: "standard" | "double" | "master";
}
