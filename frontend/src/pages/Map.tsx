import { useState } from "react";
import { Map as MapIcon, Shield, Gem, X } from "lucide-react";
import mapVectorBg from "../assets/Map_final_vecter.webp";
import { mockLandmarks } from "../data/map.mock";
import type { MapLocation } from "@/types/map.types";

const getConquerorColor = (ownerId: string | null) => {
    if (ownerId === "player_01") return "rgba(59, 130, 246, 0.6)";
    if (ownerId === "player_02") return "rgba(236, 72, 153, 0.6)";
    if (ownerId === "player_03") return "rgba(245, 158, 11, 0.6)";
    return "rgba(0, 0, 0, 0.0)";
};

export default function ConqueredLandBoard() {
    const [landmarks] = useState<MapLocation[]>(mockLandmarks);
    const [selectedLand, setSelectedLand] = useState<MapLocation | null>(null);

    const isSomethingSelected = selectedLand !== null;

    return (
        <div className="h-[calc(100vh-70px)] w-full flex flex-col bg-brand-bg font-sans overflow-hidden transition-colors duration-300">
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-brand-border/60 flex flex-col min-h-0 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 md:px-8 md:py-5 flex items-center justify-between gap-4 border-b border-brand-border/40 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-brand-border/30 rounded-xl text-brand-primary">
                                <MapIcon size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-brand-primary tracking-tight m-0">
                                    Conquered{" "}
                                    <span className="text-brand-accent font-medium">Land</span>
                                </h2>
                                <p className="text-xs text-brand-accent/80 font-medium mt-0.5">
                                    Territory control overview
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div
                        className={`flex-1 flex flex-col lg:flex-row w-full p-4 md:p-6 lg:p-8 gap-6 lg:gap-8 transition-all duration-500 min-h-0 ${selectedLand
                                ? "items-start justify-start"
                                : "items-center justify-center"
                            }`}
                    >
                        {/* Map Viewer Container */}
                        <div
                            className={`relative h-full flex justify-center items-center shrink-0 transition-all duration-500 min-h-0 ${selectedLand ? "w-full lg:w-[50%]" : "w-full flex-1"
                                }`}
                        >
                            <div className="relative aspect-square h-full max-w-full bg-brand-bg rounded-2xl overflow-hidden border border-brand-border shadow-inner p-2 lg:p-4 flex justify-center items-center transition-all duration-500">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <image
                                        href={mapVectorBg}
                                        width="1024"
                                        height="1024"
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                    <g style={{ mixBlendMode: "multiply" }}>
                                        {landmarks.map((lm) => {
                                            const isSelected = selectedLand?.id === lm.id;

                                            return (
                                                <path
                                                    key={lm.id}
                                                    d={lm.d}
                                                    fill={getConquerorColor(lm.ownerId)}
                                                    stroke={
                                                        isSelected
                                                            ? "#F59E0B"
                                                            : lm.ownerId
                                                                ? "#ffffff"
                                                                : "transparent"
                                                    }
                                                    strokeWidth={isSelected ? "8" : "3"}
                                                    opacity={
                                                        isSomethingSelected
                                                            ? isSelected
                                                                ? "1"
                                                                : "0.3"
                                                            : "1"
                                                    }
                                                    className={`transition-all duration-300 cursor-pointer ${isSelected
                                                            ? "drop-shadow-lg"
                                                            : "hover:opacity-80 hover:stroke-[4px]"
                                                        }`}
                                                    onClick={() => setSelectedLand(lm)}
                                                >
                                                    <title>{lm.name}</title>
                                                </path>
                                            );
                                        })}
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        {selectedLand && (
                            <div className="w-full lg:w-[45%] h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both overflow-y-auto custom-scrollbar pr-1">
                                <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 lg:p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-brand-primary">
                                                {selectedLand.name}
                                            </h3>
                                            <div className="inline-flex items-center gap-2 mt-2">
                                                <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider bg-brand-bg px-3 py-1 rounded-full border border-brand-border/50">
                                                    Owner:{" "}
                                                    <span className="text-brand-primary">
                                                        {selectedLand.ownerId || "Unclaimed"}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedLand(null)}
                                            className="p-2 bg-brand-bg hover:bg-brand-border/50 rounded-xl text-brand-accent border border-brand-border/50 transition-colors shadow-sm shrink-0"
                                        >
                                            <X size={20} strokeWidth={3} />
                                        </button>
                                    </div>

                                    <div className="w-full h-px bg-brand-border/50 my-6"></div>

                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold text-brand-accent uppercase mb-2">
                                            Description
                                        </h4>
                                        <p className="text-sm text-brand-primary/80 leading-relaxed">
                                            {selectedLand.description ||
                                                "No description available for this zone."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-brand-bg p-4 rounded-xl border border-brand-border/50 flex flex-col gap-1.5 shadow-sm">
                                            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase">
                                                <Gem size={16} className="text-emerald-500" /> Points
                                            </div>
                                            <span className="text-2xl font-extrabold text-brand-primary">
                                                {selectedLand.points || 0}
                                            </span>
                                        </div>
                                        <div className="bg-brand-bg p-4 rounded-xl border border-brand-border/50 flex flex-col gap-1.5 shadow-sm">
                                            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase">
                                                <Shield size={16} className="text-blue-500" /> Status
                                            </div>
                                            <span className="text-lg font-bold text-brand-primary mt-0.5">
                                                {selectedLand.ownerId ? "Secured" : "Available"}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedLand.resources &&
                                        selectedLand.resources.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-brand-accent uppercase mb-3">
                                                    Resources
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedLand.resources.map((res) => (
                                                        <span
                                                            key={res}
                                                            className="text-xs font-bold text-brand-primary bg-white border-2 border-brand-border px-3 py-1.5 rounded-lg shadow-sm"
                                                        >
                                                            {res}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>

                    {!selectedLand && (
                        <div className="shrink-0 pb-6 text-center animate-in fade-in duration-700">
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-bg rounded-full border border-brand-border text-sm font-semibold text-brand-accent shadow-sm hover:bg-brand-border/30 transition-colors">
                                <MapIcon size={16} />
                                Click on any colored zone on the map to view details
                            </span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
