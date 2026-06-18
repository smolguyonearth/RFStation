import { Layers, History, Trophy, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { GameSessionDetail } from "../types/pass.type";

const MOCK_SESSIONS: GameSessionDetail[] = [
    {
        game_id: 1,
        timestamp: "2024-06-10 · 14:32",
        win_player: "Inferno Blade",
        amount_of_players: 2,
        cards_played: [
            {
                id: "c1",
                type: "Attack",
                name: "Inferno Blade",
                description: "Deals 40 fire damage to all enemies.",
                playedBy: "Alice",
                playedAt: "14:35",
            },
            {
                id: "c2",
                type: "Defense",
                name: "Stone Shield",
                description: "Reduces incoming damage by 50% for 2 turns.",
                playedBy: "Bob",
                playedAt: "14:37",
            },
            {
                id: "c3",
                type: "Skill",
                name: "Wind Step",
                description: "Move to any position instantly.",
                playedBy: "Alice",
                playedAt: "14:40",
            },
        ],
    },
    {
        game_id: 2,
        timestamp: "2024-06-11 · 09:15",
        win_player: "Frost Nova",
        amount_of_players: 3,
        cards_played: [],
    },
    {
        game_id: 3,
        timestamp: "2024-06-12 · 20:05",
        win_player: "Thunder Spear",
        amount_of_players: 2,
        cards_played: [],
    },
];

export default function SelectionGameBoard() {
    const [activeSessionId, setActiveSessionId] = useState<number>(1);

    const activeSession =
        MOCK_SESSIONS.find((s) => s.game_id === activeSessionId) ||
        MOCK_SESSIONS[0];

    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white flex">
            {/* SIDEBAR */}
            <aside className="w-80 border-r border-white/10 backdrop-blur-xl bg-white/5 p-6 h-screen overflow-y-auto shrink-0">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">🎮 Game Sessions</h1>
                    <p className="text-zinc-400 text-sm mt-1">Browse previous matches</p>
                </div>

                <div className="space-y-3">
                    {MOCK_SESSIONS.map((session, idx) => {
                        const active = session.game_id === activeSessionId;
                        const color =
                            idx === 0
                                ? "bg-red-500"
                                : idx === 1
                                    ? "bg-blue-500"
                                    : "bg-emerald-500";

                        return (
                            <button
                                key={session.game_id}
                                onClick={() => setActiveSessionId(session.game_id)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${active
                                        ? "bg-linear-to-r from-violet-500/20 to-cyan-500/20 border-violet-500/40 shadow-lg shadow-violet-500/10"
                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Session #{session.game_id}</h3>
                                    <span className={`w-3 h-3 rounded-full ${color}`} />
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">
                                    {session.timestamp}
                                </p>
                                <p className="text-sm mt-3 text-zinc-300">
                                    🏆 {session.win_player}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-8 h-screen overflow-y-auto">
                {/* HERO */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-violet-400" />
                        <h1 className="text-4xl font-bold">Selection Game Board</h1>
                    </div>
                    <p className="text-zinc-400 mt-2">Session #{activeSession.game_id}</p>
                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Cards Played</span>
                            <Layers size={20} />
                        </div>
                        <h2 className="text-5xl font-bold mt-4">
                            {activeSession.cards_played.length}
                        </h2>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Players</span>
                            <Users size={20} />
                        </div>
                        <h2 className="text-5xl font-bold mt-4">
                            {activeSession.amount_of_players}
                        </h2>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Winner</span>
                            <Trophy size={20} className="text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold mt-4">
                            {activeSession.win_player}
                        </h2>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mb-8">
                    <button className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition flex items-center gap-2 font-medium">
                        <Layers size={18} />
                        Cards
                    </button>

                    <Link
                        to={`/activity-log`}
                        className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center gap-2 font-medium"
                    >
                        <History size={18} />
                        Timeline
                    </Link>
                </div>

                {/* CARDS */}
                {activeSession.cards_played.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center mt-6">
                        <Layers size={48} className="mx-auto mb-4 text-zinc-500" />
                        <h3 className="text-xl font-semibold">No cards played</h3>
                        <p className="text-zinc-400 mt-2">
                            This session has no recorded card history.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {activeSession.cards_played.map((card) => (
                            <div
                                key={card.id}
                                className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-violet-500/20 text-violet-300 border border-violet-500/20 mb-3">
                                        {card.type}
                                    </span>
                                    <h3 className="text-2xl font-bold mt-1">{card.name}</h3>
                                    <p className="text-zinc-400 mt-3 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <p className="text-sm text-zinc-500">
                                        Played by{" "}
                                        <span className="text-white font-medium">
                                            {card.playedBy}
                                        </span>
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1">{card.playedAt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
