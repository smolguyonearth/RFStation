import { mockLandmarks } from "../data/map.mock"
import mapVectorBg from "../assets/Map_final_vecter.webp"
import type { MapLocation } from "@/types/map.types"

const getConquerorColor = (ownerId: string | null) => {
    if (ownerId === "player_01") return "rgba(59, 130, 246, 0.6)";
    if (ownerId === "player_02") return "rgba(236, 72, 153, 0.6)";
    if (ownerId === "player_03") return "rgba(245, 158, 11, 0.6)";
    return "rgba(0, 0, 0, 0.0)";
}

interface MapViewerProps {
    selectedLand: MapLocation | null;
    onSelect: (land: MapLocation) => void;
}

export default function MapViewer({ selectedLand, onSelect }: MapViewerProps) {
    return (
        <div
            className={`transition-all duration-500 w-full ${selectedLand ? "lg:w-[55%]" : "max-w-3xl mx-auto"}`}
        >
            <div className="w-full h-full flex items-center justify-center">
                <div className="aspect-4/3 w-full flex items-center justify-center">
                    <svg
                        viewBox="0 0 1024 1024"
                        className="h-full w-auto"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <image
                            href={mapVectorBg}
                            width="1024"
                            height="1024"
                            preserveAspectRatio="xMidYMid meet"
                        />
                        <g style={{ mixBlendMode: "multiply" }}>
                            {mockLandmarks.map((lm) => {
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
                                        opacity={selectedLand ? (isSelected ? "1" : "0.3") : "1"}
                                        className="cursor-pointer transition-all duration-300"
                                        onClick={() => onSelect(lm)}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}
