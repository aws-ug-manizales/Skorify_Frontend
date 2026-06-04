/**
 * Thin wrapper around Google Analytics (gtag.js).
 *
 * The gtag bootstrap script is injected once in the root layout. These helpers
 * are no-ops when GA isn't available (SSR, ad-blockers, or when the measurement
 * ID is unset), so callers never need to guard themselves.
 */

// Google Analytics is disabled entirely in the dev environment
// (NEXT_PUBLIC_ENV=dev) so local/development traffic never reaches GA.
// Anywhere else it uses NEXT_PUBLIC_GA_ID, falling back to the prod ID.
// An empty GA_MEASUREMENT_ID makes the layout skip the gtag script and turns
// every helper below into a no-op.
const isDevEnv = (process.env.NEXT_PUBLIC_ENV ?? '').trim().toLowerCase() === 'dev';

export const GA_MEASUREMENT_ID = isDevEnv ? '' : (process.env.NEXT_PUBLIC_GA_ID ?? 'G-4MR2SR1XB3');

type GtagCommand = 'js' | 'config' | 'event' | 'set';
type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, ...args: unknown[]) => void;
  }
}

const isEnabled = (): boolean =>
  typeof window !== 'undefined' && typeof window.gtag === 'function' && Boolean(GA_MEASUREMENT_ID);

/** Send a SPA page view. Pass the full path including query string. */
export const pageview = (url: string): void => {
  if (!isEnabled()) return;
  window.gtag!('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
};

/** Send a custom GA event. */
export const trackEvent = (action: string, params: GtagParams = {}): void => {
  if (!isEnabled()) return;
  window.gtag!('event', action, params);
};
