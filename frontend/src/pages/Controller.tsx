import React, { useEffect, useState, useRef } from 'react';
import NeonDice from '@/components/NeonDice';

// Types from backend
type AppMode = 'IDLE' | 'MUSEUM' | 'GAME';
type Language = 'EN' | 'TH' | 'DE';
type GamePhase = 'INIT' | 'TURN' | 'BATTLE' | 'END';

interface GameState {
  mode: AppMode;
  language: Language;
  gamePhase: GamePhase;
  currentPlayer: number;
  displayMatrix: number[][];
  pendingMatrix: number[][];
  battleContext: { row: number, col: number } | null;
  scores: { 1: number, 2: number };
  activeMuseumLocation: { row: number, col: number } | null;
}

export default function Controller() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial state
    fetch(`/api/game/status`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGameState(data.game);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch state:", err);
        setLoading(false);
      });

    // 2. Connect WebSocket for live updates
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProto}//${window.location.host}/ws`);

    ws.onopen = () => console.log("Controller WS Connected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'game_update' && data.game) {
          setGameState(data.game);
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const setMode = async (mode: AppMode, language: Language = 'EN') => {
    await fetch(`/api/controller/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, language })
    });
  };

  const startGame = async (startingPlayer: number) => {
    await fetch(`/api/controller/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startingPlayer })
    });
  };

  const endTurn = async () => {
    await fetch(`/api/controller/endturn`, { method: 'POST' });
  };

  const resetGame = async () => {
    await fetch(`/api/game/reset`, { method: 'POST' });
  };

  if (loading || !gameState) {
    return <div className="h-screen w-screen bg-white text-black flex items-center justify-center font-mono font-bold">Connecting to Backend...</div>;
  }

  // --- Render Views Based on Mode ---
  return (
    <div className="min-h-screen w-full bg-white text-black font-sans flex flex-col relative overflow-auto">
      
      {/* GLOBAL AUDIO SLOTS */}
      {/* Idle currently has no sound, but the slot is prepared here */}
      {gameState.mode === 'IDLE' && <audio src="/sounds/bgm_idle.mp3" autoPlay loop className="hidden" />}

      {gameState.mode === 'IDLE' && <SetupView setMode={setMode} />}
      {gameState.mode === 'MUSEUM' && <MuseumControllerView gameState={gameState} setMode={setMode} />}
      {gameState.mode === 'GAME' && (
        <GameControllerView
          gameState={gameState}
          startGame={startGame}
          endTurn={endTurn}
          resetGame={resetGame}
          setMode={setMode}
        />
      )}
    </div>
  );
}

