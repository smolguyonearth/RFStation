import { useState, useEffect, useRef } from "react";
import MuseumMonitorView from "@/components/Mode/MuseumMonitorView";
import GameMonitorView from "@/components/Mode/GameMonitorView";
import { AudioEngine } from "@/lib/AudioEngine";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export default function Game() {
  const { t } = useTranslation();
  const [game, setGame] = useState<any>(null);
  const gameRef = useRef<any>(null);
  const prevModeRef = useRef<string | null>(null);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (game?.language) {
      i18n.changeLanguage(game.language.toLowerCase());
    }
  }, [game?.language]);

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
            AudioEngine.handleGameUpdate(gameRef.current);
          }
        }).catch(() => { });
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
            {t("display.connecting")}
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans select-none font-light bg-[#FAF9F6] text-zinc-800">
      <div className="w-full flex-grow flex flex-col p-4 md:p-8 bg-[#FAF9F6]">
        {game.mode === "IDLE" && (
          <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center animate-fade-in min-h-full relative overflow-hidden select-none w-full">
            {/* Charming Soft Pastel Decorative Blobs */}
            <div className="absolute top-16 left-16 w-64 h-64 bg-[#E1F7EC]/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#FFEBF0]/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#FFFBE6]/60 rounded-full blur-3xl pointer-events-none" />
            
            {/* Central Pill-shaped Card */}
            <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] p-12 md:p-20 flex flex-col items-center border border-[#FFF0F3] z-10 text-center">
              
              <span className="text-[10px] md:text-xs font-extrabold tracking-[0.3em] text-indigo-500 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-full uppercase mb-6 shadow-sm">
                Interactive Sound Exhibition
              </span>
              
              <h2 className="text-xl md:text-2xl font-bold text-zinc-500 uppercase tracking-widest mb-4">
                Welcome to the Exhibition
              </h2>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#333C4E] leading-tight max-w-3xl mb-6">
                THE LOST MEMORY
              </h1>
              
              <p className="text-zinc-500 text-sm md:text-lg mt-2 tracking-wide font-medium max-w-2xl mx-auto leading-relaxed">
                Bridging the Weser and the Chao Phraya through sound.
              </p>

              <div className="mt-12 flex items-center justify-center gap-3 bg-[#FAF9F6] border border-zinc-200 px-6 py-4 rounded-2xl animate-pulse">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs md:text-sm font-bold text-zinc-600 uppercase tracking-widest">
                  {t("display.standby_desc")}
                </span>
              </div>
            </div>
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