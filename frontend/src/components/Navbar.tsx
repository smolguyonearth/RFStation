import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Menu, X, Settings } from "lucide-react"
import { NAV_LINKS } from "@/constants/nav_menu"

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
    const isActive = (path: string) => {
        if (path === "/controller" && (location.pathname === "/control" || location.pathname === "/controll")) {
            return true;
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden lg:flex flex-col w-24 bg-white border-r border-[#FFF0F3] items-center justify-between py-8 shrink-0 relative z-40">
                {/* Top: Logo Badge */}
                <div className="flex flex-col items-center gap-1.5">
                    <Link
                        to="/"
                        className="w-12 h-12 bg-[#FFEBF0] hover:bg-[#FFD6E0] text-[#FF7899] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#FFD6E0] shadow-cute-xs transition-all cursor-pointer"
                    >
                        M
                    </Link>
                </div>

                {/* Center: Navigation Stack */}
                <nav className="flex flex-col gap-6 w-full px-4 items-center">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                title={t(link.title)}
                                className={`
                                    relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 group
                                    ${active
                                        ? "bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0] shadow-cute-xs"
                                        : "text-zinc-400 hover:text-[#FF7899] hover:bg-[#FAF9F6]"
                                    }
                                `}
                            >
                                <Icon size={20} className={active ? "text-[#FF7899]" : "text-zinc-400 group-hover:scale-105 transition-transform"} />

                                {/* Tooltip */}
                                <span className="absolute left-16 bg-[#333C4E] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                                    {t(link.title)}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: Compact Language Switcher & Settings */}
                <div className="flex flex-col gap-5 items-center w-full px-4">
                    {/* Language Pills */}
                    <div className="flex flex-col gap-1.5 bg-[#FAF9F6] border border-[#FFF0F3] p-1 rounded-xl w-full shadow-cute-xs">
                        {["en", "th", "de"].map((lng) => (
                            <button
                                key={lng}
                                onClick={() => changeLanguage(lng)}
                                className={`w-full py-1.5 text-[9px] font-bold rounded-lg transition-all ${i18n.language === lng
                                        ? "bg-white text-[#FF7899] border border-[#FFD6E0] shadow-sm"
                                        : "text-zinc-400 hover:text-zinc-600"
                                    }`}
                            >
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Settings Icon */}
                    <button className="text-zinc-400 hover:text-[#FF7899] hover:bg-[#FAF9F6] w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                        <Settings size={18} />
                    </button>
                </div>
            </aside>

            {/* ================= MOBILE HEADER ================= */}
            <header className="lg:hidden w-full bg-white border-b border-[#FFF0F3] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-zinc-800 font-semibold text-base tracking-wide hover:text-[#FF7899] transition-colors"
                >
                    <div className="w-9 h-9 bg-[#FFEBF0] rounded-xl flex items-center justify-center text-[#FF7899] font-bold border border-[#FFD6E0]">
                        M
                    </div>
                    <span>MoSCoW Board</span>
                </Link>

                {/* Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="p-2 text-zinc-400 hover:text-[#FF7899] hover:bg-[#FAF9F6] rounded-xl transition-all"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Drawer Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-[#FFF0F3] shadow-md animate-in slide-in-from-top-4 duration-200 z-50">
                        <div className="px-6 py-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                {NAV_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={toggleMenu}
                                            className={`
                                                flex items-center gap-3.5 p-3 rounded-xl transition-all
                                                ${active
                                                    ? "bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0]"
                                                    : "bg-transparent text-zinc-400 hover:bg-[#FAF9F6]"
                                                }
                                            `}
                                        >
                                            <div className={`p-2 rounded-lg ${active ? "bg-[#FFEBF0] text-[#FF7899]" : "bg-[#FAF9F6] text-zinc-400"}`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="font-medium text-sm flex-grow">
                                                {t(link.title)}
                                            </span>
                                            {active && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7899]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Language Selection */}
                            <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#FFF0F3]">
                                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-2 px-1">
                                    Select Language
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    {["en", "th", "de"].map((lng) => (
                                        <button
                                            key={lng}
                                            onClick={() => {
                                                changeLanguage(lng);
                                                toggleMenu();
                                            }}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${i18n.language === lng
                                                    ? "bg-[#FFEBF0] text-[#FF7899] border border-[#FFD6E0]"
                                                    : "bg-white border border-zinc-200 text-zinc-500 hover:bg-[#FAF9F6]"
                                                }`}
                                        >
                                            {lng.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
