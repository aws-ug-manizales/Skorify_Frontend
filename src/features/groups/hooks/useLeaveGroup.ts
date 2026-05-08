'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { api } from '@lib/api/instance';
import useSnackbar from '@shared/hooks/useSnackbar';
import type { LeaveGroupResponse } from '../types';

interface UseLeaveGroupReturn {
  loading: boolean;
  error: string | null;
  leaveGroup: (
    groupId: string,
    dissolve?: boolean,
    assigningNewAdmin?: boolean,
  ) => Promise<LeaveGroupResponse | null>;
  resetError: () => void;
}

export const useLeaveGroup = (): UseLeaveGroupReturn => {
  const router = useRouter();
  const t = useTranslations('groups');
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leaveGroup = async (
    groupId: string,
    dissolve?: boolean,
    assigningNewAdmin?: boolean,
  ): Promise<LeaveGroupResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const isMock = process.env.NEXT_PUBLIC_MOCK_GROUPS === 'true';

      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        snackbar.success(
          t(
            dissolve
              ? 'dissolveSuccess'
              : assigningNewAdmin
                ? 'leaveSuccessNewAdmin'
                : 'leaveSuccess',
          ),
        );
        router.push('/home');
        return { success: true, dissolved: dissolve ?? false };
      }

      const url = dissolve
        ? `/groups/${groupId}/members/me?dissolve=true`
        : `/groups/${groupId}/members/me`;
      const response = await api.delete<LeaveGroupResponse>(url);

      if (!response.success) {
        setError(response.error?.message || t('leaveError'));
        return null;
      }

      snackbar.success(
        t(
          dissolve
            ? 'dissolveSuccess'
            : assigningNewAdmin
              ? 'leaveSuccessNewAdmin'
              : 'leaveSuccess',
        ),
      );
      router.push('/home');
      return response.data ?? { success: true };
    } catch {
      setError(t('leaveError'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { loading, error, leaveGroup, resetError };
};
