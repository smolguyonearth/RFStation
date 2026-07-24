import { useState, useEffect, useRef } from "react";

type DiceMode = "D20" | "D6" | "D8";

interface NeonDiceProps {
  mode: DiceMode;
  onRoll: (result: number) => void;
  label?: string;
  onBeforeRoll?: () => boolean;
}

export default function Dice({ mode, onRoll, label, onBeforeRoll }: NeonDiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [diceValue, setDiceValue] = useState<string | number>("?");
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

  const animateRoll = (
    finalValue: number,
    sides: number,
    accelerate = false,
  ) => {
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
    if (onBeforeRoll && !onBeforeRoll()) return;
    const result = Math.floor(Math.random() * 20) + 1;
    animateRoll(result, 20);
  };

  const animateTube = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    let newVal = 0;
    if (mode === "D8") {
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
    if (onBeforeRoll && !onBeforeRoll()) return;

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
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, []); // Empty deps, logic uses refs!

  const processChargedRoll = () => {
    const v = tubeValueRef.current;
    if (mode === "D6") {
      const result = Math.min(6, Math.floor(v * 6) + 1);
      animateRoll(result, 6);
    } else if (mode === "D8") {
      const result = Math.min(8, Math.floor(Math.pow(v, 1.3) * 8) + 1);
      animateRoll(result, 8, true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <div
        className={`w-36 h-36 bg-white border border-zinc-200 rounded-[2rem] flex flex-col justify-center items-center shadow-xl shadow-zinc-150/40 relative transition-transform duration-100 ${isRolling ? "animate-shake" : ""}`}
      >
        <div
          className={`text-5xl font-extralight text-zinc-900 leading-none ${pop ? "animate-pop" : ""}`}
        >
          {diceValue}
        </div>
        <div className="absolute bottom-4 font-bold text-zinc-400 text-[9px] tracking-[0.2em] uppercase">
          {label || mode}
        </div>
      </div>

      {(mode === "D6" || mode === "D8") && (
        <div className="w-full mt-8 flex flex-col gap-2">
          {/* Minimal thin charge tube */}
          <div className="w-full h-1.5 bg-zinc-200/60 rounded-full overflow-hidden relative">
            <div
              ref={tubeFillRef}
              className="absolute top-0 left-0 h-full bg-zinc-800 rounded-full transition-colors duration-75"
              style={{ width: `0%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-400 font-bold tracking-widest px-1">
            <span>MIN</span>
            <span>MAX</span>
          </div>

          <button
            onMouseDown={startHolding}
            onTouchStart={startHolding}
            className="mt-4 w-full py-4 bg-zinc-900 text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-zinc-800 active:scale-95 transition-all shadow-md shadow-zinc-900/10"
          >
            {isHolding ? "Charging..." : `Hold to Charge ${mode}`}
          </button>
        </div>
      )}

      {mode === "D20" && (
        <button
          onClick={rollD20}
          className="mt-6 w-full py-4 bg-zinc-900 text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-zinc-800 active:scale-95 transition-all shadow-md shadow-zinc-900/10"
        >
          Roll {mode}
        </button>
      )}
    </div>
  );
}
