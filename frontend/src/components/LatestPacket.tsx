import type { DeviceData } from "@/types/device.types"
import { Radio } from "lucide-react"

interface Props {
    latest?: DeviceData;
}


export default function LatestPacket({ latest }: Props) {
    return (
        <section className="mb-12">
            <h2 className="text-xs uppercase tracking-[2px] text-brand-accent mb-4 font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                Latest Packet
            </h2>

            {latest ? (
                <div className="bg-brand-primary rounded-3xl shadow-lg border border-brand-primary overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent opacity-20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                    <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-center md:text-left">
                            <div className="text-sm font-semibold text-brand-border mb-2 tracking-wider">
                                DEVICE CODE
                            </div>
                            <div className="text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-sm">
                                {latest.device_code}
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-8 flex-wrap justify-center bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 w-full md:w-auto">
                            <div className="text-center min-w-[80px]">
                                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-border mb-1.5 font-bold">
                                    Nearest
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {latest.nearest_device === "X"
                                        ? "None"
                                        : latest.nearest_device}
                                </div>
                            </div>

                            <div className="w-px bg-white/20"></div>

                            <div className="text-center min-w-[80px]">
                                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-border mb-1.5 font-bold">
                                    RSSI
                                </div>
                                <div
                                    className={`text-2xl font-bold ${latest.rssi > -60 ? "text-emerald-400" : "text-white"}`}
                                >
                                    {latest.rssi}{" "}
                                    <span className="text-sm text-brand-border font-medium">
                                        dBm
                                    </span>
                                </div>
                            </div>

                            <div className="w-px bg-white/20"></div>

                            <div className="text-center min-w-[80px]">
                                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-border mb-1.5 font-bold">
                                    Zone
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {latest.zone_code}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-brand-bg rounded-3xl border-2 border-brand-border border-dashed p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="bg-brand-border/30 p-4 rounded-full mb-6">
                        <Radio size={40} className="text-brand-accent animate-pulse" />
                    </div>
                    <div className="text-xl font-bold text-brand-primary mb-2">
                        Awaiting Transmissions...
                    </div>
                    <div className="text-sm text-brand-accent font-medium">
                        Listening to Raspberry Pi websocket stream on port 3000
                    </div>
                </div>
            )}
        </section>
    );
}