'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetPredictionsByUserParams,
  type PredictionDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetPredictionsByUserState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionDto[] | null;
}

const initialState: UseGetPredictionsByUserState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetPredictionsByUser = () => {
  const [state, setState] = useState<UseGetPredictionsByUserState>(initialState);

  const getPredictionsByUser = useCallback(
    async (params: GetPredictionsByUserParams): Promise<PredictionDto[] | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<PredictionDto[]>>(
        skorifyEndpoints.prediction.getByUser,
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

  return { getPredictionsByUser, reset, ...state };
};

export default useGetPredictionsByUser;
