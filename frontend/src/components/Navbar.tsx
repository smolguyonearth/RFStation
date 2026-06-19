import { useState } from "react"
import { Link } from "react-router-dom"
import {
    Search,
    Menu,
    X,
    Gamepad2,
    Activity,
    Trophy,
    PieChart,
    Map as MapIcon,
} from "lucide-react";

const NAV_LINKS = [
    // { title: "Game Board", path: "/game", icon: Gamepad2 },
    // { title: "Activity Log", path: "/activity-log", icon: Activity },
    // { title: "Ranking", path: "/ranking", icon: Trophy },
    // { title: "Summary", path: "/summary", icon: PieChart },
    { title: "Map", path: "/map", icon: MapIcon },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

                <div className="hidden lg:block relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-border/60 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search games, players, or zones..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-black/10 text-white placeholder-brand-border/50 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-black/20 transition-all backdrop-blur-sm"
                    />
                </div>

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
                                {link.title}
                            </Link>
                        );
                    })}

                    <div className="w-px h-5 bg-white/10 mx-2"></div>

                    <Link
                        to="/tt"
                        className="px-5 py-2.5 bg-brand-accent text-white rounded-xl hover:bg-[#4A85C5] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        Sign In
                    </Link>
                </div>

                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 text-brand-border hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {isMobileMenuOpen && (
                <div className="lg:hidden px-4 pb-6 flex flex-col gap-4 border-t border-white/10 pt-4 bg-brand-primary absolute w-full shadow-2xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-border/60 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-3 text-sm bg-black/10 text-white placeholder-brand-border/50 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>

                    <div className="flex flex-col gap-1 text-sm font-medium">
                        {NAV_LINKS.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={toggleMenu}
                                    className="flex items-center gap-3 text-brand-border hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-colors"
                                >
                                    <Icon size={18} className="text-brand-accent" />
                                    {link.title}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10 px-2">
                        <Link
                            to="/tt"
                            onClick={toggleMenu}
                            className="px-8 py-3 bg-brand-accent text-white rounded-xl hover:bg-[#4A85C5] text-sm font-semibold shadow-sm text-center"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
