import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PlayerSetup from "@/components/PlayerSetup";
import GameConfig from "@/components/GameConfig";
import PlayerCard from "@/components/PlayerCard";
import NumberPad from "@/components/NumberPad";
import { ThemeToggle } from "@/components/ThemeToggle";
import TournamentView from "@/components/TournamentView";
import { Repeat } from "lucide-react";
import type { Match, TournamentConfig } from "@/types/tournament";

interface SetupPlayer {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  score: number;
  throws: number[];
  currentThrowScores: number[];
  legs: number;
  sets: number;
  totalThrows: number;
  totalScore: number;
  hasStarted: boolean;
  totalLegsWon?: number;
}

interface ThrowHistory {
  playerIndex: number;
  dartIndex: number;
  score: number;
  wasStarted: boolean;
}

export default function DartsGame() {
  const { toast } = useToast();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState<SetupPlayer[]>([
    { id: crypto.randomUUID(), name: "Spieler 1" },
    { id: crypto.randomUUID(), name: "Spieler 2" },
  ]);

  const [gameMode, setGameMode] = useState<"501" | "301" | "701" | "around_the_clock" | "tournament">("501");
  const [startingScore, setStartingScore] = useState<"501" | "301" | "701">("501");
  const [numberOfLegs, setNumberOfLegs] = useState(2);
  const [numberOfSets, setNumberOfSets] = useState(1);
  const [inMode, setInMode] = useState<"standard" | "double" | "master">("standard");
  const [outMode, setOutMode] = useState<"standard" | "double" | "master">("standard");

  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDartIndex, setCurrentDartIndex] = useState(0);
  const [isDoubleMode, setIsDoubleMode] = useState(false);
  const [isTripleMode, setIsTripleMode] = useState(false);
  const [throwHistory, setThrowHistory] = useState<ThrowHistory[]>([]);
  
  // Tournament state
  const [isTournamentMode, setIsTournamentMode] = useState(false);
  const [tournamentMatch, setTournamentMatch] = useState<Match | null>(null);
  const [tournamentMatchCompleteCallback, setTournamentMatchCompleteCallback] = useState<((winnerId: string, legsA: number, legsB: number, setsA: number, setsB: number) => void) | null>(null);

  // Prevent page refresh during active match
  useEffect(() => {
    const isMatchActive = isGameStarted && (!isTournamentMode || tournamentMatch !== null);
    
    if (isMatchActive) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        return (e.returnValue = "");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isGameStarted, isTournamentMode, tournamentMatch]);

  const handleGameModeChange = (mode: "501" | "301" | "701" | "around_the_clock" | "tournament") => {
    setGameMode(mode);
    if (mode !== "around_the_clock" && mode !== "tournament") {
      setStartingScore(mode);
    }
  };

  const resetLeg = () => {
    const resetPlayers = gamePlayers.map((p) => ({
      ...p,
      score: parseInt(startingScore),
      throws: [],
      currentThrowScores: [],
      hasStarted: false,
      totalThrows: 0,
      totalScore: 0,
    }));
    setGamePlayers(resetPlayers);
    setCurrentDartIndex(0);
    setThrowHistory([]);
  };

  const startGame = () => {
    // Tournament mode validation
    if (gameMode === "tournament") {
      if (players.length < 3 || players.length > 8) {
        toast({
          title: "Ungültige Spieleranzahl",
          description: "Turnier-Modus benötigt 3-8 Spieler",
          variant: "destructive",
        });
        return;
      }
      setIsTournamentMode(true);
      setIsGameStarted(true);
      return;
    }
    
    const initialPlayers: Player[] = players.map((p) => ({
      id: p.id,
      name: p.name,
      score: gameMode === "around_the_clock" ? 1 : parseInt(startingScore),
      throws: [],
      currentThrowScores: [],
      legs: 0,
      sets: 0,
      totalThrows: 0,
      totalScore: 0,
      hasStarted: gameMode === "around_the_clock" ? true : false,
    }));

    setGamePlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setCurrentDartIndex(0);
    setThrowHistory([]);
    setIsGameStarted(true);
  };

  const switchBeginner = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const calculateAverage = (player: Player): number => {
    if (player.totalThrows === 0) return 0;
    return (player.totalScore / player.totalThrows) * 3;
  };
  
  // Tournament handlers
  const handleTournamentMatchStart = (match: Match, config: TournamentConfig, onMatchComplete: (winnerId: string, legsA: number, legsB: number, setsA: number, setsB: number) => void) => {
    // Find the two players for this match
    const playerA = players.find(p => p.id === match.playerAId);
    const playerB = players.find(p => p.id === match.playerBId);
    
    if (!playerA || !playerB) return;
    
    // Set up game with only these two players
    const matchPlayers: Player[] = [playerA, playerB].map((p) => ({
      id: p.id,
      name: p.name,
      score: parseInt(config.startingScore),
      throws: [],
      currentThrowScores: [],
      legs: 0,
      sets: 0,
      totalThrows: 0,
      totalScore: 0,
      hasStarted: false,
      totalLegsWon: 0,
    }));
    
    setTournamentMatch(match);
    setTournamentMatchCompleteCallback(() => onMatchComplete);
    setGamePlayers(matchPlayers);
    setCurrentPlayerIndex(0);
    setCurrentDartIndex(0);
    setThrowHistory([]);
    setStartingScore(config.startingScore);
    setNumberOfLegs(config.numberOfLegs);
    setNumberOfSets(config.numberOfSets);
    setInMode(config.inMode);
    setOutMode(config.outMode);
  };
  
  const handleBackToTournament = () => {
    setTournamentMatch(null);
    setTournamentMatchCompleteCallback(null);
    setGamePlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentDartIndex(0);
    setThrowHistory([]);
  };
  
  const handleTournamentExit = () => {
    setIsTournamentMode(false);
    setTournamentMatch(null);
    setTournamentMatchCompleteCallback(null);
    setGamePlayers([]);
    setIsGameStarted(false);
    setCurrentPlayerIndex(0);
    setCurrentDartIndex(0);
    setThrowHistory([]);
  };

  const handleNumberClick = (num: number) => {
    const currentPlayer = gamePlayers[currentPlayerIndex];
    
    // Around the Clock mode - different game logic
    if (gameMode === "around_the_clock") {
      const targetNumber = currentPlayer.score;
      const updatedPlayers = [...gamePlayers];
      const previousScore = currentPlayer.score;
      
      if (num === targetNumber) {
        // Player hit their target!
        const newTarget = targetNumber + 1;
        
        if (newTarget > 20) {
          // Player won!
          toast({
            title: "🏆 Gewonnen!",
            description: `${currentPlayer.name} hat Around the Clock gewonnen!`,
          });
          updatedPlayers[currentPlayerIndex] = {
            ...currentPlayer,
            score: 21, // Indicates completion
            totalThrows: currentPlayer.totalThrows + 1,
          };
          setGamePlayers(updatedPlayers);
          
          // Add to throw history for undo
          const newHistory = [...throwHistory, {
            playerIndex: currentPlayerIndex,
            dartIndex: currentDartIndex,
            score: -(newTarget - previousScore), // Negative to indicate score increase
            wasStarted: currentPlayer.hasStarted,
          }];
          setThrowHistory(newHistory);
          
          // End the game
          setTimeout(() => {
            setIsGameStarted(false);
            setGamePlayers([]);
            setCurrentPlayerIndex(0);
            setCurrentDartIndex(0);
            setThrowHistory([]);
          }, 3000);
          return;
        }
        
        updatedPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          score: newTarget,
          totalThrows: currentPlayer.totalThrows + 1,
        };
        
        // Add to throw history for undo (negative score to indicate increase)
        const newHistory = [...throwHistory, {
          playerIndex: currentPlayerIndex,
          dartIndex: currentDartIndex,
          score: -(newTarget - previousScore),
          wasStarted: currentPlayer.hasStarted,
        }];
        setThrowHistory(newHistory);
        
        toast({
          title: "Getroffen!",
          description: `${currentPlayer.name} hat ${targetNumber} getroffen! Nächstes Ziel: ${newTarget}`,
        });
      } else {
        // Missed - no score change but track throw
        updatedPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          totalThrows: currentPlayer.totalThrows + 1,
        };
        
        // Add to throw history with 0 score change
        const newHistory = [...throwHistory, {
          playerIndex: currentPlayerIndex,
          dartIndex: currentDartIndex,
          score: 0,
          wasStarted: currentPlayer.hasStarted,
        }];
        setThrowHistory(newHistory);
      }
      
      setGamePlayers(updatedPlayers);
      
      // Move to next dart or next player
      if (currentDartIndex >= 2) {
        setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
        setCurrentDartIndex(0);
      } else {
        setCurrentDartIndex(currentDartIndex + 1);
      }
      
      setIsDoubleMode(false);
      setIsTripleMode(false);
      return;
    }
    
    // Standard game modes (301, 501, 701)
    let score = num;
    if (isDoubleMode) {
      score = num * 2;
    } else if (isTripleMode) {
      score = num * 3;
    }

    // Check if player has started (for Double/Master In)
    if (!currentPlayer.hasStarted && num !== 0) {
      if (inMode === "double" && !isDoubleMode) {
        toast({
          title: "Double In aktiv",
          description: "Du musst ein Double werfen um zu starten! Drücke 0 um zu überspringen.",
          variant: "destructive",
        });
        setIsDoubleMode(false);
        setIsTripleMode(false);
        return;
      }

      if (inMode === "master" && !isDoubleMode && !isTripleMode) {
        toast({
          title: "Master In aktiv",
          description: "Du musst ein Double oder Triple werfen um zu starten! Drücke 0 um zu überspringen.",
          variant: "destructive",
        });
        setIsDoubleMode(false);
        setIsTripleMode(false);
        return;
      }
    }

    const newScore = currentPlayer.score - score;

    // Check for bust conditions
    if (newScore < 0) {
      toast({
        title: "Überworfen!",
        description: "Der Wurf ist ungültig. Nächster Spieler ist dran.",
      });
      // Move to next player without saving throw
      const updatedPlayers = [...gamePlayers];
      if (currentPlayer.currentThrowScores.length > 0) {
        const throwTotal = currentPlayer.currentThrowScores.reduce((a, b) => a + b, 0);
        updatedPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          throws: [...currentPlayer.throws, throwTotal],
          currentThrowScores: [],
        };
        setGamePlayers(updatedPlayers);
      }
      setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
      setCurrentDartIndex(0);
      setIsDoubleMode(false);
      setIsTripleMode(false);
      return;
    }

    // Check Double/Master Out requirements
    if (newScore === 0) {
      if (outMode === "double" && !isDoubleMode) {
        toast({
          title: "Double Out aktiv",
          description: "Du musst mit einem Double auschecken!",
          variant: "destructive",
        });
        // Move to next player without winning
        const updatedPlayers = [...gamePlayers];
        if (currentPlayer.currentThrowScores.length > 0) {
          const throwTotal = currentPlayer.currentThrowScores.reduce((a, b) => a + b, 0);
          updatedPlayers[currentPlayerIndex] = {
            ...currentPlayer,
            throws: [...currentPlayer.throws, throwTotal],
            currentThrowScores: [],
          };
          setGamePlayers(updatedPlayers);
        }
        setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
        setCurrentDartIndex(0);
        setIsDoubleMode(false);
        setIsTripleMode(false);
        return;
      }

      if (outMode === "master" && !isDoubleMode && !isTripleMode) {
        toast({
          title: "Master Out aktiv",
          description: "Du musst mit einem Double oder Triple auschecken!",
          variant: "destructive",
        });
        // Move to next player without winning
        const updatedPlayers = [...gamePlayers];
        if (currentPlayer.currentThrowScores.length > 0) {
          const throwTotal = currentPlayer.currentThrowScores.reduce((a, b) => a + b, 0);
          updatedPlayers[currentPlayerIndex] = {
            ...currentPlayer,
            throws: [...currentPlayer.throws, throwTotal],
            currentThrowScores: [],
          };
          setGamePlayers(updatedPlayers);
        }
        setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
        setCurrentDartIndex(0);
        setIsDoubleMode(false);
        setIsTripleMode(false);
        return;
      }

      // Player won the leg!
      const updatedPlayers = [...gamePlayers];
      const newLegs = currentPlayer.legs + 1;
      const newSets = newLegs >= numberOfLegs ? currentPlayer.sets + 1 : currentPlayer.sets;
      const legsToSet = newLegs >= numberOfLegs ? 0 : newLegs;
      const totalLegsWon = (currentPlayer.totalLegsWon || 0) + 1;
      
      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        legs: legsToSet,
        sets: newSets,
        score: newScore,
        currentThrowScores: [],
        totalScore: currentPlayer.totalScore + score,
        totalThrows: currentPlayer.totalThrows + 1,
        hasStarted: true,
        throws: [...currentPlayer.throws, [...currentPlayer.currentThrowScores, score].reduce((a, b) => a + b, 0)],
        totalLegsWon: totalLegsWon,
      };

      // First update the state so we have the latest values
      const finalPlayers = [...updatedPlayers];
      setGamePlayers(finalPlayers);
      
      // Check if set is won
      if (newLegs >= numberOfLegs) {
        if (newSets >= numberOfSets) {
          // Game completely won - end the game
          toast({
            title: "🏆 Spiel gewonnen!",
            description: `${currentPlayer.name} hat das Spiel gewonnen!`,
          });
          
          // If tournament mode, report result back to tournament
          if (isTournamentMode && tournamentMatch && tournamentMatchCompleteCallback) {
            // Get final state of both players
            const playerA = finalPlayers.find(p => p.id === tournamentMatch.playerAId);
            const playerB = finalPlayers.find(p => p.id === tournamentMatch.playerBId);
            
            if (playerA && playerB) {
              // Call the callback with match results
              setTimeout(() => {
                tournamentMatchCompleteCallback(
                  finalPlayers[currentPlayerIndex].id,
                  playerA.totalLegsWon || 0,
                  playerB.totalLegsWon || 0,
                  playerA.sets,
                  playerB.sets
                );
                // Reset match state (but stay in tournament mode)
                setTournamentMatch(null);
                setTournamentMatchCompleteCallback(null);
                setGamePlayers([]);
                setCurrentPlayerIndex(0);
                setCurrentDartIndex(0);
                setThrowHistory([]);
              }, 2000);
              return;
            }
          }
          
          // Regular game - reset after delay
          setTimeout(() => {
            setIsGameStarted(false);
            setGamePlayers([]);
            setCurrentPlayerIndex(0);
            setCurrentDartIndex(0);
            setThrowHistory([]);
          }, 3000);
          return;
        } else {
          // Set won, start new set
          toast({
            title: "🎯 Set gewonnen!",
            description: `${currentPlayer.name} hat das Set gewonnen!`,
          });
          setTimeout(() => {
            resetLeg();
            setCurrentPlayerIndex(0);
          }, 1500);
          return;
        }
      } else {
        // Leg won, start new leg
        toast({
          title: "🎯 Leg gewonnen!",
          description: `${currentPlayer.name} hat das Leg gewonnen!`,
        });
        setTimeout(() => {
          resetLeg();
          setCurrentPlayerIndex(0);
        }, 1500);
        return;
      }
    }

    // Check if score would be 1 with double out (impossible to finish)
    if (newScore === 1 && outMode !== "standard") {
      toast({
        title: "Ungültiger Wurf",
        description: "Mit 1 Punkt verbleibend kann man nicht auschecken.",
        variant: "destructive",
      });
      // Move to next player without saving throw
      const updatedPlayers = [...gamePlayers];
      if (currentPlayer.currentThrowScores.length > 0) {
        const throwTotal = currentPlayer.currentThrowScores.reduce((a, b) => a + b, 0);
        updatedPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          throws: [...currentPlayer.throws, throwTotal],
          currentThrowScores: [],
        };
        setGamePlayers(updatedPlayers);
      }
      setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
      setCurrentDartIndex(0);
      setIsDoubleMode(false);
      setIsTripleMode(false);
      return;
    }

    // Valid throw
    const updatedPlayers = [...gamePlayers];
    const newCurrentThrowScores = [...currentPlayer.currentThrowScores, score];
    const wasStartedBefore = currentPlayer.hasStarted;
    
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      score: newScore,
      currentThrowScores: newCurrentThrowScores,
      totalScore: currentPlayer.totalScore + score,
      totalThrows: currentPlayer.totalThrows + 1,
      hasStarted: score > 0 || currentPlayer.hasStarted, // Only mark as started if score > 0
    };

    // Add to throw history
    const newHistory = [...throwHistory, {
      playerIndex: currentPlayerIndex,
      dartIndex: currentDartIndex,
      score: score,
      wasStarted: wasStartedBefore,
    }];
    setThrowHistory(newHistory);

    // Move to next dart or next player
    if (currentDartIndex >= 2) {
      // Save throw to history and move to next player
      const throwTotal = newCurrentThrowScores.reduce((a, b) => a + b, 0);
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        throws: [...currentPlayer.throws, throwTotal],
        currentThrowScores: [],
      };
      setGamePlayers(updatedPlayers);
      setCurrentPlayerIndex((prev) => (prev + 1) % gamePlayers.length);
      setCurrentDartIndex(0);
      // Only reset modes if not 0
      if (num !== 0) {
        setIsDoubleMode(false);
        setIsTripleMode(false);
      }
    } else {
      setGamePlayers(updatedPlayers);
      setCurrentDartIndex(currentDartIndex + 1);
      // Only reset modes if not 0
      if (num !== 0) {
        setIsDoubleMode(false);
        setIsTripleMode(false);
      }
    }
  };

  const handleUndo = () => {
    if (throwHistory.length === 0) {
      toast({
        title: "Nichts rückgängig zu machen",
        description: "Es wurde noch kein Wurf getätigt.",
      });
      return;
    }

    // Get the last throw from history
    const lastThrow = throwHistory[throwHistory.length - 1];
    const player = gamePlayers[lastThrow.playerIndex];

    const updatedPlayers = [...gamePlayers];
    
    // Check if we need to restore currentThrowScores from a completed turn
    let newCurrentThrowScores = player.currentThrowScores;
    let newThrows = player.throws;
    
    if (player.currentThrowScores.length === 0 && player.throws.length > 0) {
      // Player has moved to next turn, need to restore from throws history
      const lastTurnTotal = player.throws[player.throws.length - 1];
      newThrows = player.throws.slice(0, -1);
      
      // Reconstruct the throw scores from history
      const throwsFromHistory: number[] = [];
      for (let i = throwHistory.length - 1; i >= 0; i--) {
        const historyItem = throwHistory[i];
        if (historyItem.playerIndex === lastThrow.playerIndex) {
          throwsFromHistory.unshift(historyItem.score);
          if (historyItem.dartIndex === 0) {
            break;
          }
        }
      }
      newCurrentThrowScores = throwsFromHistory.slice(0, -1); // Remove the last one (the one we're undoing)
    } else {
      // Just remove the last score from current throws
      newCurrentThrowScores = player.currentThrowScores.slice(0, -1);
    }
    
    // Restore player state
    updatedPlayers[lastThrow.playerIndex] = {
      ...player,
      score: player.score + lastThrow.score,
      currentThrowScores: newCurrentThrowScores,
      throws: newThrows,
      totalScore: player.totalScore - lastThrow.score,
      totalThrows: player.totalThrows - 1,
      hasStarted: lastThrow.wasStarted,
    };

    setGamePlayers(updatedPlayers);
    setCurrentPlayerIndex(lastThrow.playerIndex);
    setCurrentDartIndex(lastThrow.dartIndex);
    setThrowHistory(throwHistory.slice(0, -1));
    setIsDoubleMode(false);
    setIsTripleMode(false);
  };

  const newGame = () => {
    setIsGameStarted(false);
    setGamePlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentDartIndex(0);
    setThrowHistory([]);
  };

  // Tournament view when tournament mode is active
  if (isGameStarted && isTournamentMode && !tournamentMatch) {
    const tournamentConfig: TournamentConfig = {
      startingScore,
      numberOfLegs,
      numberOfSets,
      inMode,
      outMode,
    };
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto py-8">
          <TournamentView
            players={players.map(p => ({ id: p.id, name: p.name }))}
            config={tournamentConfig}
            onBack={handleTournamentExit}
            onStartMatch={handleTournamentMatchStart}
          />
        </div>
      </div>
    );
  }

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary">Dart Arena</h1>
            <ThemeToggle />
          </div>

          <PlayerSetup players={players} onPlayersChange={setPlayers} />

          <GameConfig
            gameMode={gameMode}
            startingScore={startingScore}
            numberOfLegs={numberOfLegs}
            numberOfSets={numberOfSets}
            inMode={inMode}
            outMode={outMode}
            onGameModeChange={handleGameModeChange}
            onStartingScoreChange={setStartingScore}
            onNumberOfLegsChange={setNumberOfLegs}
            onNumberOfSetsChange={setNumberOfSets}
            onInModeChange={setInMode}
            onOutModeChange={setOutMode}
          />

          <div className="flex gap-4">
            <Button
              data-testid="button-switch-beginner"
              variant="outline"
              onClick={switchBeginner}
              className="flex-1"
            >
              <Repeat className="h-4 w-4 mr-2" />
              Beginner wechseln ({players[currentPlayerIndex].name} beginnt)
            </Button>
            <Button
              data-testid="button-start-game"
              onClick={startGame}
              className="flex-1"
            >
              {gameMode === "tournament" ? "Turnier starten" : "Spiel starten"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Dart Arena</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              data-testid="button-new-game"
              variant="outline"
              onClick={newGame}
            >
              Neues Spiel
            </Button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {/* Reorder players so active player is first */}
          {[...gamePlayers.slice(currentPlayerIndex), ...gamePlayers.slice(0, currentPlayerIndex)].map((player, displayIdx) => {
            const actualIdx = (currentPlayerIndex + displayIdx) % gamePlayers.length;
            return (
              <div key={player.id} className="flex-1 min-w-[280px]">
                <PlayerCard
                  name={player.name}
                  score={player.score}
                  throws={player.throws}
                  currentThrowScores={player.currentThrowScores}
                  legs={player.legs}
                  sets={player.sets}
                  average={calculateAverage(player)}
                  totalDarts={player.totalThrows}
                  isActive={actualIdx === currentPlayerIndex}
                  hasStarted={player.hasStarted}
                  gameMode={gameMode}
                  numberOfLegs={numberOfLegs}
                  numberOfSets={numberOfSets}
                />
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <NumberPad
            onNumberClick={handleNumberClick}
            onDoubleClick={() => {
              setIsDoubleMode(!isDoubleMode);
              setIsTripleMode(false);
            }}
            onTripleClick={() => {
              setIsTripleMode(!isTripleMode);
              setIsDoubleMode(false);
            }}
            onUndoClick={handleUndo}
            isDoubleMode={isDoubleMode}
            isTripleMode={isTripleMode}
          />
        </div>
      </div>
    </div>
  );
}
