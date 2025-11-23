import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCheckoutSuggestion, hasCheckout } from "@/lib/checkout";

interface PlayerCardProps {
  name: string;
  score: number;
  throws: number[];
  currentThrowScores: number[];
  legs: number;
  sets: number;
  average: number;
  totalDarts: number;
  isActive: boolean;
  hasStarted: boolean;
  gameMode: "501" | "301" | "701" | "around_the_clock" | "tournament";
  numberOfLegs?: number;
  numberOfSets?: number;
}

export default function PlayerCard({
  name,
  score,
  throws,
  currentThrowScores,
  legs,
  sets,
  average,
  totalDarts,
  isActive,
  hasStarted,
  gameMode,
  numberOfLegs = 1,
  numberOfSets = 1,
}: PlayerCardProps) {
  const checkoutSuggestion = gameMode !== "around_the_clock" && hasCheckout(score) 
    ? getCheckoutSuggestion(score)
    : [];
  
  const isAroundTheClock = gameMode === "around_the_clock";

  return (
    <Card
      className={`p-4 sm:p-6 transition-all ${
        isActive ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      data-testid={`card-player-${name}`}
    >
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2" data-testid={`text-player-name-${name}`}>
            {name}
          </h3>
          <div
            className="text-5xl sm:text-6xl font-bold text-primary"
            data-testid={`text-player-score-${name}`}
          >
            {score}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[0, 1, 2].map((index) => (
            <Badge
              key={index}
              variant="secondary"
              className="w-full justify-center min-h-8 text-sm sm:text-base"
              data-testid={`text-throw-${name}-${index}`}
            >
              {currentThrowScores[index] !== undefined
                ? currentThrowScores[index]
                : "-"}
            </Badge>
          ))}
        </div>

        {checkoutSuggestion.length > 0 && (
          <div className="text-center border-2 border-primary rounded-lg p-3">
            <div className="text-lg font-bold text-primary">
              {checkoutSuggestion.join(" → ")}
            </div>
          </div>
        )}

        {hasStarted && !isAroundTheClock && (
          <div className="text-center">
            <div className="text-base text-muted-foreground">
              {currentThrowScores.length > 0 ? "Aktueller Wurf" : "Letzte Runde"}
            </div>
            <div className="text-3xl font-semibold" data-testid={`text-current-total-${name}`}>
              {currentThrowScores.length > 0 
                ? currentThrowScores.reduce((a, b) => a + b, 0)
                : throws.length > 0 
                  ? throws[throws.length - 1]
                  : "-"
              }
            </div>
          </div>
        )}

        {!isAroundTheClock && (
          <div className="grid grid-cols-2 gap-3 text-base border-t pt-3">
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Sets</div>
              <div className="text-lg font-semibold" data-testid={`text-sets-${name}`}>{sets} / {numberOfSets}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Legs</div>
              <div className="text-lg font-semibold" data-testid={`text-legs-${name}`}>{legs} / {numberOfLegs}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Ø</div>
              <div className="text-lg font-semibold" data-testid={`text-average-${name}`}>
                {average.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Darts</div>
              <div className="text-lg font-semibold" data-testid={`text-darts-${name}`}>{totalDarts}</div>
            </div>
          </div>
        )}
        
        {isAroundTheClock && (
          <div className="flex justify-center gap-8 text-base border-t pt-3">
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Darts</div>
              <div className="text-lg font-semibold" data-testid={`text-darts-${name}`}>{totalDarts}</div>
            </div>
          </div>
        )}

      </div>
    </Card>
  );
}
