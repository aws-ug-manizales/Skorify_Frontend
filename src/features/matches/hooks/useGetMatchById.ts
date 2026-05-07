'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetMatchByIdParams,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetMatchByIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto | null;
}

const initialState: UseGetMatchByIdState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetMatchById = () => {
  const [state, setState] = useState<UseGetMatchByIdState>(initialState);

  const getMatchById = useCallback(async (params: GetMatchByIdParams): Promise<MatchDto | null> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await api.get<SkorifyEnvelope<MatchDto>>(
      skorifyEndpoints.match.getById,
      params as unknown as Record<string, unknown>,
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

  return { getMatchById, reset, ...state };
};

export default useGetMatchById;
