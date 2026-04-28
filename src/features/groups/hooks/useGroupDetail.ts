'use client';

import { useState, useEffect } from 'react';
import type { GroupDetailData } from '../types';

const MOCK_DATA: GroupDetailData = {
  group: {
    id: '1',
    name: 'Liga de Amigos',
    description: 'El grupo de las apuestas del trabajo',
    inviteCode: 'AMIGOS24',
    adminId: 'mock-admin-id',
    memberCount: 5,
    createdAt: new Date().toISOString(),
  },
  standings: [
    { rank: 1, userId: 'mock-admin-id', name: 'Narboleda', points: 45, won: 9, drawn: 2, lost: 1 },
    { rank: 2, userId: 'user-2', name: 'Ana López', points: 38, won: 7, drawn: 3, lost: 2 },
    { rank: 3, userId: 'user-3', name: 'Carlos R.', points: 30, won: 6, drawn: 0, lost: 4 },
    { rank: 4, userId: 'user-4', name: 'María S.', points: 22, won: 4, drawn: 2, lost: 5 },
    { rank: 5, userId: 'user-5', name: 'Jorge M.', points: 18, won: 3, drawn: 1, lost: 6 },
  ],
  pendingMatches: [
    {
      id: 'm1',
      homeTeam: { name: 'Colombia' },
      awayTeam: { name: 'Argentina' },
      matchDate: new Date(Date.now() + 86400000).toISOString(),
      tournament: 'Copa América',
      hasPrediction: false,
    },
    {
      id: 'm2',
      homeTeam: { name: 'España' },
      awayTeam: { name: 'Francia' },
      matchDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      tournament: 'UEFA Nations League',
      hasPrediction: true,
    },
    {
      id: 'm3',
      homeTeam: { name: 'Brasil' },
      awayTeam: { name: 'Uruguay' },
      matchDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      tournament: 'Eliminatorias',
      hasPrediction: false,
    },
  ],
  members: [
    { id: 'mock-admin-id', name: 'Narboleda', isAdmin: true },
    { id: 'user-2', name: 'Ana López', isAdmin: false },
    { id: 'user-3', name: 'Carlos R.', isAdmin: false },
    { id: 'user-4', name: 'María S.', isAdmin: false },
    { id: 'user-5', name: 'Jorge M.', isAdmin: false },
  ],
};

export const useGroupDetail = (groupId: string) => {
  const [data, setData] = useState<GroupDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isMock = process.env.NEXT_PUBLIC_MOCK_GROUPS === 'true';

    if (isMock) {
      const timer = setTimeout(() => {
        setData({ ...MOCK_DATA, group: { ...MOCK_DATA.group, id: groupId } });
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }

    const fetchData = async () => {
      try {
        // TODO: replace with real API call: GET /groups/${groupId}
        setData({ ...MOCK_DATA, group: { ...MOCK_DATA.group, id: groupId } });
      } catch {
        setError('loadError');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  return { data, isLoading, error };
};
