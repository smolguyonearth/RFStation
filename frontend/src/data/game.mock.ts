import type { GameSession, PlayerState, ActivityLog } from '../types/game.types';

export const mockPlayersGame1: PlayerState[] = [
    {
        player_id: "player_01",
        name: "Alice (KMUTT)",
        current_position: "space_01",
        has_chosen_start: true,
        visited_spaces: ["space_01", "space_02"],
        score_or_conquest_count: 5
    },
    {
        player_id: "player_02",
        name: "Bob (Bremen)",
        current_position: "space_03",
        has_chosen_start: true,
        visited_spaces: ["space_03"],
        score_or_conquest_count: 3
    },
    {
        player_id: "player_03",
        name: "Charlie (KMUTT)",
        current_position: "space_02",
        has_chosen_start: false,
        visited_spaces: [],
        score_or_conquest_count: 0
    }
];

export const mockPlayersGame2: PlayerState[] = [
    {
        player_id: "player_01",
        name: "Alice (KMUTT)",
        current_position: "space_02",
        has_chosen_start: true,
        visited_spaces: ["space_01", "space_02", "space_03"],
        score_or_conquest_count: 20
    },
    {
        player_id: "player_02",
        name: "Bob (Bremen)",
        current_position: "space_01",
        has_chosen_start: true,
        visited_spaces: ["space_01", "space_03"],
        score_or_conquest_count: 10
    }
];

export const gameSessions: GameSession[] = [
    {
        game_id: "Game_01",
        status: "IN_PROGRESS",
        current_turn: 3,
        current_player_id: "player_01",
        winner_id: null,
        board_spaces: [
            {
                space_id: "space_01",
                landmark_name: "Weser River & Chao Phraya Conjunction",
                city: "Shared",
                is_empty: false,
                occupant_id: "player_01",
                connected_paths: ["space_02", "space_03"],
                audio_asset_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
            },
            {
                space_id: "space_02",
                landmark_name: "Grand Palace (Bangkok)",
                city: "Bangkok",
                is_empty: false,
                occupant_id: "player_01",
                connected_paths: ["space_01"],
                audio_asset_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                space_id: "space_03",
                landmark_name: "Bremen Town Musicians Statue",
                city: "Bremen",
                is_empty: false,
                occupant_id: "player_02",
                connected_paths: ["space_01"],
                audio_asset_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            }
        ],
        players: mockPlayersGame1
    },
    {
        game_id: "Game_02",
        status: "END",
        current_turn: 15,
        current_player_id: "player_01",
        winner_id: "player_01", 
        board_spaces: [],
        players: mockPlayersGame2
    }
];

export const mockActivityLogs: ActivityLog[] = [
    {
        log_id: "log_101",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:15:00.000Z",
        actor_id: "player_01",
        action_type: "MOVE_PLAYER",
        details: {
            to_space_id: "space_01",
            display_message: "Alice (KMUTT) moved to space 01"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_102",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:15:20.000Z",
        actor_id: "player_01",
        action_type: "PLAY_CARD",
        details: {
            score_change: 10,
            display_message: "Alice (KMUTT) drew the 'WFH Card' action card and completed the task successfully, earning 10 points"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_103",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:15:30.000Z",
        actor_id: "SYSTEM",
        action_type: "CHANGE_TURN",
        details: {
            display_message: "End of Alice's turn, change to Bob's turn"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_104",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:16:00.000Z",
        actor_id: "player_02",
        action_type: "MOVE_PLAYER",
        details: {
            to_space_id: "space_02",
            display_message: "Bob (Bremen) moved to space 02 (empty space)"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_105",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:16:15.000Z",
        actor_id: "player_02",
        action_type: "CONQUER_LANDMARK",
        details: {
            to_space_id: "space_02",
            display_message: "Bob (Bremen) conquered space 02 successfully"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_106",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:16:25.000Z",
        actor_id: "SYSTEM",
        action_type: "CHANGE_TURN",
        details: {
            display_message: "End of Bob's turn, change to Charlie's turn"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_107",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:17:00.000Z",
        actor_id: "player_03",
        action_type: "MOVE_PLAYER",
        details: {
            to_space_id: "space_02",
            display_message: "Charlie (KMUTT) moved to space 02 (occupied by Bob)"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_108",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:17:30.000Z",
        actor_id: "player_03",
        action_type: "BATTLE",
        details: {
            display_message: "Charlie (KMUTT) fought against Bob (Bremen) and lost"
        },
        status: "REJECTED"
    },
    {
        log_id: "log_109",
        game_id: "Game_01",
        turn_number: 1,
        timestamp: "2026-06-15T09:17:40.000Z",
        actor_id: "SYSTEM",
        action_type: "CHANGE_TURN",
        details: {
            display_message: "End of Charlie's turn, back to Alice's turn"
        },
        status: "SUCCESS"
    },

    // ---------------- LOGS ของ Game_02 ----------------
    {
        log_id: "log_201",
        game_id: "Game_02",
        turn_number: 14,
        timestamp: "2026-06-14T14:20:00.000Z",
        actor_id: "player_01",
        action_type: "MOVE_PLAYER",
        details: {
            to_space_id: "space_02",
            display_message: "Alice (KMUTT) moved to Grand Palace (Bangkok)"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_202",
        game_id: "Game_02",
        turn_number: 14,
        timestamp: "2026-06-14T14:22:00.000Z",
        actor_id: "player_01",
        action_type: "CONQUER_LANDMARK",
        details: {
            score_change: 20,
            display_message: "Alice (KMUTT) conquered the final landmark and reached 20 points!"
        },
        status: "SUCCESS"
    },
    {
        log_id: "log_203",
        game_id: "Game_02",
        turn_number: 15,
        timestamp: "2026-06-14T14:25:00.000Z",
        actor_id: "SYSTEM",
        action_type: "GAME_END",
        details: {
            display_message: "Game Over! Alice (KMUTT) has won the game by conquering all landmarks."
        },
        status: "SUCCESS"
    }
];