import { useState } from "react";
import { useSwipe } from "@/hooks/useSwipe";
import Dice from "@/components/Dice";
import { useTranslation } from "react-i18next";

export default function BattlePhase({ gameState }: any) {
  const { t } = useTranslation();
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
    () => { }, // Swipe Right (Ignore)
  );

  return (
    <div {...swipeHandlers} className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#FDFBF9]">

      {/* Main Card Container */}
      <div className="w-full max-w-sm bg-white rounded-[32px] border border-zinc-100 shadow-sm p-8 flex flex-col items-center animate-in fade-in duration-500">

        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF6B81] bg-[#FF6B81]/10 px-4 py-1.5 rounded-full uppercase">
            {step === "ATTACKER_ROLL" 
              ? t("battle.attacker_tag") 
              : step === "DEFENDER_ROLL" 
                ? t("battle.defender_tag") 
                : t("battle.outcome_tag")}
          </span>
          <h2 className="text-xl font-light mt-4 text-zinc-900 tracking-wide uppercase">
            {step === "ATTACKER_ROLL" 
              ? t("battle.attacker_title", { attacker }) 
              : step === "DEFENDER_ROLL" 
                ? t("battle.defender_title", { defender }) 
                : t("battle.result_title")}
          </h2>
          {step !== "RESULT" && (
            <p className="text-zinc-400 font-medium text-[10px] mt-2 uppercase tracking-wider">
              {t("battle.loc", { row: gameState.battleContext?.row + 1, col: gameState.battleContext?.col + 1 })}
            </p>
          )}
        </div>

        {/* Content Section based on Step */}
        {step === "ATTACKER_ROLL" && (
          <div className="w-full flex flex-col items-center gap-6">
            <Dice mode="D8" label={t("dice.roll", { mode: "D8" })} onRoll={setAttackerRoll} />
            {attackerRoll !== null && (
              <button
                onClick={() => setStep("DEFENDER_ROLL")}
                className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#FF5267] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-[#FF6B81]/20"
              >
                {t("battle.confirm_roll")}
              </button>
            )}
          </div>
        )}

        {step === "DEFENDER_ROLL" && (
          <div className="w-full flex flex-col items-center gap-6">
            <Dice mode="D8" label={t("dice.roll", { mode: "D8" })} onRoll={setDefenderRoll} />
            {defenderRoll !== null && (
              <button
                onClick={() => setStep("RESULT")}
                className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#FF5267] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-[#FF6B81]/20"
              >
                {t("battle.show_results")}
              </button>
            )}
          </div>
        )}

        {step === "RESULT" && (
          <div className="w-full flex flex-col items-center">
            {/* Score Display */}
            <div className="flex items-center justify-between w-full mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
              <div className="text-center">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">{attacker === 1 ? t("game.p1") : t("game.p2")}</p>
                <p className="text-3xl font-light text-zinc-900 mt-1">{attackerRoll}</p>
              </div>
              <div className="text-zinc-300 font-light text-sm">VS</div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">{defender === 1 ? t("game.p1") : t("game.p2")}</p>
                <p className="text-3xl font-light text-zinc-900 mt-1">{defenderRoll}</p>
              </div>
            </div>

            {/* Winner Badge */}
            <div className={`mb-8 px-6 py-3 rounded-xl text-center w-full ${attackerRoll === defenderRoll ? "bg-amber-50 text-amber-600" : "bg-[#FF6B81]/10 text-[#FF6B81]"}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {attackerRoll === defenderRoll 
                  ? t("battle.clash") 
                  : t("battle.winner", { player: attackerRoll! > defenderRoll! ? attacker : defender })}
              </p>
            </div>

            <button
              onClick={handleResultNext}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              {attackerRoll === defenderRoll ? t("battle.roll_again") : t("battle.resolve")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
