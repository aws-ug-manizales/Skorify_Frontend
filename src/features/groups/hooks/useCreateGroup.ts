'use client';

import { useCallback } from 'react';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
import type { Id, TournamentInstanceDto } from '@lib/api';
import { useCreateTournamentInstance } from '@features/tournaments/hooks/useCreateTournamentInstance';
import type { CreateGroupPayload, Group } from '../types';

const mapInstanceToGroup = (instance: TournamentInstanceDto): Group => ({
  id: instance.id,
  name: instance.name,
  inviteCode: instance.inviteCode,
  adminId: instance.ownerId,
  memberCount: 1,
  createdAt: instance.createdAt,
});

interface CreateGroupInput extends CreateGroupPayload {
  tournamentId: Id;
  price?: number;
}

const useCreateGroup = () => {
  const ownerId = useCurrentUserId();
  const { createTournamentInstance, isLoading, error, reset } = useCreateTournamentInstance();

  const createGroup = useCallback(
    async (input: CreateGroupInput): Promise<Group | null> => {
      if (!ownerId) return null;

      const instance = await createTournamentInstance({
        tournamentId: input.tournamentId,
        ownerId,
        name: input.name,
        price: input.price,
      });

      if (!instance) return null;

      return mapInstanceToGroup(instance);
    },
    [createTournamentInstance, ownerId],
  );

  return { createGroup, isLoading, error, reset };
};

export default useCreateGroup;
