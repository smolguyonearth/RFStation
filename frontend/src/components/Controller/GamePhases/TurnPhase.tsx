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
      className={`w-full h-full flex flex-col items-center justify-center relative py-6 select-none ${swipeHandlers.className}`}
    >
      {step === "ROLL" && (
        <div
          key="roll"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md shadow-2xl ${
            isP1 ? "border-indigo-500/20 neon-glow-p1" : "border-rose-500/20 neon-glow-p2"
          }`}
        >
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full ${
            isP1 ? "text-indigo-400 bg-indigo-950/40 border border-indigo-800/30" : "text-rose-400 bg-rose-950/40 border border-rose-800/30"
          }`}>
            Active Player
          </span>
          <h2
            className={`text-3xl font-black mb-8 tracking-widest uppercase text-center ${
              isP1 ? "text-indigo-300" : "text-rose-300"
            }`}
          >
            PLAYER {gameState.currentPlayer} TURN
          </h2>
          
          <div className="scale-110 transform">
            <Dice mode="D6" label="ROLL TO MOVE" onRoll={handleRoll} />
          </div>

          {hasRolled && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("ACTION")}
                className={`px-8 py-3.5 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg animate-pop ${
                  isP1 
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-600/25" 
                    : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-600/25"
                }`}
              >
                Next: Move Piece →
              </button>
              <p className="mt-3 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "ACTION" && (
        <div
          key="action"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-8 rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md shadow-2xl ${
            isP1 ? "border-indigo-500/20 neon-glow-p1" : "border-rose-500/20 neon-glow-p2"
          }`}
        >
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full ${
            isP1 ? "text-indigo-400 bg-indigo-950/40 border border-indigo-800/30" : "text-rose-400 bg-rose-950/40 border border-rose-800/30"
          }`}>
            Board Action Required
          </span>
          <h2
            className={`text-3xl font-black mb-6 tracking-widest uppercase text-center ${
              isP1 ? "text-indigo-300" : "text-rose-300"
            }`}
          >
            MOVE PIECE
          </h2>

          <div className="w-full max-w-xl bg-black/40 border border-white/[0.06] rounded-[2rem] p-6 shadow-2xl mb-8 text-left">
            <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">
              Operational Checklist
            </span>
            <h3 className="text-sm font-extrabold mt-2 mb-4 uppercase tracking-wider text-zinc-200">
              Complete these tasks on physical board:
            </h3>
            
            <ul className="text-xs font-semibold space-y-3.5 text-zinc-400 tracking-wider uppercase">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_8px_#06b6d4]" />
                <span>Move your game piece to the destination square.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_8px_#06b6d4]" />
                <span>If landing on a landmark, press its physical button sensor.</span>
              </li>
              <li className="flex items-start gap-3 text-amber-300 bg-amber-950/20 px-3.5 py-2.5 rounded-xl border border-amber-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shadow-[0_0_8px_#f59e0b]" />
                <span>If landing on a path grid, click the End Turn button below.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => endTurn()}
            className={`w-full max-w-xl py-4 text-xs font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg text-white ${
              isP1 
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-600/25" 
                : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-600/25"
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
