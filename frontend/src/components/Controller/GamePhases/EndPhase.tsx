export default function EndPhase({ gameState, resetGame }: any) {
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];
  let msg = "Tie Game";
  let bg = "bg-white border-zinc-200";
  let labelColor = "text-zinc-500";
  let winColor = "text-[#1F2937]";

  if (p1 > p2) {
    msg = "Player 1 Wins";
    bg = "bg-indigo-50/20 border-indigo-100";
    labelColor = "text-indigo-600";
    winColor = "text-indigo-950";
  } else if (p2 > p1) {
    msg = "Player 2 Wins";
    bg = "bg-rose-50/20 border-rose-100";
    labelColor = "text-rose-600";
    winColor = "text-rose-950";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-pop py-4">
      <div
        className={`p-10 rounded-2xl border text-center ${bg} mb-8 shadow-sm w-full max-w-xs bg-white`}
      >
        <span className={`text-[10px] font-bold tracking-[0.2em] ${labelColor} uppercase mb-3 block`}>
          Conquest Complete
        </span>
        <h2 className={`text-xl font-light tracking-wide mb-8 uppercase ${winColor}`}>{msg}</h2>
        
        <div className="flex justify-center items-center gap-6 font-mono text-zinc-500 text-xs bg-zinc-50 py-3 rounded-xl border border-zinc-200/50 shadow-inner">
          <span>P1: <strong className="text-indigo-600 font-semibold">{p1}</strong></span>
          <span className="text-zinc-300">|</span>
          <span>P2: <strong className="text-rose-600 font-semibold">{p2}</strong></span>
        </div>
      </div>

      <button
        onClick={() => resetGame()}
        className="px-6 py-3 bg-zinc-800 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-900 active:scale-95 transition-all shadow-sm"
      >
        Play Again
      </button>
    </div>
  );
}
