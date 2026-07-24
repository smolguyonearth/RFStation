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
            className={`w-full h-full flex flex-col items-center justify-center relative py-4 select-none ${swipeHandlers.className}`}
        >
            {step === "P1_ROLL" && (
                <div
                    key="p1"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-white border border-zinc-200 rounded-2xl z-10 p-8 shadow-sm"
                >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase mb-4">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-xl font-medium text-zinc-800 mb-8 tracking-wide uppercase text-center">
                        Player 1 Roll
                    </h2>
                    
                    <div className="scale-100">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP1Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    
                    {p1Roll !== null && (
                        <div className="mt-8 flex flex-col items-center">
                            <button
                                onClick={() => setStep("P2_ROLL")}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm animate-pop"
                            >
                                Next: P2 Roll →
                            </button>
                            <p className="mt-2 text-[9px] text-zinc-400 tracking-wider">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "P2_ROLL" && (
                <div
                    key="p2"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-white border border-zinc-200 rounded-2xl z-10 p-8 shadow-sm"
                >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase mb-4">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-xl font-medium text-zinc-800 mb-8 tracking-wide uppercase text-center">
                        Player 2 Roll
                    </h2>
                    
                    <div className="scale-100">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP2Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    
                    {p2Roll !== null && (
                        <div className="mt-8 flex flex-col items-center">
                            <button
                                onClick={() => setStep("RESULT")}
                                className="px-6 py-2.5 bg-rose-600 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-rose-700 active:scale-95 transition-all shadow-sm animate-pop"
                            >
                                Show Results →
                            </button>
                            <p className="mt-2 text-[9px] text-zinc-400 tracking-wider">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "RESULT" && (
                <div
                    key="res"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white border border-zinc-200 rounded-2xl z-20 p-8 shadow-sm"
                >
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#6B7280] uppercase mb-4">
                        Roll Overview
                    </span>
                    <h2 className="text-xl font-light text-[#1F2937] mb-8 tracking-wide uppercase">
                        Results
                    </h2>
                    
                    <div className="flex justify-center items-center gap-10 w-full max-w-xs mb-8 bg-zinc-50 border border-zinc-100 p-5 rounded-xl">
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-[9px] font-medium text-indigo-600 uppercase tracking-wider">Player 1</span>
                            <span className="text-4xl font-extralight text-indigo-950 font-mono">{p1Roll}</span>
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-[9px] font-medium text-rose-600 uppercase tracking-wider">Player 2</span>
                            <span className="text-4xl font-extralight text-rose-950 font-mono">{p2Roll}</span>
                        </div>
                    </div>

                    <div className={`mb-8 text-xs font-medium tracking-wide uppercase px-6 py-3 rounded-lg border text-center ${
                        p1Roll === p2Roll
                            ? "bg-amber-50 border-amber-100 text-amber-700"
                            : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    }`}>
                        {p1Roll === p2Roll
                            ? "IT'S A TIE. RE-ROLLING!"
                            : `PLAYER ${p1Roll! > p2Roll! ? "1" : "2"} GOES FIRST`}
                    </div>

                    <button
                        onClick={handleResultNext}
                        className="px-6 py-3 bg-zinc-800 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-900 active:scale-95 transition-all shadow-sm"
                    >
                        {p1Roll === p2Roll ? "Roll Again" : "Start Game"}
                    </button>
                </div>
            )}

            {showIntroPopup && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fade-in rounded-2xl border border-zinc-200">
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-200/60 flex items-center justify-center rounded-full text-lg mb-4 shadow-sm animate-pulse text-zinc-500">
                        🔊
                    </div>
                    <h3 className="text-lg font-medium text-zinc-800 mb-2 uppercase tracking-wide">
                        Intro Audio Active
                    </h3>
                    <p className="text-xs text-zinc-500 font-light max-w-xs leading-relaxed mb-8">
                        The tutorial and intro sequence is playing on the main display.
                    </p>
                    <div className="flex flex-col gap-2.5 w-full max-w-xs">
                        <button
                            onClick={() => {
                                AudioEngine.stopIntro();
                                sessionStorage.setItem("skipped_intro", "true");
                                setShowIntroPopup(false);
                            }}
                            className="w-full py-2.5 bg-zinc-800 text-white font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-900 active:scale-95 transition-all"
                        >
                            Skip & Start
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.setItem("skipped_intro", "true");
                                setShowIntroPopup(false);
                            }}
                            className="w-full py-2.5 bg-white border border-zinc-200 text-zinc-600 font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-50 active:scale-95 transition-all"
                        >
                            Let Intro Play
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
