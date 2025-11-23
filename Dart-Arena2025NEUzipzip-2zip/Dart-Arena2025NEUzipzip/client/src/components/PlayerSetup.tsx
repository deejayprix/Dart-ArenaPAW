import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
}

interface PlayerSetupProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
}

export default function PlayerSetup({ players, onPlayersChange }: PlayerSetupProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addPlayer = () => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: `Spieler ${players.length + 1}`,
    };
    onPlayersChange([...players, newPlayer]);
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      onPlayersChange(players.filter((p) => p.id !== id));
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    onPlayersChange(
      players.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, index) => (
          <Card key={player.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                {editingId === player.id ? (
                  <Input
                    data-testid={`input-player-name-${index}`}
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingId(null);
                    }}
                    autoFocus
                    className="text-lg font-semibold"
                  />
                ) : (
                  <button
                    data-testid={`button-edit-player-${index}`}
                    onClick={() => setEditingId(player.id)}
                    className="text-lg font-semibold text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md w-full text-left"
                  >
                    {player.name}
                  </button>
                )}
              </div>
              {players.length > 1 && (
                <Button
                  data-testid={`button-remove-player-${index}`}
                  size="icon"
                  variant="ghost"
                  onClick={() => removePlayer(player.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Button
        data-testid="button-add-player"
        onClick={addPlayer}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Spieler hinzufügen
      </Button>
    </div>
  );
}
