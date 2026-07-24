import type { AppMode, GameState } from "@/types/game.types";

export default function MuseumControllerView({
  gameState,
  setMode,
}: {
  gameState: GameState;
  setMode: (m: AppMode) => void;
}) {
  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col animate-fade-in relative min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans justify-between">
      
      {/* Top Editorial Bar */}
      <div className="flex justify-between items-baseline pb-6 border-b border-zinc-200 z-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#6B7280] uppercase">
            Guide Console
          </span>
          <h1 className="text-2xl font-light tracking-wide text-[#1F2937] uppercase mt-2">
            Museum Guide
          </h1>
          <p className="text-[#6B7280] text-xs font-light tracking-wide mt-1">
            Language: <span className="font-normal text-[#1F2937]">{gameState.language}</span>
          </p>
        </div>
        <button
          onClick={() => setMode("IDLE")}
          className="px-5 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-xs font-medium text-[#1F2937] hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Exit
        </button>
      </div>

      {/* Main Console Body (Magazine / Editorial Style) */}
      <div className="flex-grow flex flex-col items-center justify-center my-12 z-10">
        {gameState.activeMuseumLocation ? (
          <div className="text-center w-full max-w-sm animate-pop">
            <div className="bg-white border border-zinc-200 rounded-2xl px-12 py-10 shadow-sm mb-6 flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#6B7280] uppercase mb-4">
                Now Broadcasting
              </span>
              <span className="text-4xl font-extralight text-[#1F2937] tracking-wider mb-2 font-mono">
                LOC {gameState.activeMuseumLocation.row}{gameState.activeMuseumLocation.col}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mt-2 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>

            {/* Audio Wave Visualizer Simulation (Muted Sage Green) */}
            <div className="flex justify-center items-end gap-1 h-10 w-full mt-4">
              {[...Array(9)].map((_, i) => {
                const heights = ["h-3", "h-6", "h-9", "h-5", "h-10", "h-7", "h-8", "h-4", "h-3"];
                return (
                  <div
                    key={i}
                    className={`w-1 ${heights[i % heights.length]} bg-[#8CA693] rounded-full animate-bounce`}
                    style={{ animationDuration: `${0.8 + (i * 0.15)}s` }}
                  />
                );
              })}
            </div>
            
            <p className="text-[#6B7280] text-xs font-light mt-8 tracking-wide">
              The presentation is broadcasting on the display screen.
            </p>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center max-w-xs">
            {/* Minimal line-spinner */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-zinc-200" />
              <div className="absolute inset-0 rounded-full border-t border-zinc-400 animate-spin" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 animate-pulse" />
            </div>

            <h2 className="text-lg font-medium text-[#1F2937] tracking-wide uppercase">
              Awaiting Input
            </h2>
            <p className="text-[#6B7280] text-xs mt-3 tracking-wide font-light leading-relaxed">
              Press a physical button on the grid board to retrieve and play the audio landmarks story.
            </p>
          </div>
        )}
      </div>

      {/* Footer System Status */}
      <div className="text-center text-[10px] font-light text-zinc-400 tracking-[0.2em] uppercase pt-6 border-t border-zinc-200">
        RFStation Audio System • Operational
      </div>
    </div>
  );
}
