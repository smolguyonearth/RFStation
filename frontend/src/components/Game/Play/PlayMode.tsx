import DicePhase from "@/components/Game/Dice/DicePhase";

export default function PlayMode() {

    return (
        <div className="h-auto bg-brand-bg py-6 px-4 sm:px-6">
            <div className="max-w-6xl w-full mx-auto min-h-screen">
                <div className="bg-white rounded-3xl shadow-sm border border-brand-border/60 p-6 md:p-8 min-h-[80vh] flex flex-col">
                <DicePhase />
                </div>
                
            </div>
        </div>
    );
}
