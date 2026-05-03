import type { Match } from '../../types';
import type { ListMatchesParams, MatchesGateway, PaginatedResult } from '../MatchesGateway';
import { MOCK_MATCHES } from '../../data/mockMatches';

const applyMockFilters = (matches: Match[], params?: ListMatchesParams) => {
  if (!params) return matches;
  // En el mock por ahora sólo filtramos por rango de fecha si viene.
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
    const filtered = applyMockFilters(MOCK_MATCHES, params);

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
