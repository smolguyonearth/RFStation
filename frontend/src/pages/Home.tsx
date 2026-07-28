import { Link } from "react-router-dom";
import { Cpu, Radio, Wrench } from "lucide-react";
import Footer from "@/components/Footer";

export default function HomePage() {
  const activeTab = "All";

  const cards = [
    {
      id: "hardware",
      category: "Hardware",
      icon: Wrench,
      title: "Hardware & Design",
      desc: "3D-printed custom architectural landmark pieces and physical map layout sensor grid.",
      tag: "Physical",
      colorClass: "bg-amber-50 text-amber-600 border-amber-100",
      hoverBorder: "hover:border-amber-400 hover:shadow-amber-500/10",
    },
    {
      id: "radio",
      category: "Radio",
      icon: Radio,
      title: "Localization (RSSI)",
      desc: "Calliope Mini signal tracking to establish spatial coordinates on the active grid.",
      tag: "Radio Signal",
      colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
      hoverBorder: "hover:border-emerald-400 hover:shadow-emerald-500/10",
    },
    {
      id: "software-audio",
      category: "Software",
      icon: Cpu,
      title: "Web App & Sound",
      desc: "Audio transition managers, game mechanics, and dual-mode web systems.",
      tag: "Software",
      colorClass: "bg-indigo-50 text-indigo-600 border-indigo-100",
      hoverBorder: "hover:border-indigo-400 hover:shadow-indigo-500/10",
    }
  ];

  const filteredCards = cards.filter((card) => {
    if (activeTab === "All") return true;
    if (activeTab === "Audio") {
      return card.title.toLowerCase().includes("sound") || card.desc.toLowerCase().includes("audio") || card.title.toLowerCase().includes("app & sound");
    }
    return card.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 p-2 sm:p-4 w-full flex-grow">

        {/* Hero Geometric Banner */}
        <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-50 via-sky-50 to-rose-50 text-slate-800 p-8 md:p-12 overflow-hidden shadow-sm border border-white/20 flex flex-col justify-center min-h-[350px] group">

          {/* Blur circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-200/40 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-700 bg-white/50 border border-indigo-100 px-3.5 py-1.5 rounded-full w-fit inline-block">
              Interactive Board Game
            </span>

            <h1 className="text-3xl md:text-5xl font-extralight tracking-wide leading-tight mt-6 text-slate-900">
              Bridging the Weser and the Chao Phraya through sound.
            </h1>

            <p className="text-slate-600 text-sm font-light tracking-wide mt-4 leading-relaxed max-w-lg">
              Explore the conceptual integration between Bremen and Bangkok, bringing interactive cultural stories and localization sensors to life.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-10">
            <Link to="/controller" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-sm border border-slate-200 active:scale-95">
              Start Controller
            </Link>
            <Link to="/display" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-indigo-400 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-sm active:scale-95">
              Launch Display
            </Link>
            <Link to="/map" className="w-full sm:w-auto text-center border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all active:scale-95">
              View Map
            </Link>
          </div>
        </div>

        {/* Project Architecture Section */}
        <div>
          <div className="flex justify-between items-baseline mb-8 border-b border-zinc-200 pb-3">
            <h2 className="text-xl font-medium text-zinc-900 tracking-wide">
              Project Architecture
            </h2>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {filteredCards.length} Subsystems
            </span>
          </div>

          {/* Dribbble Item Cards - Responsive Layout (ใช้ Grid ภายในส่วนนี้แทน) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`bg-white border border-zinc-200/80 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${card.hoverBorder} group`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shrink-0 ${card.colorClass} border`}>
                      <CardIcon size={22} />
                    </div>
                    <h3 className="font-semibold text-zinc-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed mb-6">
                      {card.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded w-fit">
                    {card.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}