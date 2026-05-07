'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { ApiError } from '../types';
import { getSkorifyErrorTranslationKey } from '../skorify-events';

/**
 * Resolve an `ApiError` to a localized, user-facing message via `t()`.
 *
 * Resolution order:
 *   1. `error.details.translationKey[0]` if present (set by the response
 *      interceptor for known iraca domain-error codes).
 *   2. `errors.skorify.<error.code>` derived from the bare event code.
 *   3. Raw `error.message` only if it's a genuine human-readable string
 *      (i.e. not the same as `error.code`, which the interceptor uses as a
 *      technical identifier for unknown events).
 *   4. `errors.generic` as final fallback (always localized via `t`).
 */
export const useApiErrorMessage = () => {
  const t = useTranslations();

  return useCallback(
    (error: ApiError | null | undefined): string => {
      if (!error) return '';

      const explicitKey = error.details?.translationKey?.[0];
      const candidates: string[] = [];
      if (explicitKey) candidates.push(explicitKey);
      if (typeof error.code === 'string') {
        candidates.push(getSkorifyErrorTranslationKey(error.code));
      }

      for (const key of candidates) {
        try {
          const message = t(key);
          if (message && message !== key) return message;
        } catch {
          // next-intl throws if key is missing; ignore and try next candidate.
        }
      }

      const rawMessage = error.message;
      if (rawMessage && rawMessage !== String(error.code)) return rawMessage;

      try {
        return t('errors.generic');
      } catch {
        return '';
      }
    },
    [t],
  );
};

export default useApiErrorMessage;
