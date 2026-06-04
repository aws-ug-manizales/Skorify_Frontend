'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type RankingItemDto,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
  type UserEnrollmentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';

export interface UserGroupSummary {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  rank: number;
  points: number;
  pendingPredictions?: number;
}

interface UseUserGroupsState {
  groups: UserGroupSummary[];
  isLoading: boolean;
  error: ApiError | null;
}

const initialState: UseUserGroupsState = {
  groups: [],
  isLoading: false,
  error: null,
};

const fetchInstance = async (
  tournamentInstanceId: string,
): Promise<TournamentInstanceDto | null> => {
  const result = await api.get<SkorifyEnvelope<TournamentInstanceDto>>(
    skorifyEndpoints.tournamentInstance.getById,
    { tournamentInstanceId },
  );
  return result.success ? result.data.data : null;
};

const fetchMemberCount = async (tournamentInstanceId: string): Promise<number> => {
  const result = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
    skorifyEndpoints.userEnrollment.getByTournamentInstanceId,
    { tournamentInstanceId },
  );
  return result.success ? (result.data.data?.length ?? 0) : 0;
};

interface UserStanding {
  position: number;
  points: number;
}

// The enrollment's `currentPosition`/`currentScore` aren't kept up to date, so
// resolve the real standing from the instance's current ranking instead.
//
// The ranking may key users by the domain user id, the Cognito `sub`, or the
// auth user id depending on how the backend built it, so match against every
// candidate id from the session rather than a single one — otherwise the lookup
// misses and the card silently falls back to the stale `currentScore` (0).
const fetchUserStanding = async (
  tournamentInstanceId: string,
  candidateIds: string[],
): Promise<UserStanding | null> => {
  const result = await api.get<SkorifyEnvelope<RankingItemDto[]>>(
    skorifyEndpoints.tournamentInstance.getCurrentRanking,
    { tournamentInstanceId },
  );
  if (!result.success) return null;
  const ranking = result.data.data ?? [];
  // The ranking is ordered by points; when the backend doesn't set an explicit
  // `position`, fall back to the array index — same rule the standings table uses.
  const index = ranking.findIndex((item) => candidateIds.includes(item.userId));
  if (index === -1) return null;
  return {
    position: ranking[index].position ?? index + 1,
    points: ranking[index].points,
  };
};

const mapToSummary = (
  enrollment: UserEnrollmentDto,
  instance: TournamentInstanceDto | null,
  memberCount: number,
  standing: UserStanding | null,
): UserGroupSummary => ({
  id: enrollment.tournamentInstanceId,
  name: instance?.name ?? enrollment.tournamentInstanceId,
  memberCount,
  rank: standing?.position || enrollment.currentPosition || 0,
  points: standing?.points ?? enrollment.currentScore,
});

export const useUserGroups = () => {
  const { hydrated, session } = useAuthSession();
  const userId = useCurrentUserId();
  const [state, setState] = useState<UseUserGroupsState>(initialState);

  // Extract the candidate ids as primitives so the callback closes over stable
  // scalar values; this keeps the React Compiler's inferred deps aligned with
  // the manual ones (accessing `session?.user.id` inline infers `session?.user`).
  const domainUserId = session?.domainUserId;
  const sessionUserId = session?.user.id;
  const sub = session?.sub;

  const refresh = useCallback(async () => {
    if (!userId) return;
    await Promise.resolve();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // The ranking may identify the user by any of these ids depending on the
    // backend, so try them all when looking up the user's standing.
    const candidateIds = [domainUserId, sessionUserId, sub].filter((id): id is string =>
      Boolean(id),
    );

    const enrollmentsResult = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
      skorifyEndpoints.userEnrollment.getByUserId,
      { userId },
    );

    if (!enrollmentsResult.success) {
      setState({ groups: [], isLoading: false, error: enrollmentsResult.error });
      return;
    }

    const enrollments = enrollmentsResult.data.data ?? [];
    const [instances, memberCounts, standings] = await Promise.all([
      Promise.all(enrollments.map((e) => fetchInstance(e.tournamentInstanceId))),
      Promise.all(enrollments.map((e) => fetchMemberCount(e.tournamentInstanceId))),
      Promise.all(enrollments.map((e) => fetchUserStanding(e.tournamentInstanceId, candidateIds))),
    ]);

    const groups = enrollments.map((enrollment, index) =>
      mapToSummary(enrollment, instances[index], memberCounts[index], standings[index]),
    );

    setState({ groups, isLoading: false, error: null });
  }, [userId, domainUserId, sessionUserId, sub]);

  const didFetch = useRef(false);
  useEffect(() => {
    if (!hydrated || !userId || didFetch.current) return;
    didFetch.current = true;
    // setState inside refresh is deferred via `await Promise.resolve()`,
    // and didFetch guards against cascading re-runs.

    void refresh();
  }, [hydrated, userId, refresh]);

  return { ...state, refresh };
};