// ==========================================
// SETUP VIEW
// ==========================================
function SetupView({ setMode }: { setMode: (mode: AppMode, lang: Language) => void }) {
  const [selectedLang, setSelectedLang] = useState<Language>('EN');

  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center animate-fade-in relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

      <h1 className="text-5xl font-black mb-16 tracking-[0.2em] text-black">
        STATION CONTROL
      </h1>

      <div className="mb-16 flex space-x-6 z-10">
        {(['EN', 'TH', 'DE'] as Language[]).map(lang => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`w-20 h-14 text-lg font-black transition-all border-4 ${selectedLang === lang
                ? 'bg-black text-white border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                : 'bg-white text-black border-zinc-200 hover:border-black shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
              }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-8 w-full max-w-xl z-10">
        <button
          onClick={() => setMode('MUSEUM', selectedLang)}
          className="group relative p-8 bg-white border-4 border-black text-left transition-all hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black mb-2 text-black tracking-widest">MUSEUM</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest">Interactive Exhibition</p>
            </div>
            <div className="text-6xl group-hover:translate-x-4 transition-transform opacity-20 group-hover:opacity-100">→</div>
          </div>
        </button>

        <button
          onClick={() => setMode('GAME', selectedLang)}
          className="group relative p-8 bg-black text-white border-4 border-black text-left transition-all hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] hover:shadow-[16px_16px_0px_0px_rgba(200,200,200,1)]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black mb-2 tracking-widest">GAME</h2>
              <p className="text-zinc-400 font-bold uppercase tracking-widest">Territory Battle</p>
            </div>
            <div className="text-6xl group-hover:translate-x-4 transition-transform opacity-20 group-hover:opacity-100">→</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MUSEUM CONTROLLER VIEW
// ==========================================
function MuseumControllerView({ gameState, setMode }: { gameState: GameState, setMode: (m: AppMode) => void }) {
  // Helper to map board coordinates to A, B, C, D zones
  const getZoneId = (row: number, col: number) => {
    const key = `${row},${col}`;
    const mapping: Record<string, string> = { "0,0": "A", "0,4": "B", "4,0": "C", "4,4": "D" };
    return mapping[key] || "A";
  };

  return (
    <div className="flex-1 p-8 flex flex-col animate-slide-in-right relative">
      
      {/* MUSEUM AUDIO SLOTS */}
      {gameState.activeMuseumLocation && (
        <>
          {/* 1. Zone Background Sound (A, B, C, D) */}
          <audio 
            key={`bgm-${gameState.activeMuseumLocation.row}-${gameState.activeMuseumLocation.col}`}
            src={`/sounds/zones/${getZoneId(gameState.activeMuseumLocation.row, gameState.activeMuseumLocation.col)}.mp3`} 
            autoPlay 
            loop 
            className="hidden" 
          />
          {/* 2. Description Sound (Language specific) */}
          <audio 
            key={`desc-${gameState.language.toLowerCase()}-${gameState.activeMuseumLocation.row}-${gameState.activeMuseumLocation.col}`}
            src={`/sounds/descriptions/${gameState.language.toLowerCase()}/loc_${gameState.activeMuseumLocation.row}_${gameState.activeMuseumLocation.col}.mp3`} 
            autoPlay 
            className="hidden" 
          />
        </>
      )}

      <div className="flex justify-between items-end mb-8 pb-4 border-b-4 border-black">
        <div>
          <h1 className="text-4xl font-black tracking-widest">MUSEUM MODE</h1>
          <p className="text-zinc-500 font-bold uppercase mt-2">Language: {gameState.language}</p>
        </div>
        <button
          onClick={() => setMode('IDLE')}
          className="px-6 py-3 border-4 border-black font-black uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
        >
          Exit
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {gameState.activeMuseumLocation ? (
          <div className="text-center animate-pop">
            <h2 className="text-xl text-zinc-500 mb-4 font-bold uppercase tracking-widest">Playing Description</h2>
            <div className="text-6xl font-black text-black mb-8 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              LOC {gameState.activeMuseumLocation.row}{gameState.activeMuseumLocation.col}
            </div>
          </div>
        ) : (
          <div className="text-center animate-pulse">
            <h2 className="text-3xl font-black text-zinc-400 uppercase tracking-widest">Awaiting Input</h2>
            <p className="text-zinc-500 mt-4 font-bold">Press a physical button on the board.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// GAME CONTROLLER VIEW
// ==========================================
function GameControllerView({ gameState, startGame, endTurn, resetGame, setMode }: any) {
  return (
    <div className="flex-1 p-8 flex flex-col animate-slide-in-right relative">
      <div className="flex justify-between items-end mb-8 pb-4 border-b-4 border-black z-10 bg-white">
        <div>
          <h1 className="text-4xl font-black tracking-widest uppercase">{gameState.gamePhase} PHASE</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest mt-2">P1: {gameState.scores[1]} | P2: {gameState.scores[2]}</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => resetGame()} className="px-6 py-3 border-4 border-black bg-black text-white font-black uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] transition-all">
            Restart
          </button>
          <button onClick={() => setMode('IDLE')} className="px-6 py-3 border-4 border-black bg-white font-black uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Exit
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {gameState.gamePhase === 'INIT' && <InitRollPhase startGame={startGame} />}
        {gameState.gamePhase === 'TURN' && <TurnPhase gameState={gameState} endTurn={endTurn} />}
        {gameState.gamePhase === 'BATTLE' && <BattlePhase gameState={gameState} />}
        {gameState.gamePhase === 'END' && <EndPhase gameState={gameState} resetGame={resetGame} />}
      </div>
    </div>
  );
}

// --- Swipe Hook ---
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [startX, setStartX] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX === null) return;
    const endX = e.clientX;
    const distance = startX - endX;

    if (distance > 50) onSwipeLeft();
    if (distance < -50) onSwipeRight();
    setStartX(null);
  };

  return { onPointerDown: handlePointerDown, onPointerUp: handlePointerUp, className: "touch-pan-y" };
}

// --- Game Phases ---
function InitRollPhase({ startGame }: any) {
  const [step, setStep] = useState<'P1_ROLL' | 'P2_ROLL' | 'RESULT'>('P1_ROLL');
  const [p1Roll, setP1Roll] = useState<number | null>(null);
  const [p2Roll, setP2Roll] = useState<number | null>(null);

  const handleP1Roll = (val: number) => {
    setP1Roll(val);
  };

  const handleP2Roll = (val: number) => {
    setP2Roll(val);
  };

  const handleResultNext = () => {
    if (p1Roll === p2Roll) {
      setP1Roll(null);
      setP2Roll(null);
      setStep('P1_ROLL');
    } else {
      startGame(p1Roll! > p2Roll! ? 1 : 2);
    }
  };

  const swipeHandlers = useSwipe(
    () => { // Swipe Left (Next)
      if (step === 'P1_ROLL' && p1Roll !== null) setStep('P2_ROLL');
      if (step === 'P2_ROLL' && p2Roll !== null) setStep('RESULT');
    },
    () => { } // Swipe Right (Ignore)
  );

  return (
    <div {...swipeHandlers} className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}>
      {step === 'P1_ROLL' && (
        <div key="p1" className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-blue-50 z-10">
          <h2 className="text-3xl font-black text-blue-600 mb-8 tracking-widest">PLAYER 1 INIT</h2>
          <div className="scale-110 transform">
            <NeonDice mode="D20" label="ROLL D20" onRoll={handleP1Roll} />
          </div>
          {p1Roll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep('P2_ROLL')}
                className="px-12 py-4 bg-black text-white font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all animate-pop"
              >
                NEXT: P2 ROLL →
              </button>
              <p className="mt-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">(Or Swipe Left)</p>
            </div>
          )}
        </div>
      )}

      {step === 'P2_ROLL' && (
        <div key="p2" className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-red-50 z-10">
          <h2 className="text-3xl font-black text-red-600 mb-8 tracking-widest">PLAYER 2 INIT</h2>
          <div className="scale-110 transform">
            <NeonDice mode="D20" label="ROLL D20" onRoll={handleP2Roll} />
          </div>
          {p2Roll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep('RESULT')}
                className="px-12 py-4 bg-black text-white font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all animate-pop"
              >
                SHOW RESULTS →
              </button>
              <p className="mt-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">(Or Swipe Left)</p>
            </div>
          )}
        </div>
      )}

      {step === 'RESULT' && (
        <div key="res" className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white z-20">
          <h2 className="text-4xl font-black mb-8 tracking-widest border-b-4 border-black pb-4">RESULTS</h2>
          <div className="flex space-x-12 text-4xl font-black">
            <div className="text-blue-600">P1: {p1Roll}</div>
            <div className="text-red-600">P2: {p2Roll}</div>
          </div>
          <div className="mt-12 mb-12 text-2xl font-black bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
            {p1Roll === p2Roll ? "IT'S A TIE. RE-ROLLING!" : `PLAYER ${p1Roll! > p2Roll! ? '1' : '2'} GOES FIRST`}
          </div>

          <button
            onClick={handleResultNext}
            className="px-12 py-4 bg-white text-black font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {p1Roll === p2Roll ? "ROLL AGAIN" : "START GAME"}
          </button>
        </div>
      )}
    </div>
  );
}

function TurnPhase({ gameState, endTurn }: any) {
  const [step, setStep] = useState<'ROLL' | 'ACTION'>('ROLL');
  const [hasRolled, setHasRolled] = useState(false);
  const isP1 = gameState.currentPlayer === 1;

  const handleRoll = () => {
    setHasRolled(true);
  };

  // Reset step if turn changes
  useEffect(() => {
    setStep('ROLL');
    setHasRolled(false);
  }, [gameState.currentPlayer]);

  const swipeHandlers = useSwipe(
    () => { // Swipe Left (Next)
      if (step === 'ROLL' && hasRolled) setStep('ACTION');
    },
    () => { } // Swipe Right (Ignore)
  );

  return (
    <div {...swipeHandlers} className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}>
      {step === 'ROLL' && (
        <div key="roll" className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 ${isP1 ? 'bg-blue-50' : 'bg-red-50'}`}>
          <h2 className={`text-4xl font-black mb-8 tracking-widest uppercase ${isP1 ? 'text-blue-600' : 'text-red-600'}`}>
            PLAYER {gameState.currentPlayer} TURN
          </h2>
          <div className="scale-110 transform">
            <NeonDice mode="D6" label="ROLL TO MOVE" onRoll={handleRoll} />
          </div>
          {hasRolled && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep('ACTION')}
                className="px-12 py-4 bg-black text-white font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all animate-pop"
              >
                NEXT: MOVE PIECE →
              </button>
              <p className="mt-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">(Or Swipe Left)</p>
            </div>
          )}
        </div>
      )}

      {step === 'ACTION' && (
        <div key="action" className={`absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right z-10 p-4 ${isP1 ? 'bg-blue-50' : 'bg-red-50'}`}>
          <h2 className={`text-4xl font-black mb-8 tracking-widest uppercase ${isP1 ? 'text-blue-600' : 'text-red-600'}`}>
            MOVE PIECE
          </h2>

          <div className="w-full max-w-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 bg-white">
            <h3 className="text-xl font-black mb-6 uppercase tracking-widest border-b-2 border-black pb-4">ACTION REQUIRED:</h3>
            <ul className="text-lg font-bold space-y-4 text-zinc-600">
              <li className="flex items-center"><span className="text-black text-2xl mr-4">→</span> Move piece to destination.</li>
              <li className="flex items-center"><span className="text-black text-2xl mr-4">→</span> If landing on a landmark, press its physical button.</li>
              <li className="flex items-center text-amber-600"><span className="text-black text-2xl mr-4">→</span> If landing on a path, press End Turn below.</li>
            </ul>
          </div>

          <button
            onClick={() => endTurn()}
            className="w-full max-w-2xl py-6 bg-black text-white text-3xl font-black uppercase hover:-translate-y-1 hover:-translate-x-1 shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] hover:shadow-[12px_12px_0px_0px_rgba(200,200,200,1)] transition-all"
          >
            END TURN
          </button>
        </div>
      )}
    </div>
  );
}

