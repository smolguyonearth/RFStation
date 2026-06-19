import { useState } from "react"
import { Map as MapIcon } from "lucide-react"
import mapVectorBg from "@/assets/Map_final_vecter.svg"
import { mockLandmarks } from "../data/map.mock"

const getConquerorColor = (ownerId: string | null) => {
    if (ownerId === "player_01") return "rgba(59, 130, 246, 0.6)";
    if (ownerId === "player_02") return "rgba(236, 72, 153, 0.6)";
    if (ownerId === "player_03") return "rgba(245, 158, 11, 0.6)";
    return "rgba(0, 0, 0, 0.0)";
};

export default function ConqueredLandBoard() {
    const [landmarks] = useState(mockLandmarks);

    return (
        <div className="min-h-screen flex flex-col bg-brand-bg font-sans transition-colors duration-300">
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Main Dashboard Container */}
                <div className="bg-white rounded-[24px] shadow-sm border border-brand-border/60 overflow-hidden min-h-[80vh]">
                    {/* Header */}
                    <div className="p-6 md:px-10 md:py-8 flex items-center gap-4 border-b border-brand-border/40">
                        <div className="p-3 bg-brand-border/30 rounded-xl text-brand-primary">
                            <MapIcon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-primary tracking-tight m-0">
                                Conquered{" "}
                                <span className="text-brand-accent font-medium">Land</span>
                            </h2>
                            <p className="text-sm text-brand-accent/80 font-medium mt-0.5">
                                Territory control overview
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col lg:flex-row w-full p-6 md:p-10 gap-8 items-center lg:items-stretch">
                        {/* Left Placeholder */}
                        <div className="flex-1 w-full lg:w-1/5 flex items-center justify-center bg-brand-bg/50 rounded-2xl border-2 border-brand-border/40 border-dashed p-6 text-center min-h-[150px]">
                            <span className="text-brand-accent font-medium text-sm">
                                Wait for add element
                            </span>
                        </div>

                        {/* Map Viewer */}
                        <div className="w-full max-w-[500px] lg:max-w-[600px] aspect-square flex justify-center items-center">
                            <div className="relative w-full h-full bg-brand-bg rounded-2xl overflow-hidden border border-brand-border shadow-inner p-2 lg:p-4">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    className="w-full h-full object-contain"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <image
                                        href={mapVectorBg}
                                        width="1024"
                                        height="1024"
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                    <g style={{ mixBlendMode: "multiply" }}>
                                        {landmarks.map((lm) => (
                                            <path
                                                key={lm.id}
                                                d={lm.d}
                                                fill={getConquerorColor(lm.ownerId)}
                                                stroke={lm.ownerId ? "#ffffff" : "transparent"}
                                                strokeWidth="3"
                                                className="transition-all duration-300 hover:opacity-80 hover:stroke-[4px] cursor-pointer drop-shadow-sm"
                                                onClick={() => alert(`Name: ${lm.name}`)}
                                            >
                                                <title>{lm.name}</title>
                                            </path>
                                        ))}
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* Right Placeholder */}
                        <div className="flex-1 w-full lg:w-1/5 flex items-center justify-center bg-brand-bg/50 rounded-2xl border-2 border-brand-border/40 border-dashed p-6 text-center min-h-[150px]">
                            <span className="text-brand-accent font-medium text-sm">
                                Wait for add element
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
