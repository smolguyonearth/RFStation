import { useEffect, useState, useMemo } from "react";
import { AudioEngine } from "@/lib/AudioEngine";
import type { AppMode, Language, GamePhase } from "@/types/game.types";

// --- GAME MONITOR DATA INTERFACE ---
export interface GameData {
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

// --- COORDINATES MAP ---
export const MATRIX_TO_LANDMARK_ID = [
  ["lm_01", "lm_06", "lm_03"],
  ["lm_10", "lm_02", "lm_04"],
];

// --- STATE MANAGEMENT HOOK ---
export function useGameMonitorState(game: GameData) {
  const [p1Zone, setP1Zone] = useState<string>("waiting");
  const [p2Zone, setP2Zone] = useState<string>("waiting");

  // Sync Audio updates with backend state changes
  useEffect(() => {
    AudioEngine.handleGameUpdate(game);
  }, [game]);

  // Teardown AudioEngine on unmount
  useEffect(() => {
    return () => {
      AudioEngine.reset();
    };
  }, []);

  // Listen to physical zone updates from peripheral controllers
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

  // Recalculate ownership mapping only when client display updates
  const ownershipMap = useMemo(() => {
    const map: Record<string, number> = {};
    game.displayMatrix.forEach((row, r) => {
      row.forEach((val, c) => {
        const landmarkId = MATRIX_TO_LANDMARK_ID[r][c];
        map[landmarkId] = val;
      });
    });
    return map;
  }, [game.displayMatrix]);

  return {
    p1Zone,
    p2Zone,
    ownershipMap,
  };
}
