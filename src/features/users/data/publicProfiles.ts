export interface PublicProfileGroup {
  id: string;
  name: string;
  rank: number;
}

export interface PublicProfilePrediction {
  id: string;
  match: string;
  tournament: string;
  hit: boolean;
  points: number;
}

export interface PublicProfile {
  id: string;
  name: string;
  memberSince: string;
  totalPoints: number;
  accuracy: number;
  predictions: number;
  streak: number;
  sharedGroups: PublicProfileGroup[];
  recentPredictions: PublicProfilePrediction[];
}

const FALLBACK_NAME_BY_ID: Record<string, string> = {
  'mock-admin-id': 'Narboleda',
  'user-2': 'Ana López',
  'user-3': 'Carlos R.',
  'user-4': 'María S.',
  'user-5': 'Jorge M.',
  'user-6': 'Laura P.',
  'user-7': 'Sebastián V.',
  'user-8': 'Camila T.',
  'user-9': 'Andrés F.',
  'user-10': 'Valentina G.',
  'user-11': 'Diego H.',
  'user-12': 'Isabella R.',
};

// Deterministic pseudo-random from the userId string so the mock values stay
// stable across renders/navigations for the same id.
const seededInt = (seed: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min + 1));
};

export const getPublicProfile = (id: string): PublicProfile => {
  const name = FALLBACK_NAME_BY_ID[id] ?? `Player ${id}`;
  return {
    id,
    name,
    memberSince: '2025-09-12',
    totalPoints: seededInt(id + 'p', 600, 4800),
    accuracy: seededInt(id + 'a', 42, 88),
    predictions: seededInt(id + 'n', 18, 220),
    streak: seededInt(id + 's', 1, 12),
    sharedGroups: [
      { id: '1', name: 'Liga de Amigos', rank: seededInt(id + 'g1', 1, 12) },
      { id: '2', name: 'Champions Elite', rank: seededInt(id + 'g2', 1, 8) },
    ],
    recentPredictions: [
      {
        id: `${id}-rp1`,
        match: 'Real Madrid 3 - 1 Barcelona',
        tournament: 'La Liga',
        hit: true,
        points: 100,
      },
      {
        id: `${id}-rp2`,
        match: 'PSG 2 - 2 Lyon',
        tournament: 'Ligue 1',
        hit: false,
        points: 0,
      },
      {
        id: `${id}-rp3`,
        match: 'Bayern 4 - 1 Dortmund',
        tournament: 'Bundesliga',
        hit: true,
        points: 75,
      },
    ],
  };
};

export const KNOWN_PROFILE_IDS = Object.keys(FALLBACK_NAME_BY_ID);
