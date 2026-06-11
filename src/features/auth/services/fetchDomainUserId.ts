import type { GetUserBySubResult } from '@lib/api';
import { skorifyEndpoints } from '@lib/api';
import apiInstance from '@api/instance';

/**
 * Calls the domain API to resolve the database user ID from a Cognito sub.
 * The idToken is temporarily stored in localStorage so the shared api instance
 * interceptor can pick it up, then restored to its previous value afterwards.
 *
 * Throws if the API call fails so that the login flow is aborted when the
 * domain user cannot be resolved.
 */
export const fetchDomainUserId = async (sub: string, idToken: string): Promise<string> => {
  // Temporarily set the token so the api interceptor sends it as Authorization
  const previous = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', idToken);
  }

  try {
    const result = await apiInstance.get<{ data: GetUserBySubResult }>(
      skorifyEndpoints.user.getBySub,
      {
        params: { sub },
      },
    );

    return result.data.data.id;
  } catch (error) {
    throw new Error('auth.errors.domainUserNotFound', { cause: error });
  } finally {
    // Always restore the previous token value
    if (typeof window !== 'undefined') {
      if (previous !== null) {
        localStorage.setItem('token', previous);
      } else {
        localStorage.removeItem('token');
      }
    }
  }
};
