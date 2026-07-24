import { useState } from 'react';
import Dice from '@/components/Dice';
import { useSwipe } from '@/hooks/useSwipe';

export default function InitRollPhase({ gameState, startGame }: any) {
    const [step, setStep] = useState<"P1_ROLL" | "P2_ROLL" | "RESULT">("P1_ROLL");
    const [p1Roll, setP1Roll] = useState<number | null>(null);
    const [p2Roll, setP2Roll] = useState<number | null>(null);
    const [skippedIntro, setSkippedIntro] = useState(!!sessionStorage.getItem("skipped_intro"));

    const isIntroActive = gameState?.introActive && !skippedIntro;

    const handleBeforeRoll = () => {
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

    const handleSkipIntro = () => {
        fetch("/api/game/skip-intro", { method: "POST" })
            .catch(err => console.error(err));
        sessionStorage.setItem("skipped_intro", "true");
        setSkippedIntro(true);
    };

    const swipeHandlers = useSwipe(
        () => {
            // Swipe Left (Next)
            if (step === "P1_ROLL" && p1Roll !== null) setStep("P2_ROLL");
            if (step === "P2_ROLL" && p2Roll !== null) setStep("RESULT");
        },
        () => { }, // Swipe Right (Ignore)
    );

    // ========== INTRO SCREEN ==========
    if (isIntroActive) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center relative py-4 select-none">
                <div className="w-16 h-16 bg-[#FFFBE6] border border-[#FFE3B5] flex items-center justify-center rounded-full text-2xl mb-6 shadow-cute-sm animate-pulse">
                    🔊
                </div>
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
                    Phase 0: Introduction
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#333C4E] mb-2 tracking-widest uppercase text-center">
                    Playing Guide
                </h2>
                <p className="text-xs text-zinc-400 font-bold max-w-[220px] text-center leading-relaxed mb-10 uppercase">
                    Please listen to the instructions on the main display...
                </p>
                <button
                    onClick={handleSkipIntro}
                    className="px-8 py-3.5 bg-white border border-[#FFF0F3] text-zinc-500 font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFEBF0] hover:text-[#FF7899] transition-all shadow-cute-sm active:scale-95"
                >
                    Skip Intro
                </button>
            </div>
        );
    }

    // ========== DICE ROLL SCREEN ==========
    return (
        <div
            {...swipeHandlers}
            className={`w-full h-full flex flex-col items-center justify-center relative py-4 select-none ${swipeHandlers.className}`}
        >
            {step === "P1_ROLL" && (
                <div
                    key="p1"
                    className="w-full flex flex-col items-center justify-center animate-fade-in"
                >
                    <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#333C4E] mb-4 tracking-widest uppercase text-center">
                        Player 1 Roll
                    </h2>

                    <div className="my-4">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP1Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>

                    {p1Roll !== null && (
                        <div className="mt-6 flex flex-col items-center">
                            <button
                                onClick={() => setStep("P2_ROLL")}
                                className="px-8 py-3.5 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFD6E0] active:scale-95 transition-all shadow-cute-sm animate-pop"
                            >
                                Next: P2 Roll →
                            </button>
                            <p className="mt-2 text-[10px] text-zinc-400 font-bold tracking-wider">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "P2_ROLL" && (
                <div
                    key="p2"
                    className="w-full flex flex-col items-center justify-center animate-fade-in"
                >
                    <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
                        Phase 1: Roll Off
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#333C4E] mb-4 tracking-widest uppercase text-center">
                        Player 2 Roll
                    </h2>

                    <div className="my-4">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP2Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>

                    {p2Roll !== null && (
                        <div className="mt-6 flex flex-col items-center">
                            <button
                                onClick={() => setStep("RESULT")}
                                className="px-8 py-3.5 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFD6E0] active:scale-95 transition-all shadow-cute-sm animate-pop"
                            >
                                Show Results →
                            </button>
                            <p className="mt-2 text-[10px] text-zinc-400 font-bold tracking-wider">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "RESULT" && (
                <div
                    key="res"
                    className="w-full flex flex-col items-center justify-center animate-pop"
                >
                    <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                        Roll Overview
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#333C4E] mb-8 tracking-widest uppercase">
                        Results
                    </h2>

                    <div className="flex justify-center items-center gap-12 w-full max-w-sm mb-8 bg-white border border-[#FFF0F3] p-6 rounded-3xl shadow-cute">
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Player 1</span>
                            <span className="text-5xl font-extrabold text-indigo-600 font-mono">{p1Roll}</span>
                        </div>
                        <div className="w-[1px] h-16 bg-zinc-200" />
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-[11px] font-bold text-[#FF7899] uppercase tracking-wider">Player 2</span>
                            <span className="text-5xl font-extrabold text-[#FF7899] font-mono">{p2Roll}</span>
                        </div>
                    </div>

                    <div className={`mb-8 text-xs sm:text-sm font-extrabold tracking-widest uppercase px-8 py-4 rounded-2xl border text-center shadow-cute-sm ${
                        p1Roll === p2Roll
                            ? "bg-[#FFFBE6] border-[#FFE3B5] text-amber-800"
                            : "bg-[#E1F7EC] border-[#C2F0D9] text-emerald-800"
                    }`}>
                        {p1Roll === p2Roll
                            ? "IT'S A TIE. RE-ROLLING!"
                            : `PLAYER ${p1Roll! > p2Roll! ? "1" : "2"} GOES FIRST`}
                    </div>

                    <button
                        onClick={handleResultNext}
                        className="px-8 py-4 bg-[#333C4E] hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
                    >
                        {p1Roll === p2Roll ? "Roll Again" : "Start Game"}
                    </button>
                </div>
            )}
        </div>
    );
}
