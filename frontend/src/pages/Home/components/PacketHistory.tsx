import type { DeviceData } from "@/types/devies.types"
import { Button } from "../../../components/ui/button"
import { useState } from "react";

type PacketHistoryProps = {
    stream: DeviceData[];
};

export default function PacketHistory({ stream }: PacketHistoryProps) {
    const [showHistory, setShowHistory] = useState(false);

    if (stream.length === 0) return null;

    return (
        <section className="text-center pb-16">
            <Button
                variant={showHistory ? "outline" : "default"}
                onClick={() => setShowHistory(!showHistory)}
                className="transition-all duration-200"
            >
                {showHistory ? "Hide History" : "Tap to see top 100 history realtime"}
            </Button>

            {showHistory && (
                <div className="mt-10 flex flex-col gap-3 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between px-5 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        <span>Device Path</span>
                        <span>Metrics</span>
                    </div>

                    {stream.map((data) => (
                        <div
                            key={data.id}
                            className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-100/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                    {data.device_code}
                                </span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-slate-300"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                                <span className="text-sm text-slate-400 font-medium">
                                    {data.nearest_device === "X" ? "None" : data.nearest_device}
                                </span>
                            </div>

                            <div className="flex gap-4 items-center text-sm">
                                <span className="text-slate-400 font-medium text-xs bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {data.zone_code}
                                </span>
                                <span
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold min-w-12.5 text-center ${data.rssi > -60
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                            : "bg-slate-200/60 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        }`}
                                >
                                    {data.rssi}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
