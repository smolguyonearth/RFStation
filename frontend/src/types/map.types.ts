export type MapLocation = {
    id: string;
    name: string;
    ownerId: string | null;
    d: string;
    description?: string;
    points?: number;
    resources?: string[];
};