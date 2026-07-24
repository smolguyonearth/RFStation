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
      // Playing zone music 
      // const locNames = [
      //   ["mahanakhon", "asiatique", "giant_swing"],
      //   ["wat_arun", "bremen_stadium", "townhall"],
      // ];
      // const loc = locNames[game.activeMuseumLocation.row][game.activeMuseumLocation.col];
      // //AudioEngine.playZone(loc, 0.08);

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700 flex flex-col h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Exhibit Hall
        </h1>
        <p className="text-slate-500 mt-2">Interactive Museum Map - Select an item to learn more</p>
      </header>

      {/* Main layout — flex row so the panel can slide in smoothly */}
      <div className="flex flex-row gap-6 flex-grow overflow-hidden">

        {/* Map Section — always visible, grows to fill space */}
        <div className="flex-1 min-w-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center relative transition-all duration-500">
          <MapViewer
            selectedLand={selectedLand}
            onSelect={(land) => {
              for (let r = 0; r < 2; r++)
                for (let c = 0; c < 3; c++)
                  if (matrixToLandmarkId[r][c] === land.id) onAction(r, c);
            }}
          />
        </div>

        {/* Details Panel — slides in from the right when a landmark is selected */}
        <div
          className={[
            "bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-y-auto",
            "transition-all duration-500 ease-in-out",
            selectedLand
              ? "w-[420px] min-w-[320px] opacity-100 translate-x-0 p-8"
              : "w-0 min-w-0 opacity-0 translate-x-8 p-0 pointer-events-none overflow-hidden",
          ].join(" ")}
        >
          {selectedLand && (
            <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              {/* Visual Audio Indicator */}
              {isPlaying && (
                <div className="flex items-center gap-2 mb-6 text-emerald-600 font-medium bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit text-xs border border-emerald-100 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Audio Guide Playing
                </div>
              )}
              <LandmarkDetails
                land={selectedLand}
                onClose={() => onAction(-1, -1)}
                flat={true}
                hideGameplayDetails={true}
                className="w-full h-full"
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