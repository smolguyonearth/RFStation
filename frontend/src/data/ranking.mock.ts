import type { PlayerRanking } from '../types/ranking.types';

export const mockRankings: PlayerRanking[] = [
    {
        player_id: "player_01",
        rank: 1,
        name: "Alice (KMUTT)",
        total_score: 1250,
        landmarks_conquered: 8,
        longest_streak: 3,
        status: 'ACTIVE',
        trend: 'UP'
    },
    {
        player_id: "player_02",
        rank: 2,
        name: "Bob (Bremen)",
        total_score: 980,
        landmarks_conquered: 5,
        longest_streak: 2,
        status: 'ACTIVE',
        trend: 'DOWN'
    },
    {
        player_id: "player_03",
        rank: 3,
        name: "Charlie (KMUTT)",
        total_score: 450,
        landmarks_conquered: 2,
        longest_streak: 1,
        status: 'ELIMINATED',
        trend: 'SAME'
    }
];