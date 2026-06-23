export type ResourceType =
    | "Energy" | "Tech" | "Manpower" | "Supplies" | "Culture"
    | "Influence" | "Intel" | "Tourism" | "Entertainment" | "Food"
    | "Trade" | "Artifacts" | "Gold" | "Nature" | "History" | "Luxury Goods"

export interface MapLocation {
    readonly id: string;
    readonly name: string;
    readonly ownerId: string | null;
    readonly description: string;
    readonly points: number;
    readonly resources: readonly ResourceType[];
    readonly d: string; // SVG path data
}