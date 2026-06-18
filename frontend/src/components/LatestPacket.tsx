import type { DeviceData } from "@/types/devies.types";
import { Card, CardContent } from "../../@/components/ui/card";

type LatestPacketProps = {
    latest: DeviceData | undefined;
};

export default function LatestPacket({ latest }: LatestPacketProps) {
    return (
        <section className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-semibold">
                Latest Packet
            </h2>

            {latest ? (
                <Card className="border-slate-100 shadow-sm">
                    <CardContent className="pt-12 pb-10 text-center">
                        <div className="text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-10 leading-none">
                            {latest.device_code}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center max-w-xl mx-auto text-slate-500">
                            {/* Nearest Device */}
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                    Nearest
                                </div>
                                <div className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    {latest.nearest_device === "X"
                                        ? "None"
                                        : latest.nearest_device}
                                </div>
                            </div>

                            {/* RSSI */}
                            <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                    RSSI
                                </div>
                                <div
                                    className={`text-xl font-semibold ${latest.rssi > -60 ? "text-emerald-600" : "text-slate-800 dark:text-slate-200"}`}
                                >
                                    {latest.rssi}{" "}
                                    <span className="text-sm font-normal text-slate-400">
                                        dBm
                                    </span>
                                </div>
                            </div>

                            {/* Zone Code */}
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                    Zone
                                </div>
                                <div className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    {latest.zone_code}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-dashed border-slate-200 shadow-none">
                    <CardContent className="py-16 text-center text-slate-400">
                        <div className="text-base font-medium">Waiting for data...</div>
                        <div className="text-sm mt-1">
                            Ensure Raspberry Pi is sending packets to the backend.
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
