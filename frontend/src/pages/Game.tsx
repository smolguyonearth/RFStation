import { useState, useEffect, useRef } from "react";
import { Cpu, Swords, Trophy, Play, RefreshCw, AlertCircle } from "lucide-react";
//import { AudioEngine } from "@/lib/AudioEngine";

interface GameData {
  state: 'setup' | 'playing' | 'battle' | 'game_over';
  currentPlayer: number;
  turnsLeft: number;
  matrix: number[][];
  battleContext: { row: number, col: number } | null;
  scores: { 1: number, 2: number };
}

export default function Game() {
  const [game, setGame] = useState<GameData | null>(null);
  const gameRef = useRef<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    fetch("/api/game/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGame(data.game);
          //AudioEngine.handleGameUpdate(data.game);
        } else {
          setError("Failed to load game state");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(`ws://${window.location.host}/ws`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "game_update" && data.game) {
            setGame(data.game);
            //AudioEngine.handleGameUpdate(data.game);
          }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };
      ws.onclose = () => {
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };
    connect();
    return () => { if (ws) ws.close(); clearTimeout(reconnectTimeout); };
  }, []);

  const handleStart = async (player: number) => {
    //AudioEngine.init();
    await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startingPlayer: player })
    });
  };

  const handleAction = async (row: number, col: number) => {
    if (game && game.currentPlayer) {
      //AudioEngine.updateLastInteracted(game.currentPlayer, row, col);
    }
    await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button_id: row * 3 + col })
    });
  };

  const handleResolve = async (winner: number) => {
    await fetch("/api/game/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner })
    });
  };

  const handleReset = async () => {
    await fetch("/api/game/reset", { method: "POST" });
  };

  if (!game) return (
    <div className="h-screen bg-[#FAF9F6] flex items-center justify-center text-zinc-400 font-sans text-sm tracking-widest animate-pulse">
      SYSTEM INITIALIZING...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#333C4E] p-6 md:p-10 font-sans selection:bg-indigo-500/30">

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl">
            <Cpu size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#333C4E] uppercase">Battle Matrix</h1>
            <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase">Tactical Command Unit</p>
          </div>
        </div>

        {(game.state === 'playing' || game.state === 'battle') && (
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FAF9F6] border border-zinc-200 rounded-xl transition-all text-xs font-bold uppercase text-zinc-400 hover:text-zinc-700 shadow-sm">
            <RefreshCw size={14} /> Reset
          </button>
        )}
      </div>

      <main className="max-w-2xl mx-auto">
        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-500 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-wide">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* SETUP */}
        {game.state === 'setup' && (
          <div className="bg-white border border-[#FFF0F3] p-10 rounded-3xl shadow-cute flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-black text-[#333C4E] mb-8 uppercase tracking-tight">Mission Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <button onClick={() => handleStart(1)} className="group flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase transition-all shadow-lg shadow-blue-200">
                <Play size={16} /> Player 1 Init
              </button>
              <button onClick={() => handleStart(2)} className="group flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs uppercase transition-all shadow-lg shadow-red-200">
                <Play size={16} /> Player 2 Init
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {game.state === 'game_over' && (
          <div className="bg-white border border-[#FFF0F3] p-10 rounded-3xl shadow-cute flex flex-col items-center animate-in zoom-in duration-500">
            <div className="p-4 bg-[#FFFBE6] border border-[#FFE3B5] rounded-2xl mb-6">
              <Trophy size={32} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-black text-[#333C4E] mb-2 uppercase">Mission Complete</h2>
            <p className="text-sm font-bold text-indigo-400 mb-8 uppercase tracking-widest">
              {game.scores[1] > game.scores[2] ? "Player 1 Victory" : game.scores[2] > game.scores[1] ? "Player 2 Victory" : "Draw Scenario"}
            </p>
            <div className="flex gap-4 w-full">
              <div className="flex-1 text-center bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-2xl">
                <div className="text-[10px] text-zinc-400 font-bold uppercase">P1 Score</div>
                <div className="text-2xl font-mono mt-1 text-blue-600 font-bold">{game.scores[1]}</div>
              </div>
              <div className="flex-1 text-center bg-[#FEF2F2] border border-[#FCA5A5] p-4 rounded-2xl">
                <div className="text-[10px] text-zinc-400 font-bold uppercase">P2 Score</div>
                <div className="text-2xl font-mono mt-1 text-red-600 font-bold">{game.scores[2]}</div>
              </div>
            </div>
            <button onClick={() => handleStart(1)} className="mt-8 w-full py-4 bg-[#333C4E] hover:bg-[#4A5568] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Re-engage
            </button>
          </div>
        )}

        {/* BOARD */}
        {(game.state === 'playing' || game.state === 'battle') && (
          <div className={`transition-all duration-500 ${game.state === 'battle' ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center mb-8 bg-white border border-[#FFF0F3] p-4 rounded-2xl shadow-cute-xs">
              <div className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${game.currentPlayer === 1 ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Player 1</div>
              <div className="font-mono font-bold text-lg text-[#333C4E]">{game.turnsLeft}</div>
              <div className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${game.currentPlayer === 2 ? 'bg-red-600 text-white' : 'text-zinc-400'}`}>Player 2</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {game.matrix.map((row, rIdx) =>
                row.map((owner, cIdx) => (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleAction(rIdx, cIdx)}
                    className="aspect-square bg-white border border-[#FFF0F3] rounded-3xl flex items-center justify-center relative hover:border-[#FFD6E0] transition-all group shadow-cute-xs"
                  >
                    <div className={`w-12 h-12 rounded-2xl transition-all duration-300 ${owner === 1 ? 'bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-110' :
                      owner === 2 ? 'bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-110' :
                        'bg-[#F5F5F5] border border-zinc-100'
                      }`} />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* BATTLE MODAL */}
      {game.state === 'battle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FAF9F6]/80 backdrop-blur-md">
          <div className="bg-white border border-[#FFF0F3] p-8 rounded-3xl shadow-cute w-full max-w-xs flex flex-col items-center animate-in zoom-in duration-300">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6 animate-pulse">
              <Swords size={32} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-black text-[#333C4E] mb-2 uppercase">Battle Sequence</h2>
            <p className="text-zinc-400 text-xs font-bold text-center mb-8 uppercase">Conflict detected at coordinates [{game.battleContext?.row},{game.battleContext?.col}]. Authorize victor:</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => handleResolve(1)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[10px] uppercase transition-all">P1 Wins</button>
              <button onClick={() => handleResolve(2)} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase transition-all">P2 Wins</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}