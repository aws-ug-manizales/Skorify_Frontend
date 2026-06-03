import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type MatchDto,
  type MatchWithTeamsDto,
  type SkorifyEnvelope,
  type TeamDto,
} from '@lib/api/skorify';
import type { Match, MatchStatus, MatchTeam } from '../../types';
import type { ListMatchesParams, MatchesGateway, PaginatedResult } from '../MatchesGateway';

const mapStatus = (status: MatchDto['status']): MatchStatus => {
  if (status === 'in_progress') return 'live';
  if (status === 'finished' || status === 'cancelled') return 'finished';
  return 'upcoming';
};

const toTeam = (team: TeamDto | undefined, fallbackId: string): MatchTeam => ({
  name: team?.name ?? fallbackId,
  code: team?.code,
  image: team?.shieldUrl ?? undefined,
});

const toMatch = ({ match, homeTeam, awayTeam }: MatchWithTeamsDto): Match => ({
  id: match.id,
  tournamentKey: match.tournamentId,
  stageKey: match.stage ?? 'group',
  status: mapStatus(match.status),
  kickoffAt: match.kickOff,
  homeTeamId: match.homeTeamId,
  awayTeamId: match.awayTeamId,
  homeTeam: toTeam(homeTeam, match.homeTeamId),
  awayTeam: toTeam(awayTeam, match.awayTeamId),
  score:
    typeof match.homeScore === 'number' && typeof match.awayScore === 'number'
      ? { home: match.homeScore, away: match.awayScore }
      : undefined,
});

const applyFilters = (matches: Match[], params?: ListMatchesParams): Match[] => {
  if (!params) return matches;
  const fromMs = params.from ? new Date(params.from).getTime() : undefined;
  const toMs = params.to ? new Date(params.to).getTime() : undefined;
  const q = params.team?.trim().toLowerCase();

  return matches.filter((m) => {
    if (params.status && m.status !== params.status) return false;
    if (params.tournamentId && m.tournamentKey !== params.tournamentId) return false;
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

const paginate = (items: Match[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export class ApiMatchesGateway implements MatchesGateway {
  async listMatches(params?: ListMatchesParams): Promise<PaginatedResult<Match>> {
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.max(1, params?.pageSize ?? 10);

    if (!params?.tournamentId) {
      // Backend only exposes matches scoped to a tournament. Without an ID
      // we return an empty page so callers can prompt the user to pick one
      // rather than silently hitting the wrong endpoint.
      return { items: [], total: 0, page, pageSize };
    }

    const res = await api.get<SkorifyEnvelope<MatchWithTeamsDto[]>>(
      skorifyEndpoints.match.getByTournamentId,
      { tournamentId: params.tournamentId },
    );

    if (!res.success) return { items: [], total: 0, page, pageSize };

    const matches = (res.data.data ?? []).map(toMatch);
    const filtered = applyFilters(matches, params);
    return {
      items: paginate(filtered, page, pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }
}
