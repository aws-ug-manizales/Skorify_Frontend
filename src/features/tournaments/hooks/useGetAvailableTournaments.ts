'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import { skorifyEndpoints, type SkorifyEnvelope, type TournamentDto } from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetAvailableTournamentsState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentDto[];
}

const initialState: UseGetAvailableTournamentsState = {
  isLoading: false,
  error: null,
  data: [],
};

interface UseGetAvailableTournamentsOptions {
  autoFetch?: boolean;
}

export const useGetAvailableTournaments = (options: UseGetAvailableTournamentsOptions = {}) => {
  const { autoFetch = true } = options;
  const [state, setState] = useState<UseGetAvailableTournamentsState>(initialState);

  const getAvailableTournaments = useCallback(async (): Promise<TournamentDto[]> => {
    await Promise.resolve();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await api.get<SkorifyEnvelope<TournamentDto[]>>(
      skorifyEndpoints.tournament.getAvailable,
    );

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
    // setState inside getAvailableTournaments is deferred via `await Promise.resolve()`,
    // and didAutoFetch guards against cascading re-runs.
     
    void getAvailableTournaments();
  }, [autoFetch, getAvailableTournaments]);

  const reset = useCallback(() => setState(initialState), []);

  return { getAvailableTournaments, reset, ...state };
};

export default useGetAvailableTournaments;
