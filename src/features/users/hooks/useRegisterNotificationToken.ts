'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type RegisterNotificationTokenPayload,
  type SkorifyEnvelope,
  type UserDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseRegisterNotificationTokenState {
  isLoading: boolean;
  error: ApiError | null;
  data: UserDto | null;
}

const initialState: UseRegisterNotificationTokenState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useRegisterNotificationToken = () => {
  const [state, setState] = useState<UseRegisterNotificationTokenState>(initialState);

  const registerNotificationToken = useCallback(
    async (payload: RegisterNotificationTokenPayload): Promise<UserDto | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.put<SkorifyEnvelope<UserDto>, RegisterNotificationTokenPayload>(
        skorifyEndpoints.user.registerNotificationToken,
        payload,
      );

      if (result.success) {
        const data = result.data.data;
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: null });
      return null;
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { registerNotificationToken, reset, ...state };
};

export default useRegisterNotificationToken;
