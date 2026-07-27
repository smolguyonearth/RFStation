import { useTranslation } from "react-i18next";

export default function EndPhase({ gameState, resetGame }: any) {
  const { t } = useTranslation();
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];

  let statusText = t("end.tie_game");
  let badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
  let trophyEmoji = "🤝";
  let accentColor = "from-amber-400 to-orange-500 shadow-amber-100";

  if (p1 > p2) {
    statusText = t("end.p1_wins");
    badgeColor = "bg-[#EFF6FF] text-blue-800 border-blue-200";
    trophyEmoji = "🏆";
    accentColor = "from-blue-500 to-indigo-600 shadow-blue-100";
  } else if (p2 > p1) {
    statusText = t("end.p2_wins");
    badgeColor = "bg-[#FEF2F2] text-red-800 border-red-200";
    trophyEmoji = "🏆";
    accentColor = "from-red-500 to-rose-600 shadow-red-100";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in py-8 px-4">
      {/* Premium Glassmorphic Card Container */}
      <div className="w-full max-w-sm bg-white border border-[#FFF0F3] rounded-[2.5rem] p-10 shadow-cute relative overflow-hidden text-center flex flex-col items-center justify-center animate-pop">
        {/* Dynamic Gradient Bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${accentColor}`} />

        {/* Celebratory Icon Section with soft glow */}
        <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-full text-4xl mb-6 shadow-cute animate-pulse">
          {trophyEmoji}
        </div>

        <span className={`text-[10px] font-black tracking-[0.25em] uppercase px-3.5 py-1.5 rounded-full border mb-4 shadow-cute-xs ${badgeColor}`}>
          {t("end.conquest_complete")}
        </span>

        <h2 className="text-3xl font-extrabold tracking-wide text-[#333C4E] mb-8 uppercase leading-tight">
          {statusText}
        </h2>

        {/* Visual score cards comparing P1 and P2 */}
        <div className="flex items-center justify-between w-full max-w-[240px] bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 shadow-inner">
          {/* P1 Score Block */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">{t("game.p1")}</span>
            <span className="text-4xl font-black text-blue-600 font-mono leading-none">{p1}</span>
          </div>

          <div className="w-[1px] h-12 bg-zinc-200" />

          {/* P2 Score Block */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-black text-red-600 tracking-widest uppercase">{t("game.p2")}</span>
            <span className="text-4xl font-black text-red-600 font-mono leading-none">{p2}</span>
          </div>
        </div>
      </div>

      {/* Premium Play Again Action Button */}
      <button
        onClick={() => resetGame()}
        className="mt-8 px-10 py-4 bg-[#333C4E] hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-2 border-[#333C4E] hover:border-zinc-800"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        {t("end.play_again")}
      </button>
    </div>
  );
}
