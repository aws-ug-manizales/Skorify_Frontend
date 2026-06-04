'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetTournamentByIdParams,
  type MatchType,
  type SkorifyEnvelope,
  type TournamentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetTournamentByIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: TournamentDto | null;
}

const initialState: UseGetTournamentByIdState = {
  isLoading: false,
  error: null,
  data: null,
};

// The backend returns this endpoint with the entity shape (camelCase),
// while the list endpoint returns the raw DB shape (snake_case). Normalize
// here so the rest of the frontend sees a single shape — matches TournamentDto.
type RawTournament = Partial<TournamentDto> & {
  startDate?: string | null;
  endDate?: string | null;
  matchType?: MatchType | null;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  id: string;
  name: string;
  token: string;
};

const normalizeTournament = (raw: RawTournament): TournamentDto => ({
  id: raw.id,
  name: raw.name,
  token: raw.token,
<<<<<<< HEAD
  start_date: raw.start_date ?? raw.startDate ?? null,
  end_date: raw.end_date ?? raw.endDate ?? null,
  match_type: raw.match_type ?? raw.matchType ?? null,
  created_at: raw.created_at ?? raw.createdAt ?? '',
  updated_at: raw.updated_at ?? raw.updatedAt ?? null,
  deleted_at: raw.deleted_at ?? raw.deletedAt ?? null,
=======
  startDate: raw.startDate ?? raw.startDate ?? null,
  endDate: raw.endDate ?? raw.endDate ?? null,
  matchType: raw.matchType ?? raw.matchType ?? null,
  createdAt: raw.createdAt ?? raw.createdAt ?? '',
  updatedAt: raw.updatedAt ?? raw.updatedAt ?? null,
  deletedAt: raw.deletedAt ?? raw.deletedAt ?? null,
>>>>>>> origin/develop
});

export const useGetTournamentById = () => {
  const [state, setState] = useState<UseGetTournamentByIdState>(initialState);

  const getTournamentById = useCallback(
    async (params: GetTournamentByIdParams): Promise<TournamentDto | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<RawTournament>>(
        skorifyEndpoints.tournament.getById,
        params as unknown as Record<string, unknown>,
      );

      if (result.success) {
        const data = normalizeTournament(result.data.data);
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: null });
      return null;
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { getTournamentById, reset, ...state };
};

export default useGetTournamentById;
