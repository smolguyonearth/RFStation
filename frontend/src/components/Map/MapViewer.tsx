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
    ownershipMap?: Record<string, number>;
}

export default function MapViewer({ selectedLand, onSelect, ownershipMap }: MapViewerProps) {
    const getFillColor = (lm: MapLocation) => {
        if (ownershipMap) {
            const owner = ownershipMap[lm.id];
            if (owner === 1) return "rgba(43, 182, 115, 0.6)"; // P1: Green
            if (owner === 2) return "rgba(255, 120, 153, 0.6)"; // P2: Pink
            if (owner === 3) return "rgba(245, 158, 11, 0.6)"; // Contested: #F59E0B
            return "rgba(0, 0, 0, 0.0)";
        }
        const ownerId = lm.ownerId;
        if (ownerId === "player_01") return "rgba(59, 130, 246, 0.6)";
        if (ownerId === "player_02") return "rgba(236, 72, 153, 0.6)";
        if (ownerId === "player_03") return "rgba(245, 158, 11, 0.6)";
        return "rgba(0, 0, 0, 0.0)";
    }

    const getStrokeColor = (lm: MapLocation, isSelected: boolean) => {
        if (isSelected) return "#F59E0B";

        if (ownershipMap) {
            const owner = ownershipMap[lm.id];
            if (owner === 1) return "#2BB673"; // P1 Green
            if (owner === 2) return "#FF7899"; // P2 Pink
            if (owner === 3) return "#F59E0B";
            return "transparent";
        }

        return lm.ownerId ? "#ffffff" : "transparent";
    }

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
                    className=""
                />
                <g style={{ mixBlendMode: "multiply" }}>
                    {Landmarks.map((lm) => {
                        const isSelected = selectedLand?.id === lm.id;
                        return (
                            <path
                                key={lm.id}
                                d={lm.d}
                                fill={getFillColor(lm)}
                                stroke={getStrokeColor(lm, isSelected)}
                                strokeWidth={isSelected || (ownershipMap && ownershipMap[lm.id]) ? "8" : "3"}
                                opacity={selectedLand ? (isSelected ? "1" : "0.3") : "1"}
                                className={`cursor-pointer transition-all duration-300 ${ownershipMap && ownershipMap[lm.id] ? "drop-shadow-md" : ""}`}
                                onClick={() => onSelect(lm)}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
