'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type EditMatchPayload,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseEditMatchState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto | null;
}

const initialState: UseEditMatchState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useEditMatch = () => {
  const [state, setState] = useState<UseEditMatchState>(initialState);

  const editMatch = useCallback(async (payload: EditMatchPayload): Promise<MatchDto | null> => {
    setState({ isLoading: true, error: null, data: null });

    const result = await api.patch<SkorifyEnvelope<MatchDto>, EditMatchPayload>(
      skorifyEndpoints.match.edit,
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

  return { editMatch, reset, ...state };
};

export default useEditMatch;
