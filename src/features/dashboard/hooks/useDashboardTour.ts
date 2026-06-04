'use client';

import { useCallback } from 'react';
import { driver, type DriveStep, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { TOUR_LOGIN_FLAG } from '../tourFlag';

export { TOUR_LOGIN_FLAG };

interface DashboardTourOptions {
  /** Whether there is at least one tournament to open during the tour. */
  hasTournament: boolean;
  /** Opens the first tournament's detail dialog. */
  openTournament: () => void;
  /** Closes the tournament detail dialog. */
  closeTournament: () => void;
}

const STEP_DELAY_MS = 380;

export const useDashboardTour = () => {
  const t = useTranslations('userDashboard.tour');

  const startTour = useCallback(
    ({ hasTournament, openTournament, closeTournament }: DashboardTourOptions) => {
      const steps: DriveStep[] = [
        {
          element: '[data-tour="tournaments"]',
          popover: {
            title: t('tournamentsTitle'),
            description: t('tournamentsDesc'),
            side: 'left',
            align: 'start',
          },
        },
      ];

      if (hasTournament) {
        steps.push(
          {
            element: '[data-tour="tournament-card"]',
            popover: {
              title: t('openTitle'),
              description: t('openDesc'),
              side: 'left',
              align: 'start',
              // Open the tournament detail dialog, then advance once it's mounted.
              onNextClick: (_el, _step, { driver: d }) => {
                openTournament();
                window.setTimeout(() => d.moveNext(), STEP_DELAY_MS);
              },
            },
          },
          {
            element: '[data-tour="join"]',
            popover: {
              title: t('joinTitle'),
              description: t('joinDesc'),
              side: 'top',
              align: 'center',
              onPrevClick: (_el, _step, { driver: d }) => {
                closeTournament();
                window.setTimeout(() => d.movePrevious(), STEP_DELAY_MS);
              },
              // Close the dialog before highlighting the groups card.
              onNextClick: (_el, _step, { driver: d }) => {
                closeTournament();
                window.setTimeout(() => d.moveNext(), STEP_DELAY_MS);
              },
            },
          },
        );
      }

      steps.push({
        element: '[data-tour="groups"]',
        popover: {
          title: t('groupsTitle'),
          description: t('groupsDesc'),
          side: 'right',
          align: 'start',
        },
      });

      const driverObj: Driver = driver({
        showProgress: true,
        nextBtnText: t('next'),
        prevBtnText: t('prev'),
        doneBtnText: t('done'),
        // Theme: dark backdrop + rounded highlight to match the app surfaces.
        popoverClass: 'skorify-tour',
        overlayColor: tokens.background,
        overlayOpacity: 0.72,
        stagePadding: 6,
        stageRadius: 10,
        // Always leave the dialog closed when the tour ends.
        onDestroyed: () => closeTournament(),
        steps,
      });

      driverObj.drive();
    },
    [t],
  );

  return { startTour };
};

export default useDashboardTour;
