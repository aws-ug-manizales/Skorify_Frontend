'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type EditPredictionPayload,
  type PredictionDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseEditPredictionState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionDto | null;
}

const initialState: UseEditPredictionState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useEditPrediction = () => {
  const [state, setState] = useState<UseEditPredictionState>(initialState);

  const editPrediction = useCallback(
    async (payload: EditPredictionPayload): Promise<PredictionDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.patch<SkorifyEnvelope<PredictionDto>, EditPredictionPayload>(
        skorifyEndpoints.prediction.edit,
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

  return { editPrediction, reset, ...state };
};

export default useEditPrediction;
