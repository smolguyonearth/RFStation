import { useState } from "react";
import type { DeviceData } from "@/types/device.types";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
    stream: DeviceData[];
    playingId?: number | null;
}

export default function HistoryList({ stream }: Props) {
    const [showHistory, setShowHistory] = useState(false);
    if (stream.length === 0) return null;
    const latestId = stream[0]?.id;

    return (
        <section className="pb-8">
            <div className="flex justify-center">
                <button
                    className="group px-8 py-3.5 bg-white border-2 border-brand-border text-brand-primary rounded-xl font-bold hover:border-brand-accent hover:text-brand-accent transition-all flex items-center gap-3 shadow-sm hover:shadow-md"
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? "Hide Live History" : "View Live History Stream"}
                    {showHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {showHistory && (
                <div className="mt-10 flex flex-col gap-2">
                    <div className="grid grid-cols-2 px-6 pb-2 text-xs uppercase tracking-[1.5px] text-brand-accent font-bold border-b border-brand-border/50">
                        <span>Transmission Path</span>
                        <span className="text-right">Metrics & ID</span>
                    </div>

                    <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar pt-2">
                        {stream.map((data) => {
                            const isNew = data.id === latestId;

                            return (
                                <div
                                    key={data.id}
                                    className={`relative flex justify-between items-center px-6 py-4 rounded-xl border transition-all duration-300 mb-2 ${isNew
                                            ? "bg-emerald-50 border-emerald-200"
                                            : "bg-white border-brand-border/50"
                                        }`}
                                >
                                    {isNew && (
                                        <span className="absolute -top-2 left-6 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                            Latest Sync
                                        </span>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-base text-brand-primary w-12">
                                            {data.device_code}
                                        </span>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-bg text-brand-accent">
                                            <ArrowRight size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-brand-accent font-semibold w-12">
                                            {data.nearest_device === "X"
                                                ? "N/A"
                                                : data.nearest_device}
                                        </span>
                                    </div>

                                    <div className="flex gap-6 items-center text-sm">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-brand-accent/70 font-bold uppercase">
                                                Zone
                                            </span>
                                            <span className="text-brand-primary font-bold">
                                                {data.zone_code}
                                            </span>
                                        </div>
                                        <div
                                            className={`px-3 py-1.5 rounded-lg font-bold text-xs min-w-15 text-center ${data.rssi > -60 ? "bg-emerald-100 text-emerald-700" : "bg-brand-bg text-brand-accent"}`}
                                        >
                                            {data.rssi} dB
                                        </div>
                                        <div className="text-[9px] text-brand-accent/40 font-mono w-10 text-right">
                                            #{data.id}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
