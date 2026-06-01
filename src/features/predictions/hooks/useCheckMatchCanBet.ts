'use client';

import { useCallback, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type CheckMatchCanBetPayload,
  type CheckMatchCanBetResult,
  type SkorifyEnvelope,
} from '@lib/api/skorify';
import type { ApiError } from '@lib/api/types';

interface UseCheckMatchCanBetState {
  isLoading: boolean;
  error: ApiError | null;
  data: CheckMatchCanBetResult | null;
}

const initialState: UseCheckMatchCanBetState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useCheckMatchCanBet = () => {
  const [state, setState] = useState<UseCheckMatchCanBetState>(initialState);

  const checkMatchCanBet = useCallback(
    async (payload: CheckMatchCanBetPayload): Promise<CheckMatchCanBetResult | null> => {
      setState({ isLoading: true, error: null, data: null });

      const result = await api.post<
        SkorifyEnvelope<CheckMatchCanBetResult>,
        CheckMatchCanBetPayload
      >(skorifyEndpoints.prediction.checkCanBet, payload);

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

  return { checkMatchCanBet, reset, ...state };
};

export default useCheckMatchCanBet;
