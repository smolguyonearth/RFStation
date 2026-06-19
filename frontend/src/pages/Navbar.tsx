import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
    { title: "🎮 Game Board", path: "/game" },
    { title: "🏋 Activity Log", path: "/activity-log" },
    { title: "🏆 Ranking", path: "/ranking" },
    { title: "📊 Summary", path: "/summary" },
    { title: "🗺️ Map", path: "/map" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white dark:bg-nav-bg border-b border-purple-100 dark:border-nav-border shadow-sm">
            {/* Main Navbar */}
            <nav className="p-4 flex items-center justify-between gap-4">
                {/* Website Name */}
                <Link
                    to="/"
                    className="text-brand font-bold text-lg md:text-xl tracking-wide hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                >
                    MoSCoW Board Game
                </Link>

                {/* Search Bar */}
                <div className="hidden md:block relative w-1/3 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search game..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-200 dark:bg-nav-search-bg text-black dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-nav-search-border focus:outline-none focus:ring-2 focus:ring-pink-500 dark:ring-brand/40 focus:border-pink-500 transition-all shadow-inner"
                    />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-5 items-center text-xs font-medium">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                        >
                            {link.title}
                        </Link>
                    ))}

                    <ThemeToggle />

                    <Link
                        to="/tt"
                        className="ml-2 px-3 py-1.5 bg-brand text-white rounded-lg hover:bg-brand-dark text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Dropdown*/}
            {isMobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-4 border-t border-purple-50 dark:border-nav-border pt-4">
                    {/* Mobile Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search game..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-200 dark:bg-nav-search-bg text-black dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-nav-search-border focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Mobile Links */}
                    <div className="flex flex-col gap-3 text-sm font-medium">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={toggleMenu}
                                className="text-black dark:text-text-main hover:text-nav-text-hover py-2"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <ThemeToggle />
                        <Link
                            to="/tt"
                            onClick={toggleMenu}
                            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark text-sm font-semibold shadow-sm text-center"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
