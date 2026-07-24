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
    <div className="flex-1 p-6 md:p-12 flex flex-col min-h-screen relative animate-slide-in-right font-outfit justify-between">
      {/* Top Header Deck */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/[0.06] z-10">
        <div>
          <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-3.5 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.1)] inline-block">
            SYSTEM STATUS: {gameState.gamePhase} PHASE
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-white uppercase mt-4">
            BATTLE CONTROLLER
          </h1>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Player 1 Card */}
            <div className="flex items-center gap-3 bg-indigo-950/20 border border-indigo-500/20 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.05)]">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              <span className="text-xs font-bold text-indigo-300 tracking-wider">PLAYER 1</span>
              <strong className="text-lg font-black text-white ml-2">{gameState.scores[1]}</strong>
            </div>

            {/* VS Divider */}
            <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">VS</span>

            {/* Player 2 Card */}
            <div className="flex items-center gap-3 bg-rose-950/20 border border-rose-500/20 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.05)]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <span className="text-xs font-bold text-rose-300 tracking-wider">PLAYER 2</span>
              <strong className="text-lg font-black text-white ml-2">{gameState.scores[2]}</strong>
            </div>

            {/* Turn Count Card */}
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] px-4 py-2 rounded-2xl text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>ROUND</span>
              <span className="text-white font-black text-sm">{gameState.currentTurn}</span>
              <span className="text-zinc-600">/</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex space-x-3 w-full lg:w-auto">
          <button
            onClick={() => resetGame()}
            className="flex-1 lg:flex-initial px-6 py-3 rounded-xl border border-white/[0.06] hover:border-amber-500/30 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300 hover:text-white font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Restart
          </button>
          <button
            onClick={() => setMode("IDLE")}
            className="flex-1 lg:flex-initial px-6 py-3 rounded-xl border border-white/[0.06] hover:border-rose-500/30 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300 hover:text-white font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Exit Game
          </button>
        </div>
      </div>

      {/* RENDER CHOSEN PHASE SUBCONPONENT */}
      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden my-8 z-10 w-full min-h-[420px]">
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
      <div className="text-center text-[10px] font-bold text-zinc-600 tracking-[0.3em] uppercase pt-6 border-t border-white/[0.04]">
        RFStation Control Hub • Session Sync Enabled
      </div>
    </div>
  );
}
