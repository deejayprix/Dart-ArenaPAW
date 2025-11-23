import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Users } from "lucide-react";
import type { TournamentState, Match, StandingsEntry, TournamentConfig, TournamentPlayer } from "@/types/tournament";
import type { Player } from "@shared/schema";

interface TournamentViewProps {
  players: TournamentPlayer[];
  config: TournamentConfig;
  onBack: () => void;
  onStartMatch: (match: Match, config: TournamentConfig, onMatchComplete: (winnerId: string, legsA: number, legsB: number, setsA: number, setsB: number) => void) => void;
}

// Generate round-robin schedule using circle method
function generateRoundRobinSchedule(players: TournamentPlayer[]): Match[] {
  const schedule: Match[] = [];
  const n = players.length;
  
  if (n < 2) return schedule;
  
  // For odd number of players, add a "bye" player
  const participatingPlayers = n % 2 === 0 ? [...players] : [...players, { id: "bye", name: "Bye" }];
  const totalPlayers = participatingPlayers.length;
  const rounds = totalPlayers - 1;
  const matchesPerRound = totalPlayers / 2;
  
  let matchId = 0;
  
  for (let round = 0; round < rounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = (round + match) % (totalPlayers - 1);
      const away = (totalPlayers - 1 - match + round) % (totalPlayers - 1);
      
      // Last player stays in place
      const playerAIndex = match === 0 ? totalPlayers - 1 : home;
      const playerBIndex = away;
      
      const playerA = participatingPlayers[playerAIndex];
      const playerB = participatingPlayers[playerBIndex];
      
      // Skip matches with "bye" player
      if (playerA.id !== "bye" && playerB.id !== "bye") {
        schedule.push({
          id: `match-${matchId++}`,
          round: round + 1,
          sequence: match + 1,
          playerAId: playerA.id,
          playerBId: playerB.id,
          status: "pending",
          legsPlayerA: 0,
          legsPlayerB: 0,
          setsPlayerA: 0,
          setsPlayerB: 0,
        });
      }
    }
  }
  
  return schedule;
}

// Initialize standings for all players
function initializeStandings(players: TournamentPlayer[]): Record<string, StandingsEntry> {
  const standings: Record<string, StandingsEntry> = {};
  
  players.forEach(player => {
    standings[player.id] = {
      playerId: player.id,
      playerName: player.name,
      wins: 0,
      losses: 0,
      legsFor: 0,
      legsAgainst: 0,
      setsFor: 0,
      setsAgainst: 0,
      points: 0,
      legDiff: 0,
      setDiff: 0,
    };
  });
  
  return standings;
}

// Calculate and sort standings
function calculateStandings(standings: Record<string, StandingsEntry>): StandingsEntry[] {
  return Object.values(standings)
    .map(entry => ({
      ...entry,
      points: entry.wins * 2 + entry.losses * 0, // 2 points per win
      legDiff: entry.legsFor - entry.legsAgainst,
      setDiff: entry.setsFor - entry.setsAgainst,
    }))
    .sort((a, b) => {
      // Sort by wins (descending)
      if (b.wins !== a.wins) return b.wins - a.wins;
      // Then by leg difference
      if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
      // Then by set difference
      if (b.setDiff !== a.setDiff) return b.setDiff - a.setDiff;
      // Then by legs for
      if (b.legsFor !== a.legsFor) return b.legsFor - a.legsFor;
      // Finally alphabetically
      return a.playerName.localeCompare(b.playerName);
    });
}

