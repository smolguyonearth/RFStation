import { useState, useEffect } from 'react';
import Dice from '@/components/Dice';
import { useTranslation } from "react-i18next";

export default function InitRollPhase({ gameState, startGame }: any) {
    const { t } = useTranslation();
    const [step, setStep] = useState<"P1_ROLL" | "P2_ROLL" | "RESULT">("P1_ROLL");
    const [p1Roll, setP1Roll] = useState<number | null>(null);
    const [p2Roll, setP2Roll] = useState<number | null>(null);
    const [skippedIntro, setSkippedIntro] = useState(!!sessionStorage.getItem("skipped_intro"));

    useEffect(() => {
        if (gameState?.introActive) {
            setStep("P1_ROLL");
            setP1Roll(null);
            setP2Roll(null);
            setSkippedIntro(false);
        }
    }, [gameState?.introActive]);

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

    // ========== INTRO SCREEN ==========
    if (isIntroActive) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center relative py-4">
                <div className="w-16 h-16 bg-[#FFFBE6] border border-[#FFE3B5] flex items-center justify-center rounded-full text-2xl mb-6 shadow-cute-sm animate-pulse">
                    🔊
                </div>
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#3F72AF] bg-[#3F72AF]/10 border border-[#3F72AF]/20 px-4 py-2 rounded-full uppercase mb-4 shadow-cute-xs">
                    {t("game.intro_tag")}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#333C4E] mb-2 tracking-widest uppercase text-center">
                    {t("game.guide_title")}
                </h2>
                <p className="text-xs text-zinc-400 font-bold max-w-[220px] text-center leading-relaxed mb-10 uppercase">
                    {t("game.intro_desc")}
                </p>
                <button
                    data-testid="skip-intro-btn"
                    onTouchStart={(e) => {
                        handleSkipIntro();
                        if (e.cancelable) e.preventDefault();
                    }}
                    onClick={handleSkipIntro}
                    className="px-8 py-3.5 bg-white border border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:border-[#3F72AF] hover:text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all duration-300 active:scale-95"
                >
                    {t("game.skip_intro")}
                </button>
            </div>
        );
    }

    // ========== DICE ROLL SCREEN ==========
    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative py-4"
        >
            {step === "P1_ROLL" && (
                <div
                    key="p1"
                    className="w-full flex flex-col items-center justify-center animate-fade-in"
                >
                    <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#3F72AF] bg-[#3F72AF]/10 border border-[#3F72AF]/20 px-4 py-2 rounded-full uppercase mb-2 shadow-cute-xs">
                        {t("init_roll.phase_title")}
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#333C4E] mb-2 tracking-widest uppercase text-center">
                        {t("init_roll.p1_roll")}
                    </h2>

                    <div className="my-2">
                        <Dice mode="D20" label={t("dice.roll", { mode: "D20" })} onRoll={handleP1Roll} onBeforeRoll={handleBeforeRoll} playerId={1} />
                    </div>

                    {p1Roll !== null && (
                        <div className="mt-2 lg:mt-4 flex flex-col items-center">
                            <button
                                data-testid="p1-roll-next-btn"
                                onTouchStart={(e) => {
                                    setStep("P2_ROLL");
                                    if (e.cancelable) e.preventDefault();
                                }}
                                onClick={() => setStep("P2_ROLL")}
                                className="px-8 py-3.5 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#BFDBFE] hover:text-white active:scale-95 transition-all shadow-cute-sm animate-pop"
                            >
                                {t("init_roll.next_p2")}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === "P2_ROLL" && (
                <div
                    key="p2"
                    className="w-full flex flex-col items-center justify-center animate-fade-in"
                >
                    <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#3F72AF] bg-[#3F72AF]/10 border border-[#3F72AF]/20 px-4 py-2 rounded-full uppercase mb-2 shadow-cute-xs">
                        {t("init_roll.phase_title")}
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#333C4E] mb-2 tracking-widest uppercase text-center">
                        {t("init_roll.p2_roll")}
                    </h2>

                    <div className="my-2">
                        <Dice mode="D20" label={t("dice.roll", { mode: "D20" })} onRoll={handleP2Roll} onBeforeRoll={handleBeforeRoll} playerId={2} />
                    </div>

                    {p2Roll !== null && (
                        <div className="mt-2 lg:mt-4 flex flex-col items-center">
                            <button
                                data-testid="p2-roll-next-btn"
                                onTouchStart={(e) => {
                                    setStep("RESULT");
                                    if (e.cancelable) e.preventDefault();
                                }}
                                onClick={() => setStep("RESULT")}
                                className="px-8 py-3.5 bg-[#FC5185]/10 text-[#FC5185] border border-[#FC5185]/20 font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FC5185] hover:text-white active:scale-95 transition-all duration-300 shadow-sm animate-pop"
                            >
                                {t("init_roll.show_results")}
                            </button>
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
                        {t("init_roll.overview")}
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#333C4E] mb-8 tracking-widest uppercase">
                        {t("init_roll.results")}
                    </h2>

                    <div className="flex justify-center items-center gap-12 w-full max-w-sm mb-8 bg-white border border-[#FFF0F3] p-6 rounded-3xl shadow-cute">
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider">{t("game.p1")}</span>
                            <span className="text-5xl font-extrabold text-[#3B82F6] font-mono">{p1Roll}</span>
                        </div>
                        <div className="w-[1px] h-16 bg-zinc-200" />
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">{t("game.p2")}</span>
                            <span className="text-5xl font-extrabold text-[#EF4444] font-mono">{p2Roll}</span>
                        </div>
                    </div>

                    <div className={`mb-8 text-xs sm:text-sm font-extrabold tracking-widest uppercase px-8 py-4 rounded-2xl border text-center shadow-cute-sm ${p1Roll === p2Roll
                        ? "bg-[#FCE38A]/20 border-[#FCE38A] text-amber-900" // กรณีเสมอ
                        : p1Roll! > p2Roll!
                            ? "bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]" // กรณี Player 1 ชนะ
                            : "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]" // กรณี Player 2 ชนะ
                        }`}>
                        {p1Roll === p2Roll
                            ? t("init_roll.tie")
                            : t("init_roll.goes_first", { player: p1Roll! > p2Roll! ? 1 : 2 })}
                    </div>

                    <button
                        data-testid="start-game-btn"
                        onTouchStart={(e) => {
                            handleResultNext();
                            if (e.cancelable) e.preventDefault();
                        }}
                        onClick={handleResultNext}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-emerald-100 active:scale-95"
                    >
                        {p1Roll === p2Roll ? t("init_roll.roll_again") : t("init_roll.start_game")}
                    </button>
                </div>
            )}
        </div>
    );
}
