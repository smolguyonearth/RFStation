import { useState } from "react";
import {
    Users,
    History,
    PlayCircle,
    RotateCcw,
    Award,
    ChevronRight,
} from "lucide-react";

export default function App() {
    const [activePlayer] = useState("Soe");

    // Data for 2 players
    const players = [
        { id: 1, name: "Soe", score: 1040, color: "bg-pink-500" },
        { id: 2, name: "Jonh", score: 980, color: "bg-orange-500" },
    ];

    const gameHistory = [
        { id: 1, winner: "Soe", date: "20-6-26 . 14:20" },
        { id: 2, winner: "Jonh", date: "20-6-26 . 14:25" },
        { id: 3, winner: "Soe", date: "20-6-26 . 14:30" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-pink-500 text-white p-2 rounded-lg">
                        <Users size={20} />
                    </span>
                    MoSCoW Board Game
                </h1>
                <button className="bg-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition">
                    Sign In
                </button>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                { }
                <section className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <PlayCircle className="text-pink-500" size={28} />
                            <h2 className="text-xl font-semibold">Live Game</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-500">Turn</p>
                                <p className="text-2xl font-bold">#64</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-500">Round</p>
                                <p className="text-2xl font-bold">7/8</p>
                            </div>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 mb-6">
                            <p className="text-sm text-pink-600 font-medium mb-1">
                                Active Turn
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <span className="font-semibold text-lg">
                                    {activePlayer} is making a move...
                                </span>
                            </div>
                        </div>

                        { }
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Player Rankings
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="relative flex flex-col items-center p-4 bg-white border rounded-2xl shadow-sm hover:border-pink-200 transition"
                                    >
                                        <div
                                            className={`${player.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3`}
                                        >
                                            {player.name[0]}
                                        </div>
                                        <h4 className="font-bold text-lg">{player.name}</h4>
                                        <p className="text-2xl font-black text-gray-800">
                                            {player.score}
                                        </p>
                                        <div className="mt-2 text-xs text-gray-400">PTS</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                { }
                <section className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <History className="text-gray-400" size={24} /> Game Session
                            </h2>
                            <button className="text-gray-400 hover:text-pink-500 transition">
                                <RotateCcw size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {gameHistory.map((game) => (
                                <div
                                    key={game.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <Award className="text-yellow-500" size={24} />
                                        <div>
                                            <p className="font-semibold">{game.winner} won</p>
                                            <p className="text-xs text-gray-500">
                                                Session #{String(game.id).padStart(3, "0")}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">{game.date}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-3 text-sm text-gray-500 hover:text-pink-500 font-medium border-t flex items-center justify-center gap-2">
                            View Full History <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
