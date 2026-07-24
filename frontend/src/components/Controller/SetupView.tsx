import { useState } from "react";
import type { AppMode, Language } from "@/types/game.types";

export default function SetupView({
  setMode,
}: {
  setMode: (mode: AppMode, lang: Language) => void;
}) {
  const [selectedLang, setSelectedLang] = useState<Language>("EN");

  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center animate-fade-in relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent" />

      <h1 className="text-4xl sm:text-5xl font-black mb-16 tracking-[0.2em] text-brand-primary text-center">
        STATION CONTROL
      </h1>

      {/* Language Selector */}
      <div className="mb-12 flex space-x-4 z-10 bg-white/60 backdrop-blur p-2 rounded-2xl border border-brand-border">
        {(["EN", "TH", "DE"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`w-16 h-12 text-sm font-bold rounded-xl transition-all ${
              selectedLang === lang
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105"
                : "bg-transparent text-zinc-600 hover:text-brand-primary hover:bg-zinc-50"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Modes Grid */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl z-10">
        {/* Museum Mode Card */}
        <button
          onClick={() => setMode("MUSEUM", selectedLang)}
          className="flex-1 group relative p-8 bg-white border border-brand-border rounded-[2rem] text-left transition-all hover:-translate-y-1.5 shadow-lg hover:shadow-2xl hover:shadow-brand-accent/10"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent rounded-l-[2rem]" />
          <div className="flex justify-between items-center h-full">
            <div>
              <h2 className="text-3xl font-black mb-2 text-brand-primary tracking-wider">
                MUSEUM
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                Interactive Exhibition
              </p>
            </div>
            <div className="text-4xl text-brand-accent group-hover:translate-x-2 transition-transform opacity-30 group-hover:opacity-100">
              →
            </div>
          </div>
        </button>

        {/* Game Mode Card */}
        <button
          onClick={() => setMode("GAME", selectedLang)}
          className="flex-1 group relative p-8 bg-brand-primary text-white border border-brand-primary rounded-[2rem] text-left transition-all hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-brand-primary/30"
        >
          <div className="flex justify-between items-center h-full">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-wider text-white">
                GAME
              </h2>
              <p className="text-brand-border text-sm font-bold uppercase tracking-widest">
                Territory Battle
              </p>
            </div>
            <div className="text-4xl text-brand-accent group-hover:translate-x-2 transition-transform opacity-65 group-hover:opacity-100">
              →
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
