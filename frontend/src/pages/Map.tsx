import { useState } from "react";
import Footer from "./Footer";
import mapVectorBg from "../assets/Map_final_vecter.svg";


import { mockLandmarks } from "../data/map.mock" 

const getConquerorColor = (ownerId: string | null) => {
  if (ownerId === "player_01") return "rgba(59, 130, 246, 0.6)";
  if (ownerId === "player_02") return "rgba(236, 72, 153, 0.6)";
  if (ownerId === "player_03") return "rgba(245, 158, 11, 0.6)";
  return "rgba(0, 0, 0, 0.0)";
};

export default function ConqueredLandBoard() {
  const [landmarks] = useState(mockLandmarks);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f9] dark:bg-bg-main font-sans transition-colors duration-300">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-boardgame-card rounded-3xl border border-[#f3e8ff] dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          
          <div className="p-6 flex items-center gap-3 border-b border-[#f3e8ff] dark:border-slate-800/60">
            <div className="text-brand shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#3f313a] dark:text-white">Conquered Land</h2>
          </div>

          <div className="flex flex-col lg:flex-row w-full p-6 gap-6 items-center lg:items-stretch">
            <div className="flex-1 lg:w-1/5 flex items-center">
              {/* Wait for add element */}
            </div>

            <div className="w-full max-w-[500px] lg:max-w-[600px] aspect-square flex justify-center items-center">
              <div className="relative w-full h-full bg-[#f8f5ff] dark:bg-slate-900/50 rounded-xl overflow-hidden border border-nav-text-hover dark:border-slate-800 shadow-inner">
                <svg viewBox="0 0 1024 1024" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
                  <image href={mapVectorBg} width="1024" height="1024" preserveAspectRatio="xMidYMid meet" />
                  <g style={{ mixBlendMode: "multiply" }}>
                    {landmarks.map((lm) => (
                      <path
                        key={lm.id}
                        d={lm.d}
                        fill={getConquerorColor(lm.ownerId)}
                        stroke={lm.ownerId ? "#ffffff" : "transparent"}
                        strokeWidth="3"
                        className="transition-colors duration-500 hover:opacity-80 cursor-pointer"
                        onClick={() => alert(`คุณคลิกพื้นที่: ${lm.name}`)}
                      >
                        <title>{lm.name}</title>
                      </path>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            <div className="flex-1 lg:w-1/5 flex items-center">
              {/* Wait for add element */}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}