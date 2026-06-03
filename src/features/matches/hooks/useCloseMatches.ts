'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CloseMatchesPayload,
  type Id,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCloseMatchesState {
  isLoading: boolean;
  error: ApiError | null;
  data: Id[] | null;
}

const initialState: UseCloseMatchesState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCloseMatches = () => {
  const [state, setState] = useState<UseCloseMatchesState>(initialState);

  const closeMatches = useCallback(async (payload: CloseMatchesPayload): Promise<Id[] | null> => {
    setState({ isLoading: true, error: null, data: null });

    const result = await api.post<SkorifyEnvelope<Id[]>, CloseMatchesPayload>(
      skorifyEndpoints.match.closeMany,
      payload,
    );

    if (result.success) {
      const data = result.data.data ?? [];
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: null });
    return null;
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { closeMatches, reset, ...state };
};

export default useCloseMatches;
