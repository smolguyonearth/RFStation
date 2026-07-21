import { useEffect, useState } from "react"
// [DB DISABLED] Database is disabled. To re-enable, see docs/DB_ACTIVATE.md
// import { supabase } from "@/lib/supabaseClient"
import { AudioEngine } from "@/lib/AudioEngine"
import Header from "@/components/Monitor/Header"
import LatestPacket from "@/components/Monitor/LatestPacket"
import HistoryList from "@/components/Monitor/HistoryList"
import type { DeviceData } from "@/types/device.types"

export default function Monitor() {
    const [stream, setStream] = useState<DeviceData[]>([]);
    const [latestByDevice, setLatestByDevice] = useState<Record<string, DeviceData>>({});
    const [isSystemActive, setIsSystemActive] = useState(false);

    const handleStart = () => {
        AudioEngine.init();
        setIsSystemActive(true);
    };

    useEffect(() => {
        if (!isSystemActive) return;

        // [DB DISABLED] Previously loaded history from Supabase on page load.
        // Now starts empty and relies on WebSocket for real-time data.
        // To re-enable, see docs/DB_ACTIVATE.md
        // async function init() {
        //     const { data } = await supabase
        //         .from("device_history")
        //         .select("*")
        //         .order("id", { ascending: false });
        //     if (data) {
        //         setStream(data);
        //         const latestMap: Record<string, DeviceData> = {};
        //         for (const packet of data) {
        //             if (!latestMap[packet.device_code]) {
        //                 latestMap[packet.device_code] = packet;
        //             }
        //         }
        //         setLatestByDevice(latestMap);
        //     }
        // }
        // init();

        const ws = new WebSocket(`ws://${window.location.host}/ws`);

        ws.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data) as DeviceData;
                
                setLatestByDevice((prev) => ({
                    ...prev,
                    [newData.device_code]: newData
                }));
                
                setStream((prev) => [newData, ...prev]);

                if (newData.nearest_device !== "X") {
                    AudioEngine.playZone(newData.nearest_device);
                }
            } catch (err) {
                console.error("Failed to parse ws message", err);
            }
        };

        return () => {
            ws.close();
        };
    }, [isSystemActive]);

    const activeDevices = Object.values(latestByDevice).sort((a, b) => a.device_code.localeCompare(b.device_code));

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
                            {activeDevices.length > 0 ? (
                                <div className={`grid gap-6 ${activeDevices.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                                    {activeDevices.map(latest => (
                                        <LatestPacket key={latest.device_code} latest={latest} />
                                    ))}
                                </div>
                            ) : (
                                <LatestPacket latest={undefined} />
                            )}
                            <HistoryList stream={stream} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}