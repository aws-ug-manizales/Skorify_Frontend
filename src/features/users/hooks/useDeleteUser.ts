'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import { createForbiddenError } from '@features/auth/lib/adminAccess';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import {
  skorifyEndpoints,
  type DeleteUserPayload,
  type SkorifyEnvelope,
  type UserDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseDeleteUserState {
  isLoading: boolean;
  error: ApiError | null;
}

const initialState: UseDeleteUserState = {
  isLoading: false,
  error: null,
};

/**
 * Soft-deletes a user via /user/delete-user. This backs the admin "suspend"
 * action: there is no dedicated suspend/reactivate endpoint, so suspending a
 * user is a soft delete (sets deletedAt) and is NOT reversible from the UI.
 *
 * NOTE: the HTTP verb is assumed to be POST (matching the other command-style
 * endpoints like close-match). Confirm against the backend; if it expects
 * DELETE/PUT, only this call needs to change.
 */
export const useDeleteUser = () => {
  const [state, setState] = useState<UseDeleteUserState>(initialState);
  const { hydrated, isAdmin } = useAuthSession();

  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      if (!hydrated || !isAdmin) {
        setState({ isLoading: false, error: createForbiddenError() });
        return false;
      }

      setState({ isLoading: true, error: null });

      const result = await api.post<SkorifyEnvelope<UserDto>, DeleteUserPayload>(
        skorifyEndpoints.user.delete,
        { Id: userId },
      );

      if (result.success) {
        setState({ isLoading: false, error: null });
        return true;
      }

      setState({ isLoading: false, error: result.error });
      return false;
    },
    [hydrated, isAdmin],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { deleteUser, reset, ...state };
};

export default useDeleteUser;
