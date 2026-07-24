import InitRollPhase from "./GamePhases/InitRollPhase";
import TurnPhase from "./GamePhases/TurnPhase";
import BattlePhase from "./GamePhases/BattlePhase";
import EndPhase from "./GamePhases/EndPhase";

export default function GameControllerView({
  gameState,
  startGame,
  endTurn,
  resetGame,
  setMode,
}: any) {
  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans justify-between relative animate-fade-in">
      {/* Top Header Deck */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-baseline gap-6 pb-6 border-b border-zinc-200 z-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#6B7280] uppercase">
            Active Session: {gameState.gamePhase} Phase
          </span>
          <h1 className="text-2xl font-light tracking-wide text-[#1F2937] uppercase mt-2">
            Game Controller
          </h1>
          
          {/* Stats Bar (Minimalist Pills) */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Player 1 Card */}
            <div className="flex items-center gap-2 bg-[#EEF2FF] border border-indigo-100 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold text-indigo-700 tracking-wider">PLAYER 1</span>
              <strong className="text-sm font-semibold text-indigo-950 ml-1">{gameState.scores[1]}</strong>
            </div>

            {/* VS Divider */}
            <span className="text-zinc-300 text-xs font-light">/</span>

            {/* Player 2 Card */}
            <div className="flex items-center gap-2 bg-[#FFF1F2] border border-rose-100 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-rose-700 tracking-wider">PLAYER 2</span>
              <strong className="text-sm font-semibold text-rose-950 ml-1">{gameState.scores[2]}</strong>
            </div>

            {/* Turn Count Card */}
            <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/50 px-3 py-1.5 rounded-lg text-zinc-500 text-[10px] font-medium tracking-wide">
              <span>ROUND</span>
              <span className="text-zinc-800 font-semibold">{gameState.currentTurn}</span>
              <span className="text-zinc-300">/</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Global Controls (Ghost Buttons) */}
        <div className="flex space-x-2 w-full lg:w-auto">
          <button
            onClick={() => resetGame()}
            className="flex-1 lg:flex-initial px-5 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Restart
          </button>
          <button
            onClick={() => setMode("IDLE")}
            className="flex-1 lg:flex-initial px-5 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Exit
          </button>
        </div>
      </div>

      {/* RENDER CHOSEN PHASE SUBCOMPONENT */}
      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden my-12 z-10 w-full min-h-[380px]">
        {gameState.gamePhase === "INIT" && (
          <InitRollPhase startGame={startGame} />
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
      <div className="text-center text-[10px] font-light text-zinc-400 tracking-[0.2em] uppercase pt-6 border-t border-zinc-200">
        RFStation Control Hub • Operational
      </div>
    </div>
  );
}
