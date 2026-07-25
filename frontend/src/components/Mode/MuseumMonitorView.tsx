import LandmarkDetails from "@/components/Map/LandmarkDetails";
import { useTranslation } from "react-i18next";
import { Landmarks } from "@/constants/landmark";
import mapVectorBg from "@/assets/Map_final_vecter.webp";
import { useEffect, useRef } from "react";
import { AudioEngine } from "@/lib/AudioEngine";

const matrixToSounds = [
  ["asiatique", "mahanakhon", "giant_swing"],
  ["wat_arun", "bremen_stadium", "townhall"],
];

const NARRATION_DELAY_MS = 1500;

interface GameData {
  mode: "IDLE" | "MUSEUM" | "GAME";
  language: "EN" | "TH" | "DE";
  gamePhase: "INIT" | "TURN" | "BATTLE" | "END";
  currentPlayer: number;
  displayMatrix: number[][];
  battleContext: { row: number; col: number } | null;
  scores: { 1: number; 2: number };
  activeMuseumLocation: { row: number; col: number } | null;
}

export default function MuseumMonitorView({
  game,
  onAction,
}: {
  game: GameData;
  onAction: (r: number, c: number) => void;
}) {
  const { t } = useTranslation();
  const narrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLocKey = game.activeMuseumLocation
    ? `${game.activeMuseumLocation.row}-${game.activeMuseumLocation.col}`
    : "none";

  // Unlock AudioContext on first user interaction on the display
  useEffect(() => {
    const unlock = () => {
      AudioEngine.init();
      const ctx = AudioEngine.audioCtx;
      if (ctx) {
        ctx.resume().catch(() => {});
      }
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    // Clear any pending narration timer
    if (narrationTimerRef.current) {
      clearTimeout(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }

    // Stop narration immediately when switching
    AudioEngine.stopVoice();

    if (game.activeMuseumLocation) {
      const zone = matrixToSounds[game.activeMuseumLocation.row][game.activeMuseumLocation.col];
      const lang = game.language || "EN";

      // Start background sound at full volume (fade in via ZonePlayer)
      AudioEngine.playZone(zone, 1.0);

      // Delay narration so background comes in first, then duck background to 40%
      narrationTimerRef.current = setTimeout(() => {
        AudioEngine.playZone(zone, 0.4); // duck background
        AudioEngine.playNarration(lang, zone);
      }, NARRATION_DELAY_MS);
    } else {
      // Deselected: fade out background, stop narration
      AudioEngine.stop();
    }

    return () => {
      if (narrationTimerRef.current) {
        clearTimeout(narrationTimerRef.current);
        narrationTimerRef.current = null;
      }
    };
  }, [activeLocKey, game.language]);

  // Cleanup on unmount (exit museum mode)
  useEffect(() => {
    return () => {
      if (narrationTimerRef.current) {
        clearTimeout(narrationTimerRef.current);
      }
      AudioEngine.stopVoice();
      AudioEngine.stopImmediate();
    };
  }, []);

  const matrixToLandmarkId = [
    ["lm_06", "lm_01", "lm_03"],
    ["lm_10", "lm_02", "lm_04"],
  ];

  const selectedLand = game.activeMuseumLocation
    ? Landmarks.find(
      (l) =>
        l.id === matrixToLandmarkId[game.activeMuseumLocation!.row][game.activeMuseumLocation!.col]
    ) || null
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col h-screen font-sans text-zinc-800 bg-[#FAF9F6] justify-between">

      {/* Header */}
      <header className="mb-6 border-b border-[#FFF0F3] pb-6 flex justify-between items-baseline">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] px-3.5 py-1.5 rounded-full uppercase border border-[#FFD6E0] shadow-cute-xs inline-block">
            {t("museum.exhibit_tag")}
          </span>
          <h1 className="text-3xl font-extrabold tracking-wide text-[#333C4E] uppercase mt-4">
            {t("museum.exhibit_title")}
          </h1>
          <p className="text-zinc-400 text-xs font-bold uppercase mt-1">
            {selectedLand ? t("museum.exploring") : t("museum.use_controller")}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center mb-6 min-h-0 relative w-full">
        {selectedLand ? (
          <div className="w-full h-full max-w-4xl bg-white border border-[#FFF0F3] rounded-[2.5rem] p-10 shadow-cute animate-pop overflow-y-auto">
            <LandmarkDetails
              land={selectedLand}
              onClose={() => onAction(-1, -1)}
              flat={true}
              hideGameplayDetails={true}
              className="w-full text-zinc-800"
              layout="split"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-80 h-80 mb-6 bg-white border border-[#FFF0F3] p-6 rounded-[2.5rem] shadow-cute flex items-center justify-center">
              <img src={mapVectorBg} className="w-full h-full object-contain opacity-90 rounded-[2rem]" />
            </div>
            <h2 className="text-2xl font-black text-[#333C4E] uppercase tracking-wide">
              {t("museum.exhibition_active")}
            </h2>
            <p className="text-zinc-400 text-xs font-bold uppercase mt-2 tracking-widest leading-relaxed max-w-sm">
              {t("museum.select_to_explore")}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] font-bold text-zinc-400 tracking-[0.25em] uppercase pt-4 border-t border-[#FFF0F3]">
        {t("museum.footer")}
      </div>
    </div>
  );
}