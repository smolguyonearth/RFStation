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
    <div className="flex-1 p-6 md:p-12 flex flex-col bg-[#F9F9FB] min-h-screen relative animate-slide-in-right">
      <div className="flex justify-between items-end mb-12 pb-6 border-b border-zinc-200 z-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
            {gameState.gamePhase} PHASE
          </span>
          <h1 className="text-3xl font-extralight tracking-widest text-zinc-800 uppercase mt-2">
            Game Controller
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/25" /> P1: {gameState.scores[1]}
            <span className="text-zinc-300 font-normal">|</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/25" /> P2: {gameState.scores[2]}
            <span className="text-zinc-300 font-normal">|</span>
            <span>Turn: {gameState.currentTurn} / 10</span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => resetGame()}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 active:scale-95 transition-all shadow-sm"
          >
            Restart
          </button>
          <button
            onClick={() => setMode("IDLE")}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 active:scale-95 transition-all shadow-sm"
          >
            Exit
          </button>
        </div>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
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
    </div>
  );
}
