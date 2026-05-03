'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { api } from '@lib/api/instance';
import { normalizeInvitationCode } from '../utils/invitationCodeValidator';
import { INVITATION_CONFIG } from '../constants/invitation';
import type {
  ValidateCodeResponse,
  JoinGroupResponse,
  GroupInvitationError,
} from '../types/invitation.types';

interface UseJoinGroupReturn {
  loading: boolean;
  error: GroupInvitationError | null;
  validateCode: (code: string) => Promise<ValidateCodeResponse | null>;
  joinGroup: (code: string) => Promise<JoinGroupResponse | null>;
  resetError: () => void;
}

export const useJoinGroup = (): UseJoinGroupReturn => {
  const router = useRouter();
  const t = useTranslations('groups');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GroupInvitationError | null>(null);

  const validateCode = async (code: string): Promise<ValidateCodeResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const normalizedCode = normalizeInvitationCode(code);

      const response = await api.post<ValidateCodeResponse>('/groups/validate-code', {
        code: normalizedCode,
      });

      if (!response.success) {
        const errorMsg = response.error?.message || t('errors.validationFailed');
        setError({
          code: 'INVALID_CODE',
          message: errorMsg,
        });
        return null;
      }

      if (!response.data?.isValid) {
        const errorType = response.data?.error?.includes('ALREADY_MEMBER')
          ? 'ALREADY_MEMBER'
          : response.data?.error?.includes('EXPIRED')
            ? 'CODE_EXPIRED'
            : 'INVALID_CODE';

        setError({
          code: errorType as GroupInvitationError['code'],
          message: response.data?.error || t('errors.invalidCode'),
        });

        return null;
      }

      return response.data;
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || t('errors.validationFailed');
      const errorCode = err?.response?.data?.code || 'INVALID_CODE';

      setError({
        code: errorCode as GroupInvitationError['code'],
        message: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (code: string): Promise<JoinGroupResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const normalizedCode = normalizeInvitationCode(code);

      const response = await api.post<JoinGroupResponse>('/groups/join', {
        invitationCode: normalizedCode,
      });

      if (!response.success) {
        const errorMsg = response.error?.message || t('errors.joinFailed');
        setError({
          code: 'UNAUTHORIZED',
          message: errorMsg,
        });
        return null;
      }

      if (!response.data?.success) {
        setError({
          code: response.data?.error?.code || 'UNAUTHORIZED',
          message:
            response.data?.error?.message || response.error?.message || t('errors.joinFailed'),
        });

        return null;
      }

      if (response.data) {
        setTimeout(() => {
          router.push(`/groups/${response.data.groupId}`);
        }, INVITATION_CONFIG.REDIRECT_DELAY_MS);

        return response.data;
      }

      return null;
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || t('errors.joinFailed');
      const errorCode = err?.response?.data?.code || 'UNAUTHORIZED';

      setError({
        code: errorCode as GroupInvitationError['code'],
        message: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    loading,
    error,
    validateCode,
    joinGroup,
    resetError,
  };
};
