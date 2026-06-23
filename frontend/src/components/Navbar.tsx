import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Map as MapIcon, Monitor } from "lucide-react";

const NAV_LINKS = [
    { title: "nav.map", path: "/map", icon: MapIcon },
    { title: "nav.monitor", path: "/monitor", icon: Monitor },
];

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

    return (
        <header className="bg-brand-primary dark:bg-nav-bg shadow-lg sticky top-0 z-50">
            <nav className="px-6 py-3.5 mx-auto w-full flex items-center justify-between gap-6">
                <Link
                    to="/"
                    className="text-white font-extrabold text-xl tracking-wide hover:text-brand-border transition-colors cursor-pointer shrink-0 flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-black">
                        M
                    </div>
                    MoSCoW Board
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex gap-6 items-center text-sm font-medium">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-brand-border hover:text-white transition-all flex items-center gap-2 group"
                            >
                                <Icon
                                    size={16}
                                    className="text-brand-accent group-hover:text-white transition-colors"
                                />
                                {t(link.title)}
                            </Link>
                        );
                    })}

                    {/* Language Switcher */}
                    <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                        <button
                            onClick={() => changeLanguage("en")}
                            className={`px-2 py-1 rounded-md text-xs font-bold ${i18n.language === "en" ? "bg-brand-accent text-white" : "text-brand-border hover:text-white"}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => changeLanguage("th")}
                            className={`px-2 py-1 rounded-md text-xs font-bold ${i18n.language === "th" ? "bg-brand-accent text-white" : "text-brand-border hover:text-white"}`}
                        >
                            TH
                        </button>
                        <button
                            onClick={() => changeLanguage("de")}
                            className={`px-2 py-1 rounded-md text-xs font-bold ${i18n.language === "de" ? "bg-brand-accent text-white" : "text-brand-border hover:text-white"}`}
                        >
                            DE
                        </button>
                    </div>
                </div>

                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 text-brand-border hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute w-full bg-brand-primary border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={toggleMenu}
                                        className="flex items-center gap-4 text-brand-border hover:text-white hover:bg-white/5 p-4 rounded-2xl transition-all active:scale-[0.98]"
                                    >
                                        <div className="p-2 bg-white/5 rounded-xl">
                                            <Icon size={20} className="text-brand-accent" />
                                        </div>
                                        <span className="font-semibold text-base">
                                            {t(link.title)}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Language Switcher */}
                        <div className="bg-black/20 p-2 rounded-2xl">
                            <p className="text-[10px] uppercase tracking-widest text-brand-border/50 font-bold px-3 py-2">
                                Select Language
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {["en", "th", "de"].map((lng) => (
                                    <button
                                        key={lng}
                                        onClick={() => changeLanguage(lng)}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all ${i18n.language === lng
                                                ? "bg-brand-accent text-white shadow-lg"
                                                : "text-brand-border hover:bg-white/5"
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
    );
}
