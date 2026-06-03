'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTeamsByQueryParams,
  type SkorifyEnvelope,
  type TeamDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetTeamsByQueryState {
  isLoading: boolean;
  error: ApiError | null;
  data: TeamDto[];
}

const initialState: UseGetTeamsByQueryState = {
  isLoading: false,
  error: null,
  data: [],
};

interface UseGetTeamsByQueryOptions {
  autoFetch?: boolean;
  // Initial query used by the auto-fetch. Defaults to '' which matches every
  // team on the backend (name LIKE %%).
  initialQuery?: string;
}

export const useGetTeamsByQuery = (options: UseGetTeamsByQueryOptions = {}) => {
  const { autoFetch = true, initialQuery = '' } = options;
  const [state, setState] = useState<UseGetTeamsByQueryState>(initialState);

  const getTeamsByQuery = useCallback(async (query: string): Promise<TeamDto[]> => {
    await Promise.resolve();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await api.get<SkorifyEnvelope<TeamDto[]>>(skorifyEndpoints.team.getByQuery, {
      query,
    } satisfies GetTeamsByQueryParams as unknown as Record<string, unknown>);

    if (result.success) {
      const data = result.data.data ?? [];
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: [] });
    return [];
  }, []);

  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (!autoFetch || didAutoFetch.current) return;
    didAutoFetch.current = true;
    // setState in getTeamsByQuery is deferred via `await Promise.resolve()`,
    // and didAutoFetch guards against cascading re-runs.
    void getTeamsByQuery(initialQuery);
  }, [autoFetch, initialQuery, getTeamsByQuery]);

  const reset = useCallback(() => setState(initialState), []);

  return { getTeamsByQuery, reset, ...state };
};

export default useGetTeamsByQuery;
