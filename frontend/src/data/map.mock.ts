import type { MapLocation } from '@/types/map.types';
import { LANDMARK_PATHS } from '@/data/landmarkPaths';

export const mockLandmarks: MapLocation[] = [
    { id: "lm_01", name: "landmarks.mahanakhon.name", description: "landmarks.mahanakhon.desc", ownerId: null, points: 50, resources: ["Energy", "Tech"], d: LANDMARK_PATHS.mahanakhon },
    { id: "lm_02", name: "landmarks.bremen_stadium.name", description: "landmarks.bremen_stadium.desc", ownerId: null, points: 40, resources: ["Manpower", "Supplies"], d: LANDMARK_PATHS.bremenStadium },
    { id: "lm_03", name: "landmarks.giant_swing.name", description: "landmarks.giant_swing.desc", ownerId: null, points: 60, resources: ["Culture", "Influence"], d: LANDMARK_PATHS.giantSwing },
    { id: "lm_04", name: "landmarks.town_hall.name", description: "landmarks.town_hall.desc", ownerId: null, points: 70, resources: ["Intel", "Influence"], d: LANDMARK_PATHS.townHall },
    { id: "lm_06", name: "landmarks.asiatique.name", description: "landmarks.asiatique.desc", ownerId: null, points: 45, resources: ["Tourism", "Entertainment"], d: LANDMARK_PATHS.asiatique },
    { id: "lm_08", name: "landmarks.yaowarat.name", description: "landmarks.yaowarat.desc", ownerId: null, points: 65, resources: ["Food", "Trade"], d: LANDMARK_PATHS.chinatown },
    { id: "lm_05", name: "landmarks.grand_palace.name", description: "landmarks.grand_palace.desc", ownerId: null, points: 100, resources: ["Artifacts", "Gold", "Influence"], d: LANDMARK_PATHS.grandPalace },
    { id: "lm_10", name: "landmarks.wat_arun.name", description: "landmarks.wat_arun.desc", ownerId: null, points: 80, resources: ["Culture", "Tourism"], d: LANDMARK_PATHS.watArun },
    { id: "lm_12", name: "landmarks.rolland.name", description: "landmarks.rolland.desc", ownerId: null, points: 55, resources: ["Nature"], d: LANDMARK_PATHS.rolland },
    { id: "lm_13", name: "landmarks.musicians.name", description: "landmarks.musicians.desc", ownerId: null, points: 30, resources: ["Culture"], d: LANDMARK_PATHS.musicians },
    { id: "lm_14", name: "landmarks.iconsiam.name", description: "landmarks.iconsiam.desc", ownerId: null, points: 85, resources: ["Luxury Goods", "Gold"], d: LANDMARK_PATHS.iconsiam },
    { id: "lm_15", name: "landmarks.wallanlagen.name", description: "landmarks.wallanlagen.desc", ownerId: null, points: 40, resources: ["Nature", "History"], d: LANDMARK_PATHS.wallanlagen }
];