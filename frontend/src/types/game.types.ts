export type AppMode = 'IDLE' | 'MUSEUM' | 'GAME';
export type Language = 'EN' | 'TH' | 'DE';
export type GamePhase = 'INIT' | 'TURN' | 'BATTLE' | 'END';

export interface GameState {
    mode: AppMode;
    language: Language;
    gamePhase: GamePhase;
    currentPlayer: number;
    currentTurn: number;
    displayMatrix: number[][];
    pendingMatrix: number[][];
    battleContext: { row: number, col: number } | null;
    scores: { 1: number, 2: number };
    activeMuseumLocation: { row: number, col: number } | null;
}