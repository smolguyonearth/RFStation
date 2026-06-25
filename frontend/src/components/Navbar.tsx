import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Menu, X } from "lucide-react"
import { useLocation } from "react-router-dom"
import { NAV_LINKS } from "@/constants/nav_menu"

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-brand-primary dark:bg-nav-bg shadow-lg sticky top-0 z-50">
            <nav className="px-6 py-3.5 mx-auto w-full flex items-center justify-between gap-6">
                {/* Logo */}
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
                <div className="hidden lg:flex gap-2 items-center text-sm font-medium">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                                    transition-all duration-200
                                    ${active
                                        ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30 scale-[1.03]"
                                        : "text-brand-border hover:text-white hover:bg-white/10"
                                    }
                                `}
                            >
                                <Icon
                                    size={15}
                                    className={active ? "text-white" : "text-brand-accent"}
                                />
                                {t(link.title)}
                            </Link>
                        );
                    })}

                    {/* Language Switcher */}
                    <div className="ml-4 flex gap-1 bg-black/20 p-1 rounded-lg">
                        {["en", "th", "de"].map((lng) => (
                            <button
                                key={lng}
                                onClick={() => changeLanguage(lng)}
                                className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === lng
                                        ? "bg-brand-accent text-white"
                                        : "text-brand-border hover:text-white"
                                    }`}
                            >
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 text-brand-border hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={toggleMenu}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98]
                                            ${active
                                                ? "bg-brand-accent/20 border border-brand-accent/40 text-white"
                                                : "text-brand-border hover:text-white hover:bg-white/5 border border-transparent"
                                            }
                                        `}
                                    >
                                        {/* Icon container: filled on active, subtle on inactive */}
                                        <div
                                            className={`p-2 rounded-xl transition-colors ${active
                                                    ? "bg-brand-accent shadow-sm shadow-brand-accent/40"
                                                    : "bg-white/5"
                                                }`}
                                        >
                                            <Icon
                                                size={20}
                                                className={active ? "text-white" : "text-brand-accent"}
                                            />
                                        </div>

                                        <span className="font-semibold text-base flex-1">
                                            {t(link.title)}
                                        </span>

                                        {/* Active badge on the right */}
                                        {active && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-accent text-white px-2 py-0.5 rounded-full">
                                                Active
                                            </span>
                                        )}
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
