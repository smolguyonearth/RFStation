import LandmarkDetails from "@/components/Map/LandmarkDetails";
import { useTranslation } from "react-i18next";
import { Landmarks } from "@/constants/landmark";
import mapVectorBg from "@/assets/Map_final_vecter.webp";
import { useEffect, useRef } from "react";
import { AudioEngine } from "@/lib/AudioEngine";

const matrixToSounds = [
  ["mahanakhon", "asiatique", "giant_swing"],
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
        ctx.resume().catch(() => { });
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

    if (game.activeMuseumLocation &&
      typeof game.activeMuseumLocation.row === "number" &&
      typeof game.activeMuseumLocation.col === "number") {
      const zone = matrixToSounds[game.activeMuseumLocation.row]?.[game.activeMuseumLocation.col];
      if (zone) {
        const lang = game.language || "EN";

        // Start background sound at full volume (fade in via ZonePlayer)
        AudioEngine.playZone(zone, 1.0);

        // Delay narration so background comes in first, then duck background to 40%
        narrationTimerRef.current = setTimeout(() => {
          AudioEngine.playZone(zone, 0.4); // duck background
          AudioEngine.playNarration(lang, zone);
        }, NARRATION_DELAY_MS);
      }
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
    ["lm_01", "lm_06", "lm_03"],
    ["lm_10", "lm_02", "lm_04"],
  ];

  const activeLoc = game.activeMuseumLocation;
  const selectedLand = activeLoc &&
    typeof activeLoc.row === "number" &&
    typeof activeLoc.col === "number"
    ? Landmarks.find(
      (l) =>
        l.id === matrixToLandmarkId[activeLoc.row]?.[activeLoc.col]
    ) || null
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-4 animate-fade-in flex flex-col h-screen font-sans text-stone-800 bg-stone-50 justify-between">

      {/* Header */}
      <header className="mb-6 border-b border-stone-200 pb-6 flex justify-between items-end">
        <div>
          {/* <h1 className="text-4xl font-serif font-light text-stone-900 tracking-tight">
            {t("museum.exhibit_title")}
          </h1> */}
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">
            {selectedLand ? t("museum.exploring") : t("museum.use_controller")}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center mb-6 min-h-0 relative w-full">
        {selectedLand ? (
          <div className="w-full h-full max-w-4xl bg-white/70 backdrop-blur-sm border border-stone-200 rounded-3xl p-12 shadow-xl shadow-stone-200/20 animate-pop overflow-y-auto">
            <LandmarkDetails
              land={selectedLand}
              onClose={() => onAction(-1, -1)}
              flat={true}
              hideGameplayDetails={true}
              className="w-full text-stone-800"
              layout="split"
              hideClose={true}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-72 h-72 mb-10 bg-white border border-stone-200 p-4 rounded-3xl shadow-lg flex items-center justify-center">
              <img src={mapVectorBg} className="w-full h-full object-contain opacity-80 rounded-2xl" />
            </div>
            <h2 className="text-2xl font-serif font-light text-stone-900">
              {t("museum.exhibition_active")}
            </h2>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
              {t("museum.select_to_explore")}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <div className="text-center text-[10px] font-bold text-stone-400 tracking-[0.3em] uppercase pt-6 border-t border-stone-200">
        {t("museum.footer")}
      </div> */}
    </div>
  );
}