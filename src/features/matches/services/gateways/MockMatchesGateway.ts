import type { Match } from '../../types';
import type { ListMatchesParams, MatchesGateway, PaginatedResult } from '../MatchesGateway';
import { MOCK_MATCHES } from '../../data/mockMatches';
import { useAuthStore } from '@features/auth/store/useAuthStore';

const USER_PREDICTIONS: Record<
  string,
  Record<string, { home: number; away: number } | undefined>
> = {
  'admin-user': {
    'm-fin-03': { home: 0, away: 0 },
    'm-fin-02': { home: 2, away: 1 },
    'm-fin-01': { home: 1, away: 2 },
  },
  'mock-user-1': {
    'm-fin-03': { home: 0, away: 1 },
    'm-fin-02': undefined,
    'm-fin-01': { home: 0, away: 3 },
  },
  'mock-user-2': {
    'm-fin-03': { home: 1, away: 3 },
    'm-fin-02': { home: 2, away: 2 },
    'm-fin-01': { home: 0, away: 0 },
  },
  'mock-user-3': {
    'm-fin-03': { home: 2, away: 0 },
    'm-fin-02': { home: 1, away: 1 },
    'm-fin-01': { home: 3, away: 1 },
  },
};

const applyMockFilters = (matches: Match[], params?: ListMatchesParams) => {
  if (!params) return matches;
  const fromMs = params.from ? new Date(params.from).getTime() : undefined;
  const toMs = params.to ? new Date(params.to).getTime() : undefined;
  const q = params.team?.trim().toLowerCase();

  return matches.filter((m) => {
    if (params.status && m.status !== params.status) return false;
    if (q) {
      const home = `${m.homeTeam.name} ${m.homeTeam.code ?? ''}`.toLowerCase();
      const away = `${m.awayTeam.name} ${m.awayTeam.code ?? ''}`.toLowerCase();
      if (!home.includes(q) && !away.includes(q)) return false;
    }
    const k = new Date(m.kickoffAt).getTime();
    if (fromMs !== undefined && k < fromMs) return false;
    if (toMs !== undefined && k > toMs) return false;
    return true;
  });
};

export class MockMatchesGateway implements MatchesGateway {
  async listMatches(params?: ListMatchesParams): Promise<PaginatedResult<Match>> {
    // Obtener usuario actual del Zustand store
    const userId = useAuthStore.getState().session?.user.id;

    // Mapear partidos dinámicamente según las predicciones del usuario actual
    const mappedMatches = MOCK_MATCHES.map((match) => {
      if (userId && USER_PREDICTIONS[userId] && match.id in USER_PREDICTIONS[userId]) {
        return {
          ...match,
          prediction: USER_PREDICTIONS[userId][match.id],
        };
      }
      return match;
    });

    const filtered = applyMockFilters(mappedMatches, params);

    const pageSize = Math.max(1, params?.pageSize ?? 10);
    const page = Math.max(1, params?.page ?? 1);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
    };
  }
}
