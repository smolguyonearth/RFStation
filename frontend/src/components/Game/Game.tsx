import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapViewer from "@/components/Map/MapClaim";
import PowerDice from "@/components/Game/Dice/PowerDice";
import BattleModal from "@/components/Game/BattleModal";

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();

    // --- States ---
    const [landOwners, setLandOwners] = useState<Record<string, string>>({});
    const [currentPlayer, setCurrentPlayer] = useState<"player_1" | "player_2">(
        "player_1",
    );
    const [roundCount, setRoundCount] = useState(1);
    const [hasRolled, setHasRolled] = useState(false);
    const [hasActed, setHasActed] = useState(false);
    const [battleTarget, setBattleTarget] = useState<string | null>(null);

    const [showBattle, setShowBattle] = useState(false);
    const [battleData, setBattleData] = useState<{
        attacker: string;
        defender: string;
        landId: string;
    } | null>(null);

    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const { firstPlayer, secondPlayer } = location.state || {
        firstPlayer: "Player 1",
        secondPlayer: "Player 2",
    };

    // --- Game Logic ---

    // เตรียมข้อมูลสรุปผล (เรียกทุกครั้งที่ render)
    const getGameSummary = () => {
        const summary = {
            player_1: { lands: [] as string[], score: 0 },
            player_2: { lands: [] as string[], score: 0 },
        };
        Object.entries(landOwners).forEach(([landId, ownerId]) => {
            if (summary[ownerId as "player_1" | "player_2"]) {
                summary[ownerId as "player_1" | "player_2"].lands.push(landId);
                summary[ownerId as "player_1" | "player_2"].score += 5;
            }
        });
        return summary;
    };
    const summary = getGameSummary();

    const calculateWinner = () => {
        let p1Count = 0;
        let p2Count = 0;
        Object.values(landOwners).forEach((owner) => {
            if (owner === "player_1") p1Count++;
            if (owner === "player_2") p2Count++;
        });
        if (p1Count > p2Count) setWinner(firstPlayer);
        else if (p2Count > p1Count) setWinner(secondPlayer);
        else setWinner("Draw");
    };

    const handleRollComplete = (score: number) => {
        if (battleTarget) {
            if (score > 3) {
                setLandOwners((prev) => ({ ...prev, [battleTarget]: currentPlayer }));
            }
            setBattleTarget(null);
            setHasActed(true);
            return;
        }
        console.log(`${currentPlayer} rolled ${score}`);
        setHasRolled(true);
    };

    const handleEndTurn = () => {
        if (isGameOver) return;
        const nextPlayer = currentPlayer === "player_1" ? "player_2" : "player_1";

        if (nextPlayer === "player_1") {
            const nextRound = roundCount + 1;
            if (nextRound > 10) {
                calculateWinner();
                setIsGameOver(true);
                return;
            }
            setRoundCount(nextRound);
        }

        setCurrentPlayer(nextPlayer);
        setHasRolled(false);
        setHasActed(false);
        setBattleTarget(null);
    };

    const handleLandClick = (landId: string) => {
        if (!hasRolled || hasActed) return; // ล็อคการคลิก

        const owner = landOwners[landId];

        if (!owner) {
            setLandOwners((prev) => ({ ...prev, [landId]: currentPlayer }));
            setHasActed(true); // ล็อคทันทีเมื่อยึดได้
        } else if (owner !== currentPlayer) {
            setBattleData({
                attacker: currentPlayer,
                defender: owner,
                landId: landId,
            });
            setShowBattle(true);
        }
    };

    const handleBattleResult = (didWin: boolean) => {
        if (didWin && battleData) {
            setLandOwners((prev) => ({
                ...prev,
                [battleData.landId]: currentPlayer,
            }));
        }
        setHasActed(true); // ล็อคทันทีหลังจบ Battle
        setShowBattle(false);
    };

    const handleExit = () => {
        if (window.confirm("Do you really want to exit? Progress will be lost.")) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col items-center">
            <div className="w-full max-w-[1800px] flex flex-col gap-4 flex-1">
                <div className="flex flex-col lg:flex-row items-stretch justify-center w-full h-[85vh] min-h-[650px] bg-pink-100 rounded-[2.5rem] overflow-hidden p-4 md:p-6 gap-6 shadow-sm">
                    <div className="flex-1 bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-pink-200 flex items-center justify-center overflow-hidden">
                        <MapViewer landOwners={landOwners} onLandClick={handleLandClick} />
                    </div>

                    <div className="w-full lg:w-[420px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto pb-2 pr-2">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-lg font-bold text-slate-700">
                                    Players Status
                                </h2>
                                <div className="px-3 py-1 bg-pink-100 text-pink-600 font-bold text-sm rounded-full">
                                    Round: {roundCount}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className={`p-4 rounded-xl ${currentPlayer === "player_1" ? "bg-blue-50 border-2 border-blue-400" : "bg-slate-50 opacity-60"}`}
                                >
                                    <span className="text-xl font-black text-blue-700">
                                        {firstPlayer}
                                    </span>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${currentPlayer === "player_2" ? "bg-emerald-50 border-2 border-emerald-400" : "bg-slate-50 opacity-60"}`}
                                >
                                    <span className="text-xl font-black text-emerald-700">
                                        {secondPlayer}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <PowerDice
                            currentPlayer={
                                currentPlayer === "player_1" ? firstPlayer : secondPlayer
                            }
                            onRollComplete={handleRollComplete}
                            onEndTurn={handleEndTurn}
                        />

                        <button
                            onClick={handleExit}
                            className="px-5 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 shadow-sm"
                        >
                            Exit Game
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}
            {showBattle && battleData && (
                <BattleModal
                    attackerName={battleData.attacker}
                    defenderName={battleData.defender}
                    onClose={handleBattleResult}
                />
            )}

            {isGameOver && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
                        <h2 className="text-4xl font-black text-slate-800 mb-6 text-center">
                            Game Over!
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-blue-50 p-6 rounded-2xl">
                                <h3 className="font-bold text-blue-700">{firstPlayer}</h3>
                                <p className="text-3xl font-black">
                                    Score: {summary.player_1.score}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {summary.player_1.lands.map((l) => (
                                        <span key={l} className="bg-white px-2 rounded text-[10px]">
                                            {l}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-6 rounded-2xl">
                                <h3 className="font-bold text-emerald-700">{secondPlayer}</h3>
                                <p className="text-3xl font-black">
                                    Score: {summary.player_2.score}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {summary.player_2.lands.map((l) => (
                                        <span key={l} className="bg-white px-2 rounded text-[10px]">
                                            {l}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
