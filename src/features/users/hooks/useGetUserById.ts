'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import { createForbiddenError } from '@features/auth/lib/adminAccess';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import {
  skorifyEndpoints,
  type GetUserByIdParams,
  type SkorifyEnvelope,
  type UserDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetUserByIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: UserDto | null;
}

const initialState: UseGetUserByIdState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useGetUserById = () => {
  const [state, setState] = useState<UseGetUserByIdState>(initialState);
  const { hydrated, isAdmin } = useAuthSession();

  const getUserById = useCallback(
    async (params: GetUserByIdParams): Promise<UserDto | null> => {
      if (!hydrated || !isAdmin) {
        setState({ isLoading: false, error: createForbiddenError(), data: null });
        return null;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<UserDto>>(
        skorifyEndpoints.user.getById,
        params as unknown as Record<string, unknown>,
      );

      if (result.success) {
        const data = result.data.data;
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: null });
      return null;
    },
    [hydrated, isAdmin],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { getUserById, reset, ...state };
};

export default useGetUserById;
