import { useState } from "react"
import { X, Gem, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { MapLocation } from "@/types/map.types"

interface LandmarkDetailsProps {
  land: MapLocation;
  onClose: () => void;
}

export default function LandmarkDetails({
  land,
  onClose,
}: LandmarkDetailsProps) {
  const { t } = useTranslation();
  const [isFullView, setIsFullView] = useState(false);

  const landmarkImage = land.image;

  return (
    <div className="w-full lg:w-[45%] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 lg:p-8 h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-brand-primary">
              {t(land.name)}
            </h3>
            <div className="inline-block mt-2 px-3 py-1 bg-brand-bg rounded-full border border-brand-border/50 text-xs font-semibold text-brand-accent uppercase">
              {t("map.owner")}:{" "}
              {land.ownerId ? land.ownerId : t("map.unclaimed")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-brand-bg rounded-xl hover:bg-brand-border/50 transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <div className="text-sm text-brand-primary/80 mb-8 max-h-[35vh] overflow-y-auto pr-2">
          {land.description ? t(land.description) : t("map.no_description")}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-bg p-4 rounded-xl border border-brand-border/50">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase mb-1">
              <Gem size={16} className="text-emerald-500" /> {t("map.points")}
            </div>
            <span className="text-2xl font-extrabold text-brand-primary">
              {land.points || 0}
            </span>
          </div>
          <div className="bg-brand-bg p-4 rounded-xl border border-brand-border/50">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase mb-1">
              <Shield size={16} className="text-blue-500" /> {t("map.status")}
            </div>
            <span className="text-lg font-bold text-brand-primary mt-1 block">
              {land.ownerId ? t("map.secured") : t("map.available")}
            </span>
          </div>
        </div>

        {/* Landmark Image Section (Conditional Rendering) */}
        {landmarkImage && (
          <div
            className="mt-8 text-center cursor-pointer group"
            onClick={() => setIsFullView(true)}
          >
            <img
              src={landmarkImage}
              alt={t(land.name)}
              className="mx-auto h-32 rounded-lg"
            />

            {/* แสดงผล Source แบบ Dynamic */}
            {land.imageSource && (
              <p className="text-[10px] text-brand-accent mt-2 italic">
                Source: {land.imageSource}
              </p>
            )}

            <p className="text-xs text-brand-accent mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            className="absolute top-5 right-5 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setIsFullView(false)}
          >
            <X size={32} />
          </button>
          <img
            src={landmarkImage}
            alt={t(land.name)}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
