import { useEffect, useState } from "react";

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
}

export default function GameMonitorView({
  game,
  onAction,
}: {
  game: GameData;
  onAction: (r: number, c: number) => void;
}) {
  const [p1Zone, setP1Zone] = useState<string>("waiting");
  const [p2Zone, setP2Zone] = useState<string>("waiting");

  useEffect(() => {
    const handleDeviceUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { device_code, zone } = customEvent.detail;
      if (device_code === "P1") setP1Zone(zone);
      else if (device_code === "P2") setP2Zone(zone);
    };

    window.addEventListener("device_zone_update", handleDeviceUpdate);
    return () =>
      window.removeEventListener("device_zone_update", handleDeviceUpdate);
  }, []);

  const zoneNameMap: Record<string, string> = {
    waiting: "Searching...",
    mahanakhon: "Mahanakhon",
    asiatique: "Asiatique",
    giant_swing: "Giant Swing",
    wat_arun: "Wat Arun",
    bremen_stadium: "Bremen Stadium",
    townhall: "Townhall",
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center relative font-sans text-[#1F2937] p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
      {/* Simulation Selectors (Minimalist Style) */}
      <div className="absolute -top-14 right-0 flex gap-3">
        {[
          { label: "P1", val: p1Zone, set: setP1Zone, color: "indigo" },
          { label: "P2", val: p2Zone, set: setP2Zone, color: "rose" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-end">
            <span className={`text-[9px] font-bold text-zinc-400 uppercase mb-1 tracking-wider`}>
              {s.label} SIMULATOR
            </span>
            <select
              value={s.val}
              onChange={(e) => s.set(e.target.value)}
              className="px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 text-xs font-medium text-zinc-700 shadow-sm focus:outline-none focus:border-zinc-300"
            >
              <option value="waiting">🔄 Searching...</option>
              <option value="mahanakhon">Mahanakhon</option>
              <option value="asiatique">Asiatique</option>
              <option value="giant_swing">Giant Swing</option>
              <option value="wat_arun">Wat Arun</option>
              <option value="bremen_stadium">Bremen Stadium</option>
              <option value="townhall">Townhall</option>
            </select>
          </div>
        ))}
      </div>

      {/* Editorial Header scoreboard */}
      <div className="flex justify-between w-full items-center mb-12 px-6 border-b border-zinc-200 pb-8 mt-4">
        {/* Player 1 Info */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${game.currentPlayer === 1 ? "scale-105" : "opacity-40"}`}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 mb-2">
            PLAYER 1
          </span>
          <span className="text-5xl font-light text-zinc-900">{game.scores[1]}</span>
          
          <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 border transition-all ${
            p1Zone === "waiting"
              ? "bg-zinc-50 text-zinc-400 border-zinc-200/60"
              : "bg-[#EEF2FF] text-indigo-700 border-indigo-100"
          }`}>
            <span>{p1Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{zoneNameMap[p1Zone] || p1Zone}</span>
          </div>
        </div>

        {/* Phase Header */}
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
            Territory Conquest
          </h2>
          <div className="px-5 py-1.5 border border-zinc-200 rounded-full text-zinc-700 text-xs font-medium uppercase tracking-widest bg-zinc-50 shadow-inner">
            {game.gamePhase}
          </div>
        </div>

        {/* Player 2 Info */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${game.currentPlayer === 2 ? "scale-105" : "opacity-40"}`}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-rose-600 mb-2">
            PLAYER 2
          </span>
          <span className="text-5xl font-light text-zinc-900">{game.scores[2]}</span>

          <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 border transition-all ${
            p2Zone === "waiting"
              ? "bg-zinc-50 text-zinc-400 border-zinc-200/60"
              : "bg-[#FFF1F2] text-rose-700 border-rose-100"
          }`}>
            <span>{p2Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{zoneNameMap[p2Zone] || p2Zone}</span>
          </div>
        </div>
      </div>

      {/* Grid Board */}
      <div
        className={`w-full max-w-md transition-all duration-1000 ${game.gamePhase === "BATTLE" ? "scale-98 opacity-40 blur-[1px]" : ""}`}
      >
        <div className="grid grid-cols-3 gap-5">
          {game.displayMatrix.map((row, r) =>
            row.map((val, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => onAction(r, c)}
                className={`w-full aspect-square rounded-2xl border transition-all duration-300 ${
                  val === 1
                    ? "bg-indigo-500 border-indigo-600 shadow-sm"
                    : val === 2
                      ? "bg-rose-500 border-rose-600 shadow-sm"
                      : val === 3
                        ? "bg-amber-400 border-amber-500 animate-pulse"
                        : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                } hover:scale-102`}
              />
            )),
          )}
        </div>
      </div>

      {/* Battle Mode Backdrop Banner */}
      {game.gamePhase === "BATTLE" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm rounded-3xl animate-fade-in">
          <div className="text-center px-8 py-6 bg-white border border-zinc-200 rounded-2xl shadow-lg max-w-xs">
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase">
              Combat Event
            </span>
            <h2 className="text-3xl font-light tracking-widest text-[#1F2937] uppercase mt-4 animate-pulse">
              Battle!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}