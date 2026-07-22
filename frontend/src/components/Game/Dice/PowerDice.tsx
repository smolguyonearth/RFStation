import { useState, useRef, useEffect } from "react";

interface PowerDiceProps {
    currentPlayer: string;
    // Callback function to send the final rolled number back to the parent component
    onRollComplete: (score: number) => void;
    onEndTurn: () => void;
}

export default function PowerDice({
    currentPlayer,
    onRollComplete,
    onEndTurn,
}: PowerDiceProps) {
    // Local state for the dice mechanics
    const [isHolding, setIsHolding] = useState(false);
    const [power, setPower] = useState(0);
    const [rollResult, setRollResult] = useState<number | null>(null);

    // Refs for animation and logic loop (does not trigger re-renders)
    const powerRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const directionRef = useRef(1); // 1 = increasing power, -1 = decreasing power

    // Triggered when the user presses and holds the button
    const handlePressStart = () => {
        if (rollResult !== null) return;
        setIsHolding(true);
        powerRef.current = 0;
        directionRef.current = 1;

        // Start the power bar oscillation (0 -> 100 -> 0)
        intervalRef.current = setInterval(() => {
            powerRef.current += directionRef.current * 8; // Adjust speed multiplier here

            if (powerRef.current >= 100) {
                powerRef.current = 100;
                directionRef.current = -1; // Bounce back down
            } else if (powerRef.current <= 0) {
                powerRef.current = 0;
                directionRef.current = 1; // Bounce back up
            }
            setPower(powerRef.current);
        }, 15);
    };

    // Triggered when the user releases the button or leaves the element
    const handlePressEnd = () => {
        if (!isHolding) return;
        setIsHolding(false);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // 1. Calculate base score from the final power percentage (1-6)
        const baseScore = Math.max(1, Math.ceil((powerRef.current / 100) * 6));

        // 2. Add random accuracy variance (-2 to +2)
        const accuracyVariance = Math.floor(Math.random() * 5) - 2;

        // 3. Combine and clamp the final score between 1 and 6
        let finalScore = baseScore + accuracyVariance;
        if (finalScore < 1) finalScore = 1;
        if (finalScore > 6) finalScore = 6;

        setTimeout(() => {
            setRollResult(finalScore);
            onRollComplete(finalScore);
        }, 150);
    };

    const handleEndTurn = () => {
        if (rollResult === null) return;

        setPower(0);
        setRollResult(null);

        onEndTurn();
    };

    // Cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center gap-6">
            <h2 className="text-xl font-bold text-slate-700">
                Turn: <span className="text-slate-900">{currentPlayer}</span>
            </h2>

            {/* Power Bar Indicator */}
            <div className="w-full h-8 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200 relative">
                <div
                    className={`h-full transition-colors duration-200 bg-blue-500`}
                    style={{ width: `${power}%` }}
                />
            </div>

            {/* Dice Result Display */}
            <div className="h-20 flex items-center justify-center">
                {rollResult !== null ? (
                    <div className="text-center animate-bounce">
                        <span className="text-5xl font-black text-slate-800">
                            {rollResult}
                        </span>
                        <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">
                            Moves
                        </p>
                    </div>
                ) : (
                    <span className="text-4xl font-bold text-slate-300">?</span>
                )}
            </div>

            {rollResult === null ? (
                <button
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    className={`w-full py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all select-none
            ${isHolding ? "scale-95 bg-slate-800 shadow-none" : "bg-slate-900 hover:bg-slate-800 hover:-translate-y-1"}
          `}
                >
                    {isHolding ? "CHARGING..." : "HOLD TO ROLL"}
                </button>
            ) : (
                <button
                    onClick={handleEndTurn}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-lg font-bold transition-all active:scale-95 shadow-lg"
                >
                    End Turn
                </button>
            )}
        </div>
    );
}
