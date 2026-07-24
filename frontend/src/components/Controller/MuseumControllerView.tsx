import type { AppMode, GameState } from "@/types/game.types";

export default function MuseumControllerView({
  gameState,
  setMode,
}: {
  gameState: GameState;
  setMode: (m: AppMode) => void;
}) {
  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col animate-slide-in-right relative min-h-screen font-outfit justify-between">
      {/* Top Console Bar */}
      <div className="flex justify-between items-center pb-6 border-b border-white/[0.06] z-10">
        <div>
          <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/30 px-3.5 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            Active Session
          </span>
          <h1 className="text-3xl font-black tracking-wider text-white uppercase mt-3">
            MUSEUM CONSOLE
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
            System Language: <span className="text-zinc-300">{gameState.language}</span>
          </p>
        </div>
        <button
          onClick={() => setMode("IDLE")}
          className="px-6 py-2.5 rounded-xl border border-white/[0.08] hover:border-zinc-500/30 bg-white/[0.02] text-zinc-300 font-extrabold text-xs uppercase tracking-widest hover:bg-white/[0.05] hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Exit Mode
        </button>
      </div>

      {/* Main Console Body */}
      <div className="flex-grow flex flex-col items-center justify-center my-12 z-10">
        {gameState.activeMuseumLocation ? (
          <div className="text-center w-full max-w-md animate-pop">
            <div className="relative inline-block mb-8">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-cyan-500/20 blur-md animate-ping opacity-60" />
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-lg" />
              
              {/* Display Box */}
              <div className="relative text-5xl md:text-6xl font-black text-white bg-black/40 border border-cyan-500/30 rounded-[2.5rem] px-16 py-12 shadow-2xl flex flex-col items-center gap-4">
                <span className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase">
                  Broadcasting Landmark
                </span>
                <span className="font-mono text-cyan-200 tracking-wider">
                  LOC {gameState.activeMuseumLocation.row}{gameState.activeMuseumLocation.col}
                </span>
              </div>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div className="flex justify-center items-end gap-1.5 h-12 w-full mt-4">
              {[...Array(9)].map((_, i) => {
                const heights = ["h-3", "h-7", "h-11", "h-6", "h-12", "h-8", "h-10", "h-5", "h-4"];
                const animationDelay = ["delay-0", "delay-100", "delay-200", "delay-300", "delay-75", "delay-150", "delay-500", "delay-1000", "delay-150"];
                return (
                  <div
                    key={i}
                    className={`w-1.5 ${heights[i % heights.length]} bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-bounce ${animationDelay[i % animationDelay.length]}`}
                    style={{ animationDuration: `${0.6 + (i * 0.1)}s` }}
                  />
                );
              })}
            </div>
            
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-8 animate-pulse">
              Audio narration broadcast is active on display
            </p>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center max-w-sm">
            {/* Radar scanner visual */}
            <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/[0.04] scale-100" />
              <div className="absolute inset-2 rounded-full border border-white/[0.06] scale-95" />
              <div className="absolute inset-6 rounded-full border border-white/[0.08] scale-75" />
              <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-pulse bg-cyan-500/[0.01]" />
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#06b6d4] animate-ping" />
              <div className="absolute w-12 h-12 rounded-full border border-cyan-500/30 border-t-transparent animate-spin" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-widest uppercase">
              Awaiting Selection
            </h2>
            <p className="text-zinc-500 text-sm mt-3 tracking-wide font-medium leading-relaxed">
              Press a physical button on the grid board to play its audio story and details.
            </p>
          </div>
        )}
      </div>

      {/* Footer System Status */}
      <div className="text-center text-[10px] font-bold text-zinc-600 tracking-[0.3em] uppercase pt-6 border-t border-white/[0.04]">
        RFStation Audio Server Operational • V3.2
      </div>
    </div>
  );
}
