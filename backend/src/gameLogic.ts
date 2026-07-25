export type AppMode = 'IDLE' | 'MUSEUM' | 'GAME';
export type Language = 'EN' | 'TH' | 'DE';
export type GamePhase = 'INIT' | 'TURN' | 'BATTLE' | 'END';
export type GameState = 'setup' | 'playing' | 'battle' | 'game_over';

export class GameLogic {
  mode: AppMode = 'IDLE';
  language: Language = 'EN';
  gamePhase: GamePhase = 'INIT';
  currentPlayer: number = 1;
  currentTurn: number = 1;
  turnsLeft: number = 10;
  turnPhase: number = 0;
  matrix: number[][] = Array(2).fill(0).map(() => Array(3).fill(0));
  battleContext: { row: number, col: number, attacker: number, defender: number } | null = null;
  scores = { 1: 0, 2: 0 };
  activeMuseumLocation: { row: number, col: number } | null = null;
  introActive: boolean = false;

  state: GameState = 'setup'; // Keep backward compatibility for the old /game page
  p1ClaimHistory: { row: number, col: number }[] = [];
  p2ClaimHistory: { row: number, col: number }[] = [];

  recordClaim(row: number, col: number, player: number) {
    if (player === 1) {
      this.p1ClaimHistory = this.p1ClaimHistory.filter(c => !(c.row === row && c.col === col));
      this.p1ClaimHistory.push({ row, col });
    } else if (player === 2) {
      this.p2ClaimHistory = this.p2ClaimHistory.filter(c => !(c.row === row && c.col === col));
      this.p2ClaimHistory.push({ row, col });
    }
  }

  setMode(mode: AppMode, language?: Language) {
    this.mode = mode;
    if (language) {
      this.language = language;
    }

    if (mode === 'GAME') {
      this.gamePhase = 'INIT';
      this.state = 'playing';
      this.matrix = Array(2).fill(0).map(() => Array(3).fill(0));
      this.scores = { 1: 0, 2: 0 };
      this.currentTurn = 1;
      this.turnsLeft = 10;
      this.turnPhase = 0;
      this.battleContext = null;
      this.activeMuseumLocation = null;
      this.p1ClaimHistory = [];
      this.p2ClaimHistory = [];
      this.introActive = true;
    } else if (mode === 'MUSEUM') {
      this.activeMuseumLocation = null;
      this.state = 'setup';
      this.introActive = false;
    } else {
      this.state = 'setup';
      this.activeMuseumLocation = null;
      this.introActive = false;
    }
  }

  startGame(startingPlayer: number) {
    this.mode = 'GAME';
    this.gamePhase = 'TURN';
    this.state = 'playing';
    this.currentPlayer = startingPlayer;
    this.currentTurn = 1;
    this.turnsLeft = 10;
    this.turnPhase = 0;
    this.matrix = Array(2).fill(0).map(() => Array(3).fill(0));
    this.battleContext = null;
    this.scores = { 1: 0, 2: 0 };
    this.activeMuseumLocation = null;
    this.p1ClaimHistory = [];
    this.p2ClaimHistory = [];
    this.introActive = false;
  }

  resetGame() {
    this.mode = 'GAME';
    this.gamePhase = 'INIT';
    this.state = 'setup';
    this.currentPlayer = 1;
    this.currentTurn = 1;
    this.turnsLeft = 10;
    this.turnPhase = 0;
    this.matrix = Array(2).fill(0).map(() => Array(3).fill(0));
    this.battleContext = null;
    this.scores = { 1: 0, 2: 0 };
    this.activeMuseumLocation = null;
    this.p1ClaimHistory = [];
    this.p2ClaimHistory = [];
    this.introActive = true;
  }

  endTurn(): boolean {
    if (this.mode === 'GAME' && this.gamePhase === 'TURN') {
      this.finishTurn();
      return true;
    }
    return false;
  }

