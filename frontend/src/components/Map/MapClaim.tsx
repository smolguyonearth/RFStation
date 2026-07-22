import { Landmarks } from "@/constants/landmark";
import mapVectorBg from "@/assets/Map_final_vecter.webp";

const PLAYER_COLORS: Record<string, string> = {
  player_1: "rgba(37, 99, 235, 0.6)", // Blue
  player_2: "rgba(5, 150, 105, 0.6)", // Emerald
};

const getConquerorColor = (ownerId: string | undefined) => {
  if (ownerId && PLAYER_COLORS[ownerId]) return PLAYER_COLORS[ownerId];
  return "rgba(0, 0, 0, 0.0)"; // โปร่งใสถ้าไม่มีเจ้าของ
};

interface MapViewerProps {
  landOwners: Record<string, string>;
  onLandClick: (landId: string) => void;
}

export default function MapViewer({ landOwners, onLandClick }: MapViewerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
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
          {Landmarks.map((lm) => {
            const currentOwner = landOwners[lm.id];
            return (
              <path
                key={lm.id}
                d={lm.d}
                fill={getConquerorColor(currentOwner)}
                stroke={currentOwner ? "#ffffff" : "transparent"}
                strokeWidth="3"
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => onLandClick(lm.id)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
