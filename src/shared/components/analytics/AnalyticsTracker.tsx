'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, trackEvent } from '@lib/analytics/gtag';

/** Build a readable label for a clicked element, best-effort. */
const resolveLabel = (el: Element): string => {
  const explicit = el.getAttribute('data-analytics-id');
  if (explicit) return explicit;

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const text = (el as HTMLElement).innerText?.trim() || el.textContent?.trim();
  if (text) return text.replace(/\s+/g, ' ').slice(0, 80);

  return el.getAttribute('href') ?? el.getAttribute('name') ?? 'unknown';
};

/**
 * Drives Google Analytics from the client:
 *  - sends a `page_view` on every App Router navigation (path or query change), and
 *  - sends a `click` event for every button / link via a delegated listener,
 *    so no per-component instrumentation is needed.
 *
 * To give a button a stable, meaningful name, add `data-analytics-id="..."`;
 * otherwise the aria-label or visible text is used.
 *
 * Must be rendered inside a <Suspense> boundary because it reads useSearchParams.
 */
const AnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Page views on route change. GA's automatic page_view is disabled in the
  // layout (send_page_view: false) so the first load is counted here too.
  useEffect(() => {
    const query = searchParams?.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  // Delegated click tracking for all buttons and links.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest('button, a, [role="button"]');
      if (!el) return;

      trackEvent('click', {
        label: resolveLabel(el),
        element: el.tagName.toLowerCase(),
        href: el.getAttribute('href') ?? undefined,
        page_path: window.location.pathname,
      });
    };

    // Capture phase so we still log clicks even if a handler calls stopPropagation.
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
};

export default AnalyticsTracker;
