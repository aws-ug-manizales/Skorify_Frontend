'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetMatchesByTournamentIdParams,
  type MatchDto,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetMatchesByTournamentIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: MatchDto[];
}

const initialState: UseGetMatchesByTournamentIdState = {
  isLoading: false,
  error: null,
  data: [],
};

interface UseGetMatchesByTournamentIdOptions {
  autoFetch?: boolean;
  tournamentId?: string;
}

export const useGetMatchesByTournamentId = (options: UseGetMatchesByTournamentIdOptions = {}) => {
  const { autoFetch = true, tournamentId } = options;
  const [state, setState] = useState<UseGetMatchesByTournamentIdState>(initialState);

  const getMatchesByTournamentId = useCallback(
    async (params: GetMatchesByTournamentIdParams): Promise<MatchDto[]> => {
      await Promise.resolve();
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<MatchDto[]>>(
        skorifyEndpoints.match.getByTournamentId,
        params as unknown as Record<string, unknown>,
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

  const lastFetchedId = useRef<string | null>(null);
  useEffect(() => {
    if (!autoFetch || !tournamentId) return;
    if (lastFetchedId.current === tournamentId) return;
    lastFetchedId.current = tournamentId;
    // setState inside the callback is deferred via `await Promise.resolve()`,
    // and the lastFetchedId guard prevents the cascade the lint rule warns about.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getMatchesByTournamentId({ tournamentId });
  }, [autoFetch, tournamentId, getMatchesByTournamentId]);

  const reset = useCallback(() => setState(initialState), []);

  return { getMatchesByTournamentId, reset, ...state };
};

export default useGetMatchesByTournamentId;
