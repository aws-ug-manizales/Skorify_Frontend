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

let handler: SessionExpiredHandler | null = null;

export const setSessionExpiredHandler = (next: SessionExpiredHandler | null): void => {
  handler = next;
};

export const notifySessionExpired = (): void => {
  handler?.();
};
