import { Map as MapIcon, Monitor, Lightbulb, Cpu } from "lucide-react"

export const NAV_LINKS = [
    { title: "nav.map", path: "/map", icon: MapIcon },
    { title: "nav.monitor", path: "/monitor", icon: Monitor },
    // [DB DISABLED] Live page removed — see docs/DB_ACTIVATE.md
    // { title: "nav.live", path: "/live", icon: Monitor },
    { title: "Game", path: "/game", icon: Cpu },
];