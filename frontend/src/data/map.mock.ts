import type { MapLocation } from '@/types/map.types';
import { LANDMARK_PATHS } from '@/data/landmarkPaths';

export const mockLandmarks: MapLocation[] = [
    { id: "lm_01", name: "Mahanakhon Tower", ownerId: null, description: "The tallest skyscraper in the district.", points: 50, resources: ["Energy", "Tech"], d: LANDMARK_PATHS.mahanakhon },
    { id: "lm_02", name: "Bremen Stadium", ownerId: null, description: "A massive stadium that serves as a stronghold.", points: 40, resources: ["Manpower", "Supplies"], d: LANDMARK_PATHS.bremenStadium },
    { id: "lm_03", name: "Giant Swing", ownerId: null, description: "A historic religious structure.", points: 60, resources: ["Culture", "Influence"], d: LANDMARK_PATHS.giantSwing },
    { id: "lm_04", name: "Town Hall", ownerId: null, description: "The traditional center of administration.", points: 70, resources: ["Intel", "Influence"], d: LANDMARK_PATHS.townHall },
    { id: "lm_06", name: "Asiatique", ownerId: null, description: "Riverside open-air mall and entertainment hub.", points: 45, resources: ["Tourism", "Entertainment"], d: LANDMARK_PATHS.asiatique },
    { id: "lm_08", name: "Chinatown Yaowarat Market", ownerId: null, description: "The vibrant heart of street food and trade.", points: 65, resources: ["Food", "Trade"], d: LANDMARK_PATHS.chinatown },
    { id: "lm_05", name: "The Grand Palace", ownerId: null, description: "The ultimate symbol of supremacy.", points: 100, resources: ["Artifacts", "Gold", "Influence"], d: LANDMARK_PATHS.grandPalace },
    { id: "lm_10", name: "Wat Arun", ownerId: null, description: "The iconic riverside temple.", points: 80, resources: ["Culture", "Tourism"], d: LANDMARK_PATHS.watArun },
    { id: "lm_12", name: "Rolland", ownerId: null, description: "Statue representing liberty and market rights.", points: 55, resources: ["Nature"], d: LANDMARK_PATHS.rolland },
    { id: "lm_13", name: "Town Musicians of Bremen", ownerId: null, description: "Iconic statue celebrating folklore.", points: 30, resources: ["Culture"], d: LANDMARK_PATHS.musicians },
    { id: "lm_14", name: "ICONSIAM", ownerId: null, description: "Modern commerce and luxury.", points: 85, resources: ["Luxury Goods", "Gold"], d: LANDMARK_PATHS.iconsiam },
    { id: "lm_15", name: "Wallanlagen", ownerId: null, description: "A historic park and former fortification area.", points: 40, resources: ["Nature", "History"], d: LANDMARK_PATHS.wallanlagen }
];