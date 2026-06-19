import { RadioTower } from "lucide-react"

export default function Header() {
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-border/40">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-border/30 rounded-xl text-brand-primary">
                    <RadioTower size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-brand-primary m-0">
                        Station{" "}
                        <span className="text-brand-accent font-medium">Monitor</span>
                    </h1>
                    <p className="text-sm text-brand-accent/80 font-medium mt-0.5">
                        Real-time IoT Packet Tracking
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5 bg-brand-bg px-4 py-2 rounded-full border border-brand-border/50 text-xs font-bold text-brand-accent uppercase tracking-[1px] self-start sm:self-auto shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Live Sync
            </div>
        </header>
    );
}
