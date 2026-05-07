'use client';

import { useState } from 'react';
import { api } from '@lib/api';
import type { BackendEnvelope } from '@lib/api/types';
import type { CreateGroupPayload, Group } from '../types';

// ─── MOCK (solo activo cuando NEXT_PUBLIC_MOCK_GROUPS=true en .env.local) ───
const mockCreateGroup = (payload: CreateGroupPayload): Promise<Group> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: `mock-${Date.now()}`,
          name: payload.name,
          description: payload.description,
          inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
          adminId: 'mock-user-1',
          memberCount: 1,
          createdAt: new Date().toISOString(),
        }),
      800,
    ),
  );
// ─────────────────────────────────────────────────────────────────────────────

const useCreateGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroup = async (payload: CreateGroupPayload): Promise<Group | null> => {
    setIsLoading(true);
    setError(null);

    if (process.env.NEXT_PUBLIC_MOCK_GROUPS === 'true') {
      const group = await mockCreateGroup(payload);
      setIsLoading(false);
      return group;
    }

    const result = await api.post<BackendEnvelope<Group>, CreateGroupPayload>('/groups', payload);

    setIsLoading(false);

    if (result.success) {
      return result.data.data;
    }

    setError(result.error.message);
    return null;
  };

  return { createGroup, isLoading, error };
};

export default useCreateGroup;
