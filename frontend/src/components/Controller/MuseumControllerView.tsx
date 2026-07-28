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

  const activeLoc = gameState.activeMuseumLocation;
  const selectedLand = activeLoc &&
    typeof activeLoc.row === "number" &&
    typeof activeLoc.col === "number"
    ? Landmarks.find(
      (l) =>
        l.id === matrixToLandmarkId[activeLoc.row]?.[activeLoc.col]
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
    <div className="flex flex-col h-screen p-6 bg-stone-50 text-stone-800 font-sans overflow-hidden">

      {/* 1. Header Section: ล็อกความสูงไว้ ไม่ให้ยุ่งกับ Map */}
      <div className="flex-none space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif font-bold text-[#364F6B] uppercase tracking-widest">
              {t("museum.title")}
            </h1>
            <p className="text-stone-400 text-[10px] font-medium uppercase tracking-widest">
              {t("museum.language")}: {gameState.language}
            </p>
          </div>
          <button
            onClick={() => setMode("IDLE")}
            className="px-5 py-2 rounded-full border border-stone-200 bg-white text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:border-stone-300 transition-all"
          >
            {t("museum.exit")}
          </button>
        </div>

        {/* แถบ Playing: จะแสดงผลเมื่อมีข้อมูลเท่านั้น */}
        {selectedLand && (
          <div className="flex justify-center animate-fade-in mb-4">
            <div className="inline-flex items-center gap-4 bg-[#3FC1C9]/5 border border-[#3FC1C9]/20 rounded-full px-6 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FC1C9] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FC1C9]"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#3FC1C9] uppercase whitespace-nowrap">
                  {t("museum.playing")}: {t(selectedLand.name)}
                </span>
              </div>
              <div className="h-3 w-px bg-[#3FC1C9]/20" /> {/* เส้นคั่นเล็กๆ */}
              <button
                onClick={() => onAction(-1, -1)}
                className="text-[10px] font-bold text-stone-400 hover:text-[#FC5185] uppercase tracking-widest whitespace-nowrap"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Map Section: ให้กินพื้นที่ส่วนที่เหลือทั้งหมด โดยไม่โดนเบียด */}
      <div className="flex-grow flex items-center justify-center min-h-0">
        <div className="w-full max-w-2xl aspect-square bg-white border border-stone-200 rounded-[2rem] p-4 shadow-sm flex items-center justify-center">
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
    </div>
  );
}
