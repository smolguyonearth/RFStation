import { useState } from "react"
import type { MapLocation } from "@/types/map.types"
import LandHeader from "@/components/Map/LandHeader"
import MapViewer from "@/components/Map/MapViewer"
import LandmarkDetails from "@/components/Map/LandmarkDetails"
import Footer from "@/components/Footer"

export default function ConqueredLandBoard() {
  const [selectedLand, setSelectedLand] = useState<MapLocation | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6]">
      <div className="p-6 md:p-10 flex flex-col flex-1 font-sans text-[#333C4E] justify-start min-h-0 overflow-hidden select-none">

        {/* Header */}
        <div className="mb-6 border-b border-[#FFF0F3] pb-5 shrink-0">
          <LandHeader />
        </div>

        {/* Main Map Content Panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1 min-h-0 overflow-hidden animate-fade-in">

          {/* Map Viewer Wrapper */}
          <div className="flex-1 w-full bg-white border border-[#FFF0F3] rounded-[2rem] p-6 shadow-cute flex items-center justify-center min-h-0 h-full overflow-hidden">
            <MapViewer
              selectedLand={selectedLand}
              onSelect={setSelectedLand}
            />
          </div>

          {/* Selected Landmark Details Card */}
          {selectedLand && (
            <div className="w-full lg:w-96 shrink-0 bg-white border border-[#FFF0F3] rounded-[2rem] p-6 shadow-cute overflow-y-auto max-h-full">
              <LandmarkDetails
                land={selectedLand}
                onClose={() => setSelectedLand(null)}
                flat={true}
                hideGameplayDetails={false}
                className="w-full h-full"
                hideClose={false}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
