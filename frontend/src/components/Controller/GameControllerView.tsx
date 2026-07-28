import InitRollPhase from "./GamePhases/InitRollPhase";
import TurnPhase from "./GamePhases/TurnPhase";
import BattlePhase from "./GamePhases/BattlePhase";
import EndPhase from "./GamePhases/EndPhase";
import { useTranslation } from "react-i18next";

export default function GameControllerView({
  gameState,
  startGame,
  endTurn,
  resetGame,
  setMode,
}: any) {
  const { t } = useTranslation();

  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8 flex flex-col h-full bg-[#FAF9F6] text-[#333C4E] font-sans justify-between relative animate-fade-in select-none overflow-hidden">
      {/* Top Header Deck - Structured 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pb-2 border-b border-[#FFF0F3] z-10 w-full shrink-0">
        {/* Left: Status & Round */}
        <div className="flex flex-col items-start gap-1.5">
          <div className="flex items-center gap-2 bg-[#FFFBE6] border border-[#FFE3B5] px-4 py-2 rounded-full text-amber-700 text-[11px] font-extrabold tracking-widest uppercase shadow-cute-xs">
            <span>{t("game.round")}</span>
            <span className="text-amber-800">{gameState.currentTurn}</span>
            <span className="text-zinc-300">/</span>
            <span>10</span>
          </div>
        </div>

        {/* Center: Title & Scoreboard */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full">
          <h1 className="text-[11px] font-black tracking-[0.2em] text-[#333C4E] uppercase">
            {t("game.controller_title")}
          </h1>
          <div className="flex items-center justify-center gap-3">
            {/* Player 1 Card */}
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 rounded-xl shadow-cute-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">{t("game.p1")}</span>
              <strong className="text-sm font-extrabold text-[#333C4E]">{gameState.scores[1]}</strong>
            </div>

            {/* VS Divider */}
            <span className="text-zinc-300 font-bold text-[10px] uppercase">vs</span>

            {/* Player 2 Card */}
            <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FCA5A5] px-3.5 py-1.5 rounded-xl shadow-cute-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider">{t("game.p2")}</span>
              <strong className="text-sm font-extrabold text-[#333C4E]">{gameState.scores[2]}</strong>
            </div>
          </div>
        </div>

        {/* Right: Global Controls */}
        <div className="flex justify-end gap-2 w-full">
          <button
            data-testid="restart-btn"
            onTouchStart={(e) => {
              resetGame();
              if (e.cancelable) e.preventDefault();
            }}
            onClick={() => resetGame()}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:bg-[#FAF9F6] hover:text-zinc-700 transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {t("game.restart")}
          </button>
          <button
            data-testid="exit-btn"
            onTouchStart={(e) => {
              setMode("IDLE");
              if (e.cancelable) e.preventDefault();
            }}
            onClick={() => setMode("IDLE")}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:bg-[#FAF9F6] hover:text-zinc-700 transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {t("game.exit")}
          </button>
        </div>
      </div>

      {/* RENDER CHOSEN PHASE SUBCONPONENT */}
      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden my-4 md:my-6 z-10 w-full min-h-0">
        {gameState.gamePhase === "INIT" && (
          <InitRollPhase gameState={gameState} startGame={startGame} />
        )}
        {gameState.gamePhase === "TURN" && (
          <TurnPhase gameState={gameState} endTurn={endTurn} />
        )}
        {gameState.gamePhase === "BATTLE" && (
          <BattlePhase gameState={gameState} />
        )}
        {gameState.gamePhase === "END" && (
          <EndPhase gameState={gameState} resetGame={resetGame} />
        )}
      </div>

      {/* Bottom Status Deck */}
      <div className="text-center text-[10px] font-bold text-zinc-300 tracking-[0.25em] uppercase pt-6 border-t border-[#FFF0F3]">
        {t("game.control_footer")}
      </div>
    </div>
  );
}
