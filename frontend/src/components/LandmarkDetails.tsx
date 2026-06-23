import { X, Gem, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MapLocation } from "@/types/map.types";

interface LandmarkDetailsProps {
    land: MapLocation;
    onClose: () => void;
}

export default function LandmarkDetails({
    land,
    onClose,
}: LandmarkDetailsProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full lg:w-[45%] animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 lg:p-8 h-full">
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

                <div className="text-sm text-brand-primary/80 mb-8 max-h-[35vh] overflow-y-auto pr-2">
                    {land.description ? t(land.description) : t("map.no_description")}
                </div>

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
            </div>
        </div>
    );
}
