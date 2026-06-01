'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type GetUserEnrollmentsByUserIdParams,
  type SkorifyEnvelope,
  type UserEnrollmentDto,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseGetUserEnrollmentsByUserIdState {
  isLoading: boolean;
  error: ApiError | null;
  data: UserEnrollmentDto[];
}

const initialState: UseGetUserEnrollmentsByUserIdState = {
  isLoading: false,
  error: null,
  data: [],
};

export const useGetUserEnrollmentsByUserId = () => {
  const [state, setState] = useState<UseGetUserEnrollmentsByUserIdState>(initialState);

  const getUserEnrollmentsByUserId = useCallback(
    async (params: GetUserEnrollmentsByUserIdParams): Promise<UserEnrollmentDto[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await api.get<SkorifyEnvelope<UserEnrollmentDto[]>>(
        skorifyEndpoints.userEnrollment.getByUserId,
        params as unknown as Record<string, unknown>,
      );

      if (result.success) {
        const data = result.data.data ?? [];
        setState({ isLoading: false, error: null, data });
        return data;
      }

      setState({ isLoading: false, error: result.error, data: [] });
      return [];
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  return { getUserEnrollmentsByUserId, reset, ...state };
};

export default useGetUserEnrollmentsByUserId;
