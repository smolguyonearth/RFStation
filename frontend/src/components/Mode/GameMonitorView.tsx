import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import MapViewer from "@/components/Map/MapViewer";

import type { MapLocation } from "@/types/map.types";

import {
  useGameMonitorState,
  MATRIX_TO_LANDMARK_ID,
  type GameData,
} from "./GameMonitor/useGameMonitorState";
import {
  GameIntroScreen,
  PlayerScoreCard,
  GameStatusPanel,
  BattleOverlay,
  EndPhaseOverlay,
} from "./GameMonitor/GameMonitorComponents";

export type { GameData };

export default function GameMonitorView({
  game,
  onAction,
}: {
  game: GameData;
  onAction: (r: number, c: number) => void;
}) {
  const { t } = useTranslation();
  const { p1Zone, p2Zone, ownershipMap } = useGameMonitorState(game);

  // Handle map landmark selections and bubble events up to Elysa Logic
  const handleMapSelect = useCallback(
    (land: MapLocation) => {
      for (let r = 0; r < MATRIX_TO_LANDMARK_ID.length; r++) {
        for (let c = 0; c < MATRIX_TO_LANDMARK_ID[r].length; c++) {
          if (MATRIX_TO_LANDMARK_ID[r][c] === land.id) {
            onAction(r, c);
            return;
          }
        }
      }
    },
    [onAction]
  );

  if (game.introActive) {
    return <GameIntroScreen language={game.language} t={t} />;
  }

  return (
    <div className="w-full max-w-[96vw] mx-auto flex flex-col items-center relative select-none px-6 py-4 font-sans text-[#333C4E] h-screen overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FF7899]/3 blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#2BB673]/3 blur-[100px] animate-float-medium pointer-events-none" />

      {/* Header Panel */}
      {/* <div className="w-full flex justify-between items-center mb-4 z-10 shrink-0">
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
      </div> */}

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
          <PlayerScoreCard
            playerId={1}
            currentPlayer={game.currentPlayer}
            score={game.scores[1]}
            zone={p1Zone}
            t={t}
          />

          <GameStatusPanel
            gamePhase={game.gamePhase}
            currentPlayer={game.currentPlayer}
            t={t}
          />

          <PlayerScoreCard
            playerId={2}
            currentPlayer={game.currentPlayer}
            score={game.scores[2]}
            zone={p2Zone}
            t={t}
          />
        </div>

        {/* Battle Phase Alert Overlay */}
        {game.gamePhase === "BATTLE" && <BattleOverlay t={t} />}
        {game.gamePhase === "END" && <EndPhaseOverlay t={t} scores={game.scores} />}
      </div>
    </div>
  );
}