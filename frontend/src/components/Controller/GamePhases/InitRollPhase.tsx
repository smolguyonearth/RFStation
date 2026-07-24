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
            className={`w-full h-full flex flex-col items-center justify-center relative py-12 select-none ${swipeHandlers.className}`}
        >
            {step === "P1_ROLL" && (
                <div
                    key="p1"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-indigo-50/20 rounded-[2.5rem] border border-indigo-100/60 z-10 p-8 shadow-sm"
                >
                    <span className="text-[9px] font-bold tracking-[0.25em] text-indigo-400 uppercase mb-3">
                        INITIALIZATION
                    </span>
                    <h2 className="text-3xl font-extralight text-indigo-600 mb-10 tracking-widest uppercase">
                        Player 1 Roll
                    </h2>
                    <div className="scale-110 transform">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP1Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    {p1Roll !== null && (
                        <div className="mt-10 flex flex-col items-center">
                            <button
                                onClick={() => setStep("P2_ROLL")}
                                className="px-8 py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/10 animate-pop"
                            >
                                Next: P2 Roll →
                            </button>
                            <p className="mt-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "P2_ROLL" && (
                <div
                    key="p2"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-slide-in-right bg-rose-50/20 rounded-[2.5rem] border border-rose-100/60 z-10 p-8 shadow-sm"
                >
                    <span className="text-[9px] font-bold tracking-[0.25em] text-rose-400 uppercase mb-3">
                        INITIALIZATION
                    </span>
                    <h2 className="text-3xl font-extralight text-rose-600 mb-10 tracking-widest uppercase">
                        Player 2 Roll
                    </h2>
                    <div className="scale-110 transform">
                        <Dice mode="D20" label="ROLL D20" onRoll={handleP2Roll} onBeforeRoll={handleBeforeRoll} />
                    </div>
                    {p2Roll !== null && (
                        <div className="mt-10 flex flex-col items-center">
                            <button
                                onClick={() => setStep("RESULT")}
                                className="px-8 py-3.5 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-600/10 animate-pop"
                            >
                                Show Results →
                            </button>
                            <p className="mt-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                                (Or Swipe Left)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {step === "RESULT" && (
                <div
                    key="res"
                    className="absolute inset-0 flex flex-col items-center justify-center animate-pop bg-white rounded-[2.5rem] border border-zinc-200/80 z-20 p-10 shadow-xl shadow-zinc-100/50"
                >
                    <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
                        RESULTS
                    </span>
                    <h2 className="text-3xl font-extralight text-zinc-800 mb-10 tracking-widest uppercase">
                        Roll Overview
                    </h2>
                    
                    <div className="flex space-x-16 text-3xl font-light mb-10">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Player 1</span>
                          <span className="text-4xl font-extrabold text-indigo-600">{p1Roll}</span>
                        </div>
                        <div className="w-[1px] bg-zinc-200" />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Player 2</span>
                          <span className="text-4xl font-extrabold text-rose-600">{p2Roll}</span>
                        </div>
                    </div>

                    <div className="mb-10 text-xs font-bold tracking-widest uppercase bg-zinc-50 text-zinc-600 px-8 py-4 rounded-2xl border border-zinc-200/80 shadow-inner text-center">
                        {p1Roll === p2Roll
                            ? "IT'S A TIE. RE-ROLLING!"
                            : `PLAYER ${p1Roll! > p2Roll! ? "1" : "2"} GOES FIRST`}
                    </div>

                    <button
                        onClick={handleResultNext}
                        className="px-8 py-4 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-900 active:scale-95 transition-all shadow-md shadow-zinc-900/10"
                    >
                        {p1Roll === p2Roll ? "ROLL AGAIN" : "START GAME"}
                    </button>
        </div>
      )}

      {showIntroPopup && (
        <div className="absolute inset-0 z-50 bg-[#F9F9FB]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in rounded-[2.5rem]">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-full text-2xl mb-6 shadow-inner animate-pulse">
            🔊
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-wide">
            Game Intro Narration
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed mb-10 uppercase tracking-widest">
            The rules and lore intro sequence is currently playing on the display monitor.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => {
                AudioEngine.stopIntro();
                sessionStorage.setItem("skipped_intro", "true");
                setShowIntroPopup(false);
              }}
              className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md"
            >
              Skip Intro & Start Play
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem("skipped_intro", "true");
                setShowIntroPopup(false);
              }}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              Let Intro Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
