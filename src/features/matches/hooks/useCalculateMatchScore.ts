'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CalculateMatchScorePayload,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCalculateMatchScoreState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto | null;
}

const initialState: UseCalculateMatchScoreState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCalculateMatchScore = () => {
  const [state, setState] = useState<UseCalculateMatchScoreState>(initialState);

  const calculateMatchScore = useCallback(
    async (payload: CalculateMatchScorePayload): Promise<MatchDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.post<SkorifyEnvelope<MatchDto>, CalculateMatchScorePayload>(
        skorifyEndpoints.match.calculateScore,
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

  return { calculateMatchScore, reset, ...state };
};

export default useCalculateMatchScore;
