export interface PlayerState {
    player_id: string;
    name: string;
    current_position: string;
    has_chosen_start: boolean;
    visited_spaces: string[];
    score_or_conquest_count: number;
}

export interface BoardSpace {
    space_id: string;
    landmark_name: string;
    city: 'Bremen' | 'Bangkok' | 'Shared';
    is_empty: boolean;
    occupant_id: string | null;
    connected_paths: string[];
    audio_asset_url: string;
}

export interface GameSession {
    game_id: string;
    status: 'START' | 'IN_PROGRESS' | 'END';
    current_turn: number;
    current_player_id: string;
    winner_id: string | null;
    board_spaces: BoardSpace[];
    players: PlayerState[];
}

export type GameActionType = 
    | 'GAME_START'
    | 'CHOOSE_START_SPACE'
    | 'MOVE_PLAYER'
    | 'CONQUER_LANDMARK'
    | 'PLAY_AUDIO'
    | 'PLAY_CARD'
    | 'CHANGE_TURN'
    | 'GAME_END'
    | 'HARDWARE_ERROR'
    | 'BATTLE'
    | 'SYSTEM_MESSAGE';

export interface ActionDetails {
    from_space_id?: string;
    to_space_id?: string;
    landmark_name?: string;
    city?: 'Bremen' | 'Bangkok' | 'Shared'; 
    score_change?: number;
    audio_played?: string;
    display_message: string;
}

export interface ActivityLog {
    log_id: string;
    game_id: string;
    turn_number: number;
    timestamp: string;
    actor_id: string | 'SYSTEM';
    action_type: GameActionType;
    details: ActionDetails;
    status: 'SUCCESS' | 'REJECTED' | 'ERROR';
}