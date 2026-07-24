import MapViewer from "@/components/Map/MapViewer";
import LandmarkDetails from "@/components/Map/LandmarkDetails";
import { Landmarks } from "@/constants/landmark";
import { AudioEngine } from "@/lib/AudioEngine";
import { useEffect, useRef, useState } from "react";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Variable to check first time loading
  const isMounted = useRef(false);

  const matrixToLandmarkId = [
    ["lm_01", "lm_06", "lm_03"],
    ["lm_10", "lm_02", "lm_04"],
  ];

  const selectedLand = game.activeMuseumLocation
    ? Landmarks.find(
      (l) =>
        l.id === matrixToLandmarkId[game.activeMuseumLocation!.row][game.activeMuseumLocation!.col]
    ) || null
    : null;

  const activeLocKey = game.activeMuseumLocation
    ? `${game.activeMuseumLocation.row}-${game.activeMuseumLocation.col}`
    : "none";

  useEffect(() => {
    // If never render (first time loading), set to true and exit immediately
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (game.activeMuseumLocation) {
      // Stop any background zone music
      AudioEngine.stop();
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch(() => { });
      }
    } else {
      AudioEngine.stop();
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [activeLocKey, game.language]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col h-screen font-sans text-[#1F2937] bg-[#F9FAFB]">
      {/* Editorial Header */}
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#6B7280] uppercase">
          Interactive Exhibition
        </span>
        <h1 className="text-3xl font-light tracking-wide text-[#1F2937] uppercase mt-2">
          Exhibit Hall
        </h1>
        <p className="text-[#6B7280] text-xs font-light tracking-wide mt-1">Select an item on the map grid to learn more about the landmark.</p>
      </header>

      {/* Main layout — Editorial / Magazine style */}
      <div className="flex flex-row gap-6 flex-grow overflow-hidden">

        {/* Map Section */}
        <div className="flex-1 min-w-0 bg-white p-6 rounded-2xl border border-zinc-200/80 flex items-center justify-center relative transition-all duration-500 shadow-sm">
          <MapViewer
            selectedLand={selectedLand}
            onSelect={(land) => {
              for (let r = 0; r < 2; r++)
                for (let c = 0; c < 3; c++)
                  if (matrixToLandmarkId[r][c] === land.id) onAction(r, c);
            }}
          />
        </div>

        {/* Details Panel */}
        <div
          className={[
            "bg-white rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col overflow-y-auto",
            "transition-all duration-500 ease-in-out",
            selectedLand
              ? "w-[420px] min-w-[320px] opacity-100 translate-x-0 p-8"
              : "w-0 min-w-0 opacity-0 translate-x-8 p-0 pointer-events-none overflow-hidden",
          ].join(" ")}
        >
          {selectedLand && (
            <div className="animate-fade-in h-full flex flex-col">
              {/* Muted Sage Audio Indicator */}
              {isPlaying && (
                <div className="flex items-center gap-2 mb-6 text-[#5C7D64] font-medium bg-[#EAF2EC] px-3.5 py-1.5 rounded-full w-fit text-[10px] border border-zinc-200/50 shadow-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CA693] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5C7D64]"></span>
                  </span>
                  Audio Guide Playing
                </div>
              )}
              <LandmarkDetails
                land={selectedLand}
                onClose={() => onAction(-1, -1)}
                flat={true}
                hideGameplayDetails={true}
                className="w-full h-full text-zinc-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      {game.activeMuseumLocation && (
        <audio
          ref={audioRef}
          src={`/sounds/descriptions/${game.language.toLowerCase()}/${[
            ["mahanakhon", "asiatique", "giant_swing"],
            ["wat_arun", "bremen_stadium", "townhall"],
          ][game.activeMuseumLocation.row][game.activeMuseumLocation.col]
            }.mp3`}
        />
      )}
    </div>
  );
}