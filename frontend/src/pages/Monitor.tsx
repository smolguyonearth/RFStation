import { useDeviceStream } from "@/hook/useDeviceStream";
import Header from "@/components/Header";
import LatestPacket from "@/components/LatestPacket";
import HistoryList from "@/components/HistoryList";

export default function App() {
    const { stream, latest } = useDeviceStream();

    return (
        <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto w-full">
                {/* Main Dashboard Container */}
                <div className="bg-white rounded-[24px] shadow-sm border border-brand-border/60 p-6 md:p-10 min-h-[80vh]">
                    <Header />
                    <LatestPacket latest={latest} />
                    <HistoryList stream={stream} />
                </div>
            </div>
        </div>
    );
}
