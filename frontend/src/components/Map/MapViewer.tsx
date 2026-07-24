import { Landmarks } from "@/constants/landmark"
import mapVectorBg from "@/assets/Map_final_vecter.webp"
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
        <div className="w-full h-full flex items-center justify-center p-2 min-h-0">
            <svg
                viewBox="0 0 1024 1024"
                className="w-auto h-full max-w-full max-h-full object-contain mx-auto"
                xmlns="http://www.w3.org/2000/svg"
            >
                <image
                    href={mapVectorBg}
                    width="1024"
                    height="1024"
                    preserveAspectRatio="xMidYMid meet"
                />
                <g style={{ mixBlendMode: "multiply" }}>
                    {Landmarks.map((lm) => {
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
    );
}
