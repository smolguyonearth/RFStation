import type { AppMode, GameState } from "@/types/game.types";

export default function MuseumControllerView({
  gameState,
  setMode,
}: {
  gameState: GameState;
  setMode: (m: AppMode) => void;
}) {

  // Audio effects are handled globally by Controller.tsx WebSocket sync

  return (
    <div className="flex-1 p-8 flex flex-col animate-slide-in-right relative">

      <div className="flex justify-between items-end mb-8 pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-black tracking-wider text-brand-primary">MUSEUM MODE</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
            Language: {gameState.language}
          </p>
        </div>
        <button
          onClick={() => setMode("IDLE")}
          className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold hover:bg-zinc-50 transition-all shadow-sm"
        >
          Exit
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {gameState.activeMuseumLocation ? (
          <div className="text-center animate-pop">
            <h2 className="text-sm text-zinc-500 mb-4 font-bold uppercase tracking-widest">
              Playing Description
            </h2>
            <div className="text-5xl font-black text-brand-primary mb-8 bg-white border border-brand-border rounded-[2rem] px-12 py-8 shadow-lg shadow-zinc-100">
              LOC {gameState.activeMuseumLocation.row}
              {gameState.activeMuseumLocation.col}
            </div>
          </div>
        ) : (
          <div className="text-center animate-pulse">
            <h2 className="text-3xl font-black text-zinc-400 uppercase tracking-widest">
              Awaiting Input
            </h2>
            <p className="text-zinc-500 mt-4 font-bold">
              Press a physical button on the board.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
