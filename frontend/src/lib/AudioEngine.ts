import { ContextManager } from "./audio/ContextManager";
import { BufferCache } from "./audio/BufferCache";
import { ZonePlayer } from "./audio/ZonePlayer";
import type { ActiveLayer, ZoneRecord } from "./audio/ZonePlayer";
import { VoicePlayer } from "./audio/VoicePlayer";
import { GameStateHandler } from "./audio/GameStateHandler";
import { AudioTransition } from "./audio/AudioTransition";

export class AudioEngine {
    static get crossfadeDuration(): number {
        return ZonePlayer.crossfadeDuration;
    }
    static set crossfadeDuration(val: number) {
        ZonePlayer.crossfadeDuration = val;
    }

    static get overlapFadeTime(): number {
        return ZonePlayer.overlapFadeTime;
    }
    static set overlapFadeTime(val: number) {
        ZonePlayer.overlapFadeTime = val;
    }

    static get audioCtx(): AudioContext | null {
        return ContextManager.getContext();
    }

    static get activeLayers(): ActiveLayer[] {
        return ZonePlayer.getActiveLayers();
    }

    static get currentZone(): string | null {
        return ZonePlayer.getCurrentZone();
    }

    static get zoneRecords(): Map<string, ZoneRecord> {
        return ZonePlayer.getZoneRecords();
    }

    static get masterGain(): GainNode | null {
        return ContextManager.getMasterGain();
    }

    static get bgGain(): GainNode | null {
        return ContextManager.getBgGain();
    }

    static get bgmGain(): GainNode | null {
        return ContextManager.getBgmGain();
    }

    static get voiceGain(): GainNode | null {
        return ContextManager.getVoiceGain();
    }

    static get bgSource(): AudioBufferSourceNode | null {
        return GameStateHandler.getBgSource();
    }

    static get voiceSource(): AudioBufferSourceNode | null {
        return VoicePlayer.getVoiceSource();
    }

    static get battleSource(): AudioBufferSourceNode | null {
        return VoicePlayer.getBattleSource();
    }

    static get introSource(): AudioBufferSourceNode | null {
        return VoicePlayer.getIntroSource();
    }

    static init(): void {
        ContextManager.init();
    }

    static async preload(zone: string): Promise<void> {
        await BufferCache.getBuffer(zone);
    }

    static async playNarration(lang: string, locationKey: string): Promise<void> {
        await VoicePlayer.playNarration(lang, locationKey);
    }

    static stopVoice(): void {
        VoicePlayer.stopVoice();
    }

    static async playSFX(sfxName: string): Promise<void> {
        await VoicePlayer.playSFX(sfxName);
    }

    static async startBattleMusic(): Promise<void> {
        await VoicePlayer.startBattleMusic();
    }

    static stopBattleMusic(): void {
        VoicePlayer.stopBattleMusic();
    }

    static async playIntro(lang: string): Promise<void> {
        await VoicePlayer.playIntro(lang);
    }

    static isIntroPlaying(): boolean {
        return VoicePlayer.isIntroPlaying();
    }

    static stopIntro(): void {
        VoicePlayer.stopIntro();
    }

    static async playZone(zone: string, volume: number = 0.7): Promise<void> {
        AudioTransition.cancel();
        await ZonePlayer.playZone(zone, volume);
    }

    static stop(): void {
        AudioTransition.cancel();
        ZonePlayer.stop();
    }

    static stopImmediate(): void {
        AudioTransition.cancel();
        ZonePlayer.stopImmediate();
    }

    static reset(): void {
        AudioTransition.cancel();
        ZonePlayer.reset();
        VoicePlayer.reset();
        GameStateHandler.reset();
        BufferCache.clear();
    }

    static async playTransition(sfxName: string, bgmZone: string | null, bgmVolume: number = 0.7): Promise<void> {
        await AudioTransition.playTransition(sfxName, bgmZone, bgmVolume);
    }

    static cancelTransition(): void {
        AudioTransition.cancel();
    }

    static setSavedOffset(zone: string, offsetSeconds: number): void {
        ZonePlayer.setSavedOffset(zone, offsetSeconds);
    }

    static getSavedOffset(zone: string): number | null {
        return ZonePlayer.getSavedOffset(zone);
    }

    static handleGameUpdate(gameState: any): void {
        GameStateHandler.handleGameUpdate(gameState);
    }

    static updateLastInteracted(player: number, row: number, col: number): void {
        GameStateHandler.updateLastInteracted(player, row, col);
    }

    static handlePhysicalZoneUpdate(deviceCode: string, zone: string): void {
        GameStateHandler.handlePhysicalZoneUpdate(deviceCode, zone);
    }
}
export type { ActiveLayer, ZoneRecord };