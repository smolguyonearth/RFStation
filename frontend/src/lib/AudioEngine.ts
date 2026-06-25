interface ActiveLayer {
    source: AudioBufferSourceNode;
    gain: GainNode;
    zone: string;
    startedAt: number;
    startOffset: number;
    buffer: AudioBuffer;
}

interface ZoneRecord {
    savedOffset: number;
    snapshotAt: number;
}

export class AudioEngine {
    static crossfadeDuration: number = 3;
    static overlapFadeTime: number = 3;

    private static audioCtx: AudioContext | null = null;
    private static activeLayers: ActiveLayer[] = [];
    private static currentZone: string | null = null;
    private static zoneRecords: Map<string, ZoneRecord> = new Map();
    private static bufferCache: Map<string, AudioBuffer> = new Map();

    static init(): void {
        if (!this.audioCtx) {
            this.audioCtx = new (
                window.AudioContext || (window as any).webkitAudioContext
            )();
        }
    }

    static async preload(zone: string): Promise<void> {
        await this.getBuffer(zone);
    }

    static async playZone(zone: string): Promise<void> {
        if (!this.audioCtx) this.init();
        const ctx = this.audioCtx!;

        if (ctx.state === "suspended") await ctx.resume();

        if (this.currentZone === zone) return;

        this.snapshotActiveLayers();
        this.currentZone = zone;

        const now = ctx.currentTime;
        const fd = this.crossfadeDuration;

        // fade out old layers
        for (const layer of this.activeLayers) {
            const g = layer.gain;

            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.linearRampToValueAtTime(0, now + fd);

            try {
                layer.source.stop(now + fd);
            } catch {}
        }

        this.activeLayers = [];

        const buffer = await this.getBuffer(zone);
        if (this.currentZone !== zone) return;

        const resumeOffset = this.getResumeOffset(zone, buffer.duration);

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();

        source.buffer = buffer;

        const startNow = ctx.currentTime;

        // fade in
        gain.gain.setValueAtTime(0, startNow);
        gain.gain.linearRampToValueAtTime(1, startNow + fd);

        source.connect(gain);
        gain.connect(ctx.destination);

        this.startSeamlessLoop(
            source,
            gain,
            zone,
            buffer,
            startNow - resumeOffset
        );

        this.activeLayers.push({
            source,
            gain,
            zone,
            startedAt: startNow,
            startOffset: resumeOffset,
            buffer,
        });
    }

    static stop(): void {
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const fd = this.crossfadeDuration;

        this.snapshotActiveLayers();

        for (const layer of this.activeLayers) {
            const g = layer.gain;

            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.linearRampToValueAtTime(0, now + fd);

            try {
                layer.source.stop(now + fd);
            } catch {}
        }

        this.activeLayers = [];
        this.currentZone = null;
    }

    static reset(): void {
        this.stop();
        this.zoneRecords.clear();
        this.bufferCache.clear();
    }

    static setSavedOffset(zone: string, offsetSeconds: number): void {
        this.zoneRecords.set(zone, {
            savedOffset: offsetSeconds,
            snapshotAt: this.audioCtx?.currentTime ?? 0,
        });
    }

    static getSavedOffset(zone: string): number | null {
        const record = this.zoneRecords.get(zone);
        return record ? record.savedOffset : null;
    }

    private static startSeamlessLoop(
        source: AudioBufferSourceNode,
        gain: GainNode,
        zone: string,
        buffer: AudioBuffer,
        startTime: number
    ): void {
        const ctx = this.audioCtx!;
        const duration = buffer.duration;
        const overlap = this.overlapFadeTime;

        source.start(startTime);

        const nextStart = startTime + duration - overlap;

        const timeout = (nextStart - ctx.currentTime) * 1000;

        setTimeout(() => {
            if (this.currentZone !== zone) return;

            const newSource = ctx.createBufferSource();
            newSource.buffer = buffer;

            newSource.connect(gain);

            this.startSeamlessLoop(
                newSource,
                gain,
                zone,
                buffer,
                nextStart
            );
        }, Math.max(0, timeout));
    }

    private static async getBuffer(zone: string): Promise<AudioBuffer> {
        const cached = this.bufferCache.get(zone);
        if (cached) return cached;

        const response = await fetch(`/sounds/${zone}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.audioCtx!.decodeAudioData(arrayBuffer);

        this.bufferCache.set(zone, buffer);
        return buffer;
    }

    private static snapshotActiveLayers(): void {
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;

        for (const layer of this.activeLayers) {
            const elapsed = now - layer.startedAt;
            const rawOffset = layer.startOffset + elapsed;
            const saved = rawOffset % layer.buffer.duration;

            this.zoneRecords.set(layer.zone, {
                savedOffset: saved,
                snapshotAt: now,
            });
        }
    }

    private static getResumeOffset(zone: string, duration: number): number {
        const record = this.zoneRecords.get(zone);
        if (!record) return 0;

        return record.savedOffset % duration;
    }
}