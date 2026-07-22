import React, { useState, useEffect, useRef } from 'react';

type DiceMode = 'D20' | 'D6' | 'D8';

interface NeonDiceProps {
  mode: DiceMode;
  onRoll: (result: number) => void;
  label?: string;
}

export default function NeonDice({ mode, onRoll, label }: NeonDiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [diceValue, setDiceValue] = useState<string | number>('?');
  const [pop, setPop] = useState(false);
  
  const tubeFillRef = useRef<HTMLDivElement>(null);
  const tubeValueRef = useRef(0);
  const tubeAnimRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isHoldingRef = useRef(false);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (tubeAnimRef.current) cancelAnimationFrame(tubeAnimRef.current);
    };
  }, []);

  const animateRoll = (finalValue: number, sides: number, accelerate = false) => {
    setIsRolling(true);
    setPop(false);

    let rolls = 0;
    const maxRolls = 12;
    let currentDelay = accelerate ? 250 : 50;

    const doRoll = () => {
      setDiceValue(Math.floor(Math.random() * sides) + 1);
      rolls++;

      if (rolls >= maxRolls) {
        setDiceValue(finalValue);
        setPop(true);
        setIsRolling(false);
        onRoll(finalValue);
      } else {
        if (accelerate) {
          currentDelay = Math.max(30, currentDelay * 0.75);
        }
        setTimeout(doRoll, currentDelay);
      }
    };

    setTimeout(doRoll, currentDelay);
  };

  const rollD20 = () => {
    if (isRolling) return;
    const result = Math.floor(Math.random() * 20) + 1;
    animateRoll(result, 20);
  };

  const animateTube = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    let newVal = 0;
    if (mode === 'D8') {
      const speed = 0.003;
      const cycle = (elapsed * speed) % 2;
      const linearVal = cycle <= 1 ? cycle : 2 - cycle;
      newVal = Math.pow(linearVal, 3);
    } else {
      const speed = 0.005;
      const cycle = (elapsed * speed) % 2;
      newVal = cycle <= 1 ? cycle : 2 - cycle;
    }

    tubeValueRef.current = newVal;
    if (tubeFillRef.current) {
      tubeFillRef.current.style.width = `${newVal * 100}%`;
    }

    if (isHoldingRef.current) {
      tubeAnimRef.current = requestAnimationFrame(animateTube);
    }
  };

  const startHolding = (e?: any) => {
    if (e && e.cancelable) e.preventDefault();
    if (isRolling || isHoldingRef.current) return;

    setIsHolding(true);
    isHoldingRef.current = true;
    startTimeRef.current = 0;
    tubeAnimRef.current = requestAnimationFrame(animateTube);
  };

  const stopHolding = (e?: any) => {
    if (e && e.cancelable) e.preventDefault();
    if (!isHoldingRef.current || isRolling) return;

    setIsHolding(false);
    isHoldingRef.current = false;
    if (tubeAnimRef.current) cancelAnimationFrame(tubeAnimRef.current);

    processChargedRoll();
  };

  // Add global mouse/touch up listeners to catch releases outside button
  useEffect(() => {
    const handleUp = (e: Event) => stopHolding(e);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []); // Empty deps, logic uses refs!

  const processChargedRoll = () => {
    const v = tubeValueRef.current;
    if (mode === 'D6') {
      const result = Math.min(6, Math.floor(v * 6) + 1);
      animateRoll(result, 6);
    } else if (mode === 'D8') {
      const result = Math.min(8, Math.floor(Math.pow(v, 1.3) * 8) + 1);
      animateRoll(result, 8, true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className={`w-40 h-40 bg-white border-4 border-zinc-200 rounded-3xl flex flex-col justify-center items-center shadow-lg relative transition-transform duration-100 ${isRolling ? 'animate-shake' : ''}`}>
        <div className={`text-6xl font-black text-black leading-none ${pop ? 'animate-pop' : ''}`}>
          {diceValue}
        </div>
        <div className="absolute bottom-3 font-bold text-zinc-400 text-xs tracking-widest uppercase">
          {label || mode}
        </div>
      </div>

      {(mode === 'D6' || mode === 'D8') && (
        <div className="w-full mt-8 flex flex-col gap-2">
          <div className="w-full h-8 bg-zinc-200 rounded-full overflow-hidden relative shadow-inner">
            <div 
              ref={tubeFillRef}
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-colors duration-75"
              style={{ width: `0%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500 font-bold px-2">
            <span>MIN</span>
            <span>MAX</span>
          </div>

          <button 
            onMouseDown={startHolding}
            onTouchStart={startHolding}
            className="mt-4 w-full py-4 bg-black text-white font-black text-base rounded-xl active:scale-95 transition-transform"
          >
            {isHolding ? 'CHARGING...' : `HOLD TO CHARGE ${mode}`}
          </button>
        </div>
      )}

      {mode === 'D20' && (
        <button 
          onClick={rollD20}
          className="mt-6 w-full py-4 bg-black text-white font-black text-base rounded-xl active:scale-95 transition-transform shadow-[0_4px_0_#94a3b8] active:shadow-none active:translate-y-1"
        >
          ROLL {mode}
        </button>
      )}
    </div>
  );
}
