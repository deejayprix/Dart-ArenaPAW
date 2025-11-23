import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDoubleClick: () => void;
  onTripleClick: () => void;
  onUndoClick: () => void;
  isDoubleMode: boolean;
  isTripleMode: boolean;
  disabled?: boolean;
}

export default function NumberPad({
  onNumberClick,
  onDoubleClick,
  onTripleClick,
  onUndoClick,
  isDoubleMode,
  isTripleMode,
  disabled = false,
}: NumberPadProps) {
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Button
          data-testid="button-undo"
          variant="outline"
          onClick={onUndoClick}
          disabled={disabled}
          className="min-h-14 text-base font-semibold hover:scale-105 transition-transform"
        >
          <Undo2 className="h-5 w-5 mr-2" />
          Rückgängig
        </Button>
        <Button
          data-testid="button-double"
          variant={isDoubleMode ? "default" : "outline"}
          onClick={onDoubleClick}
          disabled={disabled}
          className="min-h-14 text-base font-bold hover:scale-105 transition-transform"
        >
          Double
        </Button>
        <Button
          data-testid="button-triple"
          variant={isTripleMode ? "default" : "outline"}
          onClick={onTripleClick}
          disabled={disabled}
          className="min-h-14 text-base font-bold hover:scale-105 transition-transform"
        >
          Triple
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <Button
            key={num}
            data-testid={`button-number-${num}`}
            variant="outline"
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className="min-h-16 text-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-sm"
          >
            {num}
          </Button>
        ))}
        <Button
          data-testid="button-number-25"
          variant="outline"
          onClick={() => onNumberClick(25)}
          disabled={disabled}
          className="min-h-16 text-xl font-bold col-span-5 hover:scale-[1.02] transition-transform active:scale-95 shadow-sm"
        >
          Bull (25)
        </Button>
      </div>

      <Button
        data-testid="button-number-0"
        variant="outline"
        onClick={() => onNumberClick(0)}
        disabled={disabled}
        className="w-full min-h-16 text-xl font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-sm"
      >
        0 (Verfehlt)
      </Button>
    </div>
  );
}
