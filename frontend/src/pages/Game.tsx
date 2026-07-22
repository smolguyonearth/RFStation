import { useState, useEffect, useRef } from "react";
import MapViewer from "@/components/Map/MapViewer";
import LandmarkDetails from "@/components/Map/LandmarkDetails";
import { Landmarks } from "@/constants/landmark";
import { AudioEngine } from "@/lib/AudioEngine";

type AppMode = 'IDLE' | 'MUSEUM' | 'GAME';
type Language = 'EN' | 'TH' | 'DE';
type GamePhase = 'INIT' | 'TURN' | 'BATTLE' | 'END';

interface GameData {
  mode: AppMode;
  language: Language;
  gamePhase: GamePhase;
  currentPlayer: number;
  displayMatrix: number[][]; // The monitor only sees the committed matrix
  battleContext: { row: number, col: number } | null;
  scores: { 1: number, 2: number };
  activeMuseumLocation: { row: number, col: number } | null;
}

export default function Game() {
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial state
  useEffect(() => {
    fetch(`/api/game/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGame(data.game);
        } else {
          setError("Failed to load game state");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Listen for WebSocket updates
  useEffect(() => {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProto}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "game_update" && data.game) {
          setGame(data.game);
        } else if (data.device_code && data.nearest_device && data.nearest_device !== "X") {
          // Map the nearest_device code (A/B/C/D/E/F) to the full location name
          const museumMatrix = [
            ['mahanakhon', 'asiatique', 'giant_swing'],
            ['wat_arun', 'bremen_stadium', 'townhall']
          ];
          const codeMap: Record<string, string> = {
            "A": "mahanakhon", "B": "asiatique", "C": "giant_swing",
            "D": "wat_arun", "E": "bremen_stadium", "F": "townhall"
          };
          const zoneName = codeMap[data.nearest_device] || data.nearest_device;

          // Dispatch a custom event to update P1/P2 zones inside the GameMonitorView
          window.dispatchEvent(new CustomEvent('device_zone_update', {
            detail: { device_code: data.device_code, zone: zoneName }
          }));
        }
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    return () => ws.close();
  }, []);

  const handleSimulateAction = async (row: number, col: number) => {
    const button_id = (row * 3) + col;
    try {
      await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ button_id })
      });
    } catch (e) {
      console.error("Simulation failed", e);
    }
  };

  if (!game) {
    return <div className="min-h-screen bg-white text-black flex items-center justify-center font-mono font-bold">Connecting to Game Server...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

      {error && (
        <div className="absolute top-4 bg-red-100 border border-red-500 px-4 py-2 rounded-lg shadow-sm text-red-900">
          {error}
        </div>
      )}

      {game.mode === 'IDLE' && (
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-black tracking-widest text-zinc-300 mb-4">SYSTEM IDLE</h1>
          <p className="text-zinc-500">Awaiting controller input...</p>
        </div>
      )}

      {game.mode === 'MUSEUM' && <MuseumMonitorView game={game} onAction={handleSimulateAction} />}

      {game.mode === 'GAME' && <GameMonitorView game={game} onAction={handleSimulateAction} />}
    </div>
  );
}

function MuseumMonitorView({ game, onAction }: { game: GameData, onAction: (r: number, c: number) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // The 6 physical buttons mapped to specific Landmark IDs
  const matrixToLandmarkId = [
    ['lm_01', 'lm_06', 'lm_03'], // Row 0: Mahanakorn, Asiatique, Giant Swing
    ['lm_10', 'lm_02', 'lm_04']  // Row 1: Wat Arun, Stadium, Townhall
  ];

  // Compute selected land from active matrix location
  let selectedLand = null;
  if (game.activeMuseumLocation) {
    const { row, col } = game.activeMuseumLocation;
    if (row >= 0 && row < 2 && col >= 0 && col < 3) {
      const landId = matrixToLandmarkId[row][col];
      selectedLand = Landmarks.find(l => l.id === landId) || null;
    }
  }

  const getLocationName = (row: number, col: number) => {
    const museumMatrix = [
      ['mahanakhon', 'asiatique', 'giant_swing'],
      ['wat_arun', 'bremen_stadium', 'townhall']
    ];
    if (row >= 0 && row < 2 && col >= 0 && col < 3) {
      return museumMatrix[row][col];
    }
    return "mahanakhon";
  };

  // Cleanup audio on exit
  useEffect(() => {
    return () => {
      AudioEngine.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Auto-play audio when location changes
  useEffect(() => {
    let playTimeout: NodeJS.Timeout;

    if (game.activeMuseumLocation) {
      const locName = getLocationName(game.activeMuseumLocation.row, game.activeMuseumLocation.col);

      // Play BGM with fade effect (lower volume for museum mode so it doesn't overpower narrator)
      AudioEngine.playZone(locName, 0.3);

      // Play narration after a delay (e.g., 3 seconds)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        playTimeout = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio autoplay blocked or file missing", e));
          }
        }, 3000);
      }
    } else {
      AudioEngine.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      clearTimeout(playTimeout);
    };
  }, [game.activeMuseumLocation, game.language]);

  const handleMapSelect = (land: any) => {
    // Find if the clicked landmark exists in our 2x3 physical grid
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        if (matrixToLandmarkId[r][c] === land.id) {
          onAction(r, c);
          return;
        }
      }
    }
    console.log("Clicked landmark is outside the 2x3 physical grid");
  };

  return (
    <div className="w-full max-w-6xl animate-fade-in flex flex-col flex-grow">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
          MUSEUM EXHIBIT
        </h1>
        <p className="text-zinc-500 font-bold mt-2">Language: {game.language}</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-zinc-200 p-8 flex-grow flex flex-col lg:flex-row gap-8">
        <MapViewer
          selectedLand={selectedLand}
          onSelect={handleMapSelect}
        />
        {selectedLand ? (
          <LandmarkDetails
            land={selectedLand}
            onClose={() => { }}
          />
        ) : (
          <div className="w-full lg:w-[45%] flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-zinc-200 rounded-3xl">
            <div className="w-24 h-24 border-4 border-zinc-200 border-t-black rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-black text-zinc-400">WAITING FOR SELECTION</h2>
            <p className="text-zinc-500 mt-2 font-bold">Press a physical button on the board or click the map.</p>
          </div>
        )}
      </div>

      {game.activeMuseumLocation && (
        <audio
          ref={audioRef}
          src={`/sounds/descriptions/${game.language.toLowerCase()}/${getLocationName(game.activeMuseumLocation.row, game.activeMuseumLocation.col)}.mp3`}
          className="hidden"
        />
      )}
    </div>
  );
}

// ==========================================
// GAME MONITOR VIEW
// ==========================================
function GameMonitorView({ game, onAction }: { game: GameData, onAction: (r: number, c: number) => void }) {
  const [p1Zone, setP1Zone] = useState<string>("waiting");
  const [p2Zone, setP2Zone] = useState<string>("waiting");

  useEffect(() => {
    // Listen for Calliope ESP32 hardware updates mapped from WebSocket
    const handleDeviceUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { device_code, zone } = customEvent.detail;
      if (device_code === "P1") {
        setP1Zone(zone);
      } else if (device_code === "P2") {
        setP2Zone(zone);
      }
    };

    window.addEventListener('device_zone_update', handleDeviceUpdate);
    return () => window.removeEventListener('device_zone_update', handleDeviceUpdate);
  }, []);

  useEffect(() => {
    // Automatically switch BGM to the current player's zone
    if (game.currentPlayer === 1) {
      if (p1Zone === "waiting") AudioEngine.stop();
      else AudioEngine.playZone(p1Zone);
    } else if (game.currentPlayer === 2) {
      if (p2Zone === "waiting") AudioEngine.stop();
      else AudioEngine.playZone(p2Zone);
    }
  }, [game.currentPlayer, p1Zone, p2Zone]);

  return (
    <div className="w-full max-w-5xl animate-fade-in flex flex-col items-center relative">

      {/* SIMULATE BGM DROPDOWN (P1 & P2) */}
      <div className="absolute -top-12 right-0 flex gap-4">
        <div className="flex flex-col items-end">
          <label className="text-xs font-bold text-blue-600 mb-1">P1 Simulate Location</label>
          <select
            value={p1Zone}
            onChange={(e) => setP1Zone(e.target.value)}
            className="px-4 py-2 border-2 border-blue-300 rounded bg-blue-50 text-sm font-bold text-blue-700 outline-none cursor-pointer"
          >
            <option value="waiting">🔄 Waiting for Calliope...</option>
            <option value="mahanakhon">Mahanakhon</option>
            <option value="asiatique">Asiatique</option>
            <option value="giant_swing">Giant Swing</option>
            <option value="wat_arun">Wat Arun</option>
            <option value="bremen_stadium">Bremen Stadium</option>
            <option value="townhall">Townhall</option>
          </select>
        </div>

        <div className="flex flex-col items-end">
          <label className="text-xs font-bold text-red-600 mb-1">P2 Simulate Location</label>
          <select
            value={p2Zone}
            onChange={(e) => setP2Zone(e.target.value)}
            className="px-4 py-2 border-2 border-red-300 rounded bg-red-50 text-sm font-bold text-red-700 outline-none cursor-pointer"
          >
            <option value="waiting">🔄 Waiting for Calliope...</option>
            <option value="mahanakhon">Mahanakhon</option>
            <option value="asiatique">Asiatique</option>
            <option value="giant_swing">Giant Swing</option>
            <option value="wat_arun">Wat Arun</option>
            <option value="bremen_stadium">Bremen Stadium</option>
            <option value="townhall">Townhall</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between w-full items-end mb-16 px-8 border-b-2 border-zinc-200 pb-8 mt-12">
        <div className={`flex flex-col items-center transition-all ${game.currentPlayer === 1 ? 'scale-110' : 'opacity-50 grayscale'}`}>
          <span className="text-sm font-bold tracking-widest text-blue-600 mb-2">PLAYER 1</span>
          <span className="text-6xl font-black">{game.scores[1]}</span>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-[0.3em] text-zinc-400 mb-2">TERRITORY</h1>
          <div className="px-6 py-2 border border-zinc-200 rounded-full text-zinc-600 font-bold uppercase tracking-widest bg-zinc-50">
            {game.gamePhase === 'INIT' ? 'INITIALIZING' :
              game.gamePhase === 'BATTLE' ? 'BATTLE PHASE' :
                game.gamePhase === 'END' ? 'MATCH COMPLETE' : 'TURN ACTIVE'}
          </div>
        </div>

        <div className={`flex flex-col items-center transition-all ${game.currentPlayer === 2 ? 'scale-110' : 'opacity-50 grayscale'}`}>
          <span className="text-sm font-bold tracking-widest text-red-600 mb-2">PLAYER 2</span>
          <span className="text-6xl font-black">{game.scores[2]}</span>
        </div>
      </div>

      <div className={`transition-all duration-1000 ${game.gamePhase === 'BATTLE' ? 'scale-95 opacity-50 blur-[2px]' : ''}`}>
        <div className="grid grid-cols-3 gap-6">
          {game.pendingMatrix.map((rowData, rowIndex) => (
            rowData.map((owner, colIndex) => {
              let bg = 'bg-white';
              let border = 'border-zinc-200';
              if (owner === 1) bg = 'bg-blue-500 border-blue-600';
              if (owner === 2) bg = 'bg-red-500 border-red-600';
              if (owner === 3) bg = 'bg-amber-500 border-amber-600';

              return (
                <button
                  key={`game-${rowIndex}-${colIndex}`}
                  onClick={() => onAction(rowIndex, colIndex)}
                  className={`w-40 h-40 flex flex-col items-center justify-center rounded-3xl border-4 ${border} ${bg} relative overflow-hidden transition-all hover:scale-105`}
                >
                  <div className="absolute top-4 text-xs font-bold tracking-widest text-black/20">
                    SEC {rowIndex}{colIndex}
                  </div>
                </button>
              );
            })
          ))}
        </div>
      </div>

      {game.gamePhase === 'BATTLE' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-12 rounded-3xl shadow-2xl flex flex-col items-center animate-pop">
            <h2 className="text-5xl font-black text-black mb-4 tracking-widest animate-pulse">
              BATTLE!
            </h2>
            <p className="text-zinc-500 font-bold tracking-widest uppercase">
              Location [{game.battleContext?.row}, {game.battleContext?.col}] contested
            </p>
          </div>
        </div>
      )}

      {game.gamePhase === 'END' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/80 backdrop-blur-sm">
          <div className="text-center animate-pop">
            <h2 className="text-7xl font-black text-white mb-6 tracking-widest">
              {game.scores[1] > game.scores[2] ? 'PLAYER 1 WINS' :
                game.scores[2] > game.scores[1] ? 'PLAYER 2 WINS' : 'DRAW'}
            </h2>
          </div>
        </div>
      )}

    </div>
  );
}
