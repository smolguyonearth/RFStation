import { Link } from "react-router-dom";
// import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    return (
        <nav className="p-4 bg-white dark:bg-nav-bg border-b border-purple-100 dark:border-nav-border flex gap-4 items-center justify-between shadow-sm">
            {/* Website Name */}
            <Link
                to="/"
                className="text-brand font-bold text-xl tracking-wide hover:opacity-80 transition-opacity cursor-pointer"
            >
                MoSCoW Board Game
            </Link>

            {/* Search Bar */}
            <div className="relative w-1/4 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

                <input
                    type="text"
                    placeholder="Search game..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-200 dark:bg-nav-search-bg text-black dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-nav-search-border focus:outline-none focus:ring-2 focus:ring-pink-500 dark:ring-brand/40 focus:border-pink-500 transition-all shadow-inner"
                />
            </div>

            <div className="flex gap-5 text-xs font-medium">
                <Link
                    to="/game"
                    className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                >
                    🎮 Game Board
                </Link>
                <Link
                    to="/activity-log"
                    className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                >
                    Activity Log
                </Link>

                <Link
                    to="/ranking"
                    className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                >
                    🏆 Ranking
                </Link>

                <Link
                    to="/summary"
                    className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                >
                    📊 Summary
                </Link>

                <Link
                    to="/map"
                    className="text-black dark:text-text-main hover:text-nav-text-hover transition-colors flex items-center gap-1"
                >
                    Map
                </Link>

                <ThemeToggle />

                <Link
                    to="/tt"
                    className="ml-2 px-3 py-1.5 bg-brand text-white rounded-lg hover:bg-brand-dark text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                >
                    Sign In
                </Link>
            </div>
        </nav>
    );
}
