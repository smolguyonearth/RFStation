import { useState, useEffect, useRef } from "react";
import MuseumMonitorView from "@/components/Mode/MuseumMonitorView";
import GameMonitorView from "@/components/Mode/GameMonitorView";
import { AudioEngine } from "@/lib/AudioEngine";

export default function Game() {
  const [game, setGame] = useState<any>(null);
  const gameRef = useRef<any>(null);
  const prevModeRef = useRef<string | null>(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const applyAudioForGameState = (nextGame: any) => {
    if (!nextGame) return;

    const prevMode = prevModeRef.current;
    const nextMode = nextGame.mode;

    if (
      prevMode &&
      prevMode !== "IDLE" &&
      nextMode === "IDLE" &&
      prevMode !== nextMode
    ) {
      AudioEngine.reset();
    } else {
      AudioEngine.handleGameUpdate(nextGame);
    }

    prevModeRef.current = nextMode;
  };

  useEffect(() => {
    const unlock = () => {
      AudioEngine.init();
      const ctx = AudioEngine.audioCtx;
      if (ctx) {
        ctx.resume().then(() => {
          if (gameRef.current) {
            AudioEngine.reset();
            AudioEngine.handleGameUpdate(gameRef.current);
          }
        }).catch(() => {});
      }
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    fetch(`/api/game/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGame(data.game);
          applyAudioForGameState(data.game);
        }
      });

    // WebSocket logic with auto-reconnect
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
      ws = new WebSocket(`${wsProto}//${window.location.host}/ws`);

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "game_update") {
          setGame(data.game);
          applyAudioForGameState(data.game);
        }
        if (data.nearest_device) {
          const map: Record<string, string> = {
            A: "mahanakhon",
            B: "asiatique",
            C: "giant_swing",
            D: "wat_arun",
            E: "bremen_stadium",
            F: "townhall",
          };
          const zone = map[data.nearest_device];

          window.dispatchEvent(
            new CustomEvent("device_zone_update", {
              detail: {
                device_code: data.device_code,
                zone: zone,
              },
            }),
          );

          AudioEngine.handlePhysicalZoneUpdate(data.device_code, zone);
        }
      };

      ws.onclose = () => {
        console.log("Display WS Disconnected, reconnecting...");
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const handleAction = async (row: number, col: number) => {
    // Close/deselect action (e.g. Museum X button)
    const buttonId = row < 0 || col < 0 ? -1 : row * 3 + col;

    await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button_id: buttonId }),
    });
  };

  if (!game)
    return (
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center font-bold text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 animate-pulse">
            Connecting to system core...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans select-none font-light bg-[#FAF9F6] text-zinc-800">
      <div className="w-full flex-grow flex flex-col p-4 md:p-8 bg-[#FAF9F6]">
        {game.mode === "IDLE" && (
          <div className="flex flex-col items-center justify-center flex-grow py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-md animate-pulse mb-6 text-2xl">
              💤
            </div>
            <h1 className="text-2xl font-black text-zinc-800 uppercase tracking-wider">
              System Standby
            </h1>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
              Waiting for tablet controls or physical board interactions
            </p>
          </div>
        )}
        {game.mode === "MUSEUM" && (
          <MuseumMonitorView game={game} onAction={handleAction} />
        )}
        {game.mode === "GAME" && (
          <GameMonitorView game={game} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}