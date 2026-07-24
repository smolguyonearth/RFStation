export default function Footer() {
  return (
    <footer className="border-t border-[#FFF0F3] bg-white/60 py-5 text-center text-zinc-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold tracking-wide">
          © 2026 Academic Internship Program
          <span className="mx-2 text-[#FFEBF0]">|</span>
          <span className="text-[#FF7899] font-bold">
            Connecting Weser and Chao Phraya through Sound.
          </span>
        </p>

        <p className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold">
          Built with React · Vite · Tailwind · Hardware Localization
        </p>
      </div>
    </footer>
  );
}
