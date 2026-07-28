import { Swords, Trophy, Sparkles, Loader2 } from "lucide-react";
import type { Language, GamePhase } from "@/types/game.types";

// --- PROPS INTERFACES ---
interface GameIntroScreenProps {
  language: Language;
  t: (key: string, options?: Record<string, unknown>) => string;
}

interface PlayerScoreCardProps {
  className?: string;
  playerId: 1 | 2;
  currentPlayer: number;
  score: number;
  zone: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}

interface GameStatusPanelProps {
  className?: string;
  gamePhase: GamePhase;
  currentPlayer: number;
  t: (key: string, options?: Record<string, unknown>) => string;
}

interface BattleOverlayProps {
  t: (key: string, options?: Record<string, unknown>) => string;
}

// --- CONSTANTS ---
const ZONE_NAME_MAP: Record<string, string> = {
  waiting: "Searching...",
  mahanakhon: "Mahanakhon",
  asiatique: "Asiatique",
  giant_swing: "Giant Swing",
  wat_arun: "Wat Arun",
  bremen_stadium: "Bremen Stadium",
  townhall: "Townhall",
};

const PLAYER_CONFIG = {
  1: {
    labelKey: "game.p1",
    activeClasses: "border-[#BFDBFE] bg-[#EFF6FF]/40 shadow-cute-sm scale-102",
    inactiveClasses: "border-zinc-100 bg-[#FAF9F6]/50 opacity-40",
    bulbColor: "bg-[#3B82F6]",
    textColor: "text-[#3B82F6]",
    badgeColor: "bg-[#3B82F6]",
    statusColor: (isWaiting: boolean) =>
      isWaiting
        ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
        : "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]",
    testId: "monitor-p1-card",
    scoreTestId: "monitor-p1-score",
  },
  2: {
    labelKey: "game.p2",
    activeClasses: "border-[#FCA5A5] bg-[#FEF2F2]/40 shadow-cute-sm scale-102",
    inactiveClasses: "border-zinc-100 bg-[#FAF9F6]/50 opacity-40",
    bulbColor: "bg-[#EF4444]",
    textColor: "text-[#EF4444]",
    badgeColor: "bg-[#EF4444]",
    statusColor: (isWaiting: boolean) =>
      isWaiting
        ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
        : "bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]",
    testId: "monitor-p2-card",
    scoreTestId: "monitor-p2-score",
  },
};

// --- COMPONENTS ---

