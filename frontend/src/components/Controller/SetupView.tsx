import { useState } from "react";
import type { AppMode, Language } from "@/types/game.types";

export default function SetupView({
  setMode,
}: {
  setMode: (mode: AppMode, lang: Language) => void;
}) {
  const [selectedLang, setSelectedLang] = useState<Language>("EN");

  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center animate-fade-in min-h-screen font-outfit relative">
      
      {/* Station Control Header */}
      <div className="text-center mb-12 md:mb-16 z-10">
        <span className="text-[10px] md:text-xs font-black tracking-[0.4em] text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)] inline-block">
          RFStation Control Hub
        </span>
        <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 uppercase">
          STATION CONTROL
        </h1>
        <p className="text-zinc-500 text-sm mt-3 tracking-widest font-medium">
          Select operational mode to initiate subsystem broadcast.
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-12 flex space-x-3 z-10 bg-white/[0.02] backdrop-blur-xl p-1.5 rounded-2xl border border-white/[0.06] shadow-2xl">
        {(["EN", "TH", "DE"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`w-16 h-11 text-xs font-extrabold rounded-xl transition-all duration-300 ${
              selectedLang === lang
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105"
                : "bg-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        {/* Museum Mode Card */}
        <button
          onClick={() => setMode("MUSEUM", selectedLang)}
          className="group relative p-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] hover:border-cyan-500/30 rounded-[2.5rem] text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)] flex flex-col justify-between min-h-[260px] overflow-hidden"
        >
          {/* Top subtle glow bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />
          
          <div className="flex justify-between items-start w-full">
            <div className="p-4 bg-cyan-950/20 border border-cyan-800/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              {/* Museum Icon */}
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33-1.127m-15 11.217V21M3 21h18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all duration-300">
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-black text-white tracking-wider group-hover:text-cyan-400 transition-colors duration-300">
              MUSEUM MODE
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
              Interactive Exhibition Guide & Audio Sync
            </p>
          </div>
        </button>

        {/* Game Mode Card */}
        <button
          onClick={() => setMode("GAME", selectedLang)}
          className="group relative p-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] hover:border-indigo-500/30 rounded-[2.5rem] text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] flex flex-col justify-between min-h-[260px] overflow-hidden"
        >
          {/* Top subtle glow bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500/20 to-rose-500/20" />

          <div className="flex justify-between items-start w-full">
            <div className="p-4 bg-indigo-950/20 border border-indigo-800/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              {/* Game Crown/Controller Icon */}
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.75V10.5h.75c.621 0 1.125-.504 1.125-1.125V5.25a3 3 0 00-3-3h-6a3 3 0 00-3 3v4.125c0 .621.504 1.125 1.125 1.125h.75v3.75h-.75A1.125 1.125 0 004.5 15.375v3.375m15 0h-15" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300">
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-black text-white tracking-wider group-hover:text-indigo-400 transition-colors duration-300">
              GAME MODE
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
              Competitive 2-Player Territory Conquest
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
