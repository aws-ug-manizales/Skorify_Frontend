'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTournamentByIdParams,
  type SkorifyEnvelope,
  type TournamentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetTournamentByIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentDto | null;
}

const initialState: UseGetTournamentByIdState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetTournamentById = () => {
  const [state, setState] = useState<UseGetTournamentByIdState>(initialState);

  const getTournamentById = useCallback(
    async (params: GetTournamentByIdParams): Promise<TournamentDto | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<TournamentDto>>(
        skorifyEndpoints.tournament.getById,
        params as unknown as Record<string, unknown>,
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

  return { getTournamentById, reset, ...state };
};

export default useGetTournamentById;
