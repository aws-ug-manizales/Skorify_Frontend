'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTeamByIdsParams,
  type SkorifyEnvelope,
  type TeamDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

export type TeamsByIdsLookup = Record<string, TeamDto | undefined>;

interface UseGetTeamsByIdsState {
  isLoading: boolean;
  error: ApiError | null;
  teams: TeamsByIdsLookup;
}

const initialState: UseGetTeamsByIdsState = {
  isLoading: false,
  error: null,
  teams: {},
};

export const useGetTeamsByIds = (teamIds: string[]) => {
  const [state, setState] = useState<UseGetTeamsByIdsState>(initialState);
  const lastKeyRef = useRef<string>('');

  const fetchTeams = useCallback(async (params: GetTeamByIdsParams): Promise<TeamsByIdsLookup> => {
    if (params.teamIds.length === 0) return {};

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const qs = params.teamIds.map((id) => `teamIds=${encodeURIComponent(id)}`).join('&');
    const result = await api.get<SkorifyEnvelope<TeamDto[]>>(
      `${skorifyEndpoints.team.getByIds}?${qs}`,
    );

    if (result.success) {
      const lookup: TeamsByIdsLookup = {};
      (result.data.data ?? []).forEach((team) => {
        lookup[team.id] = team;
      });
      setState({ isLoading: false, error: null, teams: lookup });
      return lookup;
    }

    setState((prev) => ({ ...prev, isLoading: false, error: result.error }));
    return {};
  }, []);

  // Re-fetch whenever the set of IDs changes.
  const key = teamIds.slice().sort().join('|');
  useEffect(() => {
    if (!key || key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    void fetchTeams({ teamIds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reset = useCallback(() => {
    lastKeyRef.current = '';
    setState(initialState);
  }, []);

  return { fetchTeams, reset, ...state };
};

export default useGetTeamsByIds;
