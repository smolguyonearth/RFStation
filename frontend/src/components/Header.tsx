export default function Header() {
    return (
        <div className="flex justify-between items-center bg-purple-50 dark:bg-nav-bg border border-purple-100 dark:border-nav-border p-5 rounded-xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Station Monitor Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receiver node core telemetry control
                </p>
            </div>

            <div></div>
        </div>
    );
}
