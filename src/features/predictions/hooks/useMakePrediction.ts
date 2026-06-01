'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type MakePredictionPayload,
  type PredictionDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseMakePredictionState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionDto | null;
}

const initialState: UseMakePredictionState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useMakePrediction = () => {
  const [state, setState] = useState<UseMakePredictionState>(initialState);

  const makePrediction = useCallback(
    async (payload: MakePredictionPayload): Promise<PredictionDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.post<SkorifyEnvelope<PredictionDto>, MakePredictionPayload>(
        skorifyEndpoints.prediction.make,
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

  return { makePrediction, reset, ...state };
};

export default useMakePrediction;
