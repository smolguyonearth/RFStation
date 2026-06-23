import { Map } from "lucide-react";

export default function LandHeader() {
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/40">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-border/30 rounded-xl text-brand-primary">
                    <Map size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-brand-primary">
                        Conquered
                        <span className="text-brand-accent font-medium"> Land</span>
                    </h1>
                    <p className="text-sm text-brand-accent/80 font-medium">
                        Territory control overview
                    </p>
                </div>
            </div>
        </header>
    );
}
