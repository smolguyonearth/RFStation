import { ContextManager } from "./ContextManager";

export class BufferCache {
    private static bufferCache: Map<string, AudioBuffer> = new Map();

    static async getBuffer(zone: string): Promise<AudioBuffer> {
        const cached = this.bufferCache.get(zone);
        if (cached) return cached;

        const ctx = ContextManager.getContext();
        if (!ctx) {
            throw new Error("AudioContext has not been initialized. Call ContextManager.init() first.");
        }

        const response = await fetch(`/sounds/${zone}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await ctx.decodeAudioData(arrayBuffer);

        this.bufferCache.set(zone, buffer);
        return buffer;
    }

    static clear(): void {
        this.bufferCache.clear();
    }
}
