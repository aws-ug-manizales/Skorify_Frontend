'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Link from 'next/link';
import { tokens } from '@lib/theme/theme';
import { BOTTOM_NAV_HEIGHT } from './DrawerShell';

const BOTTOM_NAV_ITEMS = [
  { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
  { key: 'matches', href: '/matches', Icon: CalendarMonthIcon },
  { key: 'home', href: '/home', Icon: HomeIcon },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
] as const;

const DashboardBottomNav = () => {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const activeIndex = BOTTOM_NAV_ITEMS.findIndex(({ href }) => pathname.startsWith(href));

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 'appBar',
        bgcolor: tokens.surfaceContainerLow,
        borderTop: `1px solid ${tokens.outlineVariant}33`,
      }}
    >
      <BottomNavigation
        value={activeIndex}
        sx={{
          bgcolor: 'transparent',
          height: BOTTOM_NAV_HEIGHT,
          '& .MuiBottomNavigationAction-root': {
            color: tokens.onSurfaceVariant,
            minWidth: 0,
            '& svg': {
              color: 'inherit',
              transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            '& .MuiTouchRipple-root': { color: tokens.primary },
            '&.Mui-selected': {
              color: tokens.primary,
              '& svg': { color: tokens.primary, transform: 'scale(1.3)' },
            },
          },
        }}
      >
        {BOTTOM_NAV_ITEMS.map(({ key, href, Icon }) => (
          <BottomNavigationAction
            key={key}
            component={Link}
            href={href}
            icon={<Icon sx={{ fontSize: '1.375rem' }} />}
            aria-label={t(key)}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default DashboardBottomNav;
