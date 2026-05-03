'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Match } from '../types';
import type { MatchesFilterKey } from '../components/molecules/MatchesFilters';
import { matchesService } from '../services/matchesService';
import {
  statusFromFilter,
  worldCupWeekToFromToIso,
  type MatchesQuery,
} from '../filters/MatchesQuery';

type UseMatchesListState = {
  query: MatchesQuery;
  setStatusFilter: (filter: MatchesFilterKey) => void;
  setTeam: (team: string) => void;
  setWeek: (month: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
  loading: boolean;
  items: Match[];
  total: number;
};

export const useMatchesList = (initialPageSize = 10): UseMatchesListState => {
  const [query, setQuery] = useState<MatchesQuery>({
    statusFilter: 'filterAll',
    team: '',
    week: '',
    page: 1,
    pageSize: initialPageSize,
  });

  const [items, setItems] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const status = statusFromFilter(query.statusFilter);
    const { from, to } = worldCupWeekToFromToIso(Number(query.week));
    return {
      page: query.page,
      pageSize: query.pageSize,
      status,
      team: query.team.trim() || undefined,
      from,
      to,
    };
  }, [query]);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    matchesService
      .listMatches(params)
      .then((res) => {
        if (!mounted) return;
        setItems(res.items);
        setTotal(res.total);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params]);

  const setStatusFilter = (filter: MatchesFilterKey) =>
    setQuery((q) => ({ ...q, statusFilter: filter, page: 1 }));
  const setTeam = (team: string) => setQuery((q) => ({ ...q, team, page: 1 }));
  const setWeek = (week: string) => setQuery((q) => ({ ...q, week, page: 1 }));
  const setPage = (page: number) => setQuery((q) => ({ ...q, page: Math.max(1, page) }));
  const setPageSize = (pageSize: number) =>
    setQuery((q) => ({ ...q, pageSize: Math.max(1, pageSize), page: 1 }));

  const resetFilters = () =>
    setQuery((q) => ({ ...q, statusFilter: 'filterAll', team: '', week: '', page: 1 }));

  return {
    query,
    setStatusFilter,
    setTeam,
    setWeek,
    setPage,
    setPageSize,
    resetFilters,
    loading,
    items,
    total,
  };
};
