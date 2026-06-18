import type { DeviceData } from "../types/devies.types";
import Header from "../components/Header";
import LatestPacket from "../components/LatestPacket";
import PacketHistory from "../components/PacketHistory";

interface HomeProps {
    latest: DeviceData | undefined;
    stream: DeviceData[];
}

export default function Home({ latest, stream }: HomeProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-bg-main font-sans antialiased text-text-main animate-in fade-in duration-500">
            <header className="border border-purple-100 dark:border-nav-border bg-purple-50 dark:bg-nav-bg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 bg-linear-to-tr from-pink-500 dark:from-brand to-pink-200 dark:to-brand-light rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-brand/20">
                            M
                        </div>
                        <div>
                            <span className="font-bold text-lg text-black dark:text-text-main">
                                MoSCoW Station Monitor
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium tracking-wider uppercase">
                                KMUTT & University of Bremen Internship Project
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-emerald-500 font-medium uppercase tracking-wider">
                                Live Sync
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-white dark:bg-boardgame-card text-black dark:text-text-main border border-purple-100 dark:border-nav-border rounded-2xl min-h-screen shadow-xs">
                        <Header />

                        <div className="w-full">
                            <LatestPacket latest={latest} />
                        </div>

                        <div className="w-full pt-4">
                            <PacketHistory stream={stream} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
