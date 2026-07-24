import { ContextManager } from "./ContextManager";

export class DuckingManager {
    static performDucking(active: boolean): void {
        const ctx = ContextManager.getContext();
        const bgGain = ContextManager.getBgGain();
        const bgmGain = ContextManager.getBgmGain();

        if (!ctx || !bgGain || !bgmGain) return;

        const now = ctx.currentTime;
        const targetBg = active ? 0.03 : 0.15;
        const targetBgm = active ? 0.4 : 0.7;

        bgGain.gain.cancelScheduledValues(now);
        bgGain.gain.setTargetAtTime(targetBg, now, 0.15);

        bgmGain.gain.cancelScheduledValues(now);
        bgmGain.gain.setTargetAtTime(targetBgm, now, 0.15);
    }
}
