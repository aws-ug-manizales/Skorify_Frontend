'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification, NotificationType } from '@shared/notifications';
import { setSessionExpiredHandler } from '@lib/api/sessionEvents';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/** Auto-redirect to login this many ms after the modal appears. */
const AUTO_REDIRECT_MS = 4000;

/**
 * Watches the Cognito session while the user is inside an authenticated area.
 *
 * Detection is both:
 *  - reactive: a 401 from the API calls `notifySessionExpired()` (registered here), and
 *  - proactive: re-validates against Cognito on mount, when the tab regains focus,
 *    and when the current access token is scheduled to expire.
 *
 * On a real expiry it shows a non-dismissable "session expired" modal and then
 * logs the user out and redirects to `/auth` — either when they click the button
 * or automatically after a few seconds.
 */
const SessionExpiryGuard = () => {
  const router = useRouter();
  const { show, hide } = useNotification();
  const { hydrated, session } = useAuthSession();
  const validateSession = useAuthStore((state) => state.validateSession);
  const logout = useAuthStore((state) => state.logout);

  // Guards so the button click and the auto-redirect timer don't double-fire.
  const triggeredRef = useRef(false);
  const redirectingRef = useRef(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToLogin = useCallback(async () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    hide();
    await logout();
    router.replace('/auth');
  }, [hide, logout, router]);

  const handleExpired = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    show({
      type: NotificationType.MODAL,
      titleKey: 'auth.sessionExpired.title',
      messageKey: 'auth.sessionExpired.message',
      actions: [{ labelKey: 'auth.sessionExpired.cta', onClick: () => void goToLogin() }],
    });

    redirectTimerRef.current = setTimeout(() => void goToLogin(), AUTO_REDIRECT_MS);
  }, [goToLogin, show]);

  // Register the reactive (401) handler for the axios interceptor.
  useEffect(() => {
    setSessionExpiredHandler(handleExpired);
    return () => {
      setSessionExpiredHandler(null);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [handleExpired]);

  // Proactive validation: on mount, on tab focus, and at token expiry.
  // Depend on primitives (not the `session` object) so a silent token refresh —
  // which produces a new session reference — doesn't re-trigger this effect in a
  // loop. expiresAt only changes when the token actually refreshes.
  const expiresAt = session?.expiresAt;
  const isActive = hydrated && !!session;
  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    const check = async () => {
      if (cancelled || triggeredRef.current) return;
      const stillValid = await validateSession();
      if (!cancelled && !stillValid) handleExpired();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void check();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Schedule a check at the access token's expiration. validateSession() runs
    // Cognito's getSession(), which silently refreshes when the refresh token is
    // still valid; otherwise it returns false and we surface the modal.
    let expiryTimer: ReturnType<typeof setTimeout> | null = null;
    if (expiresAt) {
      const msUntilExpiry = new Date(expiresAt).getTime() - Date.now();
      expiryTimer = setTimeout(() => void check(), Math.max(msUntilExpiry, 0));
    }

    // Validate immediately in case a stale token was rehydrated from storage.
    void check();

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, [isActive, expiresAt, validateSession, handleExpired]);

  return null;
};

export default SessionExpiryGuard;
