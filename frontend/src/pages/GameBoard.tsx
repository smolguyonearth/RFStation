import { useState, useRef } from "react";
import type { GameSession } from "../types/game.types";
import { gameSessions } from "../data/game.mock";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function GameBoard() {
    const [gameSession] = useState<GameSession>(gameSessions[0]);
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayAudio = (spaceId: string, audioUrl: string) => {
        if (currentPlayingId === spaceId && audioRef.current) {
            audioRef.current.pause();
            setCurrentPlayingId(null);
            return;
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = new Audio(audioUrl);
        setCurrentPlayingId(spaceId);
        audioRef.current.play().catch((error) => {
            console.error("Audio playback failed:", error);
            setCurrentPlayingId(null);
        });

        audioRef.current.onended = () => {
            setCurrentPlayingId(null);
        };
    };

    const currentPlayer = gameSession.players.find(
        (p) => p.player_id === gameSession.current_player_id,
    );

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-bg-main font-sans antialiased text-text-main">
            <header className="border border-purple-100 dark:border-nav-border bg-purple-50 dark:bg-nav-bg sticky top-0 z-50 shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 bg-linear-to-tr from-pink-500 dark:from-brand to-pink-200 dark:to-brand-light rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-brand/20">
                            M
                        </div>
                        <div>
                            <span className="font-bold text-lg text-black dark:text-text-main">
                                MoSCoW Interactive Board Game
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium tracking-wider uppercase">
                                KMUTT & University of Bremen Internship Project
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-audio-success animate-pulse" />
                            <span className="text-xs text-audio-success font-medium">
                                RSSI Receiver Online
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-boardgame-card text-black dark:text-text-main border border-purple-100 dark:border-nav-border rounded-2xl shadow-xs">
                        <div className="flex justify-between items-center bg-purple-50 dark:bg-nav-bg border border-purple-100 dark:border-nav-border p-4 rounded-xl">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Game Console
                                </h1>
                                <p className="text-sm text-slate-500">
                                    ID: {gameSession.game_id}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full text-xs font-semibold">
                                    STATUS: {gameSession.status}
                                </span>
                                <p className="text-lg font-medium mt-1 text-slate-500">
                                    Turn: {gameSession.current_turn}
                                </p>
                            </div>
                        </div>

                        {currentPlayer && (
                            <div className="bg-pink-500/10 dark:bg-brand/10 border border-pink-500 dark:border-brand/25 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-brand font-bold">
                                        Current Turn
                                    </p>
                                    <h2 className="text-xl font-semibold">
                                        {currentPlayer.name} is thinking...
                                    </h2>
                                </div>
                                <div className="text-sm bg-brand text-white px-3 py-1 rounded-md font-medium">
                                    Position: {currentPlayer.current_position}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 bg-purple-50 dark:bg-nav-bg border border-purple-100 dark:border-nav-border p-4 rounded-xl space-y-4">
                                <h3 className="text-lg font-bold border-b border-purple-100 dark:border-nav-border pb-2">
                                    Players List
                                </h3>
                                <div className="space-y-3">
                                    {gameSession.players.map((player) => (
                                        <div
                                            key={player.player_id}
                                            className={`p-3 rounded-lg border transition-all ${player.player_id === gameSession.current_player_id
                                                    ? "bg-white dark:bg-boardgame-card border-pink-500 shadow-md shadow-brand/10 ring-1 ring-pink-500"
                                                    : "bg-white/60 dark:bg-boardgame-card/60 border-purple-100 dark:border-nav-border"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span
                                                    className={`font-semibold ${player.player_id === gameSession.current_player_id ? "text-pink-500" : "text-white dark:text-text-main"}`}
                                                >
                                                    {player.name}
                                                </span>
                                                <span className="text-xs bg-slate-100 dark:bg-bg-muted px-2 py-0.5 rounded text-slate-500 font-medium">
                                                    Score: {player.score_or_conquest_count}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-2 space-y-1">
                                                <p>📍 Position: {player.current_position}</p>
                                                <p>
                                                    👣 Visited:{" "}
                                                    {player.visited_spaces.join(", ") || "None"}
                                                </p>
                                                <p>
                                                    🏁 Started:{" "}
                                                    {player.has_chosen_start ? (
                                                        <span className="text-emerald-500 dark:text-audio-success font-bold">
                                                            ✅ Ready
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500 dark:text-audio-peak font-medium">
                                                            ❌ Pending
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-purple-50 dark:bg-nav-bg border border-purple-100 dark:border-nav-border p-4 rounded-xl space-y-4">
                                <h3 className="text-lg font-bold border-b border-purple-100 dark:border-nav-border pb-2">
                                    Active Board Spaces
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {gameSession.board_spaces.map((space) => (
                                        <Card
                                            key={space.space_id}
                                            className="border-purple-100 dark:border-nav-border bg-white dark:bg-boardgame-card shadow-xs"
                                        >
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-base font-bold text-black dark:text-text-main">
                                                    {space.landmark_name}
                                                </CardTitle>
                                                <Badge
                                                    className={
                                                        space.city === "Bangkok"
                                                            ? "bg-pink-500/10 dark:bg-brand/10 text-brand border-none shadow-none"
                                                            : "bg-pink-200/10 dark:bg-brand/20 text-pink-500 dark:text-brand-dark border-none shadow-none"
                                                    }
                                                >
                                                    {space.city}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        ID: {space.space_id}
                                                    </span>
                                                    <Button
                                                        onClick={() =>
                                                            handlePlayAudio(
                                                                space.space_id,
                                                                space.audio_asset_url,
                                                            )
                                                        }
                                                        className={`transition-colors duration-300 cursor-pointer ${currentPlayingId === space.space_id
                                                                ? "bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold animate-pulse shadow-lg shadow-amber-400/20"
                                                                : "bg-brand hover:bg-brand-dark text-white shadow-sm"
                                                            }`}
                                                    >
                                                        {currentPlayingId === space.space_id
                                                            ? "⏸️ Pause"
                                                            : "🎵 Play"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
