'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type PredictionScoringConfigDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetPredictionRulesState {
  isLoading: boolean;
  error: ApiError | null;
  data: PredictionScoringConfigDto | null;
}

const initialState: UseGetPredictionRulesState = {
  isLoading: false,
  error: null,
  data: null,
};

interface UseGetPredictionRulesOptions {
  autoFetch?: boolean;
}

export const useGetPredictionRules = (options: UseGetPredictionRulesOptions = {}) => {
  const { autoFetch = true } = options;
  const [state, setState] = useState<UseGetPredictionRulesState>(initialState);

  const getPredictionRules = useCallback(async (): Promise<PredictionScoringConfigDto | null> => {
    await Promise.resolve();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await api.get<SkorifyEnvelope<PredictionScoringConfigDto>>(
      skorifyEndpoints.prediction.getRules,
    );

    if (result.success) {
      const data = result.data.data;
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: null });
    return null;
  }, []);

  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (!autoFetch || didAutoFetch.current) return;
    didAutoFetch.current = true;
    // setState inside getPredictionRules is deferred via `await Promise.resolve()`,
    // and didAutoFetch guards against cascading re-runs.
     
    void getPredictionRules();
  }, [autoFetch, getPredictionRules]);

  const reset = useCallback(() => setState(initialState), []);

  return { getPredictionRules, reset, ...state };
};

export default useGetPredictionRules;
