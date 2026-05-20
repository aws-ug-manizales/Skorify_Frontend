'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetPredictionByUserAndMatchParams,
  type PredictionDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetPredictionByUserAndMatchState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionDto | null;
}

const initialState: UseGetPredictionByUserAndMatchState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetPredictionByUserAndMatch = () => {
  const [state, setState] = useState<UseGetPredictionByUserAndMatchState>(initialState);

  const getPredictionByUserAndMatch = useCallback(
    async (params: GetPredictionByUserAndMatchParams): Promise<PredictionDto | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<PredictionDto>>(
        skorifyEndpoints.prediction.getByUserAndMatch,
        params as unknown as Record<string, unknown>,
      );

      if (result.success) {
        const data = result.data.data ?? null;
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: null });
      return null;
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { getPredictionByUserAndMatch, reset, ...state };
};

export default useGetPredictionByUserAndMatch;