export function GameIntroScreen({ language, t }: GameIntroScreenProps) {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center relative select-none px-4 py-12 font-sans text-[#333C4E]">
      <div className="w-full max-w-2xl bg-white border border-[#FFF0F3] rounded-[2.5rem] p-12 shadow-cute flex flex-col items-center justify-center text-center relative overflow-hidden animate-pop">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-[#EF4444] to-[#3B82F6]" />
        <div className="w-20 h-20 bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center rounded-full text-3xl mb-8 shadow-cute animate-pulse">
          🔊
        </div>
        <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#3F72AF] bg-[#3F72AF]/10 border border-[#3F72AF]/20 px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
          {t("game.intro_tag")}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#333C4E] mb-2 tracking-widest uppercase text-center">
          {t("game.intro_title")}
        </h2>
        <p className="text-xs text-zinc-400 font-bold max-w-sm text-center leading-relaxed mb-6 uppercase tracking-wider">
          {t("game.intro_desc")}
        </p>
        <div className="flex items-center gap-3 bg-[#E1F7EC] border border-[#C2F0D9] px-5 py-2.5 rounded-xl shadow-cute-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-black tracking-wider text-emerald-800 uppercase">
            {t("museum.language")}: {language || "EN"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlayerScoreCard({
  className,
  playerId,
  currentPlayer,
  score,
  zone,
  t,
}: PlayerScoreCardProps) {
  const config = PLAYER_CONFIG[playerId];
  const isActive = currentPlayer === playerId;
  const isWaiting = zone === "waiting";

  return (
    <div
      data-testid={config.testId}
      className={`relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center mx-2 my-2 ${className ?? ""
        } ${isActive ? config.activeClasses : config.inactiveClasses}`}
    >
      <div className="flex flex-col gap-1.5 items-center w-full">
        <span
          className={`text-[10px] font-black tracking-[0.25em] ${config.textColor} uppercase flex items-center justify-center gap-1.5 w-full`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.bulbColor} animate-pulse`} />
          {t(config.labelKey)}
        </span>
        <div className="flex items-baseline justify-center">
          <span
            data-testid={config.scoreTestId}
            className="text-5xl font-black text-zinc-800 font-mono leading-none tracking-tight"
          >
            {score}
          </span>
        </div>
        <div
          className={`mt-2 px-3 py-1 rounded-xl text-[9px] font-black inline-flex items-center justify-center gap-1.5 border transition-all duration-300 w-full max-w-[160px] ${config.statusColor(
            isWaiting
          )}`}
        >
          <span>
            {isWaiting ? <Loader2 size={10} className="animate-spin text-zinc-400" /> : "📍"}
          </span>
          <span className="truncate">{(ZONE_NAME_MAP[zone] || zone).toUpperCase()}</span>
        </div>
      </div>
      {isActive && (
        <div
          className={`absolute right-4 top-4 ${config.badgeColor} text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider animate-pulse shadow-sm`}
        >
          {t("game.active_turn")}
        </div>
      )}
    </div>
  );
}

export function GameStatusPanel({ className, gamePhase, currentPlayer, t }: GameStatusPanelProps) {
  return (
    <div
      className={`flex flex-col items-center text-center p-3 bg-[#FAF9F6] border border-[#FFF0F3] rounded-3xl shadow-inner mx-2 my-2${className ?? ""}`}
    >
      <h2 className="text-[10px] font-black tracking-[0.35em] text-zinc-400 uppercase mb-2">
        {t("game.territory_conquest")}
      </h2>
      <div
        data-testid="monitor-phase-badge"
        className="px-4 py-1.5 border border-zinc-200 bg-white rounded-xl text-zinc-600 text-xs font-bold uppercase tracking-widest shadow-cute-xs flex items-center gap-2"
      >
        {gamePhase === "BATTLE" ? (
          <>
            <Swords size={14} className="text-amber-500 animate-bounce" />
            <span className="text-amber-500 font-sans tracking-[0.1em]">
              {t("game.phase", { phase: gamePhase })}
            </span>
          </>
        ) : gamePhase === "END" ? (
          <>
            <Trophy size={14} className="text-yellow-500 animate-bounce" />
            <span className="text-yellow-500 font-sans tracking-[0.1em]">
              {t("game.phase", { phase: gamePhase })}
            </span>
          </>
        ) : (
          <>
            <Sparkles size={14} className="text-[#FF7899]" />
            <span className="text-zinc-600 font-sans tracking-[0.1em]">
              {t("game.phase", { phase: gamePhase })}
            </span>
          </>
        )}
      </div>
      <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2.5 tracking-widest leading-relaxed px-2">
        {gamePhase === "TURN"
          ? t("game.turn_desc", { player: currentPlayer })
          : gamePhase === "BATTLE"
            ? t("game.combat_desc")
            : gamePhase === "END"
              ? t("game.gameover_desc")
              : t("game.init_desc")}
      </p>
    </div>
  );
}

export function BattleOverlay({ t }: BattleOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#FAF9F6]/90 backdrop-blur-xs rounded-[2.5rem] animate-fade-in p-6">
      <div className="text-center px-10 py-12 bg-white border border-[#FFF0F3] rounded-[2.5rem] shadow-cute max-w-sm w-full animate-pop flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7899] via-amber-400 to-[#2BB673]" />
        <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-500 mb-6 animate-pulse">
          <Swords size={40} className="text-amber-500" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-1.5 rounded-xl uppercase shadow-cute-xs">
          {t("game.combat_encounter")}
        </span>
        <h2 className="text-3xl font-extrabold tracking-widest text-[#333C4E] uppercase mt-6 mb-3 animate-pulse">
          {t("game.battle_alert")}
        </h2>
        <p className="text-zinc-500 text-xs font-bold leading-relaxed max-w-xs mt-2 uppercase tracking-widest leading-relaxed">
          {t("game.battle_desc")}
        </p>
      </div>
    </div>
  );
}

interface EndPhaseOverlayProps {
  t: (key: string, options?: Record<string, unknown>) => string;
  scores: Record<number, number>;
}

export function EndPhaseOverlay({ t, scores }: EndPhaseOverlayProps) {
  const p1 = scores[1];
  const p2 = scores[2];

  let statusText = t("end.tie_game");
  let badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
  let accentColor = "from-amber-400 to-orange-500 shadow-amber-100";
  let winnerBanner = "border-amber-100 bg-amber-50/30";

  if (p1 > p2) {
    statusText = t("end.p1_wins");
    badgeColor = "bg-[#EFF6FF] text-blue-800 border-blue-200";
    accentColor = "from-blue-500 to-indigo-600 shadow-blue-100";
    winnerBanner = "border-blue-100 bg-[#EFF6FF]/30";
  } else if (p2 > p1) {
    statusText = t("end.p2_wins");
    badgeColor = "bg-[#FEF2F2] text-red-800 border-red-200";
    accentColor = "from-red-500 to-rose-600 shadow-red-100";
    winnerBanner = "border-red-100 bg-[#FEF2F2]/30";
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#FAF9F6]/95 backdrop-blur-md rounded-[2.5rem] animate-fade-in p-6">
      <div className={`text-center px-16 py-14 bg-white border-2 ${winnerBanner} rounded-[3rem] shadow-cute max-w-lg w-full animate-pop flex flex-col items-center relative overflow-hidden`}>
        {/* Dynamic Gradient Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${accentColor}`} />

        {/* Large Celebratory Icon with soft glow */}
        <div className="w-24 h-24 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-full mb-8 shadow-cute animate-pulse">
          {p1 === p2 ? (
            <Sparkles size={44} className="text-amber-500" />
          ) : (
            <Trophy size={44} className={p1 > p2 ? "text-blue-500" : "text-red-500"} />
          )}
        </div>

        <span className={`text-[11px] font-black tracking-[0.25em] uppercase px-5 py-2.5 rounded-full border mb-6 shadow-cute-xs ${badgeColor}`}>
          {t("end.conquest_complete")}
        </span>

        <h2 className="text-4xl font-black tracking-wide text-[#333C4E] mb-10 uppercase leading-none">
          {statusText}
        </h2>

        {/* Side by side visual scoreboard comparing P1 and P2 */}
        <div className="flex items-center justify-between w-full max-w-xs bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100 shadow-inner">
          {/* Player 1 Details */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase">{t("game.p1")}</span>
            <span className="text-5xl font-black text-blue-600 font-mono leading-none">{p1}</span>
          </div>

          {/* VS Divider */}
          <div className="w-[1px] h-16 bg-zinc-200 mx-4" />

          {/* Player 2 Details */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-black text-red-600 tracking-widest uppercase">{t("game.p2")}</span>
            <span className="text-5xl font-black text-red-600 font-mono leading-none">{p2}</span>
          </div>
        </div>

        {/* Waiting for controller restart indicator */}
        <p className="text-[10px] text-zinc-400 font-black tracking-widest uppercase mt-10 animate-pulse">
          {t("end.waiting_for_restart")}
        </p>
      </div>
    </div>
  );
}
