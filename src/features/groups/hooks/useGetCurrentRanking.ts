'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetCurrentRankingParams,
  type RankingItemDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetCurrentRankingState {
  isLoading: boolean;
  error: ApiError | null;
  data: RankingItemDto[];
}

const initialState: UseGetCurrentRankingState = {
  isLoading: false,
  error: null,
  data: [],
};

export const useGetCurrentRanking = () => {
  const [state, setState] = useState<UseGetCurrentRankingState>(initialState);

  const getCurrentRanking = useCallback(
    async (params: GetCurrentRankingParams): Promise<RankingItemDto[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<RankingItemDto[]>>(
        skorifyEndpoints.tournamentInstance.getCurrentRanking,
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

  return { getCurrentRanking, reset, ...state };
};

export default useGetCurrentRanking;
