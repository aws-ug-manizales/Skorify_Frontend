'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateTournamentPayload,
  type SkorifyEnvelope,
  type TournamentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCreateTournamentState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentDto | null;
}

const initialState: UseCreateTournamentState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCreateTournament = () => {
  const [state, setState] = useState<UseCreateTournamentState>(initialState);

  const createTournament = useCallback(
    async (payload: CreateTournamentPayload): Promise<TournamentDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.put<SkorifyEnvelope<TournamentDto>, CreateTournamentPayload>(
        skorifyEndpoints.tournament.create,
        payload,
      );

      if (result.success) {
        const data = result.data.data;
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: null });
      return null;
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { createTournament, reset, ...state };
};

export default useCreateTournament;