function BattlePhase({ gameState }: any) {
  const [step, setStep] = useState<'P1_ROLL' | 'P2_ROLL' | 'RESULT'>('P1_ROLL');
  const [p1Roll, setP1Roll] = useState<number | null>(null);
  const [p2Roll, setP2Roll] = useState<number | null>(null);

  const resolveBattle = async (winner: number) => {
    await fetch(`/api/game/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner })
    });
  };

  const handleP1Roll = (val: number) => {
    setP1Roll(val);
  };

  const handleP2Roll = (val: number) => {
    setP2Roll(val);
  };

  const handleResultNext = () => {
    if (p1Roll === p2Roll) {
      setP1Roll(null);
      setP2Roll(null);
      setStep('P1_ROLL');
    } else {
      resolveBattle(p1Roll! > p2Roll! ? 1 : 2);
    }
  };

  const swipeHandlers = useSwipe(
    () => { // Swipe Left (Next)
      if (step === 'P1_ROLL' && p1Roll !== null) setStep('P2_ROLL');
      if (step === 'P2_ROLL' && p2Roll !== null) setStep('RESULT');
    },
    () => { } // Swipe Right (Ignore)
  );

  return (
    <div {...swipeHandlers} className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}>

      {/* --- AUDIO SLOTS --- */}
      {step !== 'RESULT' && (
        <audio src="/sounds/battle_song.mp3" autoPlay loop className="hidden" id="battle-audio-slot" />
      )}
      {step === 'RESULT' && (
        <audio src="/sounds/conquer_sound.mp3" autoPlay className="hidden" id="conquer-audio-slot" />
      )}
      {/* ------------------- */}

      <div className="absolute top-0 text-center z-50">
        <h2 className="text-2xl font-black text-amber-500 uppercase tracking-widest animate-pulse border-b-2 border-amber-500 pb-1">TERRITORY BATTLE</h2>
        <p className="text-lg text-zinc-500 font-bold mt-1">Location [{gameState.battleContext?.row}, {gameState.battleContext?.col}]</p>
      </div>

      {step === 'P1_ROLL' && (
        <div key="bp1" className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-blue-50 z-10">
          <h2 className="text-4xl font-black text-blue-600 mb-8 tracking-widest uppercase">P1 ATTACK</h2>
          <div className="scale-110 transform">
            <NeonDice mode="D8" label="ROLL D8" onRoll={handleP1Roll} />
          </div>
          {p1Roll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep('P2_ROLL')}
                className="px-12 py-4 bg-black text-white font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all animate-pop"
              >
                NEXT: P2 DEFEND →
              </button>
              <p className="mt-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">(Or Swipe Left)</p>
            </div>
          )}
        </div>
      )}

      {step === 'P2_ROLL' && (
        <div key="bp2" className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-red-50 z-10">
          <h2 className="text-4xl font-black text-red-600 mb-8 tracking-widest uppercase">P2 DEFEND</h2>
          <div className="scale-110 transform">
            <NeonDice mode="D8" label="ROLL D8" onRoll={handleP2Roll} />
          </div>
          {p2Roll !== null && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => setStep('RESULT')}
                className="px-12 py-4 bg-black text-white font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all animate-pop"
              >
                SHOW RESULTS →
              </button>
              <p className="mt-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">(Or Swipe Left)</p>
            </div>
          )}
        </div>
      )}

      {step === 'RESULT' && (
        <div key="bres" className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white z-20">
          <h2 className="text-4xl font-black mb-6 tracking-widest border-b-4 border-black pb-2">BATTLE RESULT</h2>
          <div className="flex space-x-12 text-4xl font-black">
            <div className="text-blue-600">P1: {p1Roll}</div>
            <div className="text-red-600">P2: {p2Roll}</div>
          </div>
          <div className="mt-12 mb-12 text-2xl font-black bg-amber-500 text-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            {p1Roll === p2Roll ? "CLASH! RE-ROLLING!" : `PLAYER ${p1Roll! > p2Roll! ? '1' : '2'} WINS TERRITORY`}
          </div>

          <button
            onClick={handleResultNext}
            className="px-12 py-4 bg-white text-black font-black text-2xl uppercase border-4 border-black hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {p1Roll === p2Roll ? "ROLL AGAIN" : "RESOLVE BATTLE"}
          </button>
        </div>
      )}
    </div>
  );
}

function EndPhase({ gameState, resetGame }: any) {
  const p1 = gameState.scores[1];
  const p2 = gameState.scores[2];
  let msg = "TIE GAME";
  let bg = "bg-black text-white";

  if (p1 > p2) {
    msg = "PLAYER 1 WINS";
    bg = "bg-blue-600 text-white";
  } else if (p2 > p1) {
    msg = "PLAYER 2 WINS";
    bg = "bg-red-600 text-white";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-pop py-12">
      <div className={`p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center ${bg} mb-12`}>
        <h2 className="text-5xl font-black tracking-widest mb-6">{msg}</h2>
        <div className="text-3xl font-bold font-mono">P1: {p1} | P2: {p2}</div>
      </div>

      <button
        onClick={() => resetGame()}
        className="px-12 py-6 bg-white border-4 border-black text-2xl font-black uppercase hover:-translate-y-1 hover:-translate-x-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
