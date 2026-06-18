export interface PlayerRanking {
    player_id: string;
    rank: number;
    name: string;
    avatar_url?: string;
    total_score: number;
    landmarks_conquered: number;
    longest_streak?: number;
    status: 'ACTIVE' | 'OFFLINE' | 'ELIMINATED';
    trend: 'UP' | 'DOWN' | 'SAME';
}