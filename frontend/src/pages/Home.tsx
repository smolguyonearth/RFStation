import { Link } from "react-router-dom";
import { Cpu, Lightbulb, CheckCircle2, Radio, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
      
      {/* ================= LEFT MAIN COLUMN ================= */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-8 min-w-0">
        
        {/* Top Header & Search Simulation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search project features..."
              className="w-full bg-[#F3F4F6] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-light text-zinc-600 focus:outline-none focus:border-zinc-300"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            <span className="bg-[#0C1227] text-white px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer shadow-sm">
              All Sections
            </span>
            {["Hardware", "Software", "Radio", "Audio"].map((tab) => (
              <span
                key={tab}
                className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-700 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Geometric Banner */}
        <div className="relative rounded-[2rem] bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 md:p-12 overflow-hidden shadow-sm flex flex-col justify-between min-h-[260px]">
          {/* Abstract geometric glass/neon decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-lg">
            <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-200 uppercase bg-white/10 px-3 py-1 rounded-full w-fit">
              Interactive Board Game
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extralight tracking-wide leading-tight mt-6">
              Bridging the Weser and the Chao Phraya through sound.
            </h1>
            <p className="text-indigo-200 text-xs font-light tracking-wide mt-3 leading-relaxed">
              Explore the conceptual integration between Bremen and Bangkok, bringing interactive cultural stories and localization sensors to life.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to="/controller"
              className="w-full sm:w-auto text-center bg-white hover:bg-zinc-100 text-[#0C1227] font-semibold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Start Console
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto text-center border border-white/30 hover:border-white/50 hover:bg-white/5 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all active:scale-95"
            >
              View Map
            </Link>
          </div>
        </div>

        {/* Project Architecture Section */}
        <div>
          <div className="flex justify-between items-baseline mb-6 border-b border-zinc-200 pb-3">
            <h2 className="text-lg font-medium text-zinc-900 tracking-wide">
              Project Architecture
            </h2>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              3 Subsystems
            </span>
          </div>

          {/* Dribbble Item Cards - Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Hardware */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5">
                  <Wrench size={18} />
                </div>
                <h3 className="font-semibold text-zinc-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors">
                  Hardware & Design
                </h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
                  3D-printed custom architectural landmark pieces and physical map layout sensor grid.
                </p>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded w-fit">
                Physical
              </span>
            </div>

            {/* Card 2: Radio */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                  <Radio size={18} />
                </div>
                <h3 className="font-semibold text-zinc-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors">
                  Localization (RSSI)
                </h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
                  Calliope Mini signal tracking to establish spatial coordinates on the active grid.
                </p>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded w-fit">
                Radio Signal
              </span>
            </div>

            {/* Card 3: Software */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all group sm:col-span-2 lg:col-span-1">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                  <Cpu size={18} />
                </div>
                <h3 className="font-semibold text-zinc-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors">
                  Web App & Sound
                </h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
                  Audio transition managers, game mechanics, and dual-mode web systems.
                </p>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded w-fit">
                Software
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ================= RIGHT SIDE PANEL COLUMN ================= */}
      <div className="lg:col-span-1 flex flex-col gap-8 w-full">
        
        {/* Astro / Status Box */}
        <div className="relative rounded-2xl bg-[#0C1227] text-white p-6 shadow-md overflow-hidden min-h-[220px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] font-bold tracking-widest text-indigo-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                SYSTEM STATS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            <h3 className="text-base font-medium tracking-wide">
              RFStation Guide Engine
            </h3>
            
            <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-wider bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex justify-between">
                <span>Active Channels</span>
                <span className="text-white font-bold">2 Players</span>
              </div>
              <div className="flex justify-between">
                <span>Max Rounds</span>
                <span className="text-white font-bold">10 Rounds</span>
              </div>
              <div className="flex justify-between">
                <span>Audio Output</span>
                <span className="text-white font-bold">Web Audio API</span>
              </div>
            </div>
          </div>

          <Link
            to="/display"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm active:scale-95 mt-6 block"
          >
            Launch Display Screen
          </Link>
        </div>

        {/* Project logs feed */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-4">
            Recent Activities
          </span>

          <div className="flex flex-col gap-4">
            {[
              { title: "Hardware Calibrated", desc: "Weser & Chao Phraya grid active", icon: Wrench, color: "bg-amber-50 text-amber-600 border border-amber-100" },
              { title: "BGM Loops Configured", desc: "Anti-pop micro fades loaded", icon: Lightbulb, color: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
              { title: "Submodules Refactored", desc: "Natively merged directory structure", icon: CheckCircle2, color: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
            ].map((log, index) => {
              const LogIcon = log.icon;
              return (
                <div key={index} className="flex gap-3.5 items-start p-3 bg-zinc-50 border border-zinc-200/50 rounded-xl">
                  <div className={`p-2 rounded-lg shrink-0 ${log.color}`}>
                    <LogIcon size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-800">{log.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">{log.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-lg text-xs font-medium transition-colors mt-6">
            Show System Logs
          </button>
        </div>

      </div>

    </div>
  );
}
