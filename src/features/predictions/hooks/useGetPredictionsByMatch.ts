'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetPredictionsByMatchParams,
  type PredictionDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetPredictionsByMatchState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionDto[];
}

const initialState: UseGetPredictionsByMatchState = {
  isLoading: false,
  error: null,
  data: [],
};

export const useGetPredictionsByMatch = () => {
  const [state, setState] = useState<UseGetPredictionsByMatchState>(initialState);

  const getPredictionsByMatch = useCallback(
    async (params: GetPredictionsByMatchParams): Promise<PredictionDto[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<PredictionDto[]>>(
        skorifyEndpoints.prediction.getByMatch,
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

  return { getPredictionsByMatch, reset, ...state };
};

export default useGetPredictionsByMatch;
