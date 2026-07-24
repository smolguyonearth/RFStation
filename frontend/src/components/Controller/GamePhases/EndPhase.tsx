export default function EndPhase({ gameState, resetGame }: any) {
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];
  let msg = "Tie Game";
  let bg = "bg-white border-zinc-200";
  let labelColor = "text-zinc-400";
  let winColor = "text-zinc-900";

  if (p1 > p2) {
    msg = "Player 1 Wins";
    bg = "bg-[#EEF2FF] border-indigo-100/60";
    labelColor = "text-indigo-600";
    winColor = "text-indigo-900";
  } else if (p2 > p1) {
    msg = "Player 2 Wins";
    bg = "bg-[#FFF1F2] border-rose-100/60";
    labelColor = "text-rose-600";
    winColor = "text-rose-900";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-pop py-4">
      <div
        className={`p-10 rounded-3xl border ${bg} mb-8 shadow-sm w-full max-w-xs bg-white text-center`}
      >
        <span className={`text-[10px] font-bold tracking-[0.25em] ${labelColor} uppercase mb-3 block`}>
          Conquest Complete
        </span>
        <h2 className={`text-2xl font-light tracking-wider mb-8 uppercase ${winColor}`}>{msg}</h2>
        
        <div className="flex justify-center items-center gap-6 font-mono text-zinc-600 text-xs bg-zinc-50 py-3.5 rounded-xl border border-zinc-200/60 shadow-inner">
          <span>P1: <strong className="text-indigo-600 font-bold">{p1}</strong></span>
          <span className="text-zinc-300 font-medium">|</span>
          <span>P2: <strong className="text-rose-600 font-bold">{p2}</strong></span>
        </div>
      </div>

      <button
        onClick={() => resetGame()}
        className="px-6 py-3 bg-[#0C1227] hover:bg-[#1E294A] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
      >
        Play Again
      </button>
    </div>
  );
}
