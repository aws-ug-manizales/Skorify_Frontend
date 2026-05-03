'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateMatchPayload,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCreateMatchState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto | null;
}

const initialState: UseCreateMatchState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCreateMatch = () => {
  const [state, setState] = useState<UseCreateMatchState>(initialState);

  const createMatch = useCallback(async (payload: CreateMatchPayload): Promise<MatchDto | null> => {
    setState({ isLoading: true, error: null, data: null });

    const result = await api.put<SkorifyEnvelope<MatchDto>, CreateMatchPayload>(
      skorifyEndpoints.match.create,
      payload,
    );

    if (result.success) {
      const data = result.data.data;
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: null });
    return null;
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { createMatch, reset, ...state };
};

export default useCreateMatch;
