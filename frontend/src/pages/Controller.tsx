import { useEffect, useState } from "react";
import type { Language, AppMode, GameState } from "@/types/game.types";
import SetupView from "@/components/Controller/SetupView";
import MuseumControllerView from "@/components/Controller/MuseumControllerView";
import GameControllerView from "@/components/Controller/GameControllerView";
import { AudioEngine } from "@/lib/AudioEngine";

export default function Controller() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial state
    fetch(`/api/game/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGameState(data.game);
          AudioEngine.handleGameUpdate(data.game);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch state:", err);
        setLoading(false);
      });

    // 2. Connect WebSocket for live updates with auto-reconnect
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
      ws = new WebSocket(`${wsProto}//${window.location.host}/ws`);

      ws.onopen = () => console.log("Controller WS Connected");
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "game_update" && data.game) {
            setGameState(data.game);
            AudioEngine.handleGameUpdate(data.game);
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };
      ws.onclose = () => {
        console.log("Controller WS Disconnected, reconnecting...");
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const setMode = async (mode: AppMode, language: Language = "EN") => {
    if (mode === "GAME") {
      sessionStorage.removeItem("skipped_intro");
    } else {
      localStorage.removeItem("player1_last_location");
      localStorage.removeItem("player2_last_location");
      localStorage.removeItem("p1_last_interacted");
      localStorage.removeItem("p2_last_interacted");
    }
    await fetch(`/api/controller/mode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, language }),
    });
  };

  const startGame = async (startingPlayer: number) => {
    await fetch(`/api/controller/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startingPlayer }),
    });
  };

  const endTurn = async () => {
    await fetch(`/api/controller/endturn`, { method: "POST" });
  };

  const resetGame = async () => {
    localStorage.removeItem("player1_last_location");
    localStorage.removeItem("player2_last_location");
    localStorage.removeItem("p1_last_interacted");
    localStorage.removeItem("p2_last_interacted");
    await fetch(`/api/game/reset`, { method: "POST" });
  };

  if (loading || !gameState) {
    return (
      <div className="h-screen w-screen bg-brand-bg text-brand-primary flex items-center justify-center font-mono font-bold">
        Connecting to Backend...
      </div>
    );
  }

  // --- Render Views Based on Mode ---
  return (
    <div className="min-h-screen w-full bg-[#07080d] text-white font-sans flex flex-col relative overflow-x-hidden overflow-y-auto cyber-grid">
      {/* Decorative neon background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col w-full">
        {gameState.mode === "IDLE" && <SetupView setMode={setMode} />}
        {gameState.mode === "MUSEUM" && (
          <MuseumControllerView gameState={gameState} setMode={setMode} />
        )}
        {gameState.mode === "GAME" && (
          <GameControllerView
            gameState={gameState}
            startGame={startGame}
            endTurn={endTurn}
            resetGame={resetGame}
            setMode={setMode}
          />
        )}
      </div>
    </div>
  );
}
