'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CreateUserPayload,
  type SkorifyEnvelope,
  type UserDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCreateUserState {
  isLoading: boolean;
  error: ApiError | null;
  data: UserDto | null;
}

const initialState: UseCreateUserState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCreateUser = () => {
  const [state, setState] = useState<UseCreateUserState>(initialState);

  const createUser = useCallback(async (payload: CreateUserPayload): Promise<UserDto | null> => {
    setState({ isLoading: true, error: null, data: null });

    const result = await api.put<SkorifyEnvelope<UserDto>, CreateUserPayload>(
      skorifyEndpoints.user.create,
      payload,
    );

    if (result.success) {
      const data = result.data.data;
      setState({ isLoading: false, error: null, data });
      return data;
    }

    setState({ isLoading: false, error: result.error, data: null });
    return null;
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { createUser, reset, ...state };
};

export default useCreateUser;
