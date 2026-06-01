'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
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

const mapToSummary = (
  enrollment: UserEnrollmentDto,
  instance: TournamentInstanceDto | null,
): UserGroupSummary => ({
  id: enrollment.tournamentInstanceId,
  name: instance?.name ?? enrollment.tournamentInstanceId,
  memberCount: 0,
  rank: enrollment.currentPosition,
  points: enrollment.currentScore,
});

export const useUserGroups = () => {
  const { hydrated } = useAuthSession();
  const userId = useCurrentUserId();
  const [state, setState] = useState<UseUserGroupsState>(initialState);

  const refresh = useCallback(async () => {
    if (!userId) return;
    await Promise.resolve();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const enrollmentsResult = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
      skorifyEndpoints.userEnrollment.getByUserId,
      { userId },
    );

    if (!enrollmentsResult.success) {
      setState({ groups: [], isLoading: false, error: enrollmentsResult.error });
      return;
    }

    const enrollments = enrollmentsResult.data.data ?? [];
    const instances = await Promise.all(
      enrollments.map((enrollment) => fetchInstance(enrollment.tournamentInstanceId)),
    );

    const groups = enrollments.map((enrollment, index) =>
      mapToSummary(enrollment, instances[index]),
    );

    setState({ groups, isLoading: false, error: null });
  }, [userId]);

  const didFetch = useRef(false);
  useEffect(() => {
    if (!hydrated || !userId || didFetch.current) return;
    didFetch.current = true;
    // setState inside refresh is deferred via `await Promise.resolve()`,
    // and didFetch guards against cascading re-runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [hydrated, userId, refresh]);

  return { ...state, refresh };
};
