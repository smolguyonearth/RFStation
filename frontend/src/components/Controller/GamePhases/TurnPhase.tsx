import { useState, useEffect } from "react";
import Dice from "@/components/Dice";
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

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative py-4"
    >
      {step === "ROLL" && (
        <div
          key="roll"
          className="w-full flex flex-col items-center justify-center animate-fade-in"
        >
          <span className={`text-[10px] font-extrabold tracking-[0.2em] uppercase mb-2 px-4 py-2 rounded-full border shadow-cute-xs ${isP1 ? "text-[#3B82F6] bg-[#EFF6FF] border-[#BFDBFE]" : "text-[#EF4444] bg-[#FEF2F2] border-[#FCA5A5]"
            }`}>
            {t("turn.active_player")}
          </span>

          <h2 className="text-xl md:text-2xl font-extrabold mb-2 tracking-widest uppercase text-center text-[#333C4E]">
            {t("turn.player_turn", { player: gameState.currentPlayer })}
          </h2>

          <div className="my-2">
            <Dice
              key={`${gameState.currentPlayer}-${gameState.currentTurn}`}
              mode="D6"
              label={t("dice.roll", { mode: "D6" })}
              onRoll={handleRoll}
              playerId={gameState.currentPlayer}
            />
          </div>

          {hasRolled && (
            <div className="mt-4 flex flex-col items-center">
              <button
                data-testid="next-move-btn"
                onTouchStart={(e) => {
                  setStep("ACTION");
                  if (e.cancelable) e.preventDefault();
                }}
                onClick={() => setStep("ACTION")}
                className={`px-8 py-3.5 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-cute border-2 ${isP1
                  ? "bg-[#EFF6FF] hover:bg-[#BFDBFE] text-[#3B82F6] border-[#BFDBFE]"
                  : "bg-[#FEF2F2] hover:bg-[#FCA5A5] text-[#EF4444] border-[#FCA5A5]"
                  }`}
              >
                {t("turn.next_move")}
              </button>
            </div>
          )}
        </div>
      )}

      {step === "ACTION" && (
        <div
          key="action"
          className="w-full max-w-md flex flex-col items-center justify-center animate-fade-in"
        >
          <span className={`text-[10px] font-extrabold tracking-[0.2em] uppercase mb-4 px-4 py-2 rounded-full border shadow-cute-xs ${isP1 ? "text-[#3B82F6] bg-[#EFF6FF] border-[#BFDBFE]" : "text-[#EF4444] bg-[#FEF2F2] border-[#FCA5A5]"
            }`}>
            {t("turn.board_action")}
          </span>

          <h2 className="text-xl md:text-2xl font-extrabold mb-4 tracking-widest uppercase text-center text-[#333C4E]">
            {t("turn.move_piece")}
          </h2>

          <div className="w-full bg-white border border-[#FFF0F3] rounded-[2.5rem] p-7 shadow-cute mb-6 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase block text-indigo-600">
              {t("turn.checklist")}
            </span>
            <h3 className="text-sm font-black mt-1.5 mb-4 uppercase tracking-wider text-zinc-700">
              {t("turn.complete_on_board")}
            </h3>

            <ul className="space-y-3.5 text-[13px] text-zinc-600 font-bold">
              <li className="flex items-start gap-3 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100/60">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-500" />
                <span>{t("turn.checklist_1")}</span>
              </li>
              <li className="flex items-start gap-3 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100/60">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-500" />
                <span>{t("turn.checklist_2")}</span>
              </li>
              <li className="flex items-start gap-3 px-4 py-3 rounded-2xl border text-amber-800 bg-amber-50/60 border-amber-200/70">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />
                <span className="font-extrabold">{t("turn.checklist_3")}</span>
              </li>
            </ul>
          </div>

          <button
            data-testid="end-turn-btn"
            onTouchStart={(e) => {
              endTurn();
              if (e.cancelable) e.preventDefault();
            }}
            onClick={() => endTurn()}
            className="w-full py-4 text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all border-2 bg-[#333C4E] hover:bg-zinc-800 text-white border-[#333C4E] hover:border-zinc-800 shadow-cute-sm active:scale-95"
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
