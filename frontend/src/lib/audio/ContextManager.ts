export class ContextManager {
    private static audioCtx: AudioContext | null = null;
    private static masterGain: GainNode | null = null;
    private static bgGain: GainNode | null = null;
    private static bgmGain: GainNode | null = null;
    private static voiceGain: GainNode | null = null;

    static getContext(): AudioContext | null {
        return this.audioCtx;
    }

    static getMasterGain(): GainNode | null {
        return this.masterGain;
    }

    static getBgGain(): GainNode | null {
        return this.bgGain;
    }

    static getBgmGain(): GainNode | null {
        return this.bgmGain;
    }

    static getVoiceGain(): GainNode | null {
        return this.voiceGain;
    }

    static init(): void {
        if (!this.audioCtx) {
            this.audioCtx = new (
                window.AudioContext || (window as any).webkitAudioContext
            )();
            const ctx = this.audioCtx;

            // Build Gain routing node graph
            this.masterGain = ctx.createGain();
            this.masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
            this.masterGain.connect(ctx.destination);

            this.bgGain = ctx.createGain();
            this.bgGain.gain.setValueAtTime(0.15, ctx.currentTime);
            this.bgGain.connect(this.masterGain);

            this.bgmGain = ctx.createGain();
            this.bgmGain.gain.setValueAtTime(0.7, ctx.currentTime);
            this.bgmGain.connect(this.masterGain);

            this.voiceGain = ctx.createGain();
            this.voiceGain.gain.setValueAtTime(2.5, ctx.currentTime); // Boost voice narration and SFX to 250%
            this.voiceGain.connect(this.masterGain);
        }
    }

    static async resume(): Promise<void> {
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            await this.audioCtx.resume();
        }
    }
}
