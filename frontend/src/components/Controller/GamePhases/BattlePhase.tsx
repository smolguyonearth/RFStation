import { useState } from "react";
import { useSwipe } from "@/hooks/useSwipe";
import Dice from "@/components/Dice";

export default function BattlePhase({ gameState }: any) {
  let attacker = 1;
  let defender = 2;

  if (
    gameState.battleContext &&
    typeof gameState.battleContext.attackerId === "number" &&
    typeof gameState.battleContext.defenderId === "number"
  ) {
    attacker = gameState.battleContext.attackerId;
    defender = gameState.battleContext.defenderId;
  } else {
    console.warn(
      "BattlePhase: Explicit attackerId or defenderId missing in battleContext. Falling back to currentPlayer logic.",
      gameState.battleContext
    );
    attacker = gameState.currentPlayer ?? 1;
    defender = attacker === 1 ? 2 : 1;
  }

  const [step, setStep] = useState<"ATTACKER_ROLL" | "DEFENDER_ROLL" | "RESULT">("ATTACKER_ROLL");
  const [attackerRoll, setAttackerRoll] = useState<number | null>(null);
  const [defenderRoll, setDefenderRoll] = useState<number | null>(null);

  const resolveBattle = async (winner: number) => {
    await fetch(`/api/game/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner }),
    });
  };

  const handleAttackerRoll = (val: number) => {
    setAttackerRoll(val);
  };

  const handleDefenderRoll = (val: number) => {
    setDefenderRoll(val);
  };

  const handleResultNext = () => {
    if (attackerRoll === defenderRoll) {
      setAttackerRoll(null);
      setDefenderRoll(null);
      setStep("ATTACKER_ROLL");
    } else {
      const winner = attackerRoll! > defenderRoll! ? attacker : defender;
      resolveBattle(winner);
    }
  };

  const swipeHandlers = useSwipe(
    () => {
      // Swipe Left (Next)
      if (step === "ATTACKER_ROLL" && attackerRoll !== null) setStep("DEFENDER_ROLL");
      if (step === "DEFENDER_ROLL" && defenderRoll !== null) setStep("RESULT");
    },
    () => {}, // Swipe Right (Ignore)
  );

  return (
    <div
      {...swipeHandlers}
      className={`w-full h-full flex flex-col items-center justify-center relative py-4 select-none ${swipeHandlers.className}`}
    >
      {/* --- AUDIO SLOTS --- */}
      {step !== "RESULT" && (
        <audio
          src="/sounds/battle_song.mp3"
          autoPlay
          loop
          className="hidden"
          id="battle-audio-slot"
        />
      )}
      {step === "RESULT" && (
        <audio
          src="/sounds/conquer_sound.mp3"
          autoPlay
          className="hidden"
          id="conquer-audio-slot"
        />
      )}
      {/* ------------------- */}

      <div className="absolute top-0 text-center z-50">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#6B7280] uppercase border-b border-zinc-200 pb-1.5 px-2">
          Territory Battle
        </span>
        <p className="text-zinc-500 font-light text-xs mt-3">
          Location: Row {gameState.battleContext?.row + 1}, Col {gameState.battleContext?.col + 1}
        </p>
      </div>

      {step === "ATTACKER_ROLL" && (
        <div
          key="bp_attacker"
          className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-2xl border border-zinc-200 bg-white z-10 p-8 shadow-sm"
        >
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full ${
            attacker === 1 ? "text-indigo-600 bg-indigo-50 border border-indigo-100" : "text-rose-600 bg-rose-50 border border-rose-100"
          }`}>
            Combat — Attacker
          </span>
          <h2 className={`text-xl font-medium mb-8 tracking-wide uppercase text-center ${
            attacker === 1 ? "text-indigo-950" : "text-rose-950"
          }`}>
            Player {attacker} Attack
          </h2>
          <div className="scale-100">
            <Dice mode="D8" label="ROLL D8" onRoll={handleAttackerRoll} />
          </div>
          {attackerRoll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("DEFENDER_ROLL")}
                className={`px-6 py-2.5 text-white font-medium text-xs uppercase tracking-wider rounded-lg active:scale-95 transition-all shadow-sm animate-pop ${
                  attacker === 1 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Next: P{defender} Defend →
              </button>
              <p className="mt-2 text-[9px] text-zinc-400 tracking-wider">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "DEFENDER_ROLL" && (
        <div
          key="bp_defender"
          className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-2xl border border-zinc-200 bg-white z-10 p-8 shadow-sm"
        >
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full ${
            defender === 1 ? "text-indigo-600 bg-indigo-50 border border-indigo-100" : "text-rose-600 bg-rose-50 border border-rose-100"
          }`}>
            Combat — Defender
          </span>
          <h2 className={`text-xl font-medium mb-8 tracking-wide uppercase text-center ${
            defender === 1 ? "text-indigo-950" : "text-rose-950"
          }`}>
            Player {defender} Defend
          </h2>
          <div className="scale-100">
            <Dice mode="D8" label="ROLL D8" onRoll={handleDefenderRoll} />
          </div>
          {defenderRoll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("RESULT")}
                className={`px-6 py-2.5 text-white font-medium text-xs uppercase tracking-wider rounded-lg active:scale-95 transition-all shadow-sm animate-pop ${
                  defender === 1 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Show Results →
              </button>
              <p className="mt-2 text-[9px] text-zinc-400 tracking-wider">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "RESULT" && (
        <div
          key="bres"
          className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white border border-zinc-200 rounded-2xl z-20 p-8 shadow-sm"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#6B7280] uppercase mb-4">
            Combat Overview
          </span>
          <h2 className="text-xl font-light text-[#1F2937] mb-8 tracking-wide uppercase">
            Battle Outcome
          </h2>
          
          <div className="flex justify-center items-center gap-10 w-full max-w-xs mb-8 bg-zinc-50 border border-zinc-100 p-5 rounded-xl">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-[9px] font-medium uppercase tracking-wider ${
                attacker === 1 ? "text-indigo-600" : "text-rose-600"
              }`}>
                P{attacker} Attack
              </span>
              <span className={`text-4xl font-extralight font-mono ${
                attacker === 1 ? "text-indigo-950" : "text-rose-950"
              }`}>{attackerRoll}</span>
            </div>
            <div className="w-[1px] h-12 bg-zinc-200" />
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-[9px] font-medium uppercase tracking-wider ${
                defender === 1 ? "text-indigo-600" : "text-rose-600"
              }`}>
                P{defender} Defend
              </span>
              <span className={`text-4xl font-extralight font-mono ${
                defender === 1 ? "text-indigo-950" : "text-rose-950"
              }`}>{defenderRoll}</span>
            </div>
          </div>

          <div className={`mb-8 text-xs font-medium tracking-wide uppercase px-6 py-3 rounded-lg border text-center ${
            attackerRoll === defenderRoll
              ? "bg-amber-50 border-amber-100 text-amber-700"
              : (attackerRoll! > defenderRoll! ? attacker : defender) === 1
                ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
          }`}>
            {attackerRoll === defenderRoll
              ? "CLASH! RE-ROLLING!"
              : `PLAYER ${attackerRoll! > defenderRoll! ? attacker : defender} WINS TERRITORY`}
          </div>

          <button
            onClick={handleResultNext}
            className="px-6 py-3 bg-zinc-800 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-900 active:scale-95 transition-all shadow-sm"
          >
            {attackerRoll === defenderRoll ? "Roll Again" : "Resolve Battle"}
          </button>
        </div>
      )}
    </div>
  );
}
