import { useState, useEffect } from "react";
import Dice from "@/components/Dice";
import { useSwipe } from "@/hooks/useSwipe";

export default function TurnPhase({ gameState, endTurn }: any) {
  const [step, setStep] = useState<"ROLL" | "ACTION">("ROLL");
  const [hasRolled, setHasRolled] = useState(false);
  const isP1 = gameState.currentPlayer === 1;

  const handleRoll = () => {
    setHasRolled(true);
  };

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
      className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}
    >
      {step === "ROLL" && (
        <div
          key="roll"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-[2.5rem] border ${isP1 ? "bg-indigo-50/20 border-indigo-100/60 shadow-indigo-100/10" : "bg-rose-50/20 border-rose-100/60 shadow-rose-100/10"} shadow-sm`}
        >
          <span className={`text-[9px] font-bold tracking-[0.25em] ${isP1 ? "text-indigo-400" : "text-rose-400"} uppercase mb-3`}>
            ACTIVE TURN
          </span>
          <h2
            className={`text-3xl font-extralight mb-10 tracking-widest uppercase ${isP1 ? "text-indigo-600" : "text-rose-600"}`}
          >
            Player {gameState.currentPlayer} Turn
          </h2>
          <div className="scale-110 transform">
            <Dice mode="D6" label="ROLL TO MOVE" onRoll={handleRoll} />
          </div>
          {hasRolled && (
            <div className="mt-10 flex flex-col items-center">
              <button
                onClick={() => setStep("ACTION")}
                className={`px-8 py-3.5 ${isP1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"} text-white font-bold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-md animate-pop`}
              >
                Next: Move Piece →
              </button>
              <p className="mt-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "ACTION" && (
        <div
          key="action"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-[2.5rem] border ${isP1 ? "bg-indigo-50/20 border-indigo-100/60 shadow-indigo-100/10" : "bg-rose-50/20 border-rose-100/60 shadow-rose-100/10"} shadow-sm`}
        >
          <span className={`text-[9px] font-bold tracking-[0.25em] ${isP1 ? "text-indigo-400" : "text-rose-400"} uppercase mb-3`}>
            BOARD ACTION
          </span>
          <h2
            className={`text-3xl font-extralight mb-10 tracking-widest uppercase ${isP1 ? "text-indigo-600" : "text-rose-600"}`}
          >
            Move Piece
          </h2>

          <div className="w-full max-w-xl bg-white border border-zinc-200/80 rounded-[2.5rem] p-8 shadow-xl shadow-zinc-100/50 mb-8 text-left">
            <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
              Action Checklist
            </span>
            <h3 className="text-sm font-bold mt-2 mb-6 uppercase tracking-wider text-zinc-800">
              Complete these physical tasks:
            </h3>
            
            <ul className="text-xs font-medium space-y-4 text-zinc-600 tracking-wide">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span>Move your game piece to the destination square.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span>If you land on a landmark, press its physical sensor button.</span>
              </li>
              <li className="flex items-center gap-3 text-amber-700 font-semibold bg-amber-50/40 px-3 py-2 rounded-xl border border-amber-100/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span>If you land on a path, click the End Turn button below.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => endTurn()}
            className={`w-full max-w-xl py-4 ${isP1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"} text-white text-xs font-bold uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-md`}
          >
            End Turn
          </button>
        </div>
      )}

    </div>
  );
}
