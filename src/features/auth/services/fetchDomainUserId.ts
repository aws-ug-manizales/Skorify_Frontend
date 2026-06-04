import type { GetUserBySubResult } from '@lib/api';
import { skorifyEndpoints } from '@lib/api';
import apiInstance from '@api/instance';

/**
 * Calls the domain API to resolve the database user ID from a Cognito sub.
 * The idToken is temporarily stored in localStorage so the shared api instance
 * interceptor can pick it up, then restored to its previous value afterwards.
 *
 * Returns `undefined` on any error so the session can still be created
 * without a domainUserId (it will be retried on next restore).
 */
export const fetchDomainUserId = async (
  sub: string,
  idToken: string,
): Promise<string | undefined> => {
  try {
    // Temporarily set the token so the api interceptor sends it as Authorization
    const previous = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', idToken);
    }

    const result = await apiInstance.get<{ data: GetUserBySubResult }>(
      skorifyEndpoints.user.getBySub,
      {
        params: { sub },
      },
    );

    // Restore the previous token value
    if (typeof window !== 'undefined') {
      if (previous !== null) {
        localStorage.setItem('token', previous);
      } else {
        localStorage.removeItem('token');
      }
    }

    return result.data.data.id;
  } catch {
    return undefined;
  }
};
