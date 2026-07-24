import { useState } from "react";
import type { AppMode, Language } from "@/types/game.types";

export default function SetupView({
  setMode,
}: {
  setMode: (mode: AppMode, lang: Language) => void;
}) {
  const [selectedLang, setSelectedLang] = useState<Language>("EN");

  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center animate-fade-in min-h-screen bg-[#FAF9F6] text-[#333C4E] font-sans relative overflow-hidden select-none">
      
      {/* Charming Soft Pastel Decorative Blobs */}
      <div className="absolute top-16 left-16 w-32 h-32 bg-[#E1F7EC]/40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-44 h-44 bg-[#FFEBF0]/50 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#FFFBE6]/60 rounded-full blur-xl pointer-events-none" />
      
      {/* Central Pill-shaped Card */}
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-cute p-10 md:p-14 flex flex-col items-center border border-[#FFF0F3] z-10">
        
        {/* Header inside the central card */}
        <div className="text-center mb-12 max-w-md w-full">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#FF7899] bg-[#FFEBF0] border border-[#FFD6E0] px-4 py-2 rounded-full uppercase">
            Station Control System
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-8 tracking-wide text-[#333C4E] uppercase leading-none">
            Select Mode
          </h1>
          <p className="text-zinc-400 text-xs mt-4 tracking-wide font-medium max-w-xs mx-auto leading-relaxed">
            Initialize the station guide system or start a competitive local match.
          </p>
        </div>

        {/* Language Toggle (Cute Soft Pills) */}
        <div className="mb-12 flex space-x-2 bg-[#FAF9F6] p-1.5 rounded-2xl border border-zinc-100/80 shadow-inner">
          {(["EN", "TH", "DE"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`w-14 h-9 text-xs font-extrabold rounded-xl transition-all duration-300 ${
                selectedLang === lang
                  ? "bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] shadow-sm"
                  : "bg-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Bottom Mode Cards (Pill-shaped White Cards with Subtle Pastel Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Museum Mode card */}
          <button
            onClick={() => setMode("MUSEUM", selectedLang)}
            className="group relative p-8 bg-white border border-[#E1F7EC] rounded-[2rem] text-left transition-all duration-300 hover:border-[#C2F0D9] hover:shadow-cute hover:-translate-y-0.5 flex flex-col justify-between min-h-[220px] active:scale-[0.98]"
          >
            <div className="flex justify-between items-start w-full">
              {/* Friendly line-art icon with light mint fill */}
              <div className="p-3.5 bg-[#E1F7EC] text-[#2BB673] border border-[#C2F0D9] rounded-2xl transition-transform duration-300 group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33-1.127m-15 11.217V21M3 21h18" />
                </svg>
              </div>
              <div className="text-emerald-300 group-hover:text-[#2BB673] group-hover:translate-x-0.5 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#333C4E] tracking-wide group-hover:text-[#2BB673] transition-colors">
                Museum Mode
              </h2>
              <p className="text-zinc-400 text-xs font-bold tracking-wide mt-2">
                Interactive Landmark Guide & Audio Narration
              </p>
            </div>
          </button>

          {/* Game Mode card */}
          <button
            onClick={() => setMode("GAME", selectedLang)}
            className="group relative p-8 bg-white border border-[#FFEBF0] rounded-[2rem] text-left transition-all duration-300 hover:border-[#FFD6E0] hover:shadow-cute hover:-translate-y-0.5 flex flex-col justify-between min-h-[220px] active:scale-[0.98]"
          >
            <div className="flex justify-between items-start w-full">
              {/* Friendly line-art icon with light pink fill */}
              <div className="p-3.5 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] rounded-2xl transition-transform duration-300 group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.75V10.5h.75c.621 0 1.125-.504 1.125-1.125V5.25a3 3 0 00-3-3h-6a3 3 0 00-3 3v4.125c0 .621.504 1.125 1.125 1.125h.75v3.75h-.75A1.125 1.125 0 004.5 15.375v3.375m15 0h-15" />
                </svg>
              </div>
              <div className="text-rose-300 group-hover:text-[#FF7899] group-hover:translate-x-0.5 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#333C4E] tracking-wide group-hover:text-[#FF7899] transition-colors">
                Game Mode
              </h2>
              <p className="text-zinc-400 text-xs font-bold tracking-wide mt-2">
                Competitive 2-Player Territory Conquest
              </p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
