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
});

export const useGroupDetail = (groupId: string) => {
  const [data, setData] = useState<GroupDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshKeyRef = useRef(0);

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

    const standings = ranking.map(mapRankingToStanding);
    const members = ranking.map((item, index) => mapRankingToMember(item, index, instance.ownerId));

    setData({
      group: mapInstanceToGroup(instance, ranking.length),
      standings,
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
