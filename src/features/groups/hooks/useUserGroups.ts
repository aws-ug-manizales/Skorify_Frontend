'use client';

import { useEffect, useState } from 'react';

export interface UserGroupSummary {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  rank: number;
  points: number;
  pendingPredictions?: number;
}

const MOCK_USER_GROUPS: UserGroupSummary[] = [
  {
    id: '1',
    name: 'Liga Colombiana 2026',
    description: 'El grupo de las apuestas del trabajo',
    memberCount: 12,
    rank: 3,
    points: 2450,
    pendingPredictions: 2,
  },
  {
    id: '2',
    name: 'Champions Elite',
    description: 'Solo los mejores predictores',
    memberCount: 8,
    rank: 1,
    points: 3120,
    pendingPredictions: 0,
  },
  {
    id: '3',
    name: 'Mundial Familiar',
    description: 'Apuestas con la familia',
    memberCount: 24,
    rank: 7,
    points: 1840,
    pendingPredictions: 5,
  },
];

export const useUserGroups = () => {
  const [groups, setGroups] = useState<UserGroupSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isMock = process.env.NEXT_PUBLIC_MOCK_GROUPS === 'true';
    const timer = setTimeout(
      () => {
        setGroups(MOCK_USER_GROUPS);
        setIsLoading(false);
      },
      isMock ? 400 : 0,
    );
    return () => clearTimeout(timer);
  }, []);

  return { groups, isLoading };
};
