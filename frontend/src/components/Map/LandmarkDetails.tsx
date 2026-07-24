import { useState } from "react"
import { X, Gem, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { MapLocation } from "@/types/map.types"

interface LandmarkDetailsProps {
  land: MapLocation;
  onClose: () => void;
  className?: string;
  hideGameplayDetails?: boolean;
  flat?: boolean;
}

export default function LandmarkDetails({
  land,
  onClose,
  className = "w-full lg:w-[45%]",
  hideGameplayDetails = false,
  flat = false,
}: LandmarkDetailsProps) {
  const { t } = useTranslation();
  const [isFullView, setIsFullView] = useState(false);

  const landmarkImage = land.image;

  return (
    <div className={`${className} animate-in fade-in slide-in-from-bottom-8 duration-500`}>
      <div className={flat ? "h-full flex flex-col justify-between" : "bg-white rounded-[2rem] border border-[#FFF0F3] shadow-cute p-6 lg:p-8 h-full flex flex-col justify-between"}>
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#333C4E] tracking-wide uppercase">
              {t(land.name)}
            </h3>
            {!hideGameplayDetails && (
              <div className="inline-block mt-2 px-3 py-1 bg-[#FFEBF0] rounded-xl border border-[#FFD6E0] text-[10px] font-bold text-[#FF7899] uppercase tracking-wider shadow-cute-xs">
                {t("map.owner")}:{" "}
                {land.ownerId ? land.ownerId : t("map.unclaimed")}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] rounded-xl shadow-cute-xs hover:bg-[#FFD6E0] transition-colors"
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div className="text-xs text-zinc-500 font-bold leading-relaxed mb-6 max-h-[30vh] overflow-y-auto pr-2">
          {land.description ? t(land.description) : t("map.no_description")}
        </div>

        {/* Stats Grid */}
        {!hideGameplayDetails && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFEBF0] p-4 rounded-xl border border-[#FFD6E0] shadow-cute-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF7899] uppercase mb-1 tracking-wider">
                <Gem size={14} /> {t("map.points")}
              </div>
              <span className="text-2xl font-extrabold text-[#FF7899] font-mono">
                {land.points || 0}
              </span>
            </div>
            <div className="bg-[#E1F7EC] p-4 rounded-xl border border-[#C2F0D9] shadow-cute-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2BB673] uppercase mb-1 tracking-wider">
                <Shield size={14} /> {t("map.status")}
              </div>
              <span className="text-xs font-bold text-[#2BB673] mt-1 block uppercase">
                {land.ownerId ? t("map.secured") : t("map.available")}
              </span>
            </div>
          </div>
        )}

        {/* Landmark Image Section */}
        {landmarkImage && (
          <div
            className="mt-6 text-center cursor-pointer group"
            onClick={() => setIsFullView(true)}
          >
            <img
              src={landmarkImage}
              alt={t(land.name)}
              className="mx-auto h-28 rounded-2xl object-cover border border-[#FFF0F3] shadow-cute-sm group-hover:scale-[1.02] transition-transform duration-300 w-full"
            />

            {/* Source Display */}
            {land.imageSource && (
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-3 italic">
                Source: {land.imageSource}
              </p>
            )}

            <p className="text-[10px] text-[#FF7899] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
              {t("Click to expand")}
            </p>
          </div>
        )}
      </div>

      {/* Modal Full View */}
      {isFullView && landmarkImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in"
          onClick={() => setIsFullView(false)}
        >
          <button
            className="absolute top-5 right-5 text-white bg-[#FF7899] border border-[#FFD6E0] p-2 rounded-full hover:bg-[#FFD6E0] transition-colors shadow-sm"
            onClick={() => setIsFullView(false)}
          >
            <X size={24} />
          </button>
          <img
            src={landmarkImage}
            alt={t(land.name)}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl border-[3px] border-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
