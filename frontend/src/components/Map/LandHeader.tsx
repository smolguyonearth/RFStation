import { Map } from "lucide-react";

export default function LandHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] rounded-2xl shadow-cute-xs">
          <Map size={20} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FF7899] uppercase">
            Overview
          </span>
          <h1 className="text-2xl font-extrabold tracking-wide text-[#333C4E] uppercase mt-1">
            Conquered <span className="text-[#FF7899]">Land</span>
          </h1>
          <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-wide">
            Territory control and landmark acquisition progress
          </p>
        </div>
      </div>
    </header>
  );
}
