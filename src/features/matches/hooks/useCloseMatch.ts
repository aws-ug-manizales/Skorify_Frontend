'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CloseMatchPayload,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCloseMatchState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto | null;
}

const initialState: UseCloseMatchState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCloseMatch = () => {
  const [state, setState] = useState<UseCloseMatchState>(initialState);

  const closeMatch = useCallback(async (payload: CloseMatchPayload): Promise<MatchDto | null> => {
    setState({ isLoading: true, error: null, data: null });

    const result = await api.post<SkorifyEnvelope<MatchDto>, CloseMatchPayload>(
      skorifyEndpoints.match.close,
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

  return { closeMatch, reset, ...state };
};

export default useCloseMatch;
