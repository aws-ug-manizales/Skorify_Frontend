'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTournamentInstancesByTournamentIdParams,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetTournamentInstancesByTournamentIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentInstanceDto[];
}

const initialState: UseGetTournamentInstancesByTournamentIdState = {
  isLoading: false,
  error: null,
  data: [],
};

export const useGetTournamentInstancesByTournamentId = () => {
  const [state, setState] = useState<UseGetTournamentInstancesByTournamentIdState>(initialState);

  const getTournamentInstancesByTournamentId = useCallback(
    async (
      params: GetTournamentInstancesByTournamentIdParams,
    ): Promise<TournamentInstanceDto[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<TournamentInstanceDto[]>>(
        skorifyEndpoints.tournamentInstance.getByTournamentId,
        params as unknown as Record<string, unknown>,
      );

      if (result.success) {
        const data = result.data.data ?? [];
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: [] });
      return [];
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { getTournamentInstancesByTournamentId, reset, ...state };
};

export default useGetTournamentInstancesByTournamentId;
