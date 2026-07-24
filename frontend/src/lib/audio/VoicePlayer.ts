import { ContextManager } from "./ContextManager";
import { DuckingManager } from "./DuckingManager";

export class VoicePlayer {
    private static voiceSource: AudioBufferSourceNode | null = null;
    private static voiceGainNode: GainNode | null = null;

    private static battleSource: AudioBufferSourceNode | null = null;
    private static battleGainNode: GainNode | null = null;

    private static introSource: AudioBufferSourceNode | null = null;
    private static introGainNode: GainNode | null = null;

    /** Configurable tail-fade duration in seconds */
    static tailFadeDuration: number = 1.5;

    /**
     * Schedules a smooth fade-out over the last `fadeDuration` seconds of a
     * one-shot audio buffer. Call right after source.start().
     *
     * @param source   The AudioBufferSourceNode that was just started.
     * @param gainNode The GainNode controlling volume for this source.
     * @param duration The total duration of the audio buffer (seconds).
     * @param fadeDuration How long the tail fade should last (seconds). Defaults to tailFadeDuration.
     */
    static scheduleTailFade(
        source: AudioBufferSourceNode,
        gainNode: GainNode,
        duration: number,
        fadeDuration: number = this.tailFadeDuration
    ): void {
        const ctx = ContextManager.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const fadeStart = now + Math.max(0, duration - fadeDuration);
        const fadeEnd = now + duration;

        // Schedule the tail fade curve
        gainNode.gain.setValueAtTime(1, fadeStart);
        gainNode.gain.exponentialRampToValueAtTime(0.001, fadeEnd);

        // Stop exactly at the end of the fade
        try {
            source.stop(fadeEnd);
        } catch { }
    }

    static getVoiceSource(): AudioBufferSourceNode | null {
        return this.voiceSource;
    }

    static getBattleSource(): AudioBufferSourceNode | null {
        return this.battleSource;
    }

    static getIntroSource(): AudioBufferSourceNode | null {
        return this.introSource;
    }

