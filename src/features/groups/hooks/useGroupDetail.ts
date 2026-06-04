'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type RankingItemDto,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
} from '@lib/api/skorify';
import type { Group, GroupDetailData, GroupMember, StandingRow } from '../types';

const mapInstanceToGroup = (instance: TournamentInstanceDto, memberCount: number): Group => ({
  id: instance.id,
  name: instance.name,
  inviteCode: instance.inviteCode,
  adminId: instance.ownerId,
  memberCount,
  createdAt: instance.createdAt,
<<<<<<< HEAD
});

const mapRankingToStanding = (item: RankingItemDto, index: number): StandingRow => ({
  rank: item.position ?? index + 1,
  userId: item.userId,
  name: item.userName,
  points: item.points ?? 0,
  predictedMatches: 0,
});

const mapRankingToMember = (item: RankingItemDto, index: number, adminId: string): GroupMember => ({
  id: item.userId,
  name: item.userName,
  isAdmin: item.userId === adminId,
  points: item.points ?? 0,
  rank: item.position ?? index + 1,
=======
  tournamentId: instance.tournamentId,
});

// Build standings ordered by an explicit backend position when available
// (`-1` means "not calculated yet"), falling back to points descending. Each
// row gets a resolved 1-based rank so the table/podium can sort by it.
const buildStandings = (
  ranking: RankingItemDto[],
  positionOf: (item: RankingItemDto) => number,
): StandingRow[] => {
  const hasPositions = ranking.some((item) => positionOf(item) > 0);
  const ordered = [...ranking].sort((a, b) =>
    hasPositions ? positionOf(a) - positionOf(b) : (b.points ?? 0) - (a.points ?? 0),
  );
  return ordered.map((item, index) => ({
    rank: positionOf(item) > 0 ? positionOf(item) : index + 1,
    userId: item.userId,
    name: item.userName,
    points: item.points ?? 0,
    streak: item.streak ?? 0,
    maxStreak: item.maxStreak ?? 0,
  }));
};

const mapStandingToMember = (row: StandingRow, adminId: string): GroupMember => ({
  id: row.userId,
  name: row.name,
  isAdmin: row.userId === adminId,
  points: row.points,
  rank: row.rank,
>>>>>>> origin/develop
});

export const useGroupDetail = (groupId: string) => {
  const [data, setData] = useState<GroupDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshKeyRef = useRef(0);
<<<<<<< HEAD
=======
  // Keep the last rendered standings so a refetch can animate from the prior
  // order even when the backend doesn't populate `lastPosition`.
  const prevStandingsRef = useRef<StandingRow[] | null>(null);
>>>>>>> origin/develop

  const fetchData = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    const [instanceResult, rankingResult] = await Promise.all([
      api.get<SkorifyEnvelope<TournamentInstanceDto>>(skorifyEndpoints.tournamentInstance.getById, {
        tournamentInstanceId: groupId,
      }),
      api.get<SkorifyEnvelope<RankingItemDto[]>>(
        skorifyEndpoints.tournamentInstance.getCurrentRanking,
        { tournamentInstanceId: groupId },
      ),
    ]);

    if (!instanceResult.success || !instanceResult.data.data) {
      setData(null);
      setError('notFound');
      setIsLoading(false);
      return;
    }

    if (!rankingResult.success) {
      setData(null);
      setError('loadError');
      setIsLoading(false);
      return;
    }

    const instance = instanceResult.data.data;
    const ranking = rankingResult.data.data ?? [];

<<<<<<< HEAD
    const standings = ranking.map(mapRankingToStanding);
    const members = ranking.map((item, index) => mapRankingToMember(item, index, instance.ownerId));
=======
    const standings = buildStandings(ranking, (item) => item.currentPosition);
    // Prefer the prior on-screen standings (so a refetch animates from what the
    // user was just looking at). On the very first load there's no snapshot, so
    // fall back to the backend's `lastPosition` when it reports one.
    const hasPreviousPositions = ranking.some((item) => item.lastPosition > 0);
    const previousStandings =
      prevStandingsRef.current ??
      (hasPreviousPositions ? buildStandings(ranking, (item) => item.lastPosition) : undefined);
    prevStandingsRef.current = standings;
    const members = standings.map((row) => mapStandingToMember(row, instance.ownerId));
>>>>>>> origin/develop

    setData({
      group: mapInstanceToGroup(instance, ranking.length),
      standings,
<<<<<<< HEAD
=======
      previousStandings,
>>>>>>> origin/develop
      pendingMatches: [],
      members,
    });
    setIsLoading(false);
  }, [groupId]);

  const refetch = useCallback(() => {
    refreshKeyRef.current += 1;
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    // setState inside fetchData is deferred via `await Promise.resolve()`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};
