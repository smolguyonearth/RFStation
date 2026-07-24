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
    <div className="w-full max-w-5xl animate-fade-in flex flex-col items-center relative">
      <div className="absolute -top-12 right-0 flex gap-4">
        {/* Simulate Selectors */}
        {[
          { label: "P1", val: p1Zone, set: setP1Zone, color: "blue" },
          { label: "P2", val: p2Zone, set: setP2Zone, color: "red" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-end">
            <label className={`text-xs font-bold text-${s.color}-600 mb-1`}>
              {s.label} Simulate Location
            </label>
            <select
              value={s.val}
              onChange={(e) => s.set(e.target.value)}
              className={`px-4 py-2 border-2 border-${s.color}-300 rounded bg-${s.color}-50 text-sm font-bold text-${s.color}-700`}
            >
              <option value="waiting">🔄 Waiting...</option>
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

      <div className="flex justify-between w-full items-center mb-16 px-8 border-b-2 border-zinc-200 pb-8 mt-12">
        <div
          className={`flex flex-col items-center transition-all ${game.currentPlayer === 1 ? "scale-110" : "opacity-50 grayscale"}`}
        >
          <span className="text-sm font-bold tracking-widest text-blue-600 mb-2">
            PLAYER 1
          </span>
          <span className="text-6xl font-black text-brand-primary">{game.scores[1]}</span>
          
          {/* P1 Location Badge */}
          <div className={`mt-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            p1Zone === "waiting"
              ? "bg-slate-50 text-slate-400 border-slate-200/60 animate-pulse"
              : "bg-blue-50 text-blue-700 border-blue-100"
          }`}>
            <span>{p1Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{zoneNameMap[p1Zone] || p1Zone}</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-[0.3em] text-zinc-600 mb-2">
            TERRITORY
          </h1>
          <div className="px-6 py-2 border border-zinc-200 rounded-full text-zinc-700 font-bold uppercase tracking-widest bg-zinc-50">
            {game.gamePhase}
          </div>
        </div>
        <div
          className={`flex flex-col items-center transition-all ${game.currentPlayer === 2 ? "scale-110" : "opacity-50 grayscale"}`}
        >
          <span className="text-sm font-bold tracking-widest text-red-600 mb-2">
            PLAYER 2
          </span>
          <span className="text-6xl font-black text-brand-primary">{game.scores[2]}</span>

          {/* P2 Location Badge */}
          <div className={`mt-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            p2Zone === "waiting"
              ? "bg-slate-50 text-slate-400 border-slate-200/60 animate-pulse"
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            <span>{p2Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{zoneNameMap[p2Zone] || p2Zone}</span>
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-lg transition-all duration-1000 ${game.gamePhase === "BATTLE" ? "scale-95 opacity-50 blur-[2px]" : ""}`}
      >
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {game.displayMatrix.map((row, r) =>
            row.map((val, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => onAction(r, c)}
                className={`w-full aspect-square rounded-[1.5rem] sm:rounded-[2rem] border-4 ${val === 1 ? "bg-blue-500 border-blue-600 shadow-[0_4px_20px_rgba(59,130,246,0.3)]" : val === 2 ? "bg-red-500 border-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.3)]" : val === 3 ? "bg-amber-500 border-amber-600 animate-pulse" : "bg-white border-zinc-200 hover:border-zinc-300"} transition-all hover:scale-105`}
              />
            )),
          )}
        </div>
      </div>

      {game.gamePhase === "BATTLE" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm rounded-[2.5rem]">
          <h2 className="text-4xl sm:text-5xl font-black tracking-widest animate-pulse text-brand-primary">
            BATTLE!
          </h2>
        </div>
      )}
    </div>
  );
}