    static async playNarration(lang: string, locationKey: string): Promise<void> {
        ContextManager.init();
        const ctx = ContextManager.getContext()!;
        if (ctx.state === "suspended") await ctx.resume();

        const voiceGain = ContextManager.getVoiceGain();
        if (!voiceGain) return;

        this.stopVoice();

        try {
            const path = `/sounds/descriptions/${lang.toLowerCase()}/${locationKey}.mp3`;
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);

            const source = ctx.createBufferSource();
            const localGain = ctx.createGain();

            source.buffer = buffer;
            source.connect(localGain);
            localGain.connect(voiceGain);

            const now = ctx.currentTime;
            // Anti-popping: very fast 10ms fade-in
            localGain.gain.setValueAtTime(0, now);
            localGain.gain.linearRampToValueAtTime(1, now + 0.01);

            DuckingManager.performDucking(true);

            source.onended = () => {
                if (this.voiceSource === source) {
                    DuckingManager.performDucking(false);
                    this.voiceSource = null;
                    this.voiceGainNode = null;
                }
            };

            source.start(0);
            this.voiceSource = source;
            this.voiceGainNode = localGain;
        } catch (e) {
            console.error("Failed to play narration description", e);
            DuckingManager.performDucking(false);
        }
    }

    static stopVoice(): void {
        const ctx = ContextManager.getContext();
        if (ctx && this.voiceSource && this.voiceGainNode) {
            const source = this.voiceSource;
            const gainNode = this.voiceGainNode;
            const now = ctx.currentTime;
            try {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.05); // 50ms fade out
                source.stop(now + 0.05);
            } catch {
                try { source.stop(); } catch { }
            }
        }
        this.voiceSource = null;
        this.voiceGainNode = null;
        DuckingManager.performDucking(false);
    }

    static async playSFX(sfxName: string, enableTailFade: boolean = true, enableDucking: boolean = true): Promise<void> {
        ContextManager.init();
        const ctx = ContextManager.getContext()!;
        if (ctx.state === "suspended") await ctx.resume();

        const voiceGain = ContextManager.getVoiceGain();
        if (!voiceGain) return;

        try {
            const response = await fetch(`/sounds/${sfxName}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);

            const source = ctx.createBufferSource();
            const localGain = ctx.createGain();

            source.buffer = buffer;
            source.connect(localGain);
            localGain.connect(voiceGain);

            const now = ctx.currentTime;
            // Tiny micro-fade in of 10ms to avoid transients
            localGain.gain.setValueAtTime(0, now);
            localGain.gain.linearRampToValueAtTime(1, now + 0.01);

            if (enableDucking) {
                DuckingManager.performDucking(true);
            }

            source.onended = () => {
                if (enableDucking) {
                    DuckingManager.performDucking(false);
                }
            };

            source.start(0);

            // Schedule a natural tail fade-out for the last N seconds
            if (enableTailFade && buffer.duration > this.tailFadeDuration) {
                this.scheduleTailFade(source, localGain, buffer.duration);
            }
        } catch (e) {
            console.error("Failed to play SFX", e);
            if (enableDucking) {
                DuckingManager.performDucking(false);
            }
        }
    }

    static async startBattleMusic(): Promise<void> {
        ContextManager.init();
        const ctx = ContextManager.getContext()!;
        if (ctx.state === "suspended") await ctx.resume();

        const voiceGain = ContextManager.getVoiceGain();
        if (!voiceGain) return;

        if (this.battleSource) return;

        try {
            const response = await fetch(`/sounds/battle_song.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);

            const source = ctx.createBufferSource();
            const localGain = ctx.createGain();

            source.buffer = buffer;
            source.loop = true;
            source.connect(localGain);
            localGain.connect(voiceGain);

            const now = ctx.currentTime;
            // Smooth fade-in of battle music over 1.0s
            localGain.gain.setValueAtTime(0, now);
            localGain.gain.linearRampToValueAtTime(1, now + 1.0);

            source.start(0);
            this.battleSource = source;
            this.battleGainNode = localGain;
        } catch (e) {
            console.error("Failed to play battle music", e);
        }
    }

    static stopBattleMusic(): void {
        const ctx = ContextManager.getContext();
        if (ctx && this.battleSource && this.battleGainNode) {
            const source = this.battleSource;
            const gainNode = this.battleGainNode;
            const now = ctx.currentTime;
            const fadeDuration = this.tailFadeDuration;
            try {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + fadeDuration);
                source.stop(now + fadeDuration);
            } catch {
                try { source.stop(); } catch { }
            }
        }
        this.battleSource = null;
        this.battleGainNode = null;
    }

    static async playIntro(lang: string): Promise<void> {
        ContextManager.init();
        const ctx = ContextManager.getContext()!;
        if (ctx.state === "suspended") await ctx.resume();

        const voiceGain = ContextManager.getVoiceGain();
        if (!voiceGain) return;

        this.stopIntro();

        try {
            const response = await fetch(`/sounds/intro/intro_${lang.toLowerCase()}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);

            const source = ctx.createBufferSource();
            const localGain = ctx.createGain();

            source.buffer = buffer;
            source.connect(localGain);
            localGain.connect(voiceGain);

            const now = ctx.currentTime;
            // Smooth fade-in of 0.5s
            localGain.gain.setValueAtTime(0, now);
            localGain.gain.linearRampToValueAtTime(1, now + 0.5);

            DuckingManager.performDucking(true);

            source.onended = () => {
                if (this.introSource === source) {
                    DuckingManager.performDucking(false);
                    this.introSource = null;
                    this.introGainNode = null;
                }
            };

            source.start(0);
            this.introSource = source;
            this.introGainNode = localGain;
        } catch (e) {
            console.error("Failed to play intro sequence", e);
            DuckingManager.performDucking(false);
        }
    }

    static isIntroPlaying(): boolean {
        return this.introSource !== null;
    }

    static stopIntro(): void {
        const ctx = ContextManager.getContext();
        if (ctx && this.introSource && this.introGainNode) {
            const source = this.introSource;
            const gainNode = this.introGainNode;
            const now = ctx.currentTime;
            try {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // 0.5s fade out
                source.stop(now + 0.5);
            } catch {
                try { source.stop(); } catch { }
            }
        }
        this.introSource = null;
        this.introGainNode = null;
        DuckingManager.performDucking(false);
    }

    static reset(): void {
        this.stopVoice();
        this.stopBattleMusic();
        this.stopIntro();
    }
}
