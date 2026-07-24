import { ContextManager } from "./ContextManager";
import { BufferCache } from "./BufferCache";
import { DuckingManager } from "./DuckingManager";
import { ZonePlayer } from "./ZonePlayer";

/**
 * AudioTransition coordinates smooth, cinematic handovers between
 * one-shot SFX clips and looping BGM zones.
 *
 * Instead of a hard cut (stop SFX → start BGM), it creates a crossfade
 * overlap window where the tail of the SFX and the head of the BGM
 * are blended together using equal-power curves.
 */
export class AudioTransition {
    /** Duration in seconds of the overlap crossfade window */
    static overlapWindow: number = 0.45;

    /** Active transition state */
    private static isTransitioning: boolean = false;

    /** Active transition timeout ID for cancellation */
    private static transitionTimeout: ReturnType<typeof setTimeout> | null = null;
    private static transitionSource: AudioBufferSourceNode | null = null;

    static isActive(): boolean {
        return this.isTransitioning;
    }

    /**
     * Builds an equal-power fade-out curve (cos-based).
     * Value goes from `startVal` down towards 0.
     */
    private static buildFadeOutCurve(startVal: number, steps: number = 64): Float32Array {
        const curve = new Float32Array(steps);
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            curve[i] = startVal * Math.cos(t * Math.PI / 2);
        }
        return curve;
    }

    /**
     * Cancel any pending transition.
     */
    static cancel(): void {
        this.isTransitioning = false;
        if (this.transitionTimeout !== null) {
            clearTimeout(this.transitionTimeout);
            this.transitionTimeout = null;
        }
        if (this.transitionSource) {
            try { this.transitionSource.stop(); } catch { }
            this.transitionSource = null;
        }
    }

    /**
     * Play an SFX clip, then seamlessly hand over to a BGM zone loop.
     *
     * Timeline:
     *   0 ──────────────── (duration - overlap) ──── duration
     *   |  SFX at full vol  |  crossfade window  |
     *                       |  SFX fades out      |
     *                       |  BGM fades in        |
     *
     * @param sfxName  Sound effect filename (without .mp3), e.g. "conquer_sound"
     * @param bgmZone  Zone key for ZonePlayer, e.g. "mahanakhon". Pass null to skip BGM.
     * @param bgmVolume Target volume for the BGM zone (default 0.7)
     */
    static async playTransition(
        sfxName: string,
        bgmZone: string | null,
        bgmVolume: number = 0.7
    ): Promise<void> {
        this.cancel();
        this.isTransitioning = true;

        ContextManager.init();
        const ctx = ContextManager.getContext();
        if (!ctx) {
            this.isTransitioning = false;
            return;
        }
        if (ctx.state === "suspended") await ctx.resume();

        const voiceGain = ContextManager.getVoiceGain();
        if (!voiceGain) {
            this.isTransitioning = false;
            return;
        }

        try {
            // Load SFX buffer
            const response = await fetch(`/sounds/${sfxName}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const sfxBuffer = await ctx.decodeAudioData(arrayBuffer);

            // Safety check: was transition cancelled during loading?
            if (!this.isTransitioning) return;

            const sfxSource = ctx.createBufferSource();
            const sfxGain = ctx.createGain();

            sfxSource.buffer = sfxBuffer;
            sfxSource.connect(sfxGain);
            sfxGain.connect(voiceGain);

            const now = ctx.currentTime;
            const duration = sfxBuffer.duration;
            const overlap = Math.min(this.overlapWindow, duration * 0.5); // don't overlap more than half

            // Anti-pop micro-fade in (10ms)
            sfxGain.gain.setValueAtTime(0, now);
            sfxGain.gain.linearRampToValueAtTime(1, now + 0.01);

            DuckingManager.performDucking(true);

            // Schedule the SFX tail fade-out during the overlap window
            const fadeOutStart = now + duration - overlap;
            const fadeOutCurve = this.buildFadeOutCurve(1, 64);
            sfxGain.gain.setValueAtTime(1, fadeOutStart);
            sfxGain.gain.setValueCurveAtTime(fadeOutCurve, fadeOutStart, overlap);

            // Stop SFX exactly at the end of the fade
            try {
                sfxSource.stop(now + duration);
            } catch { }

            sfxSource.onended = () => {
                DuckingManager.performDucking(false);
            };

            sfxSource.start(0);
            this.transitionSource = sfxSource;

            // Schedule BGM start at the overlap point
            if (bgmZone) {
                // Pre-load the BGM buffer while SFX plays
                BufferCache.getBuffer(bgmZone).catch(() => { });

                const delayMs = Math.max(0, (duration - overlap) * 1000);
                this.transitionTimeout = setTimeout(() => {
                    this.transitionTimeout = null;
                    this.isTransitioning = false;
                    // Start the BGM zone with matching fade-in duration
                    ZonePlayer.playZone(bgmZone, bgmVolume, overlap);
                }, delayMs);
            } else {
                this.isTransitioning = false;
            }
        } catch (e) {
            console.error("AudioTransition: Failed to play transition", e);
            this.isTransitioning = false;
            DuckingManager.performDucking(false);
        }
    }
}
