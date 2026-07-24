import { useState, useEffect, useRef } from "react";
import { Cpu, Swords, Trophy, Play } from "lucide-react";
import { AudioEngine } from "@/lib/AudioEngine";

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
  const latestZones = useRef<{ P1: string | null, P2: string | null }>({ P1: null, P2: null });
  const [error, setError] = useState<string | null>(null);

  // Keep ref in sync for WebSocket
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  // Fetch initial state
  useEffect(() => {
    fetch("/api/game/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGame(data.game);
          AudioEngine.handleGameUpdate(data.game);
        } else {
          setError("Failed to load game state");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Listen for WebSocket updates with auto-reconnect
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
            AudioEngine.handleGameUpdate(data.game);
          }
          
              // Device movement updates (from /api/ingest)
              if (data.device_code && data.nearest_device) {
                 const code = data.device_code.toUpperCase();
                 if (data.nearest_device !== "X") {
                   if (code === "P1") latestZones.current.P1 = data.nearest_device;
                   if (code === "P2") latestZones.current.P2 = data.nearest_device;
                 }
              }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };

      ws.onclose = () => {
        console.log("Game WS Disconnected, reconnecting...");
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  // Redundant turn audio trigger removed in favor of handleGameUpdate state machine

  const handleStart = async (player: number) => {
    AudioEngine.init(); // Initialize audio context on user interaction
    
    await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startingPlayer: player })
    });
  };

  const handleAction = async (row: number, col: number) => {
    // We removed the frontend block here so you can ALWAYS debug 
    // your clicks in the backend terminal! 
    // The backend gameLogic.ts will safely ignore them if the game isn't playing.
    if (game && game.currentPlayer) {
      AudioEngine.updateLastInteracted(game.currentPlayer, row, col);
    }
    
    // Send action (equivalent to pressing a physical button)
    const button_id = row * 3 + col;
    await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button_id })
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
    await fetch("/api/game/reset", {
      method: "POST"
    });
  };

  if (!game) {
    return <div className="p-8 text-brand-primary font-bold flex justify-center">Loading Game...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500 bg-brand-bg min-h-[calc(100vh-80px)] relative">
      <div className="flex items-center justify-between w-full max-w-2xl mb-8">
        <div className="flex items-center gap-3">
          <Cpu size={32} className="text-brand-accent" />
          <h1 className="text-3xl font-black text-brand-primary tracking-wide">Battle Matrix</h1>
        </div>
        
        {/* Restart Button inside header when playing */}
        {(game.state === 'playing' || game.state === 'battle') && (
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Restart Game
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg mb-6 shadow-sm">
          {error}
        </div>
      )}

      {/* SETUP STATE */}
      {game.state === 'setup' && (
        <div className="bg-white border border-brand-border p-12 rounded-3xl shadow-xl flex flex-col items-center">
          <h2 className="text-2xl font-bold text-brand-primary mb-8">Start a New Game</h2>
          <div className="flex gap-6">
            <button 
              onClick={() => handleStart(1)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Play size={20} /> Player 1 Starts
            </button>
            <button 
              onClick={() => handleStart(2)}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
            >
              <Play size={20} /> Player 2 Starts
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER STATE */}
      {game.state === 'game_over' && (
        <div className="bg-white border border-brand-border p-12 rounded-3xl shadow-xl flex flex-col items-center mb-8">
          <Trophy size={64} className="text-yellow-500 mb-6" />
          <h2 className="text-3xl font-black text-brand-primary mb-2">Game Over!</h2>
          <p className="text-lg font-bold text-gray-500 mb-8">
            {game.scores[1] > game.scores[2] ? "Player 1 Wins!" : game.scores[2] > game.scores[1] ? "Player 2 Wins!" : "It's a Tie!"}
          </p>
          <div className="flex gap-12 text-2xl font-bold">
            <div className="flex flex-col items-center">
              <span className="text-blue-500">Player 1</span>
              <span>{game.scores[1]}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-500">Player 2</span>
              <span>{game.scores[2]}</span>
            </div>
          </div>
          <button 
            onClick={() => handleStart(1)} // Reset game
            className="mt-10 px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg"
          >
            Play Again
          </button>
        </div>
      )}

      {/* PLAYING / BATTLE STATE (THE BOARD) */}
      {(game.state === 'playing' || game.state === 'battle') && (
        <>
          <div className="flex justify-between w-full max-w-2xl mb-6 px-4">
            <div className={`px-4 py-2 rounded-xl font-bold ${game.currentPlayer === 1 ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
              Player 1 Turn
            </div>
            <div className="flex flex-col items-center justify-center font-black text-brand-primary text-xl">
              <span>{game.turnsLeft}</span>
              <span className="text-xs uppercase text-gray-400">Turns Left</span>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold ${game.currentPlayer === 2 ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
              Player 2 Turn
            </div>
          </div>

          <div className={`bg-white border border-brand-border p-8 rounded-3xl shadow-xl transition-all ${game.state === 'battle' ? 'opacity-50 pointer-events-none blur-sm' : ''}`}>
            <div className="flex flex-col gap-6">
              {game.matrix.map((rowData, rowIndex) => (
                <div key={rowIndex} className="flex gap-6 justify-center">
                  {rowData.map((owner, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} className="flex flex-col items-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-inner relative">
                      <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                        Place [{rowIndex},{colIndex}]
                      </span>
                      
                      {/* Clickable Area for the Place */}
                      <button 
                        className="absolute inset-0 z-10 cursor-pointer"
                        onClick={() => handleAction(rowIndex, colIndex)}
                        aria-label={`Claim place ${rowIndex}, ${colIndex}`}
                      />
                      
                      <div className="flex gap-4">
                        {/* Player 1 LED (Blue) */}
                        <div
                          className={`
                            w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 
                            flex items-center justify-center transition-all duration-300
                            ${owner === 1 || owner === 3 
                              ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400 opacity-100 scale-105' 
                              : 'bg-gray-200 border-gray-300 opacity-50 shadow-inner'
                            }
                            ${owner === 3 ? 'animate-pulse' : ''}
                          `}
                        />
                        
                        {/* Player 2 LED (Red) */}
                        <div
                          className={`
                            w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 
                            flex items-center justify-center transition-all duration-300
                            ${owner === 2 || owner === 3
                              ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400 opacity-100 scale-105' 
                              : 'bg-gray-200 border-gray-300 opacity-50 shadow-inner'
                            }
                            ${owner === 3 ? 'animate-pulse' : ''}
                          `}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* BATTLE MODAL */}
      {game.state === 'battle' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-brand-accent flex flex-col items-center animate-in zoom-in duration-300">
            <Swords size={48} className="text-brand-accent mb-4 animate-bounce" />
            <h2 className="text-3xl font-black text-brand-primary mb-2">BATTLE!</h2>
            <p className="text-gray-500 font-medium mb-8 text-center max-w-xs">
              A clash occurred at Place [{game.battleContext?.row}, {game.battleContext?.col}]. Select the winner!
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleResolve(1)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
              >
                Player 1 Wins
              </button>
              <button 
                onClick={() => handleResolve(2)}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
              >
                Player 2 Wins
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
