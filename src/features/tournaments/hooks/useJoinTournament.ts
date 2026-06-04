'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateUserEnrollmentPayload,
  type SkorifyEnvelope,
  type UserEnrollmentDto,
} from '@lib/api/skorify';
import { stripControllerPrefix } from '@lib/api/skorify-events';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';

export type JoinTournamentResult = 'joined' | 'already' | 'error';

export const useJoinTournament = () => {
  const userId = useCurrentUserId();
  const [isLoading, setIsLoading] = useState(false);

  const joinTournament = useCallback(
    async (tournamentInstanceId: string | null | undefined): Promise<JoinTournamentResult> => {
      if (!userId || !tournamentInstanceId) return 'error';

      setIsLoading(true);
      const result = await api.put<SkorifyEnvelope<UserEnrollmentDto>, CreateUserEnrollmentPayload>(
        skorifyEndpoints.userEnrollment.create,
        { userId, tournamentInstanceId },
      );
      setIsLoading(false);

      if (!result.success) return 'error';

      // Iraca returns 200 for the "already enrolled" outcome too, so inspect the
      // event code to tell a fresh enrollment apart from an existing one.
      const code = stripControllerPrefix(result.data.meta.code);
      if (code === 'UserIsInTournamentInstanceDomainEvent') return 'already';
      return 'joined';
    },
    [userId],
  );

  return { joinTournament, isLoading };
};

export default useJoinTournament;
