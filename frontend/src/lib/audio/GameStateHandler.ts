import { ContextManager } from "./ContextManager";
import { VoicePlayer } from "./VoicePlayer";
import { ZonePlayer } from "./ZonePlayer";
import { AudioTransition } from "./AudioTransition";

export class GameStateHandler {
    private static prevMode: string | null = null;
    private static prevPhase: string | null = null;
    private static prevMatrix: string | null = null;
    private static prevIntroActive: boolean = false;

    // Background source tracker
    private static bgSource: AudioBufferSourceNode | null = null;

    // Last interacted state trackers (coordinates of the last clicked/challenged tile)
    private static p1LastLocation: { row: number, col: number } | null = null;
    private static p2LastLocation: { row: number, col: number } | null = null;

    // Physical zone trackers from Calliope beacons
    private static p1PhysicalZone: string | null = null;
    private static p2PhysicalZone: string | null = null;
    private static currentGameState: any = null;

    static getBgSource(): AudioBufferSourceNode | null {
        return this.bgSource;
    }

    static setBgSource(source: AudioBufferSourceNode | null): void {
        this.bgSource = source;
    }

    static stopBgSource(): void {
        if (this.bgSource) {
            try {
                this.bgSource.stop();
            } catch { }
            this.bgSource = null;
        }
    }