  handleAction(row: number, col: number): boolean {
    console.log(`[GameLogic] handleAction called for row=${row}, col=${col}. Current mode=${this.mode}, phase=${this.gamePhase}, currentPlayer=${this.currentPlayer}`);
    if (this.mode === 'MUSEUM') {
      if (row === -1 || col === -1) {
        this.activeMuseumLocation = null;
      } else {
        this.activeMuseumLocation = { row, col };
      }
      return true;
    }

    if (this.mode === 'GAME') {
      if (this.gamePhase !== 'TURN') return false; // Ignore actions if not in TURN phase

      const currentOwner = this.matrix[row][col];

      // Rule: Claim empty spot
      if (currentOwner === 0) {
        this.matrix[row][col] = this.currentPlayer;
        this.recordClaim(row, col, this.currentPlayer);
        this.finishTurn();
        return true;
      }

      // Rule: Battle (clicking opponent's spot)
      if (currentOwner !== 0 && currentOwner !== this.currentPlayer && currentOwner !== 3) {
        this.gamePhase = 'BATTLE';
        this.state = 'battle';
        this.matrix[row][col] = 3; // 3 denotes battle mode (blinking)
        this.battleContext = { row, col, attacker: this.currentPlayer, defender: currentOwner };
        return true;
      }

      // Rule: Pass turn (clicking own spot)
      if (currentOwner === this.currentPlayer) {
        this.finishTurn();
        return true;
      }

      return false;
    }

    // Fallback for direct actions on old /game page
    if (this.state === 'playing') {
      const currentOwner = this.matrix[row][col];
      if (currentOwner === 0) {
        this.matrix[row][col] = this.currentPlayer;
        this.recordClaim(row, col, this.currentPlayer);
        this.finishTurn();
        return true;
      }
      if (currentOwner !== 0 && currentOwner !== this.currentPlayer && currentOwner !== 3) {
        this.state = 'battle';
        this.matrix[row][col] = 3;
        this.battleContext = { row, col, attacker: this.currentPlayer, defender: currentOwner };
        return true;
      }
      if (currentOwner === this.currentPlayer) {
        this.finishTurn();
        return true;
      }
    }

    return false;
  }

  resolveBattle(winner: number) {
    if (this.mode === 'GAME') {
      if (this.gamePhase !== 'BATTLE' || !this.battleContext) return;
      const { row, col } = this.battleContext;
      this.matrix[row][col] = winner;
      this.recordClaim(row, col, winner);
      this.gamePhase = 'TURN';
      this.state = 'playing';
      this.battleContext = null;
      this.finishTurn();
    } else {
      // Fallback
      if (this.state !== 'battle' || !this.battleContext) return;
      const { row, col } = this.battleContext;
      this.matrix[row][col] = winner;
      this.recordClaim(row, col, winner);
      this.state = 'playing';
      this.battleContext = null;
      this.finishTurn();
    }
  }

  private finishTurn() {
    const nextPlayer = this.currentPlayer === 1 ? 2 : 1;

    // A full round = both players have played.
    // Increment round counter only after the second player in the round finishes.
    // turnPhase tracks which half of the round we're on: 0 = first player, 1 = second player.
    if (this.turnPhase === 1) {
      // Both players have played — end of round
      if (this.currentTurn >= 10) {
        // 10 rounds × 2 players = 20 total actions
        this.state = 'game_over';
        this.gamePhase = 'END';
        this.calculateScores();
        return;
      }
      this.currentTurn++;
      this.turnsLeft = 10 - this.currentTurn;
      this.turnPhase = 0;
    } else {
      this.turnPhase = 1;
    }

    // Swap turn
    this.currentPlayer = nextPlayer;
    if (this.mode === 'GAME') {
      this.gamePhase = 'TURN';
    }
    
    // Live update scores
    this.calculateScores();
  }

  private calculateScores() {
    let p1 = 0;
    let p2 = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.matrix[r][c] === 1) p1++;
        if (this.matrix[r][c] === 2) p2++;
      }
    }
    this.scores = { 1: p1, 2: p2 };
  }

  getSnapshot() {
    return {
      mode: this.mode,
      language: this.language,
      gamePhase: this.gamePhase,
      currentPlayer: this.currentPlayer,
      currentTurn: this.currentTurn,
      turnsLeft: this.turnsLeft,
      matrix: this.matrix,
      displayMatrix: this.matrix,
      pendingMatrix: this.matrix,
      battleContext: this.battleContext,
      scores: this.scores,
      activeMuseumLocation: this.activeMuseumLocation,
      state: this.state,
      p1ClaimHistory: this.p1ClaimHistory,
      p2ClaimHistory: this.p2ClaimHistory,
      introActive: this.introActive
    };
  }
}

