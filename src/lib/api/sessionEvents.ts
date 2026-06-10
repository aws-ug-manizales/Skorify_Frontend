/**
 * Bridge between non-React code (the axios interceptor) and the React layer.
 *
 * The axios instance lives outside the component tree, so it cannot call the
 * notification context directly. Instead, when it detects an expired session
 * (a 401 response) it calls `notifySessionExpired()`, and a React component
 * (`SessionExpiryGuard`) registers the actual handler that shows the modal and
 * redirects to the login screen.
 */
type SessionExpiredHandler = () => void;

type SessionRefresher = () => Promise<boolean>;

let handler: SessionExpiredHandler | null = null;
let refresher: SessionRefresher | null = null;
let inFlightRefresh: Promise<boolean> | null = null;

export const setSessionExpiredHandler = (next: SessionExpiredHandler | null): void => {
  handler = next;
};

export const notifySessionExpired = (): void => {
  handler?.();
};

export const setSessionRefresher = (next: SessionRefresher | null): void => {
  refresher = next;
};

export const requestSessionRefresh = (): Promise<boolean> => {
  if (!refresher) return Promise.resolve(false);
  if (!inFlightRefresh) {
    inFlightRefresh = Promise.resolve()
      .then(() => refresher!())
      .catch(() => false)
      .finally(() => {
        inFlightRefresh = null;
      });
  }
  return inFlightRefresh;
};
