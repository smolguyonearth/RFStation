import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { AudioEngine } from "@/lib/AudioEngine"
import Header from "@/components/Header"
import LatestPacket from "@/components/LatestPacket"
import HistoryList from "@/components/HistoryList"
import type { DeviceData } from "@/types/device.types"

export default function Monitor() {
    const [stream, setStream] = useState<DeviceData[]>([]);
    const [latest, setLatest] = useState<DeviceData | undefined>();
    const [isSystemActive, setIsSystemActive] = useState(false);

    const handleStart = () => {
        AudioEngine.init();
        setIsSystemActive(true);
    };

    useEffect(() => {
        if (!isSystemActive) return;

        async function init() {
            const { data } = await supabase
                .from("device_history")
                .select("*")
                .order("id", { ascending: false });

            if (data) {
                setStream(data);
                setLatest(data[0]);
            }
        }

        init();

        const channel = supabase
            .channel("db-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "device_history" },
                (payload) => {
                    const newData = payload.new as DeviceData;
                    setLatest(newData);
                    setStream((prev) => [newData, ...prev]);

                    AudioEngine.playZone(newData.zone_code);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isSystemActive]);

    return (
        <div className="min-h-screen bg-brand-bg py-8 px-4">
            <div className="max-w-6xl mx-auto w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-brand-border/60 p-6 md:p-10 min-h-[60vh]">
                    <Header />

                    {!isSystemActive ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📡</div>
                                <h2 className="text-2xl font-bold text-gray-700">
                                    Awaiting Transmissions...
                                </h2>
                                <p className="text-gray-500">
                                    System is ready. Click below to start monitoring.
                                </p>
                            </div>

                            <button
                                onClick={handleStart}
                                className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"
                            >
                                Start System
                            </button>
                        </div>
                    ) : (
                        
                        <div className="space-y-6">
                            <LatestPacket latest={latest} />
                            <HistoryList stream={stream} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}