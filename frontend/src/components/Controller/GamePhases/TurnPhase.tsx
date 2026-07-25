import { useState, useEffect } from "react";
import Dice from "@/components/Dice";
import { useSwipe } from "@/hooks/useSwipe";
import { useTranslation } from "react-i18next";

export default function TurnPhase({ gameState, endTurn }: any) {
  const { t } = useTranslation();
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
          className="w-full flex flex-col items-center justify-center animate-fade-in"
        >
          <span className={`text-[10px] font-extrabold tracking-[0.2em] uppercase mb-4 px-4 py-2 rounded-full border shadow-cute-xs ${
            isP1 ? "text-[#4F46E5] bg-[#EEF2FF] border-[#C7D2FE]" : "text-[#FF7899] bg-[#FFEBF0] border-[#FFD6E0]"
          }`}>
            {t("turn.active_player")}
          </span>
          
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-widest uppercase text-center text-[#333C4E]">
            {t("turn.player_turn", { player: gameState.currentPlayer })}
          </h2>
          
          <div className="my-4">
            <Dice mode="D6" label={t("dice.roll", { mode: "D6" })} onRoll={handleRoll} />
          </div>

          {hasRolled && (
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={() => setStep("ACTION")}
                className={`px-8 py-3.5 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-cute border-2 ${
                  isP1 
                    ? "bg-[#EEF2FF] hover:bg-[#C7D2FE] text-[#4F46E5] border-[#C7D2FE]" 
                    : "bg-[#FFEBF0] hover:bg-[#FFD6E0] text-[#FF7899] border-[#FFD6E0]"
                }`}
              >
                {t("turn.next_move")}
              </button>
              <p className="mt-2 text-[10px] text-zinc-400 font-bold tracking-wider">
                {t("init_roll.or_swipe")}
              </p>
            </div>
          )}
        </div>
      )}

      {step === "ACTION" && (
        <div
          key="action"
          className="w-full max-w-md flex flex-col items-center justify-center animate-fade-in"
        >
          <span className={`text-[10px] font-extrabold tracking-[0.2em] uppercase mb-4 px-4 py-2 rounded-full border shadow-cute-xs ${
            isP1 ? "text-[#4F46E5] bg-[#EEF2FF] border-[#C7D2FE]" : "text-[#FF7899] bg-[#FFEBF0] border-[#FFD6E0]"
          }`}>
            {t("turn.board_action")}
          </span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-widest uppercase text-center text-[#333C4E]">
            {t("turn.move_piece")}
          </h2>

          <div className="w-full bg-white border border-[#FFF0F3] rounded-[2rem] p-6 shadow-cute mb-8 text-left">
            <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#FF7899] uppercase">
              {t("turn.checklist")}
            </span>
            <h3 className="text-xs font-bold mt-1 mb-4 uppercase tracking-wider text-zinc-500">
              {t("turn.complete_on_board")}
            </h3>
            
            <ul className="text-xs space-y-3.5 text-zinc-500 font-bold">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7899] mt-1.5" />
                <span>{t("turn.checklist_1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7899] mt-1.5" />
                <span>{t("turn.checklist_2")}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#333C4E] bg-[#FAF9F6] px-3.5 py-3 rounded-xl border border-[#FFF0F3]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 animate-pulse" />
                <span>{t("turn.checklist_3")}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => endTurn()}
            className={`w-full py-4 text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all border-2 shadow-cute active:scale-95 ${
              isP1 
                ? "bg-[#EEF2FF] hover:bg-[#C7D2FE] text-[#4F46E5] border-[#C7D2FE]" 
                : "bg-[#FFEBF0] hover:bg-[#FFD6E0] text-[#FF7899] border-[#FFD6E0]"
            }`}
          >
            {t("turn.end_turn")}
          </button>
        </div>
      )}
    </div>
  );

  function handleRoll() {
    setHasRolled(true);
  }
}
