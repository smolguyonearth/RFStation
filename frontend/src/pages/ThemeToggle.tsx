import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;

        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        return savedTheme === "dark" || (!savedTheme && prefersDark);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border transition-all cursor-pointer shadow-xs flex items-center justify-center hover:scale-105 active:scale-95
        /* Light Mode */
        bg-white border-slate-200 text-slate-700 
        /* Dark Mode */
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Moon className="h-4 w-4 text-purple-400" />
            ) : (
                <Sun className="h-4 w-4 text-amber-500" />
            )}
        </button>
    );
}