    static updateLastInteracted(player: number, row: number, col: number): void {
        if (player === 1) {
            this.p1LastLocation = { row, col };
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.setItem("p1_last_interacted", JSON.stringify({ row, col }));
            }
        } else if (player === 2) {
            this.p2LastLocation = { row, col };
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.setItem("p2_last_interacted", JSON.stringify({ row, col }));
            }
        }
    }

    private static getP1LastLocation(): { row: number, col: number } | null {
        if (this.p1LastLocation) return this.p1LastLocation;
        if (typeof window !== "undefined" && window.localStorage) {
            const stored = localStorage.getItem("p1_last_interacted");
            if (stored) {
                try {
                    this.p1LastLocation = JSON.parse(stored);
                    return this.p1LastLocation;
                } catch { }
            }
        }
        return null;
    }

    private static getP2LastLocation(): { row: number, col: number } | null {
        if (this.p2LastLocation) return this.p2LastLocation;
        if (typeof window !== "undefined" && window.localStorage) {
            const stored = localStorage.getItem("p2_last_interacted");
            if (stored) {
                try {
                    this.p2LastLocation = JSON.parse(stored);
                    return this.p2LastLocation;
                } catch { }
            }
        }
        return null;
    }

    static reset(): void {
        this.prevMode = null;
        this.prevPhase = null;
        this.prevMatrix = null;
        this.prevIntroActive = false;
        this.stopBgSource();
        this.p1LastLocation = null;
        this.p2LastLocation = null;
        this.p1PhysicalZone = null;
        this.p2PhysicalZone = null;
        this.currentGameState = null;
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.removeItem("player1_last_location");
            localStorage.removeItem("player2_last_location");
            localStorage.removeItem("p1_last_interacted");
            localStorage.removeItem("p2_last_interacted");
        }
    }

    static getActivePlayerLatestSoundKey(gameState: any): string | null {
        if (!gameState || (gameState.currentPlayer !== 1 && gameState.currentPlayer !== 2)) {
            return null;
        }

        const currentPlayer = gameState.currentPlayer;
        const lastInteracted = currentPlayer === 1 ? this.getP1LastLocation() : this.getP2LastLocation();

        const matrixToSounds = [
            ["mahanakhon", "asiatique", "giant_swing"],
            ["wat_arun", "bremen_stadium", "townhall"],
        ];

        // 1. Prioritize real-time physical zone from Calliope
        const physicalZone = currentPlayer === 1 ? this.p1PhysicalZone : this.p2PhysicalZone;
        if (physicalZone && physicalZone !== "waiting") {
            return physicalZone;
        }

        // 2. Fallback to lastInteractedLocation state
        if (lastInteracted && lastInteracted.row != null && lastInteracted.col != null) {
            if (matrixToSounds[lastInteracted.row] && matrixToSounds[lastInteracted.row][lastInteracted.col]) {
                return matrixToSounds[lastInteracted.row][lastInteracted.col];
            }
        }

        // 2. Fallback to claim history logic if lastInteracted is null
        const history = currentPlayer === 1 ? gameState.p1ClaimHistory : gameState.p2ClaimHistory;

        // Helper to check localStorage fallback
        const getLocalStorageFallback = (): string | null => {
            if (typeof window !== "undefined" && window.localStorage) {
                return localStorage.getItem(`player${currentPlayer}_last_location`);
            }
            return null;
        };

        if (!history || !Array.isArray(history) || history.length === 0) {
            return getLocalStorageFallback();
        }

        const latest = history[history.length - 1];
        if (!latest || latest.row == null || latest.col == null) {
            return getLocalStorageFallback();
        }

        if (!matrixToSounds[latest.row] || !matrixToSounds[latest.row][latest.col]) {
            return getLocalStorageFallback();
        }

        const soundKey = matrixToSounds[latest.row][latest.col];

        // Save to persistent state
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(`player${currentPlayer}_last_location`, soundKey);
        }

        return soundKey;
    }

    static handleGameUpdate(gameState: any): void {
        if (!gameState) return;
        this.currentGameState = gameState;
        ContextManager.init();

        const currentMode = gameState.mode;
        const currentPhase = gameState.gamePhase;
        const lang = gameState.language || "EN";

        // 1. Initial startup standby check
        if (this.prevMode === null) {
            if (currentMode === "GAME") {
                VoicePlayer.playIntro(lang);
            }
        }

        // 2. Transition between modes
        if (currentMode !== this.prevMode && this.prevMode !== null) {
            VoicePlayer.stopVoice();
            VoicePlayer.stopBattleMusic();
            VoicePlayer.stopIntro();

            if (currentMode === "IDLE") {
                ZonePlayer.stopImmediate();
                this.stopBgSource();
                this.p1LastLocation = null;
                this.p2LastLocation = null;
                this.p1PhysicalZone = null;
                this.p2PhysicalZone = null;
                if (typeof window !== "undefined" && window.localStorage) {
                    localStorage.removeItem("player1_last_location");
                    localStorage.removeItem("player2_last_location");
                    localStorage.removeItem("p1_last_interacted");
                    localStorage.removeItem("p2_last_interacted");
                }
            } else if (currentMode === "MUSEUM") {
                // Let views handle Museum mode audio locally to avoid clashes
            } else if (currentMode === "GAME") {
                // Do NOT start ambience loop A.mp3 in GAME mode
                VoicePlayer.playIntro(lang);
            }
        }

        // 3. Museum mode details logic (handled locally by MuseumMonitorView.tsx and MuseumControllerView.tsx)
        if (currentMode === "MUSEUM") {
            // Let views handle Museum mode audio locally to avoid clashes
        }

        // 4. Game mode scoreboard logic
        if (currentMode === "GAME") {
            const introActive = !!gameState.introActive;
            if (!introActive && this.prevIntroActive) {
                VoicePlayer.stopIntro();
            }
            this.prevIntroActive = introActive;

            // Battle phase changes

            if (currentPhase === "BATTLE" && this.prevPhase !== "BATTLE") {
                // VoicePlayer.stopIntro();
                VoicePlayer.stopIntro();
                VoicePlayer.stopVoice();
                VoicePlayer.startBattleMusic();
            } else if (currentPhase !== "BATTLE" && this.prevPhase === "BATTLE") {
                VoicePlayer.stopBattleMusic();
            }

            // Capture SFX alerts & Handover transitions
            if (this.prevPhase === "BATTLE" && currentPhase === "TURN") {
                // Play conquer sound as non-ducking SFX, allowing BGM to play immediately
                VoicePlayer.playSFX("conquer_sound", true, false);
            } else if (currentPhase === "TURN" && this.prevPhase === "TURN") {
                const currentMatrixStr = JSON.stringify(gameState.matrix);
                if (this.prevMatrix && currentMatrixStr !== this.prevMatrix) {
                    // Play conquer sound as non-ducking SFX, allowing BGM to play immediately
                    VoicePlayer.playSFX("conquer_sound", true, false);
                }
                this.prevMatrix = currentMatrixStr;
            } else if (currentPhase === "TURN" && this.prevPhase !== "TURN") {
                // Initialize matrix tracking
                this.prevMatrix = JSON.stringify(gameState.matrix);
            }

            // --- TRACK ACTIVE PLAYER'S MOST RECENTLY CAPTURED LANDMARK BGM LOOP ---
            if (currentPhase === "TURN") {
                if (!AudioTransition.isActive()) {
                    const activeSoundKey = this.getActivePlayerLatestSoundKey(gameState);
                    if (activeSoundKey) {
                        // Start or crossfade to active sound key
                        ZonePlayer.playZone(activeSoundKey, 0.7);
                    } else {
                        // No landmarks captured yet: stay silent
                        ZonePlayer.stop();
                    }
                }
            } else {
                // If not in TURN phase (e.g. INIT roll or BATTLE phase), stop the location audio loop
                if (!AudioTransition.isActive()) {
                    ZonePlayer.stop();
                }
            }
        }

        // Sync values
        this.prevMode = currentMode;
        this.prevPhase = currentPhase;
    }

    static handlePhysicalZoneUpdate(deviceCode: string, zone: string): void {
        if (deviceCode === "P1") this.p1PhysicalZone = zone;
        else if (deviceCode === "P2") this.p2PhysicalZone = zone;

        if (!this.currentGameState) return;

        const currentMode = this.currentGameState.mode;
        const currentPhase = this.currentGameState.gamePhase;
        const currentPlayer = this.currentGameState.currentPlayer;

        if (currentMode === "GAME" && currentPhase === "TURN") {
            if ((deviceCode === "P1" && currentPlayer === 1) ||
                (deviceCode === "P2" && currentPlayer === 2)) {
                if (!AudioTransition.isActive() && zone && zone !== "waiting") {
                    ZonePlayer.playZone(zone, 0.7);
                }
            }
        }
    }
}
