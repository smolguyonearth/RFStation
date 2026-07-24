import type { AppMode, GameState } from "@/types/game.types";
import { useEffect, useRef } from "react";
import MapViewer from "@/components/Map/MapViewer";
import { Landmarks } from "@/constants/landmark";
import { useTranslation } from "react-i18next";

export default function MuseumControllerView({
  gameState,
  setMode,
}: {
  gameState: GameState;
  setMode: (m: AppMode) => void;
}) {
  const { t } = useTranslation();
  const isMounted = useRef(false);

  const matrixToLandmarkId = [
    ["lm_01", "lm_06", "lm_03"],
    ["lm_10", "lm_02", "lm_04"],
  ];

  const selectedLand = gameState.activeMuseumLocation
    ? Landmarks.find(
      (l) =>
        l.id === matrixToLandmarkId[gameState.activeMuseumLocation!.row][gameState.activeMuseumLocation!.col]
    ) || null
    : null;

  const activeLocKey = gameState.activeMuseumLocation
    ? `${gameState.activeMuseumLocation.row}-${gameState.activeMuseumLocation.col}`
    : "none";

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
  }, [activeLocKey, gameState.language]);

  const onAction = async (row: number, col: number) => {
    const buttonId = row < 0 || col < 0 ? -1 : row * 3 + col;
    await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button_id: buttonId }),
    });
  };

  return (
    <div className="flex-1 p-6 md:p-10 flex flex-col animate-fade-in relative min-h-screen bg-[#FAF9F6] text-[#333C4E] font-sans justify-between">

      {/* Top Console Bar */}
      <div className="relative z-50 flex justify-between items-baseline pb-6 border-b border-[#FFF0F3]">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-3.5 py-1.5 rounded-full uppercase shadow-cute-xs">
            Interactive Guide
          </span>
          <h1 className="text-2xl font-black tracking-wide text-[#333C4E] uppercase mt-4">
            Museum Guide Map
          </h1>
          <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-wider">
            Language: <span className="text-indigo-500">{gameState.language}</span>
          </p>
        </div>
        <button
          onClick={() => setMode("IDLE")}
          className="px-5 py-2.5 rounded-2xl border border-[#FFF0F3] bg-white text-xs font-bold uppercase tracking-wider text-zinc-500 hover:bg-[#FAF9F6] hover:border-[#FFD6E0] transition-all shadow-cute-xs flex items-center gap-2"
        >
          Exit
        </button>
      </div>

      {/* Main Map Viewer Console */}
      <div className="flex-grow flex flex-col items-center justify-center my-6 z-10 w-full min-h-[360px]">

        {selectedLand && (
          <div className="text-center w-full max-w-sm animate-pop mb-4">
            <div className="bg-[#E1F7EC] border border-[#C2F0D9] rounded-2xl px-6 py-3.5 shadow-cute-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                  Playing: {t(selectedLand.name)}
                </span>
              </div>
              <button
                onClick={() => onAction(-1, -1)}
                className="text-xs font-bold text-zinc-400 hover:text-rose-500 uppercase tracking-widest px-2 py-1 bg-white border border-zinc-100 rounded-lg shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-xl bg-white border border-[#FFF0F3] rounded-[2.5rem] p-6 shadow-cute flex items-center justify-center relative min-h-[300px]">
          <MapViewer
            selectedLand={selectedLand}
            onSelect={(land) => {
              for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 3; c++) {
                  if (matrixToLandmarkId[r][c] === land.id) {
                    onAction(r, c);
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Footer System Status */}
      <div className="text-center text-[10px] font-bold text-zinc-400 tracking-[0.25em] uppercase pt-6 border-t border-[#FFF0F3]">
        RFStation Audio System • V3.2
      </div>
    </div>
  );
}
