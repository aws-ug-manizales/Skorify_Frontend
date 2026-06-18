'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateUserEnrollmentPayload,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
  type UserEnrollmentDto,
} from '@lib/api/skorify';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
import { normalizeInvitationCode } from '../utils/invitationCodeValidator';
import { INVITATION_CONFIG } from '../constants/invitation';
import type {
  ValidateCodeResponse,
  JoinGroupResponse,
  GroupInvitationError,
} from '../types/invitation.types';

const ALREADY_MEMBER_CODE = 'UserIsInTournamentInstanceDomainEvent';
const INSTANCE_NOT_FOUND_CODE = 'NotGottenTournamentInstanceDomainEvent';
const USER_NOT_FOUND_CODE = 'NotGottenUserDomainEvent';

const mapBackendErrorToCode = (code?: string | number): GroupInvitationError['code'] => {
  if (code === ALREADY_MEMBER_CODE) return 'ALREADY_MEMBER';
  if (code === INSTANCE_NOT_FOUND_CODE) return 'GROUP_NOT_FOUND';
  if (code === USER_NOT_FOUND_CODE) return 'UNAUTHORIZED';
  return 'INVALID_CODE';
};

const messageKeyForValidationFailure = (failure: {
  status: number;
  code: string | number;
}): string => {
  if (failure.code === INSTANCE_NOT_FOUND_CODE) return 'errors.invalidCode';
  if (failure.status === 0) return 'errors.connection';
  if (failure.status === 401 || failure.code === USER_NOT_FOUND_CODE) return 'errors.session';
  return 'errors.validationFailed';
};

export interface UseJoinGroupReturn {
  loading: boolean;
  error: GroupInvitationError | null;
  validateCode: (code: string) => Promise<ValidateCodeResponse | null>;
  joinGroup: (code: string) => Promise<JoinGroupResponse | null>;
  resetError: () => void;
}

export const useJoinGroup = (): UseJoinGroupReturn => {
  const router = useRouter();
  const t = useTranslations('groups');
  const userId = useCurrentUserId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GroupInvitationError | null>(null);

  const validateCode = async (code: string): Promise<ValidateCodeResponse | null> => {
    setLoading(true);
    setError(null);

    const normalizedCode = normalizeInvitationCode(code);

    const response = await api.get<SkorifyEnvelope<TournamentInstanceDto>>(
      skorifyEndpoints.tournamentInstance.getByInviteCode,
      { inviteCode: normalizedCode },
    );

    setLoading(false);

    if (!response.success) {
      setError({
        code: mapBackendErrorToCode(response.error.code),
        message: t(
          messageKeyForValidationFailure({ status: response.status, code: response.error.code }),
        ),
      });
      return null;
    }

    const instance = response.data.data;

    // Check whether the current user already belongs to this instance so the UI
    // can short-circuit the join flow (e.g. redirect home) instead of letting
    // them re-attempt a join the backend would reject as ALREADY_MEMBER.
    //
    // We read the user's enrollments (the same GET the dashboard uses) rather
    // than the dedicated `is-a-user-in-tournament-instance` endpoint: that one
    // answers "yes" via the `UserIsInTournamentInstanceDomainEvent`, which the
    // framework returns as a non-2xx error — so `success` would be false for an
    // actual member and the check would silently miss.
    let isMember = false;
    if (userId) {
      const enrollments = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
        skorifyEndpoints.userEnrollment.getByUserId,
        { userId },
      );
      isMember =
        enrollments.success &&
        (enrollments.data.data ?? []).some((e) => e.tournamentInstanceId === instance.id);
    }

    return {
      isValid: true,
      groupId: instance.id,
      groupName: instance.name,
      isMember,
    };
  };

  const joinGroup = async (code: string): Promise<JoinGroupResponse | null> => {
    setLoading(true);
    setError(null);

    if (!userId) {
      setLoading(false);
      setError({ code: 'UNAUTHORIZED', message: t('errors.joinFailed') });
      return null;
    }

    const normalizedCode = normalizeInvitationCode(code);

    const validation = await api.get<SkorifyEnvelope<TournamentInstanceDto>>(
      skorifyEndpoints.tournamentInstance.getByInviteCode,
      { inviteCode: normalizedCode },
    );

    if (!validation.success) {
      setLoading(false);
      setError({
        code: mapBackendErrorToCode(validation.error.code),
        message: t('errors.invalidCode'),
      });
      return null;
    }

    const instance = validation.data.data;

    const enrollment = await api.put<
      SkorifyEnvelope<UserEnrollmentDto>,
      CreateUserEnrollmentPayload
    >(skorifyEndpoints.userEnrollment.create, {
      userId,
      tournamentInstanceId: instance.id,
    });

    setLoading(false);

    if (!enrollment.success) {
      const mapped = mapBackendErrorToCode(enrollment.error.code);
      setError({
        code: mapped,
        message: mapped === 'ALREADY_MEMBER' ? t('errors.alreadyMember') : t('errors.joinFailed'),
      });
      return null;
    }

    setTimeout(() => {
      router.push(`/groups/${instance.id}`);
    }, INVITATION_CONFIG.REDIRECT_DELAY_MS);

    return {
      success: true,
      groupId: instance.id,
      groupName: instance.name,
      message: t('errors.joinFailed'),
    };
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
