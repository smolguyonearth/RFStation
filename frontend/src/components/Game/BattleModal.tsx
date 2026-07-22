import { useState, useEffect } from "react";
import Dice from "@/components/Game/Dice/Dice";

interface BattleModalProps {
    attackerName: string;
    defenderName: string;
    onClose: (didWin: boolean) => void;
}

export default function BattleModal({
    attackerName,
    defenderName,
    onClose,
}: BattleModalProps) {
    const [rolls, setRolls] = useState({ attacker: 0, defender: 0 });
    const [turn, setTurn] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [winner, setWinner] = useState<"attacker" | "defender" | "tie" | null>(
        null,
    );

    const handleRoll = () => {
        if (isRolling) return;
        setIsRolling(true);

        setTimeout(() => {
            const result = Math.floor(Math.random() * 8) + 1; // D8
            if (turn === 1) {
                setRolls((prev) => ({ ...prev, attacker: result }));
                setTurn(2);
            } else {
                setRolls((prev) => ({ ...prev, defender: result }));
                setTurn(0);
            }
            setIsRolling(false);
        }, 600);
    };

    const handleReRoll = () => {
        setRolls({ attacker: 0, defender: 0 });
        setTurn(1);
        setWinner(null);
        setIsRolling(false);
    };

    useEffect(() => {
        if (turn !== 0) return;

        if (rolls.attacker > rolls.defender) {
            setWinner("attacker");
        } else if (rolls.defender > rolls.attacker) {
            setWinner("defender");
        } else {
            setWinner("tie");
        }
    }, [turn, rolls]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                <h2 className="text-2xl font-black text-center mb-6 text-slate-800">
                    ⚔️ Battle! ⚔️
                </h2>
                <div className="flex justify-center items-center gap-8 mb-8">
                    {/* Attacker */}
                    <div className="flex flex-col items-center gap-2">
                        <span className={`text-sm ${attackerName === "player_1" ? "text-blue-600" : "text-emerald-600"}`}>
                            Attacker
                        </span>
                        <Dice
                            value={rolls.attacker}
                            isRolling={isRolling && turn === 1}
                        />
                    </div>
                    <span className="font-black text-slate-300 text-xl">VS</span>
                    {/* Defender */}
                    <div className="flex flex-col items-center gap-2">
                        <span
                            className={`text-sm ${defenderName === "player_1" ? "text-blue-600" : "text-emerald-600"}`}
                        >
                            Defender
                        </span>
                        <Dice
                            value={rolls.defender}
                            isRolling={isRolling && turn === 2}
                        />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black mb-4">
                        {/* Tie  */}
                        {winner === null
                            ? turn === 1
                                ? `Attacker's Turn`
                                : `Defender's Turn`
                            : winner === "tie"
                                ? "It's a Tie!"
                                : winner === "attacker"
                                    ? "You Won!"
                                    : "You Lost!"}
                    </p>
                    {winner === null ? (
                        <button
                            onClick={handleRoll}
                            disabled={isRolling}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                        >
                            {turn === 1 ? `Attacker's Roll` : `Defender's Roll`}
                        </button>
                    ) : winner === "tie" ? (
                        <button
                            onClick={handleReRoll}
                            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                        >
                            Re-Roll
                        </button>
                    ) : (
                        <button
                            onClick={() => onClose(winner === "attacker")}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
