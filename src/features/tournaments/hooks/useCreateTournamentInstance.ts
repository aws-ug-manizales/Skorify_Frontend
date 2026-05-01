'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateTournamentInstancePayload,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCreateTournamentInstanceState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentInstanceDto | null;
}

const initialState: UseCreateTournamentInstanceState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCreateTournamentInstance = () => {
  const [state, setState] = useState<UseCreateTournamentInstanceState>(initialState);

  const createTournamentInstance = useCallback(
    async (payload: CreateTournamentInstancePayload): Promise<TournamentInstanceDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.put<
        SkorifyEnvelope<TournamentInstanceDto>,
        CreateTournamentInstancePayload
      >(skorifyEndpoints.tournamentInstance.create, payload);

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

  return { createTournamentInstance, reset, ...state };
};

export default useCreateTournamentInstance;
