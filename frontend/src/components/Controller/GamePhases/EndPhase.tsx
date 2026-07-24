export default function EndPhase({ gameState, resetGame }: any) {
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];
  let msg = "TIE GAME";
  let bg = "bg-white/[0.02] border-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.03)]";
  let labelColor = "text-zinc-500";
  let winColor = "text-white";
  let glowStyle = "";

  if (p1 > p2) {
    msg = "PLAYER 1 WINS";
    bg = "bg-indigo-950/10 border-indigo-500/25";
    labelColor = "text-indigo-400";
    winColor = "text-indigo-300";
    glowStyle = "neon-glow-p1";
  } else if (p2 > p1) {
    msg = "PLAYER 2 WINS";
    bg = "bg-rose-950/10 border-rose-500/25";
    labelColor = "text-rose-400";
    winColor = "text-rose-300";
    glowStyle = "neon-glow-p2";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-pop py-6">
      <div
        className={`p-10 rounded-[2.5rem] border text-center ${bg} ${glowStyle} mb-8 shadow-2xl w-full max-w-sm backdrop-blur-md`}
      >
        <span className={`text-[10px] font-black tracking-[0.3em] ${labelColor} uppercase mb-3 block`}>
          Conquest Complete
        </span>
        <h2 className={`text-3xl font-black tracking-widest mb-8 uppercase ${winColor}`}>{msg}</h2>
        
        <div className="flex justify-center items-center gap-6 font-mono text-zinc-500 font-bold text-xs uppercase tracking-widest bg-black/40 py-4 rounded-2xl border border-white/[0.04] shadow-inner">
          <span>P1: <strong className="text-indigo-400 font-extrabold text-sm">{p1}</strong></span>
          <span className="text-zinc-800">|</span>
          <span>P2: <strong className="text-rose-400 font-extrabold text-sm">{p2}</strong></span>
        </div>
      </div>

      <button
        onClick={() => resetGame()}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
      >
        Play Again
      </button>
    </div>
  );
}
