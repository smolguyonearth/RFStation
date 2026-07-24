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
      className={`w-full h-full flex flex-col items-center justify-center relative py-6 select-none ${swipeHandlers.className}`}
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
        <span className="text-[10px] font-black tracking-[0.3em] text-amber-400 bg-amber-950/40 border border-amber-800/30 px-5 py-1.5 rounded-full uppercase">
          Territory Battle
        </span>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-4">
          Location: Row {gameState.battleContext?.row + 1}, Col {gameState.battleContext?.col + 1}
        </p>
      </div>

      {step === "ATTACKER_ROLL" && (
        <div
          key="bp_attacker"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md z-10 p-8 shadow-2xl ${
            attacker === 1 ? "border-indigo-500/20 neon-glow-p1" : "border-rose-500/20 neon-glow-p2"
          }`}
        >
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full ${
            attacker === 1 ? "text-indigo-400 bg-indigo-950/40 border border-indigo-800/30" : "text-rose-400 bg-rose-950/40 border border-rose-800/30"
          }`}>
            COMBAT ROUND — ATTACKER
          </span>
          <h2 className={`text-3xl font-black mb-8 tracking-widest uppercase text-center ${
            attacker === 1 ? "text-indigo-300" : "text-rose-300"
          }`}>
            PLAYER {attacker} ATTACK
          </h2>
          <div className="scale-110 transform">
            <Dice mode="D8" label="ROLL D8" onRoll={handleAttackerRoll} />
          </div>
          {attackerRoll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("DEFENDER_ROLL")}
                className={`px-8 py-3.5 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg animate-pop ${
                  attacker === 1 
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-600/25" 
                    : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-600/25"
                }`}
              >
                Next: P{defender} Defend →
              </button>
              <p className="mt-3 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "DEFENDER_ROLL" && (
        <div
          key="bp_defender"
          className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right rounded-[2.5rem] border bg-white/[0.02] backdrop-blur-md z-10 p-8 shadow-2xl ${
            defender === 1 ? "border-indigo-500/20 neon-glow-p1" : "border-rose-500/20 neon-glow-p2"
          }`}
        >
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full ${
            defender === 1 ? "text-indigo-400 bg-indigo-950/40 border border-indigo-800/30" : "text-rose-400 bg-rose-950/40 border border-rose-800/30"
          }`}>
            COMBAT ROUND — DEFENDER
          </span>
          <h2 className={`text-3xl font-black mb-8 tracking-widest uppercase text-center ${
            defender === 1 ? "text-indigo-300" : "text-rose-300"
          }`}>
            PLAYER {defender} DEFEND
          </h2>
          <div className="scale-110 transform">
            <Dice mode="D8" label="ROLL D8" onRoll={handleDefenderRoll} />
          </div>
          {defenderRoll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep("RESULT")}
                className={`px-8 py-3.5 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg animate-pop ${
                  defender === 1 
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-600/25" 
                    : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-600/25"
                }`}
              >
                Show Results →
              </button>
              <p className="mt-3 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                (Or Swipe Left)
              </p>
            </div>
          )}
        </div>
      )}

      {step === "RESULT" && (
        <div
          key="bres"
          className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-800 z-20 p-8 shadow-2xl"
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-4 py-1.5 rounded-full uppercase mb-4">
            COMBAT OVERVIEW
          </span>
          <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">
            BATTLE OUTCOME
          </h2>
          
          <div className="flex justify-center items-center gap-12 w-full max-w-sm mb-8 bg-white/[0.02] border border-white/[0.04] p-6 rounded-3xl">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                attacker === 1 ? "text-indigo-400" : "text-rose-400"
              }`}>
                P{attacker} (Attack)
              </span>
              <span className={`text-4xl font-black font-mono ${
                attacker === 1 ? "text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              }`}>{attackerRoll}</span>
            </div>
            <div className="w-[1px] h-14 bg-zinc-800" />
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                defender === 1 ? "text-indigo-400" : "text-rose-400"
              }`}>
                P{defender} (Defend)
              </span>
              <span className={`text-4xl font-black font-mono ${
                defender === 1 ? "text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              }`}>{defenderRoll}</span>
            </div>
          </div>

          <div className={`mb-8 text-xs font-black tracking-widest uppercase px-8 py-4 rounded-2xl border text-center shadow-inner ${
            attackerRoll === defenderRoll
              ? "bg-amber-950/20 border-amber-500/25 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              : (attackerRoll! > defenderRoll! ? attacker : defender) === 1
                ? "bg-indigo-950/20 border-indigo-500/25 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                : "bg-rose-950/20 border-rose-500/25 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
          }`}>
            {attackerRoll === defenderRoll
              ? "CLASH! RE-ROLLING!"
              : `PLAYER ${attackerRoll! > defenderRoll! ? attacker : defender} WINS TERRITORY`}
          </div>

          <button
            onClick={handleResultNext}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            {attackerRoll === defenderRoll ? "ROLL AGAIN" : "RESOLVE BATTLE"}
          </button>
        </div>
      )}
    </div>
  );
}
