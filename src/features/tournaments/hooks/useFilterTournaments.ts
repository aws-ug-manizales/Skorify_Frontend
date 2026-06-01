'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type FilterTournamentsParams,
  type SkorifyEnvelope,
  type TournamentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseFilterTournamentsState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentDto[];
}

const initialState: UseFilterTournamentsState = {
  isLoading: false,
  error: null,
  data: [],
};

interface UseFilterTournamentsOptions {
  autoFetch?: boolean;
  params?: FilterTournamentsParams;
}

export const useFilterTournaments = (options: UseFilterTournamentsOptions = {}) => {
  const { autoFetch = true, params } = options;
  const [state, setState] = useState<UseFilterTournamentsState>(initialState);

  const filterTournaments = useCallback(
    async (next: FilterTournamentsParams = {}): Promise<TournamentDto[]> => {
      await Promise.resolve();
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<TournamentDto[]>>(
        skorifyEndpoints.tournament.filter,
        next as Record<string, unknown>,
      );

      if (result.success) {
        const data = result.data.data ?? [];
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: [] });
      return [];
    },
    [],
  );

  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (!autoFetch || didAutoFetch.current) return;
    didAutoFetch.current = true;
    // setState inside filterTournaments is deferred via `await Promise.resolve()`,
    // and didAutoFetch guards against cascading re-runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void filterTournaments(params ?? {});
  }, [autoFetch, filterTournaments, params]);

  const reset = useCallback(() => setState(initialState), []);

  return { filterTournaments, reset, ...state };
};

export default useFilterTournaments;
