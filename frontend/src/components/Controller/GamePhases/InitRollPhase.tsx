import { useState } from 'react';
import Dice from '@/components/Dice';
import { useSwipe } from '@/hooks/useSwipe';
import { AudioEngine } from '@/lib/AudioEngine';

export default function InitRollPhase({ startGame }: any) {
    const [step, setStep] = useState<"P1_ROLL" | "P2_ROLL" | "RESULT">("P1_ROLL");
    const [p1Roll, setP1Roll] = useState<number | null>(null);
    const [p2Roll, setP2Roll] = useState<number | null>(null);
    const [showIntroPopup, setShowIntroPopup] = useState(false);

    const handleBeforeRoll = () => {
        if (AudioEngine.isIntroPlaying()) {
            setShowIntroPopup(true);
            return false;
        }
        return true;
    };

    const handleP1Roll = (val: number) => {
        setP1Roll(val);
    };

    const handleP2Roll = (val: number) => {
        setP2Roll(val);
    };

    const handleResultNext = () => {
        if (p1Roll === p2Roll) {
            setP1Roll(null);
            setP2Roll(null);
            setStep("P1_ROLL");
        } else {
            startGame(p1Roll! > p2Roll! ? 1 : 2);
        }
    };

    const swipeHandlers = useSwipe(
        () => {
            // Swipe Left (Next)
            if (step === "P1_ROLL" && p1Roll !== null) setStep("P2_ROLL");
            if (step === "P2_ROLL" && p2Roll !== null) setStep("RESULT");
        },
        () => { }, // Swipe Right (Ignore)
    );

    return (
        <div
            {...swipeHandlers}
            className={`w-full h-full flex flex-col items-center justify-center relative py-6 select-none ${swipeHandlers.className}`}
        >
            {step === "P1_ROLL" && (
                <div
                    key="p1"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border border-indigo-500/20 neon-glow-p1 z-10 p-8 shadow-2xl"
                >
                    <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 bg-indigo-950/40 border border-indigo-800/30 px-4 py-1.5 rounded-full uppercase mb-4">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase text-center">
                        PLAYER 1 ROLL
                    </h2>
                    
                    <div className="scale-110 transform">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP1Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    
                    {p1Roll !== null && (
                        <div className="mt-8 flex flex-col items-center">
                            <button
                                onClick={() => setStep("P2_ROLL")}
                                className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-indigo-600 hover:to-indigo-700 active:scale-95 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pop"
                            >
                                Next: P2 Roll →
                            </button>
                            <p className="mt-3 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "P2_ROLL" && (
                <div
                    key="p2"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border border-rose-500/20 neon-glow-p2 z-10 p-8 shadow-2xl"
                >
                    <span className="text-[10px] font-black tracking-[0.3em] text-rose-400 bg-rose-950/40 border border-rose-800/30 px-4 py-1.5 rounded-full uppercase mb-4">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase text-center">
                        PLAYER 2 ROLL
                    </h2>
                    
                    <div className="scale-110 transform">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP2Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    
                    {p2Roll !== null && (
                        <div className="mt-8 flex flex-col items-center">
                            <button
                                onClick={() => setStep("RESULT")}
                                className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pop"
                            >
                                Show Results →
                            </button>
                            <p className="mt-3 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "RESULT" && (
                <div
                    key="res"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-800 z-20 p-8 shadow-2xl"
                >
                    <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-4 py-1.5 rounded-full uppercase mb-4">
                        Roll Overview
                    </span>
                    <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">
                        RESULTS
                    </h2>
                    
                    <div className="flex justify-center items-center gap-12 w-full max-w-sm mb-8 bg-white/[0.02] border border-white/[0.04] p-6 rounded-3xl">
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Player 1</span>
                            <span className="text-5xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">{p1Roll}</span>
                        </div>
                        <div className="w-[1px] h-14 bg-zinc-800" />
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Player 2</span>
                            <span className="text-5xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">{p2Roll}</span>
                        </div>
                    </div>

                    <div className={`mb-8 text-xs font-black tracking-widest uppercase px-8 py-4 rounded-2xl border text-center shadow-inner ${
                        p1Roll === p2Roll
                            ? "bg-amber-950/20 border-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                            : "bg-cyan-950/20 border-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                    }`}>
                        {p1Roll === p2Roll
                            ? "IT'S A TIE. RE-ROLLING!"
                            : `PLAYER ${p1Roll! > p2Roll! ? "1" : "2"} GOES FIRST`}
                    </div>

                    <button
                        onClick={handleResultNext}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                        {p1Roll === p2Roll ? "ROLL AGAIN" : "START GAME"}
                    </button>
                </div>
            )}

            {showIntroPopup && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in rounded-[2.5rem] border border-white/[0.08]">
                    <div className="w-16 h-16 bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-center rounded-full text-2xl mb-6 shadow-inner animate-pulse text-cyan-400">
                        🔊
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider">
                        Intro Audio Active
                    </h3>
                    <p className="text-xs text-zinc-500 font-bold max-w-xs leading-relaxed mb-8 uppercase tracking-widest">
                        The tutorial rules and audio sequence is playing on display.
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => {
                                AudioEngine.stopIntro();
                                sessionStorage.setItem("skipped_intro", "true");
                                setShowIntroPopup(false);
                            }}
                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                            Skip & Start Playing
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.setItem("skipped_intro", "true");
                                setShowIntroPopup(false);
                            }}
                            className="w-full py-3.5 bg-transparent border border-white/[0.08] hover:border-zinc-500/30 text-zinc-400 hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-xl active:scale-95 transition-all"
                        >
                            Let Intro Play
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
