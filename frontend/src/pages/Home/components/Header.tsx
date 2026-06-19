import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

export default function Header() {
    return (
        <Card className="flex flex-row justify-between items-center bg-purple-50 dark:bg-nav-bg border-purple-100 dark:border-nav-border rounded-xl shadow-none">
            <CardHeader className="p-5 flex-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Station Monitor Dashboard
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                    Receiver node core telemetry control
                </CardDescription>
            </CardHeader>

        </Card>
    );
}
