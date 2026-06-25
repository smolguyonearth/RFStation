import type { MapLocation } from '@/types/map.types'
import { LANDMARK_PATHS } from './landmarkPaths'
import { LANDMARK_IMAGES } from './landmarkImages'

export const Landmarks: MapLocation[] = [
    {
        id: 'lm_01',
        name: 'landmarks.mahanakhon.name',
        description: 'landmarks.mahanakhon.desc',
        ownerId: null,
        points: 50,
        resources: ['Energy', 'Tech'],
        d: LANDMARK_PATHS.mahanakhon,
        image: LANDMARK_IMAGES.king_power,
        imageSource: 'Chainwit, via Wikimedia Commons'
    },
    {
        id: 'lm_02',
        name: 'landmarks.bremen_stadium.name',
        description: 'landmarks.bremen_stadium.desc',
        ownerId: null,
        points: 40,
        resources: ['Manpower', 'Supplies'],
        d: LANDMARK_PATHS.bremenStadium,
        image: LANDMARK_IMAGES.bremen_stadium,
        imageSource: 'Marjan Grabowski on Unsplash'
    },
    {
        id: 'lm_03',
        name: 'landmarks.giant_swing.name',
        description: 'landmarks.giant_swing.desc',
        ownerId: null,
        points: 60,
        resources: ['Culture', 'Influence'],
        d: LANDMARK_PATHS.giantSwing,
        image: LANDMARK_IMAGES.giant_swing,
        imageSource: 'Moustapha KEBE on Unsplash'
    },
    {
        id: 'lm_04',
        name: 'landmarks.town_hall.name',
        description: 'landmarks.town_hall.desc',
        ownerId: null,
        points: 70,
        resources: ['Intel', 'Influence'],
        d: LANDMARK_PATHS.townHall,
        image: LANDMARK_IMAGES.town_hall,
        imageSource: 'Alain ROUILLER on Unsplash'
    },
    {
        id: 'lm_06',
        name: 'landmarks.asiatique.name',
        description: 'landmarks.asiatique.desc',
        ownerId: null,
        points: 45,
        resources: ['Tourism', 'Entertainment'],
        d: LANDMARK_PATHS.asiatique,
        image: LANDMARK_IMAGES.asiatique,
        imageSource: 'Kylle Pangan on Unsplash'
    },
    {
        id: 'lm_08',
        name: 'landmarks.yaowarat.name',
        description: 'landmarks.yaowarat.desc',
        ownerId: null,
        points: 65,
        resources: ['Food', 'Trade'],
        d: LANDMARK_PATHS.chinatown,
        image: LANDMARK_IMAGES.chinatown_yaowarat,
        imageSource: 'Kelvin Han on Unsplash'
    },
    {
        id: 'lm_05',
        name: 'landmarks.grand_palace.name',
        description: 'landmarks.grand_palace.desc',
        ownerId: null,
        points: 100,
        resources: ['Artifacts', 'Gold', 'Influence'],
        d: LANDMARK_PATHS.grandPalace,
        image: LANDMARK_IMAGES.grand_palace,
        imageSource: 'Prashant on Unsplash'
    },
    {
        id: 'lm_10',
        name: 'landmarks.wat_arun.name',
        description: 'landmarks.wat_arun.desc',
        ownerId: null,
        points: 80,
        resources: ['Culture', 'Tourism'],
        d: LANDMARK_PATHS.watArun,
        image: LANDMARK_IMAGES.wat_arun,
        imageSource: 'Anantachai Saothong on Unsplash'
    },
    {
        id: 'lm_12',
        name: 'landmarks.rolland.name',
        description: 'landmarks.rolland.desc',
        ownerId: null,
        points: 55,
        resources: ['Nature'],
        d: LANDMARK_PATHS.rolland,
        image: LANDMARK_IMAGES.roland,
        imageSource: 'Dietmar Rabich / CC BY-SA 4.0'
    },
    {
        id: 'lm_13',
        name: 'landmarks.musicians.name',
        description: 'landmarks.musicians.desc',
        ownerId: null,
        points: 30,
        resources: ['Culture'],
        d: LANDMARK_PATHS.musicians,
        image: LANDMARK_IMAGES.town_musicians,
        imageSource: 'Vlad Ion on Unsplash'
    },
    {
        id: 'lm_14',
        name: 'landmarks.iconsiam.name',
        description: 'landmarks.iconsiam.desc',
        ownerId: null,
        points: 85,
        resources: ['Luxury Goods', 'Gold'],
        d: LANDMARK_PATHS.iconsiam,
        image: LANDMARK_IMAGES.iconsiam,
        imageSource: 'Sung Jin Cho on Unsplash'
    },
    {
        id: 'lm_15',
        name: 'landmarks.wallanlagen.name',
        description: 'landmarks.wallanlagen.desc',
        ownerId: null,
        points: 40,
        resources: ['Nature', 'History'],
        d: LANDMARK_PATHS.wallanlagen,
        image: LANDMARK_IMAGES.wallanlagen,
        imageSource: 'Kieran Sheehan on Unsplash'
    }
]
