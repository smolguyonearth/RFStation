import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type DiceMode = "D20" | "D6" | "D8";

interface NeonDiceProps {
  mode: DiceMode;
  onRoll: (result: number) => void;
  label?: string;
  onBeforeRoll?: () => boolean;
  resetTrigger?: any;
}

export default function Dice({ mode, onRoll, label, onBeforeRoll, resetTrigger }: NeonDiceProps) {
  const { t } = useTranslation();
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

  useEffect(() => {
    setDiceValue("?");
    setPop(false);
    if (tubeFillRef.current) tubeFillRef.current.style.width = '0%';
    tubeValueRef.current = 0;
    setIsRolling(false);
  }, [resetTrigger]);

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
    if (isRolling || diceValue !== "?") return;
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
    if (isRolling || isHoldingRef.current || diceValue !== "?") return;
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
    <div className="flex flex-col items-center w-full max-w-[280px] mx-auto select-none px-2">
      {/* Moderately Sized Dice Container to fit on Screen */}
      <div
        className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white border border-[#FFF0F3] rounded-[2.5rem] flex flex-col justify-center items-center shadow-cute relative transition-transform duration-100 ${isRolling ? "animate-shake" : ""}`}
      >
        <div
          className={`text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#333C4E] leading-none ${pop ? "animate-pop" : ""}`}
        >
          {diceValue}
        </div>
        <div className="absolute bottom-4 font-extrabold text-[#FF7899] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
          {label || mode}
        </div>
      </div>

      {(mode === "D6" || mode === "D8") && (
        <div className="w-full mt-6 flex flex-col gap-2">
          {/* Cozy pastel pink charge tube */}
          <div className="w-full h-2 bg-[#FAF9F6] border border-[#FFF0F3] rounded-full overflow-hidden relative shadow-inner">
            <div
              ref={tubeFillRef}
              className="absolute top-0 left-0 h-full bg-[#FF7899] rounded-full transition-colors duration-75"
              style={{ width: `0%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] sm:text-[10px] text-zinc-400 font-bold tracking-widest px-1">
            <span>MIN</span>
            <span>MAX</span>
          </div>

          <button
            onMouseDown={startHolding}
            onTouchStart={startHolding}
            disabled={isRolling || diceValue !== "?"}
            className="mt-4 w-full py-3.5 px-6 bg-[#FFEBF0] text-[#FF7899] border-2 border-[#FFD6E0] font-extrabold text-xs tracking-wider uppercase rounded-2xl hover:bg-[#FFD6E0] hover:text-white active:scale-95 transition-all shadow-cute-xs cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {isHolding ? t("dice.charging") : isRolling ? t("dice.rolling") : diceValue !== "?" ? t("dice.rolled") : t("dice.hold", { mode })}
          </button>
        </div>
      )}

      {mode === "D20" && (
        <button
          onClick={rollD20}
          disabled={isRolling || diceValue !== "?"}
          className="mt-6 w-full py-3.5 px-6 bg-[#FFEBF0] text-[#FF7899] border-2 border-[#FFD6E0] font-extrabold text-xs tracking-wider uppercase rounded-2xl hover:bg-[#FFD6E0] hover:text-white active:scale-95 transition-all shadow-cute-xs cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
        >
          {isRolling ? t("dice.rolling") : diceValue !== "?" ? t("dice.rolled") : t("dice.roll", { mode })}
        </button>
      )}
    </div>
  );
}
