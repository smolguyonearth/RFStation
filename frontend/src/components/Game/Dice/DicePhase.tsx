import { useState, useEffect } from "react";
import Dice from "@/components/Game/Dice/Dice"
import { useNavigate } from "react-router-dom";


export default function DicePhase() {
  const [players, setPlayers] = useState({ p1: "Player 1", p2: "Player 2" });
  const [rolls, setRolls] = useState({ p1: 0, p2: 0 });
  const [turn, setTurn] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<"p1" | "p2" | "tie" | null>(null);
  const navigate = useNavigate();

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;

      if (turn === 1) {
        setRolls((prev) => ({ ...prev, p1: result }));
        setTurn(2);
      } else if (turn === 2) {
        setRolls((prev) => ({ ...prev, p2: result }));
        setTurn(0);
      }
      setIsRolling(false);
    }, 600);
  };



  useEffect(() => {
    if (turn === 0 && rolls.p1 > 0 && rolls.p2 > 0) {
      if (rolls.p1 > rolls.p2) {
        setWinner("p1");
      } else if (rolls.p2 > rolls.p1) {
        setWinner("p2");
      } else {
        setWinner("tie");
      }
    }
  }, [rolls, turn]);

  // const resetGame = () => {
  //   setRolls({ p1: 0, p2: 0 });
  //   setTurn(1);
  //   setWinner(null);
  // };

  const handleStartGame = () => {
    if (winner === "p1") {
      navigate("/game", {
        state: { firstPlayer: players.p1, secondPlayer: players.p2 },
      });
    } else if (winner === "p2") {
      navigate("/game", {
        state: { firstPlayer: players.p2, secondPlayer: players.p1 },
      });
    }
  };

  const handleReRoll = () => {
    setRolls({ p1: 0, p2: 0 });
    setTurn(1);
    setWinner(null);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col items-center z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-900">
            Who Goes First?
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Roll the highest number to start the game.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full mb-16">
          {/* Player 1 */}
          <div
            className={`flex flex-col items-center gap-6 p-8 rounded-3xl transition-all duration-500 ${turn === 1 && !winner
                ? "bg-blue-50/50 shadow-[inset_0_0_0_2px_rgba(59,130,246,0.2)] scale-105"
                : "bg-transparent scale-100 opacity-80"
              }`}
          >
            <input
              type="text"
              value={players.p1}
              onChange={(e) => setPlayers({ ...players, p1: e.target.value })}
              className="text-2xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 outline-none w-40 pb-1 transition-colors"
            />
            <Dice value={rolls.p1} isRolling={isRolling && turn === 1} />
            <div className="h-6">
              {turn === 1 && !winner && (
                <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase animate-pulse">
                  Waiting to roll...
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-inner">
              <span className="text-xl font-black text-slate-300">VS</span>
            </div>
          </div>

          {/* Player 2 */}
          <div
            className={`flex flex-col items-center gap-6 p-8 rounded-3xl transition-all duration-500 ${turn === 2 && !winner
                ? "bg-emerald-50/50 shadow-[inset_0_0_0_2px_rgba(16,185,129,0.2)] scale-105"
                : "bg-transparent scale-100 opacity-80"
              }`}
          >
            <input
              type="text"
              value={players.p2}
              onChange={(e) => setPlayers({ ...players, p2: e.target.value })}
              className="text-2xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none w-40 pb-1 transition-colors"
            />
            <Dice value={rolls.p2} isRolling={isRolling && turn === 2} />
            <div className="h-6">
              {turn === 2 && !winner && (
                <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase animate-pulse">
                  Waiting to roll...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-24">
          {!winner && (
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className={`px-10 py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all active:scale-95
                    ${turn === 1
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                }
                    ${isRolling
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:-translate-y-1"
                }
                  `}
            >
              {isRolling
                ? "Rolling..."
                : `Roll for ${turn === 1 ? players.p1 : players.p2}`}
            </button>
          )}

          {winner === "tie" && (
            <div className="text-center animate-fade-in">
              <h2 className="text-3xl font-black text-amber-500 mb-5">
                It's a Tie!
              </h2>
              <button
                onClick={handleReRoll}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition-all hover:-translate-y-1"
              >
                Re-Roll Now
              </button>
            </div>
          )}

          {(winner === "p1" || winner === "p2") && (
            <div className="text-center animate-fade-in flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                🎉{" "}
                <span
                  className={
                    winner === "p1" ? "text-blue-600" : "text-emerald-600"
                  }
                >
                  {winner === "p1" ? players.p1 : players.p2}
                </span>{" "}
                goes first!
              </h2>

              <div className="flex gap-4">
                <button
                  onClick={handleStartGame}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg"
                >
                  Start Game
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
