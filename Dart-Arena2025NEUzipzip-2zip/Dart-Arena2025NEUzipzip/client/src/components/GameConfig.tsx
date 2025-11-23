import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GameConfigProps {
  gameMode: "501" | "301" | "701" | "around_the_clock" | "tournament";
  startingScore: "501" | "301" | "701";
  numberOfLegs: number;
  numberOfSets: number;
  inMode: "standard" | "double" | "master";
  outMode: "standard" | "double" | "master";
  onGameModeChange: (mode: "501" | "301" | "701" | "around_the_clock" | "tournament") => void;
  onStartingScoreChange: (score: "501" | "301" | "701") => void;
  onNumberOfLegsChange: (legs: number) => void;
  onNumberOfSetsChange: (sets: number) => void;
  onInModeChange: (mode: "standard" | "double" | "master") => void;
  onOutModeChange: (mode: "standard" | "double" | "master") => void;
}

export default function GameConfig({
  gameMode,
  startingScore,
  numberOfLegs,
  numberOfSets,
  inMode,
  outMode,
  onGameModeChange,
  onStartingScoreChange,
  onNumberOfLegsChange,
  onNumberOfSetsChange,
  onInModeChange,
  onOutModeChange,
}: GameConfigProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Spielmodus
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(["301", "501", "701"] as const).map((mode) => (
              <Button
                key={mode}
                data-testid={`button-mode-${mode}`}
                variant={gameMode === mode ? "default" : "outline"}
                onClick={() => onGameModeChange(mode)}
                className="flex-1"
              >
                {mode}
              </Button>
            ))}
            {(["around_the_clock", "tournament"] as const).map((mode) => (
              <Button
                key={mode}
                data-testid={`button-mode-${mode}`}
                variant={gameMode === mode ? "default" : "outline"}
                onClick={() => onGameModeChange(mode)}
                className="flex-1"
              >
                {mode === "around_the_clock" ? "Around the Clock" : "Turnier"}
              </Button>
            ))}
          </div>
        </div>

        {gameMode !== "around_the_clock" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sets" className="text-base font-semibold mb-3 block">
                Anzahl Sets {gameMode === "tournament" && "(pro Spiel)"}
              </Label>
              <Input
                id="sets"
                data-testid="input-number-of-sets"
                type="number"
                min="1"
                value={numberOfSets}
                onChange={(e) => onNumberOfSetsChange(parseInt(e.target.value) || 1)}
                className="text-lg w-20"
              />
            </div>
            <div>
              <Label htmlFor="legs" className="text-base font-semibold mb-3 block">
                Anzahl Legs {gameMode === "tournament" && "(pro Set)"}
              </Label>
              <Input
                id="legs"
                data-testid="input-number-of-legs"
                type="number"
                min="1"
                value={numberOfLegs}
                onChange={(e) => onNumberOfLegsChange(parseInt(e.target.value) || 1)}
                className="text-lg w-20"
              />
            </div>
          </div>
        )}

        {gameMode !== "around_the_clock" && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                In-Modus
              </Label>
              <div className="flex gap-2">
                {(["standard", "double", "master"] as const).map((mode) => (
                  <Button
                    key={mode}
                    data-testid={`button-in-${mode}`}
                    variant={inMode === mode ? "default" : "outline"}
                    onClick={() => onInModeChange(mode)}
                    className="flex-1 capitalize"
                  >
                    {mode === "standard" ? "Standard" : mode === "double" ? "Double In" : "Master In"}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                Out-Modus
              </Label>
              <div className="flex gap-2">
                {(["standard", "double", "master"] as const).map((mode) => (
                  <Button
                    key={mode}
                    data-testid={`button-out-${mode}`}
                    variant={outMode === mode ? "default" : "outline"}
                    onClick={() => onOutModeChange(mode)}
                    className="flex-1 capitalize"
                  >
                    {mode === "standard" ? "Standard" : mode === "double" ? "Double Out" : "Master Out"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
