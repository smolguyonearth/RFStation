import Footer from './Footer'
import { mockRankings } from '../data/ranking.mock'

const getRankColors = (rank: number) => {
    switch (rank) {
        case 1:
            return 'bg-[#fef08a] text-[#854d0e] border-[#fde047] dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50'
        case 2:
            return 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        case 3:
            return 'bg-[#ffedd5] text-[#9a3412] border-[#fdba74] dark:bg-orange-900/30 dark:text-orange-500 dark:border-orange-800/50'
        default:
            return 'bg-[#fff0f6] text-[#9d174d] border-[#fce7f3] dark:bg-[#1e293b] dark:text-slate-400 dark:border-slate-800'
    }
}

const getMedalIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return '🥇'
        case 2:
            return '🥈'
        case 3:
            return '🥉'
        default:
            return `#${rank}`
    }
}

const getPlayerAccentColor = (playerId: string) => {
    if (playerId === 'player_01') return 'bg-[#bfdbfe] dark:bg-blue-500'
    if (playerId === 'player_02') return 'bg-[#fbcfe8] dark:bg-rose-500'
    if (playerId === 'player_03') return 'bg-[#a7f3d0] dark:bg-emerald-500'
    return 'bg-[#e2e8f0] dark:bg-slate-500'
}

export default function RankingBoard() {
    const sortedRankings = [...mockRankings].sort(
        (a, b) => b.total_score - a.total_score
    )

    return (
        <div className='min-h-screen flex flex-col bg-[#fcf8f9] dark:bg-[#0b0f19] transition-colors duration-300 font-sans'>
            <main className='flex-1 w-full max-w-4xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <div className='flex flex-col mb-8 border-b border-[#fbcfe8] dark:border-slate-800 pb-6 text-center sm:text-left'>
                    <h1 className='text-4xl font-extrabold tracking-tight bg-linear-to-r from-[#ec4899] to-[#8b5cf6] dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent inline-block mb-2'>
                        Global Leaderboard
                    </h1>
                    <p className='text-[#64748b] dark:text-slate-400 text-sm'>
                        Current standings for the MoSCoW Board Game tournament.
                    </p>
                </div>

                {/* Ranking List */}
                <div className='flex flex-col gap-4 pb-12'>
                    <div className='hidden sm:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wider'>
                        <div className='col-span-1 text-center'>Rank</div>
                        <div className='col-span-5'>Player</div>
                        <div className='col-span-3 text-center'>Landmarks</div>
                        <div className='col-span-3 text-right'>Total Score</div>
                    </div>

                    {sortedRankings.map(player => (
                        <div
                            key={player.player_id}
                            className={`w-full relative bg-white dark:bg-[#161f30] border ${player.rank === 1
                                    ? 'border-[#fbcfe8] dark:border-amber-500/50 shadow-[0_4px_20px_-4px_rgba(236,72,153,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.1)] z-10'
                                    : 'border-[#f3e8ff] dark:border-slate-800 shadow-sm'
                                } rounded-xl overflow-hidden flex flex-col sm:flex-row items-center transition-all duration-200 hover:bg-[#fff0f6]/50 dark:hover:bg-[#1a2235] hover:-translate-y-1 hover:shadow-md`}
                        >
                            {/* Color Accent Bar */}
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-1.5 ${getPlayerAccentColor(
                                    player.player_id
                                )}`}
                            ></div>

                            <div className='w-full grid grid-cols-1 sm:grid-cols-12 gap-4 p-5 sm:p-4 items-center'>
                                {/* 1. Rank Badge */}
                                <div className='col-span-1 flex justify-center order-1 sm:order-0'>
                                    <div
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-black shadow-sm ${getRankColors(
                                            player.rank
                                        )}`}
                                    >
                                        {getMedalIcon(player.rank)}
                                    </div>
                                </div>

                                {/* 2. Player Info */}
                                <div className='col-span-5 flex items-center justify-center sm:justify-start gap-4 order-2 sm:order-0'>
                                    {/* Trend Indicator */}
                                    <div className='hidden sm:flex flex-col items-center justify-center w-4'>
                                        {player.trend === 'UP' && (
                                            <span className='text-[#10b981] dark:text-emerald-500 text-xs'>
                                                ▲
                                            </span>
                                        )}
                                        {player.trend === 'DOWN' && (
                                            <span className='text-[#f43f5e] dark:text-rose-500 text-xs'>
                                                ▼
                                            </span>
                                        )}
                                        {player.trend === 'SAME' && (
                                            <span className='text-[#94a3b8] dark:text-slate-500 text-xs'>
                                                -
                                            </span>
                                        )}
                                    </div>

                                    <div className='flex flex-col items-center sm:items-start text-center sm:text-left'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-base font-bold text-[#3f313a] dark:text-slate-100'>
                                                {player.name}
                                            </span>
                                            {player.status === 'ELIMINATED' && (
                                                <span className='text-[10px] bg-[#ffe4e6] text-[#9f1239] border border-[#fecdd3] dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 px-2 py-0.5 rounded uppercase tracking-wider font-semibold'>
                                                    Eliminated
                                                </span>
                                            )}
                                        </div>
                                        <span className='text-xs text-[#64748b] dark:text-slate-500 font-mono mt-0.5'>
                                            ID: {player.player_id}
                                        </span>
                                    </div>
                                </div>

                                {/* 3. Landmarks Conquered */}
                                <div className='col-span-3 flex flex-col items-center justify-center border-t border-b sm:border-y-0 border-[#fce7f3] dark:border-slate-800 py-3 sm:py-0 order-4 sm:order-0 w-full'>
                                    <span className='text-[10px] sm:hidden font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wider mb-1'>
                                        Landmarks
                                    </span>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg grayscale opacity-80'>🚩</span>
                                        <span className='text-lg font-semibold text-[#475569] dark:text-slate-300'>
                                            {player.landmarks_conquered}
                                        </span>
                                    </div>
                                </div>

                                {/* 4. Total Score (Highlight) */}
                                <div className='col-span-3 flex flex-col items-center sm:items-end justify-center order-3 sm:order-0 w-full'>
                                    <span className='text-[10px] sm:hidden font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wider mb-1'>
                                        Score
                                    </span>
                                    <div className='bg-[#f8f5ff] dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-[#f3e8ff] dark:border-slate-800 flex items-baseline gap-1.5 w-full sm:w-auto justify-center sm:justify-end'>
                                        <span
                                            className={`text-2xl font-black tracking-tight ${player.rank === 1
                                                    ? 'text-[#ec4899] dark:text-amber-400'
                                                    : 'text-[#be185d] dark:text-emerald-400'
                                                }`}
                                        >
                                            {player.total_score.toLocaleString()}
                                        </span>
                                        <span className='text-xs font-medium text-[#94a3b8] dark:text-slate-500 uppercase'>
                                            PTS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
