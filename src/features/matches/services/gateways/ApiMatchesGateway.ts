import { api } from '@lib/api';
import type { BackendEnvelope } from '@lib/api/types';
import type { Match } from '../../types';
import type { ListMatchesParams, MatchesGateway, PaginatedResult } from '../MatchesGateway';

type ApiPaginated<T> =
  | {
      items: T[];
      total: number;
      page: number;
      pageSize: number;
    }
  | BackendEnvelope<{
      items: T[];
      total: number;
      page: number;
      pageSize: number;
    }>;

type MatchesListResponse = ApiPaginated<Match> | BackendEnvelope<Match[]> | Match[];

const unwrapPaginated = (
  payload: MatchesListResponse,
  fallbackPage: number,
  fallbackPageSize: number,
): PaginatedResult<Match> => {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
      page: fallbackPage,
      pageSize: fallbackPageSize,
    };
  }

  if (payload && 'data' in payload && Array.isArray(payload.data)) {
    return {
      items: payload.data,
      total: payload.data.length,
      page: fallbackPage,
      pageSize: fallbackPageSize,
    };
  }

  if (payload && 'items' in payload && Array.isArray(payload.items)) {
    return payload as PaginatedResult<Match>;
  }

  if (
    payload &&
    'data' in payload &&
    payload.data &&
    typeof payload.data === 'object' &&
    'items' in payload.data &&
    Array.isArray((payload.data as { items: Match[] }).items)
  ) {
    return payload.data as PaginatedResult<Match>;
  }

  return { items: [], total: 0, page: fallbackPage, pageSize: fallbackPageSize };
};

export class ApiMatchesGateway implements MatchesGateway {
  constructor(private readonly url: string = '/matches') {}

  async listMatches(params?: ListMatchesParams): Promise<PaginatedResult<Match>> {
    const fallbackPage = Math.max(1, params?.page ?? 1);
    const fallbackPageSize = Math.max(1, params?.pageSize ?? 10);
    const res = await api.get<MatchesListResponse>(this.url, params);
    if (!res.success)
      return { items: [], total: 0, page: fallbackPage, pageSize: fallbackPageSize };
    return unwrapPaginated(res.data, fallbackPage, fallbackPageSize);
  }
}
