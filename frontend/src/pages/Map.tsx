import { useState } from "react"
import type { MapLocation } from "@/types/map.types"
import LandHeader from "@/components/Map/LandHeader"
import MapViewer from "@/components/Map/MapViewer"
import LandmarkDetails from "@/components/Map/LandmarkDetails"

export default function ConqueredLandBoard() {
    const [selectedLand, setSelectedLand] = useState<MapLocation | null>(null);

    return (
        <div className="h-auto bg-brand-bg py-6 px-4 sm:px-6">
            <div className="max-w-6xl w-full mx-auto min-h-screen">
                <div className="bg-white rounded-3xl shadow-sm border border-brand-border/60 p-6 md:p-8 h-fit flex flex-col">
                    <LandHeader />
                    <div className="flex flex-col lg:flex-row gap-8 mt-8 flex-1">
                        <MapViewer
                            selectedLand={selectedLand}
                            onSelect={setSelectedLand}
                        />
                        {selectedLand && (
                            <LandmarkDetails
                                land={selectedLand}
                                onClose={() => setSelectedLand(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
