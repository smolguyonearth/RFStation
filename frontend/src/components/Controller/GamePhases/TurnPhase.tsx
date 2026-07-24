import { useState, useEffect } from "react";
import Dice from "@/components/Dice";
import { useSwipe } from "@/hooks/useSwipe";

export default function TurnPhase({ gameState, endTurn }: any) {
  const [step, setStep] = useState<"ROLL" | "ACTION">("ROLL");
  const [hasRolled, setHasRolled] = useState(false);
  const isP1 = gameState.currentPlayer === 1;

  // Reset step if turn changes
  useEffect(() => {
    setStep("ROLL");
    setHasRolled(false);
  }, [gameState.currentPlayer]);

  const swipeHandlers = useSwipe(
    () => {
      // Swipe Left (Next)
      if (step === "ROLL" && hasRolled) setStep("ACTION");
    },
    () => {}, // Swipe Right (Ignore)
  );

  return (
    <div
      {...swipeHandlers}
      className={`w-full h-full flex flex-col items-center justify-center relative py-4 select-none ${swipeHandlers.className}`}
    >
      {step === "ROLL" && (
        <div
          key="roll"
          className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm"
        >
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full ${
            isP1 ? "text-indigo-600 bg-indigo-50 border border-indigo-100" : "text-rose-600 bg-rose-50 border border-rose-100"
          }`}>
            Active Player
          </span>
          <h2
            className={`text-xl font-medium mb-8 tracking-wide uppercase text-center ${
              isP1 ? "text-indigo-950" : "text-rose-950"
            }`}
          >
            Player {gameState.currentPlayer} Turn
          </h2>
          
          <div className="scale-100">
            <Dice mode="D6" label="ROLL TO MOVE" onRoll={handleRoll} />
          </div>

          {hasRolled && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("ACTION")}
                className={`px-6 py-2.5 text-white font-medium text-xs uppercase tracking-wider rounded-lg active:scale-95 transition-all shadow-sm animate-pop ${
                  isP1 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Next: Move Piece →
              </button>
              <p className="mt-2 text-[9px] text-zinc-400 tracking-wider">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "ACTION" && (
        <div
          key="action"
          className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm"
        >
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full ${
            isP1 ? "text-indigo-600 bg-indigo-50 border border-indigo-100" : "text-rose-600 bg-rose-50 border border-rose-100"
          }`}>
            Board Action
          </span>
          <h2
            className={`text-xl font-medium mb-6 tracking-wide uppercase text-center ${
              isP1 ? "text-indigo-950" : "text-rose-950"
            }`}
          >
            Move Piece
          </h2>

          <div className="w-full max-w-md bg-zinc-50 border border-zinc-200/60 rounded-xl p-5 shadow-inner mb-6 text-left">
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
              Operational Checklist
            </span>
            <h3 className="text-xs font-semibold mt-1 mb-3 uppercase tracking-wide text-zinc-700">
              Complete on physical board:
            </h3>
            
            <ul className="text-xs font-light space-y-2.5 text-zinc-600 tracking-wide">
              <li className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5" />
                <span>Move your piece to the destination square.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5" />
                <span>If landing on a landmark, press its physical button sensor.</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-700 bg-white px-3 py-2 rounded-lg border border-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                <span>If landing on path grid, click the button below.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => endTurn()}
            className={`w-full max-w-md py-3 text-xs font-semibold uppercase tracking-wider rounded-lg active:scale-95 transition-all text-white ${
              isP1 
                ? "bg-indigo-600 hover:bg-indigo-700" 
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            End Turn
          </button>
        </div>
      )}
    </div>
  );

  function handleRoll() {
    setHasRolled(true);
  }
}
