export default function EndPhase({ gameState, resetGame }: any) {
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];
  let msg = "TIE GAME";
  let bg = "bg-white text-zinc-800 border-zinc-200/80 shadow-zinc-100/50";
  let labelColor = "text-zinc-400";
  let winColor = "text-zinc-800";

  if (p1 > p2) {
    msg = "PLAYER 1 WINS";
    bg = "bg-indigo-50/20 text-indigo-800 border-indigo-100/60 shadow-indigo-100/5";
    labelColor = "text-indigo-400";
    winColor = "text-indigo-700";
  } else if (p2 > p1) {
    msg = "PLAYER 2 WINS";
    bg = "bg-rose-50/20 text-rose-800 border-rose-100/60 shadow-rose-100/5";
    labelColor = "text-rose-400";
    winColor = "text-rose-700";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-pop py-12">
      <div
        className={`p-10 rounded-[2.5rem] border text-center ${bg} mb-12 shadow-xl w-full max-w-sm`}
      >
        <span className={`text-[9px] font-bold tracking-[0.25em] ${labelColor} uppercase mb-3 block`}>
          CONQUEST COMPLETE
        </span>
        <h2 className={`text-3xl font-extralight tracking-widest mb-8 uppercase ${winColor}`}>{msg}</h2>
        
        <div className="flex justify-center items-center gap-6 font-mono text-zinc-500 font-bold text-xs uppercase tracking-widest bg-white/60 py-3 rounded-2xl border border-zinc-200/40">
          <span>P1 Score: <strong className="text-indigo-600 font-extrabold">{p1}</strong></span>
          <span className="text-zinc-300">|</span>
          <span>P2 Score: <strong className="text-rose-600 font-extrabold">{p2}</strong></span>
        </div>
      </div>

      <button
        onClick={() => resetGame()}
        className="px-8 py-4 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-900 active:scale-95 transition-all shadow-md shadow-zinc-900/10"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
