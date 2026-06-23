export default function Footer() {
    return (
        <footer className="border-t border-brand-border bg-brand-bg py-4 text-center text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                <p className="text-[11px] font-medium">
                    © 2026 Academic Internship Program
                    <span className="mx-2 opacity-50">|</span>
                    <span className="text-brand-accent">
                        Connecting Weser and Chao Phraya through Sound.
                    </span>
                </p>

                <p className="text-[9px] uppercase tracking-wider opacity-60">
                    Built with React · Vite · Tailwind · Hardware Localization
                </p>
            </div>
        </footer>
    );
}
