'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import { skorifyEndpoints, type SkorifyEnvelope, type UserEnrollmentDto } from '@lib/api/skorify';

/**
 * Resolves the number of groups (tournament-instance enrollments) each user
 * belongs to. There is no aggregate endpoint, so this fans out one
 * get-user-enrollments-by-user-id call per user. Intended for the admin user
 * list, where the user set is bounded.
 */
export const useUserGroupCounts = (userIds: string[]) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchCounts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setCounts({});
      return;
    }

    setIsLoading(true);

    const entries = await Promise.all(
      ids.map(async (userId): Promise<[string, number]> => {
        const result = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
          skorifyEndpoints.userEnrollment.getByUserId,
          { userId },
        );
        return [userId, result.success ? (result.data.data?.length ?? 0) : 0];
      }),
    );

    setCounts(Object.fromEntries(entries));
    setIsLoading(false);
  }, []);

  // Re-fetch only when the actual set of user ids changes, not on every render.
  const idsKey = userIds.join(',');
  const lastKey = useRef<string | null>(null);
  useEffect(() => {
    if (lastKey.current === idsKey) return;
    lastKey.current = idsKey;
    void fetchCounts(idsKey ? idsKey.split(',') : []);
  }, [idsKey, fetchCounts]);

  return { counts, isLoading };
};

export default useUserGroupCounts;
