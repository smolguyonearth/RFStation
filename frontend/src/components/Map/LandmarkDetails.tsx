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
  layout?: "vertical" | "split";
  hideClose?: boolean;
}

export default function LandmarkDetails({
  land,
  onClose,
  className = "w-full lg:w-[45%]",
  hideGameplayDetails = false,
  flat = false,
  layout = "vertical",
  hideClose = false,
}: LandmarkDetailsProps) {
  const { t } = useTranslation();
  const [isFullView, setIsFullView] = useState(false);

  const landmarkImage = land.image;

  return (
    <div className={`${className} animate-in fade-in slide-in-from-bottom-8 duration-500`}>
      <div className={flat ? "h-full flex flex-col justify-between" : "bg-white rounded-[2rem] border border-[#FFF0F3] shadow-cute p-6 lg:p-10 h-full flex flex-col justify-between"}>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-[#333C4E] tracking-wider uppercase">
              {t(land.name)}
            </h3>
            {!hideGameplayDetails && (
              <div className="inline-block mt-2 px-3 py-1 bg-[#FFEBF0] rounded-xl border border-[#FFD6E0] text-[10px] font-bold text-[#FF7899] uppercase tracking-wider shadow-cute-xs">
                {t("map.owner")}:{" "}
                {land.ownerId ? land.ownerId : t("map.unclaimed")}
              </div>
            )}
          </div>
          {!hideClose && (
            <button
              onClick={onClose}
              className="p-2.5 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] rounded-xl shadow-cute-xs hover:bg-[#FF7899] hover:text-white transition-all duration-300"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {layout === "split" ? (
          /* Split Layout (2 Columns for wide displays) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start flex-grow">
            {/* Left Column: Details (7/12 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full py-2">
              <div className="text-sm sm:text-base lg:text-[1.05rem] text-zinc-500 font-medium leading-relaxed mb-6 overflow-y-auto pr-3 max-h-[50vh] scrollbar-thin">
                {land.description ? t(land.description) : t("map.no_description")}
              </div>

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
            </div>

            {/* Right Column: Image (5/12 cols) */}
            {landmarkImage && (
              <div
                className="lg:col-span-5 text-center cursor-pointer group w-full flex flex-col items-center justify-center"
                onClick={() => setIsFullView(true)}
              >
                <div className="overflow-hidden rounded-[2.2rem] border border-[#FFF0F3] shadow-cute w-full aspect-[4/3] max-h-[360px] bg-zinc-50">
                  <img
                    src={landmarkImage}
                    alt={t(land.name)}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>

                {land.imageSource && (
                  <p className="text-[9px] text-zinc-400 font-bold uppercase mt-3 tracking-wider italic">
                    Source: {land.imageSource}
                  </p>
                )}

                <p className="text-[10px] text-[#FF7899] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                  {t("Click to expand")}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Standard Vertical Layout */
          <div className="flex flex-col flex-grow justify-between">
            <div className="text-xs text-zinc-500 font-bold leading-relaxed mb-6 max-h-[30vh] overflow-y-auto pr-2">
              {land.description ? t(land.description) : t("map.no_description")}
            </div>

            {!hideGameplayDetails && (
              <div className="grid grid-cols-2 gap-4 mb-6">
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

            {landmarkImage && (
              <div
                className="mt-4 text-center cursor-pointer group"
                onClick={() => setIsFullView(true)}
              >
                <img
                  src={landmarkImage}
                  alt={t(land.name)}
                  className="mx-auto rounded-2xl object-cover border border-[#FFF0F3] shadow-cute-sm group-hover:scale-[1.02] transition-transform duration-300 w-full aspect-[16/10] max-h-36"
                />

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
