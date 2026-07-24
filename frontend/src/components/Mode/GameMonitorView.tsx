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
    <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center relative font-sans text-[#333C4E] p-8 bg-white border border-[#FFF0F3] rounded-[2.5rem] shadow-cute mt-8 select-none">
      
      {/* Simulation Selectors */}
      <div className="absolute -top-16 right-0 flex gap-4">
        {[
          { label: "P1", val: p1Zone, set: setP1Zone },
          { label: "P2", val: p2Zone, set: setP2Zone },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-zinc-400 uppercase mb-1 tracking-wider">
              {s.label} SIMULATOR
            </span>
            <select
              value={s.val}
              onChange={(e) => s.set(e.target.value)}
              className="px-3 py-1.5 border border-[#FFF0F3] rounded-xl bg-[#FAF9F6] text-xs font-bold text-zinc-600 shadow-cute-xs focus:outline-none"
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

      {/* Scoreboard Header */}
      <div className="flex justify-between w-full items-center mb-12 px-6 border-b border-[#FFF0F3] pb-8 mt-4">
        
        {/* Player 1 Info */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${game.currentPlayer === 1 ? "scale-105" : "opacity-40"}`}
        >
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF7899] mb-2">
            PLAYER 1
          </span>
          <span className="text-5xl font-extrabold text-zinc-800 font-mono">{game.scores[1]}</span>
          
          <div className={`mt-3 px-3.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border transition-all shadow-cute-xs ${
            p1Zone === "waiting"
              ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
              : "bg-[#FFEBF0] text-[#FF7899] border-[#FFD6E0]"
          }`}>
            <span>{p1Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{(zoneNameMap[p1Zone] || p1Zone).toUpperCase()}</span>
          </div>
        </div>

        {/* Phase Header */}
        <div className="text-center">
          <h2 className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
            Territory Conquest
          </h2>
          <div className="px-5 py-2 border border-[#FFF0F3] rounded-xl text-zinc-600 text-xs font-bold uppercase tracking-widest bg-[#FAF9F6] shadow-cute-xs">
            {game.gamePhase} PHASE
          </div>
        </div>

        {/* Player 2 Info */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${game.currentPlayer === 2 ? "scale-105" : "opacity-40"}`}
        >
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#2BB673] mb-2">
            PLAYER 2
          </span>
          <span className="text-5xl font-extrabold text-zinc-800 font-mono">{game.scores[2]}</span>

          <div className={`mt-3 px-3.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border transition-all shadow-cute-xs ${
            p2Zone === "waiting"
              ? "bg-[#FAF9F6] text-zinc-400 border-zinc-100"
              : "bg-[#E1F7EC] text-[#2BB673] border-[#C2F0D9]"
          }`}>
            <span>{p2Zone === "waiting" ? "🔍" : "📍"}</span>
            <span>{(zoneNameMap[p2Zone] || p2Zone).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Grid Board */}
      <div
        className={`w-full max-w-sm transition-all duration-1000 ${game.gamePhase === "BATTLE" ? "scale-98 opacity-45 blur-[1px]" : ""}`}
      >
        <div className="grid grid-cols-3 gap-5">
          {game.displayMatrix.map((row, r) =>
            row.map((val, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => onAction(r, c)}
                className={`w-full aspect-square rounded-[1.8rem] border transition-all duration-300 shadow-cute-xs hover:scale-102 active:scale-[0.96] ${
                  val === 1
                    ? "bg-[#FFEBF0] border-[#FFD6E0] text-[#FF7899]"
                    : val === 2
                      ? "bg-[#E1F7EC] border-[#C2F0D9] text-[#2BB673]"
                      : val === 3
                        ? "bg-[#FFFBE6] border-[#FFE3B5] animate-pulse text-amber-500"
                        : "bg-white border-[#FFF0F3] hover:bg-[#FAF9F6]"
                }`}
              />
            )),
          )}
        </div>
      </div>

      {/* Battle Mode Backdrop Banner */}
      {game.gamePhase === "BATTLE" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#FAF9F6]/85 backdrop-blur-xs rounded-3xl animate-fade-in">
          <div className="text-center px-10 py-8 bg-white border border-[#FFF0F3] rounded-[2rem] shadow-cute max-w-xs animate-pop">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-xl uppercase shadow-sm">
              Combat Event
            </span>
            <h2 className="text-3xl font-extrabold tracking-widest text-[#333C4E] uppercase mt-6 animate-pulse">
              BATTLE!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}