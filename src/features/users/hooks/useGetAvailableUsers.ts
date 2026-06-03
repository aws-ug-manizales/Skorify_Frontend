'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import { createForbiddenError } from '@features/auth/lib/adminAccess';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { skorifyEndpoints, type SkorifyEnvelope, type UserDto } from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetAvailableUsersState {
  isLoading: boolean;
  error: ApiError | null;
  data: UserDto[];
}

const initialState: UseGetAvailableUsersState = {
  isLoading: false,
  error: null,
  data: [],
};

interface UseGetAvailableUsersOptions {
  autoFetch?: boolean;
}

export const useGetAvailableUsers = (options: UseGetAvailableUsersOptions = {}) => {
  const { autoFetch = true } = options;
  const [state, setState] = useState<UseGetAvailableUsersState>(initialState);
  const { hydrated, isAdmin } = useAuthSession();

  const getAvailableUsers = useCallback(async (): Promise<UserDto[]> => {
    if (!hydrated || !isAdmin) {
      setState({ isLoading: false, error: createForbiddenError(), data: [] });
      return [];
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await api.get<SkorifyEnvelope<UserDto[]>>(skorifyEndpoints.user.getAvailable);

    if (result.success) {
      const data = result.data.data ?? [];
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: [] });
    return [];
  }, [hydrated, isAdmin]);

  // Auto-fetch once the session is hydrated and confirmed as admin. Guarding on
  // `hydrated` avoids a premature forbidden error before the store rehydrates.
  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (!autoFetch || didAutoFetch.current || !hydrated || !isAdmin) return;
    didAutoFetch.current = true;
    void getAvailableUsers();
  }, [autoFetch, hydrated, isAdmin, getAvailableUsers]);

  const reset = useCallback(() => setState(initialState), []);

  return { getAvailableUsers, reset, ...state };
};

export default useGetAvailableUsers;
