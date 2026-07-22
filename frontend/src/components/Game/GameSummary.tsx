export default function GameSummary({ summary, players, onClose }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-6 text-slate-800">
                    Game Over! 🏆
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    {["player_1", "player_2"].map((pId) => (
                        <div
                            key={pId}
                            className={`p-6 rounded-2xl ${pId === "player_1" ? "bg-emerald-50" : "bg-blue-50"}`}
                        >
                            <h3
                                className={`text-xl font-bold mb-2 ${pId === "player_1" ? "text-emerald-700" : "text-blue-700"}`}
                            >
                                {pId === "player_1" ? players.first : players.second}
                            </h3>
                            <p className="text-4xl font-black mb-4">
                                Score: {summary[pId].score}
                            </p>
                            <div className="text-sm">
                                <p className="font-bold text-slate-500 mb-1">Lands owned:</p>
                                <div className="flex flex-wrap gap-2">
                                    {summary[pId].lands.length > 0 ? (
                                        summary[pId].lands.map((l: string) => (
                                            <span
                                                key={l}
                                                className="px-2 py-1 bg-white rounded-lg shadow-sm text-xs font-medium"
                                            >
                                                {l}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No lands</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                    >
                        Exit to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
