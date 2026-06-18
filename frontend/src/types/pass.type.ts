export interface PassSessionSummary {
    game_id: number;
    timestamp: string;
    win_player: string;
    amount_of_players: number;
}

export interface PlayedCard {
    id: string;
    type: 'Attack' | 'Defense' | 'Skill';
    name: string;
    description: string;
    playedBy: string;
    playedAt: string;
}

export interface GameSessionDetail extends PassSessionSummary {
    cards_played: PlayedCard[];
}