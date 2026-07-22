export type DiceProps = {
    value: number;
    isRolling: boolean;
};

export default function Dice({ value, isRolling }: DiceProps) {
    return (
        <div
            className={`w-32 h-32 flex items-center justify-center transition-all duration-300
        ${isRolling
                    ? "animate-bounce rotate-12 scale-110 drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)]"
                    : "rotate-0 scale-100 drop-shadow-[0_8px_10px_rgba(0,0,0,0.1)]"
                }
      `}
        >
            <div className="w-full h-full bg-slate-800 flex items-center justify-center [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
                <span
                    className={`text-white font-black tracking-tighter ${value === 0 && !isRolling
                        ? "text-5xl text-slate-400"
                        : "text-5xl md:text-6xl"
                        }`}
                >
                    {value === 0 && !isRolling ? "?" : value}
                </span>
            </div>
        </div>
    );
}
