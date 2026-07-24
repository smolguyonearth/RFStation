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
      className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}
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
        <span className="text-[9px] font-bold tracking-[0.25em] text-amber-600 bg-amber-50 border border-amber-100/60 px-4 py-1.5 rounded-full uppercase">
          Territory Battle
        </span>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-4">
          Location: Row {gameState.battleContext?.row + 1}, Col {gameState.battleContext?.col + 1}
        </p>
      </div>

      {step === "ATTACKER_ROLL" && (
        <div
          key="bp_attacker"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-[2.5rem] border z-10 p-8 shadow-sm ${
            attacker === 1 ? "bg-indigo-50/20 border-indigo-100/60" : "bg-rose-50/20 border-rose-100/60"
          }`}
        >
          <span className={`text-[9px] font-bold tracking-[0.25em] uppercase mb-3 ${
            attacker === 1 ? "text-indigo-400" : "text-rose-400"
          }`}>
            COMBAT ROUND — ATTACKER
          </span>
          <h2 className={`text-3xl font-extralight mb-10 tracking-widest uppercase ${
            attacker === 1 ? "text-indigo-600" : "text-rose-600"
          }`}>
            P{attacker} Attack
          </h2>
          <div className="scale-110 transform">
            <Dice mode="D8" label="ROLL D8" onRoll={handleAttackerRoll} />
          </div>
          {attackerRoll !== null && (
            <div className="mt-10 flex flex-col items-center">
              <button
                onClick={() => setStep("DEFENDER_ROLL")}
                className={`px-8 py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-md animate-pop ${
                  attacker === 1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                }`}
              >
                Next: P{defender} Defend →
              </button>
              <p className="mt-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "DEFENDER_ROLL" && (
        <div
          key="bp_defender"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-[2.5rem] border z-10 p-8 shadow-sm ${
            defender === 1 ? "bg-indigo-50/20 border-indigo-100/60" : "bg-rose-50/20 border-rose-100/60"
          }`}
        >
          <span className={`text-[9px] font-bold tracking-[0.25em] uppercase mb-3 ${
            defender === 1 ? "text-indigo-400" : "text-rose-400"
          }`}>
            COMBAT ROUND — DEFENDER
          </span>
          <h2 className={`text-3xl font-extralight mb-10 tracking-widest uppercase ${
            defender === 1 ? "text-indigo-600" : "text-rose-600"
          }`}>
            P{defender} Defend
          </h2>
          <div className="scale-110 transform">
            <Dice mode="D8" label="ROLL D8" onRoll={handleDefenderRoll} />
          </div>
          {defenderRoll !== null && (
            <div className="mt-10 flex flex-col items-center">
              <button
                onClick={() => setStep("RESULT")}
                className={`px-8 py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-md animate-pop ${
                  defender === 1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                }`}
              >
                Show Results →
              </button>
              <p className="mt-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "RESULT" && (
        <div
          key="bres"
          className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white rounded-[2.5rem] border border-zinc-200/80 z-20 p-10 shadow-xl shadow-zinc-100/50"
        >
          <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            COMBAT ROUND
          </span>
          <h2 className="text-3xl font-extralight text-zinc-800 mb-10 tracking-widest uppercase">
            Battle Outcome
          </h2>
          
          <div className="flex space-x-16 text-3xl font-light mb-10">
            <div className="flex flex-col items-center gap-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                attacker === 1 ? "text-indigo-400" : "text-rose-400"
              }`}>
                P{attacker} (Attacker)
              </span>
              <span className={`text-4xl font-extrabold ${
                attacker === 1 ? "text-indigo-600" : "text-rose-600"
              }`}>{attackerRoll}</span>
            </div>
            <div className="w-[1px] bg-zinc-200" />
            <div className="flex flex-col items-center gap-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                defender === 1 ? "text-indigo-400" : "text-rose-400"
              }`}>
                P{defender} (Defender)
              </span>
              <span className={`text-4xl font-extrabold ${
                defender === 1 ? "text-indigo-600" : "text-rose-600"
              }`}>{defenderRoll}</span>
            </div>
          </div>

          <div className={`mb-10 text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-2xl border text-center ${
            attackerRoll === defenderRoll
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : (attackerRoll! > defenderRoll! ? attacker : defender) === 1
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            {attackerRoll === defenderRoll
              ? "CLASH! RE-ROLLING!"
              : `PLAYER ${attackerRoll! > defenderRoll! ? attacker : defender} WINS TERRITORY`}
          </div>

          <button
            onClick={handleResultNext}
            className="px-8 py-4 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-900 active:scale-95 transition-all shadow-md shadow-zinc-900/10"
          >
            {attackerRoll === defenderRoll ? "ROLL AGAIN" : "RESOLVE BATTLE"}
          </button>
        </div>
      )}
    </div>
  );
}
