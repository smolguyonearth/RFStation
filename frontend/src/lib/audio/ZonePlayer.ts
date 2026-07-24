import { ContextManager } from "./ContextManager";
import { BufferCache } from "./BufferCache";

export interface ActiveLayer {
    source: AudioBufferSourceNode;
    gain: GainNode;
    zone: string;
    startedAt: number;
    startOffset: number;
    buffer: AudioBuffer;
}

export interface ZoneRecord {
    savedOffset: number;
    snapshotAt: number;
}

export class ZonePlayer {
    static crossfadeDuration: number = 0.008;
    static overlapFadeTime: number = 0.008;

    private static activeLayers: ActiveLayer[] = [];
    private static currentZone: string | null = null;
    private static zoneRecords: Map<string, ZoneRecord> = new Map();
    private static activeTimeouts: Set<any> = new Set();

    static getCurrentZone(): string | null {
        return this.currentZone;
    }

    static getActiveLayers(): ActiveLayer[] {
        return this.activeLayers;
    }

    static getZoneRecords(): Map<string, ZoneRecord> {
        return this.zoneRecords;
    }

    static clearAllTimeouts(): void {
        for (const tid of this.activeTimeouts) {
            clearTimeout(tid);
        }
        this.activeTimeouts.clear();
    }

    static setSavedOffset(zone: string, offsetSeconds: number): void {
        const ctx = ContextManager.getContext();
        this.zoneRecords.set(zone, {
            savedOffset: offsetSeconds,
            snapshotAt: ctx?.currentTime ?? 0,
        });
    }

    static getSavedOffset(zone: string): number | null {
        const record = this.zoneRecords.get(zone);
        return record ? record.savedOffset : null;
    }

    static clearZoneOffset(zone: string): void {
        this.zoneRecords.delete(zone);
    }

    static async playZone(zone: string, volume: number = 0.7, fadeDuration?: number): Promise<void> {
        ContextManager.init();
        const ctx = ContextManager.getContext();
        if (!ctx) return;

        if (ctx.state === "suspended") await ctx.resume();

        const bgmGain = ContextManager.getBgmGain();
        if (!bgmGain) return;

        if (this.currentZone === zone) {
            const now = ctx.currentTime;
            bgmGain.gain.cancelScheduledValues(now);
            bgmGain.gain.linearRampToValueAtTime(volume, now + (fadeDuration ?? 0.008));
            return;
        }

        this.clearAllTimeouts();
        this.snapshotActiveLayers();
        this.currentZone = zone;

        const now = ctx.currentTime;
        const fd = fadeDuration ?? this.crossfadeDuration;

        // fade out old layers
        for (const layer of this.activeLayers) {
            const g = layer.gain;

            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.linearRampToValueAtTime(0, now + fd);

            try {
                layer.source.stop(now + fd);
            } catch { }
        }

        this.activeLayers = [];

        try {
            const buffer = await BufferCache.getBuffer(zone);
            if (this.currentZone !== zone) return;

            const resumeOffset = this.getResumeOffset(zone, buffer.duration);

            const source = ctx.createBufferSource();
            const layerGain = ctx.createGain();

            source.buffer = buffer;

            const startNow = ctx.currentTime;

            // fade in BGM layer
            layerGain.gain.setValueAtTime(0, startNow);
            layerGain.gain.linearRampToValueAtTime(volume, startNow + fd);

            source.connect(layerGain);
            layerGain.connect(bgmGain);

            this.startSeamlessLoop(
                source,
                layerGain,
                zone,
                buffer,
                startNow - resumeOffset
            );

            this.activeLayers.push({
                source,
                gain: layerGain,
                zone,
                startedAt: startNow,
                startOffset: resumeOffset,
                buffer,
            });
        } catch (e) {
            console.error("Failed to play zone loop", e);
        }
    }

    static stop(): void {
        const ctx = ContextManager.getContext();
        if (!ctx) return;

        this.clearAllTimeouts();
        const now = ctx.currentTime;
        const fd = this.crossfadeDuration;

        this.snapshotActiveLayers();

        for (const layer of this.activeLayers) {
            const g = layer.gain;

            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.linearRampToValueAtTime(0, now + fd);

            try {
                layer.source.stop(now + fd);
            } catch { }
        }

        this.activeLayers = [];
        this.currentZone = null;
    }

    static stopImmediate(): void {
        const ctx = ContextManager.getContext();
        if (!ctx) return;

        this.clearAllTimeouts();

        for (const layer of this.activeLayers) {
            layer.gain.gain.cancelScheduledValues(0);
            layer.gain.gain.value = 0;
            try {
                layer.source.stop(0);
            } catch { }
        }

        this.activeLayers = [];
        this.currentZone = null;
    }

    static reset(): void {
        this.stopImmediate();
        this.clearAllTimeouts();
        this.zoneRecords.clear();
    }

    private static startSeamlessLoop(
        source: AudioBufferSourceNode,
        gain: GainNode,
        zone: string,
        buffer: AudioBuffer,
        startTime: number
    ): void {
        const ctx = ContextManager.getContext()!;
        const duration = buffer.duration;
        const overlap = this.overlapFadeTime;

        source.start(startTime);

        const nextStart = startTime + duration - overlap;
        const timeout = (nextStart - ctx.currentTime) * 1000;

        const tid = setTimeout(() => {
            this.activeTimeouts.delete(tid);
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
        this.activeTimeouts.add(tid);
    }

    private static snapshotActiveLayers(): void {
        const ctx = ContextManager.getContext();
        if (!ctx) return;
        const now = ctx.currentTime;

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
