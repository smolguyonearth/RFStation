export class AudioEngine {
    private static audioCtx: AudioContext | null = null;
    private static currentSource: AudioBufferSourceNode | null = null;
    private static currentGain: GainNode | null = null;
    private static currentZone: string | null = null;

    static init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    static async playZone(zone: string) {
        if (!this.audioCtx) this.init();
        if (this.audioCtx!.state === 'suspended') this.audioCtx!.resume();

        if (this.currentZone === zone) return;

        const response = await fetch(`/sounds/${zone}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.audioCtx!.decodeAudioData(arrayBuffer);

        const now = this.audioCtx!.currentTime;
        const fadeTime = 0.5;

        if (this.currentSource && this.currentGain) {
            this.currentGain.gain.setValueAtTime(this.currentGain.gain.value, now);
            this.currentGain.gain.linearRampToValueAtTime(0, now + fadeTime);
            this.currentSource.stop(now + fadeTime);
        }

        const newSource = this.audioCtx!.createBufferSource();
        const newGain = this.audioCtx!.createGain();

        newSource.buffer = buffer;
        newSource.loop = true;
        newGain.gain.setValueAtTime(0, now);
        newGain.gain.linearRampToValueAtTime(1, now + fadeTime);

        newSource.connect(newGain);
        newGain.connect(this.audioCtx!.destination);

        newSource.start(now);

        this.currentSource = newSource;
        this.currentGain = newGain;
        this.currentZone = zone;
    }
}