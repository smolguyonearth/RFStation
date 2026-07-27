import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Landmarks } from "@/constants/landmark";
import { Swords, Loader2, Trophy, Sparkles } from "lucide-react";
import { AudioEngine } from "@/lib/AudioEngine";
import MapViewer from "@/components/Map/MapViewer";

type AppMode = "IDLE" | "MUSEUM" | "GAME";
type Language = "EN" | "TH" | "DE";
type GamePhase = "INIT" | "TURN" | "BATTLE" | "END";

interface GameData {
  mode: AppMode;
  language: Language;
  gamePhase: GamePhase;
  currentPlayer: number;
  displayMatrix: number[][];
  battleContext: { row: number; col: number } | null;
  scores: { 1: number; 2: number };
  activeMuseumLocation: { row: number; col: number } | null;
  introActive?: boolean;
}

export default function GameMonitorView({
  game,
  onAction,
}: {
  game: GameData;
  onAction: (r: number, c: number) => void;
}) {
  const { t } = useTranslation();
  const [p1Zone, setP1Zone] = useState<string>("waiting");
  const [p2Zone, setP2Zone] = useState<string>("waiting");

  useEffect(() => {
    AudioEngine.handleGameUpdate(game);
  }, [game]);

  useEffect(() => {
    return () => {
      AudioEngine.reset();
    };
  }, []);

  useEffect(() => {
    const handleDeviceUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { device_code, zone } = customEvent.detail;
      if (device_code === "P1") setP1Zone(zone);
      else if (device_code === "P2") setP2Zone(zone);

      AudioEngine.handlePhysicalZoneUpdate(device_code, zone);
    };

    window.addEventListener("device_zone_update", handleDeviceUpdate);
    return () =>
      window.removeEventListener("device_zone_update", handleDeviceUpdate);
  }, []);

  if (game.introActive) {
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center relative select-none px-4 py-12 font-sans text-[#333C4E]">
        <div className="w-full max-w-2xl bg-white border border-[#FFF0F3] rounded-[2.5rem] p-12 shadow-cute flex flex-col items-center justify-center text-center relative overflow-hidden animate-pop">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-[#FF7899] to-[#2BB673]" />

          <div className="w-20 h-20 bg-[#FFEBF0] border border-[#FFD6E0] flex items-center justify-center rounded-full text-3xl mb-8 shadow-cute animate-pulse">
            🔊
          </div>

          <span className="text-[10px] font-black tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black tracking-wider text-emerald-800 uppercase">
              {t("museum.language")}: {game.language || "EN"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const zoneNameMap: Record<string, string> = {
    waiting: "Searching...",
    mahanakhon: "Mahanakhon",
    asiatique: "Asiatique",
    giant_swing: "Giant Swing",
    wat_arun: "Wat Arun",
    bremen_stadium: "Bremen Stadium",
    townhall: "Townhall",
  };

  const matrixToLandmarkId = [
    ["lm_01", "lm_06", "lm_03"],
    ["lm_10", "lm_02", "lm_04"],
  ];

  const ownershipMap: Record<string, number> = {};
  game.displayMatrix.forEach((row, r) => {
    row.forEach((val, c) => {
      const landmarkId = matrixToLandmarkId[r][c];
      ownershipMap[landmarkId] = val;
    });
  });

  const handleMapSelect = (land: any) => {
    for (let r = 0; r < matrixToLandmarkId.length; r++) {
      for (let c = 0; c < matrixToLandmarkId[r].length; c++) {
        if (matrixToLandmarkId[r][c] === land.id) {
          onAction(r, c);
          return;
        }
      }
    }
  };

  return (
    <div className="w-full max-w-[96vw] mx-auto flex flex-col items-center relative select-none px-6 py-4 font-sans text-[#333C4E] h-screen overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FF7899]/3 blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#2BB673]/3 blur-[100px] animate-float-medium pointer-events-none" />

      {/* Header Panel (Dropdowns removed) */}
      <div className="w-full flex justify-between items-center mb-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7899] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7899]"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            {t("game.exhibit_console")}
          </span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {t("game.footer_version")}
        </div>
      </div>

      {/* Main Glass HUD Dashboard */}
      <div className="w-full bg-white border border-[#FFF0F3] rounded-[2.5rem] p-6 shadow-cute flex flex-col lg:flex-row gap-6 z-10 relative overflow-hidden flex-1 min-h-0">

        {/* Dynamic Game MapViewer (Left/Main Side) */}
        <div
          className={`w-full lg:w-2/3 flex-1 min-h-0 bg-[#FAF9F6] border border-[#FFF0F3] rounded-[2rem] overflow-hidden transition-all duration-700 shadow-inner ${game.gamePhase === "BATTLE" ? "scale-[0.97] opacity-40 blur-[1px] pointer-events-none" : ""
            }`}
        >
          <MapViewer
            selectedLand={null}
            onSelect={handleMapSelect}
            ownershipMap={ownershipMap}
          />
        </div>

        {/* Vertical Scoreboard Sidebar (Right Side) */}
        <div className="w-full lg:w-76 flex flex-col gap-4 lg:gap-5 items-stretch shrink-0 overflow-y-auto px-3 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Player 1 Box (Neon Emerald/Green Theme) */}
          <div
            className={`relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center mx-2 my-2 flex-1 ${game.currentPlayer === 1
              ? "border-[#C2F0D9] bg-[#E1F7EC]/40 shadow-cute-sm scale-102"
              : "border-zinc-100 bg-[#FAF9F6]/50 opacity-40"
              }`}
          >
            <div className="flex flex-col gap-1.5 items-center w-full">
              <span className="text-[10px] font-black tracking-[0.25em] text-[#2BB673] uppercase flex items-center justify-center gap-1.5 w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2BB673] animate-pulse" />
                {t("game.p1")}
              </span>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-black text-zinc-800 font-mono leading-none tracking-tight">
                  {game.scores[1]}
                </span>
              </div>
              <div className={`mt-2 px-3 py-1 rounded-xl text-[9px] font-black inline-flex items-center justify-center gap-1.5 border transition-all duration-300 w-full max-w-[160px] ${p1Zone === "waiting"
                ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
                : "bg-[#E1F7EC] text-[#2BB673] border-[#C2F0D9]"
                }`}>
                <span>{p1Zone === "waiting" ? <Loader2 size={10} className="animate-spin text-zinc-400" /> : "📍"}</span>
                <span className="truncate">{(zoneNameMap[p1Zone] || p1Zone).toUpperCase()}</span>
              </div>
            </div>
            {game.currentPlayer === 1 && (
              <div className="absolute right-4 top-4 bg-[#2BB673] text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider animate-pulse shadow-sm">
                {t("game.active_turn")}
              </div>
            )}
          </div>

          {/* Central Game Phase/Status Panel */}
          <div className="flex flex-col items-center text-center p-3 bg-[#FAF9F6] border border-[#FFF0F3] rounded-3xl shadow-inner my-auto mx-2 animate-pop shrink-0">
            <h2 className="text-[10px] font-black tracking-[0.35em] text-zinc-400 uppercase mb-2">
              {t("game.territory_conquest")}
            </h2>
            <div className="px-4 py-1.5 border border-zinc-200 bg-white rounded-xl text-zinc-600 text-xs font-bold uppercase tracking-widest shadow-cute-xs flex items-center gap-2">
              {game.gamePhase === "BATTLE" ? (
                <>
                  <Swords size={14} className="text-amber-500 animate-bounce" />
                  <span className="text-amber-500 font-sans tracking-[0.1em]">{t("game.phase", { phase: game.gamePhase })}</span>
                </>
              ) : game.gamePhase === "END" ? (
                <>
                  <Trophy size={14} className="text-yellow-500 animate-bounce" />
                  <span className="text-yellow-500 font-sans tracking-[0.1em]">{t("game.phase", { phase: game.gamePhase })}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#FF7899]" />
                  <span className="text-zinc-600 font-sans tracking-[0.1em]">{t("game.phase", { phase: game.gamePhase })}</span>
                </>
              )}
            </div>

            {/* Dynamic Turn Detail Description */}
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2.5 tracking-widest leading-relaxed px-2">
              {game.gamePhase === "TURN"
                ? t("game.turn_desc", { player: game.currentPlayer })
                : game.gamePhase === "BATTLE"
                  ? t("game.combat_desc")
                  : game.gamePhase === "END"
                    ? t("game.gameover_desc")
                    : t("game.init_desc")}
            </p>
          </div>

          {/* Player 2 Box (Neon Pink Theme) */}
          <div
            className={`relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center mx-2 my-2 flex-1 ${game.currentPlayer === 2
              ? "border-[#FFD6E0] bg-[#FFEBF0]/40 shadow-cute-sm scale-102"
              : "border-zinc-100 bg-[#FAF9F6]/50 opacity-40"
              }`}
          >
            <div className="flex flex-col gap-1 items-center w-full">
              <span className="text-[10px] font-black tracking-[0.25em] text-[#FF7899] uppercase flex items-center justify-center gap-1.5 w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7899] animate-pulse" />
                {t("game.p2")}
              </span>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-black text-zinc-800 font-mono leading-none tracking-tight">
                  {game.scores[2]}
                </span>
              </div>
              <div className={`mt-2 px-3 py-1 rounded-xl text-[9px] font-black inline-flex items-center justify-center gap-1.5 border transition-all duration-300 w-full max-w-[160px] ${p2Zone === "waiting"
                ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
                : "bg-[#FFEBF0] text-[#FF7899] border-[#FFD6E0]"
                }`}>
                <span>{p2Zone === "waiting" ? <Loader2 size={10} className="animate-spin text-zinc-400" /> : "📍"}</span>
                <span className="truncate">{(zoneNameMap[p2Zone] || p2Zone).toUpperCase()}</span>
              </div>
            </div>
            {game.currentPlayer === 2 && (
              <div className="absolute right-4 top-4 bg-[#FF7899] text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider animate-pulse shadow-sm">
                {t("game.active_turn")}
              </div>
            )}
          </div>
        </div>

        {/* Battle Phase Alert Overlay */}
        {game.gamePhase === "BATTLE" && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#FAF9F6]/90 backdrop-blur-xs rounded-[2.5rem] animate-fade-in p-6">
            <div className="text-center px-10 py-12 bg-white border border-[#FFF0F3] rounded-[2.5rem] shadow-cute max-w-sm w-full animate-pop flex flex-col items-center relative overflow-hidden">

              {/* Danger Accents */}
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
        )}
      </div>
    </div>
  );
}