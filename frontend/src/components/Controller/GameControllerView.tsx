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
    <div className="flex-1 p-6 md:p-12 flex flex-col min-h-screen bg-[#FAF9F6] text-[#333C4E] font-sans justify-between relative animate-fade-in select-none">
      {/* Top Header Deck */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-baseline gap-6 pb-6 border-b border-[#FFF0F3] z-10">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-3.5 py-1.5 rounded-full uppercase shadow-cute-xs inline-block">
            {t("game.status", { phase: gameState.gamePhase })}
          </span>
          <h1 className="text-2xl font-extrabold tracking-wide text-[#333C4E] uppercase mt-4">
            {t("game.controller_title")}
          </h1>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Player 1 Card */}
            <div className="flex items-center gap-2 bg-[#EEF2FF] border border-[#C7D2FE] px-4 py-2 rounded-xl shadow-cute-xs">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
              <span className="text-[10px] font-bold text-indigo-700 tracking-wider">{t("game.p1")}</span>
              <strong className="text-base font-extrabold text-[#333C4E] ml-1">{gameState.scores[1]}</strong>
            </div>

            {/* VS Divider */}
            <span className="text-zinc-300 font-bold text-xs uppercase">vs</span>

            {/* Player 2 Card */}
            <div className="flex items-center gap-2 bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-xl shadow-cute-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF7899]" />
              <span className="text-[10px] font-bold text-[#FF7899] tracking-wider">{t("game.p2")}</span>
              <strong className="text-base font-extrabold text-[#333C4E] ml-1">{gameState.scores[2]}</strong>
            </div>

            {/* Turn Count Card */}
            <div className="flex items-center gap-1.5 bg-[#FFFBE6] border border-[#FFE3B5] px-4 py-2 rounded-xl text-amber-700 text-[10px] font-bold tracking-wide shadow-cute-xs">
              <span>{t("game.round")}</span>
              <span className="text-amber-800 font-extrabold">{gameState.currentTurn}</span>
              <span className="text-zinc-300">/</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex space-x-3 w-full lg:w-auto mt-4 lg:mt-0">
          <button
            onClick={() => resetGame()}
            className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-500 hover:bg-[#FAF9F6] hover:text-zinc-700 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {t("game.restart")}
          </button>
          <button
            onClick={() => setMode("IDLE")}
            className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-500 hover:bg-[#FAF9F6] hover:text-zinc-700 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {t("game.exit")}
          </button>
        </div>
      </div>

      {/* RENDER CHOSEN PHASE SUBCONPONENT */}
      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden my-12 z-10 w-full min-h-[380px]">
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
