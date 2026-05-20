'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTournamentInstanceByIdParams,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetTournamentInstanceByIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentInstanceDto | null;
}

const initialState: UseGetTournamentInstanceByIdState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetTournamentInstanceById = () => {
  const [state, setState] = useState<UseGetTournamentInstanceByIdState>(initialState);

  const getTournamentInstanceById = useCallback(
    async (params: GetTournamentInstanceByIdParams): Promise<TournamentInstanceDto | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<TournamentInstanceDto>>(
        skorifyEndpoints.tournamentInstance.getById,
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

  return { getTournamentInstanceById, reset, ...state };
};

export default useGetTournamentInstanceById;