export default function TournamentView({ players, config, onBack, onStartMatch }: TournamentViewProps) {
  const [tournament, setTournament] = useState<TournamentState>({
    phase: "setup",
    players: players,
    schedule: [],
    activeMatchId: null,
    standings: initializeStandings(players),
  });
  
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  
  useEffect(() => {
    if (tournament.phase === "setup") {
      // Generate schedule on mount
      const schedule = generateRoundRobinSchedule(players);
      setTournament(prev => ({
        ...prev,
        schedule,
        phase: "active",
      }));
    }
  }, [players, tournament.phase]);
  
  const handleMatchComplete = (matchId: string, winnerId: string, legsPlayerA: number, legsPlayerB: number, setsPlayerA: number, setsPlayerB: number) => {
    setTournament(prev => {
      const match = prev.schedule.find((m: Match) => m.id === matchId);
      if (!match) return prev;
      
      // Update match
      const updatedSchedule = prev.schedule.map((m: Match) =>
        m.id === matchId
          ? { ...m, status: "completed" as const, winnerId, legsPlayerA, legsPlayerB, setsPlayerA, setsPlayerB }
          : m
      );
      
      // Update standings
      const updatedStandings = { ...prev.standings };
      const playerA = updatedStandings[match.playerAId];
      const playerB = updatedStandings[match.playerBId];
      
      if (playerA) {
        playerA.legsFor += legsPlayerA;
        playerA.legsAgainst += legsPlayerB;
        playerA.setsFor += setsPlayerA;
        playerA.setsAgainst += setsPlayerB;
        if (winnerId === match.playerAId) {
          playerA.wins++;
        } else {
          playerA.losses++;
        }
      }
      
      if (playerB) {
        playerB.legsFor += legsPlayerB;
        playerB.legsAgainst += legsPlayerA;
        playerB.setsFor += setsPlayerB;
        playerB.setsAgainst += setsPlayerA;
        if (winnerId === match.playerBId) {
          playerB.wins++;
        } else {
          playerB.losses++;
        }
      }
      
      // Check if tournament is completed
      const allMatchesCompleted = updatedSchedule.every((m: Match) => m.status === "completed");
      
      return {
        ...prev,
        schedule: updatedSchedule,
        standings: updatedStandings,
        activeMatchId: null,
        phase: allMatchesCompleted ? "completed" : "active",
      };
    });
  };
  
  const handleManualStartMatch = (match: Match) => {
    setActiveMatchId(match.id);
    onStartMatch(match, config, (winnerId, legsA, legsB, setsA, setsB) => {
      setActiveMatchId(null);
      handleMatchComplete(match.id, winnerId, legsA, legsB, setsA, setsB);
    });
  };
  
  const sortedStandings = calculateStandings(tournament.standings);
  
  const pendingMatches = tournament.schedule.filter((m: Match) => m.status === "pending");
  const completedMatches = tournament.schedule.filter((m: Match) => m.status === "completed");
  
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Turnier</h1>
            <p className="text-muted-foreground">
              {tournament.phase === "completed" ? "Turnier beendet" : `${completedMatches.length} / ${tournament.schedule.length} Spiele gespielt`}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
      </div>
      
      {/* Standings Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Rangliste
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Platz</th>
                <th className="text-left p-2 font-semibold">Spieler</th>
                <th className="text-center p-2 font-semibold">Spiele</th>
                <th className="text-center p-2 font-semibold">Siege</th>
                <th className="text-center p-2 font-semibold">Niederlagen</th>
                <th className="text-center p-2 font-semibold">Legs +/-</th>
                <th className="text-center p-2 font-semibold">Punkte</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((entry, index) => {
                const totalGames = entry.wins + entry.losses;
                const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
                
                return (
                  <tr key={entry.playerId} className={`border-b ${tournament.phase === "completed" && index === 0 ? "bg-primary/10 font-bold" : ""}`}>
                    <td className="p-2 text-center">
                      {medal || (index + 1)}
                    </td>
                    <td className="p-2">{entry.playerName}</td>
                    <td className="text-center p-2">{totalGames}</td>
                    <td className="text-center p-2 text-green-600 dark:text-green-400 font-semibold">{entry.wins}</td>
                    <td className="text-center p-2 text-red-600 dark:text-red-400">{entry.losses}</td>
                    <td className="text-center p-2">
                      <span className={entry.legDiff > 0 ? "text-green-600 dark:text-green-400" : entry.legDiff < 0 ? "text-red-600 dark:text-red-400" : ""}>
                        {entry.legDiff > 0 ? "+" : ""}{entry.legDiff}
                      </span>
                    </td>
                    <td className="text-center p-2 font-bold">{entry.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Pending Matches - Scrollable List */}
      {tournament.phase === "active" && pendingMatches.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Offene Spiele ({pendingMatches.length})</h2>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {pendingMatches.map((match: Match) => {
                const isActive = match.id === activeMatchId;
                return (
                  <div key={match.id} className={`flex items-center justify-between p-3 rounded-lg ${isActive ? 'bg-primary/20 border-2 border-primary' : 'bg-secondary/50'}`}>
                    <div className="flex-1">
                      <span className="font-semibold">{getPlayerName(match.playerAId)}</span>
                      <span className="mx-2 text-muted-foreground">vs</span>
                      <span className="font-semibold">{getPlayerName(match.playerBId)}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Runde {match.round})
                      </span>
                      {isActive && (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          ● Läuft gerade
                        </span>
                      )}
                    </div>
                    {!isActive && (
                      <Button size="sm" onClick={() => handleManualStartMatch(match)}>
                        Spiel starten
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      )}
      
      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Abgeschlossene Spiele ({completedMatches.length})</h2>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {completedMatches.slice().reverse().map((match: Match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg text-sm">
                  <div className="flex-1">
                    <span className={match.winnerId === match.playerAId ? "font-bold" : ""}>
                      {getPlayerName(match.playerAId)}
                    </span>
                    <span className="mx-2 text-muted-foreground">
                      {match.setsPlayerA}:{match.setsPlayerB} ({match.legsPlayerA}:{match.legsPlayerB})
                    </span>
                    <span className={match.winnerId === match.playerBId ? "font-bold" : ""}>
                      {getPlayerName(match.playerBId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
      
      {tournament.phase === "completed" && (
        <Card className="p-8 text-center bg-gradient-to-br from-primary/20 to-accent/20">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-2">Turnier beendet!</h2>
          <p className="text-xl mb-4">
            Gewinner: <span className="font-bold text-primary">{sortedStandings[0]?.playerName}</span> 🏆
          </p>
          <p className="text-muted-foreground mb-6">
            Mit {sortedStandings[0]?.wins} Siegen und {sortedStandings[0]?.legDiff > 0 ? "+" : ""}{sortedStandings[0]?.legDiff} Leg-Differenz
          </p>
          <Button onClick={onBack} size="lg">
            Neues Turnier starten
          </Button>
        </Card>
      )}
    </div>
  );
}

// Export the match completion handler type for parent component
export type { TournamentViewProps };
export { generateRoundRobinSchedule, initializeStandings, calculateStandings };
