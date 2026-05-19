'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import Link from 'next/link';
import { tokens } from '@lib/theme/theme';
import { BOTTOM_NAV_HEIGHT } from './DrawerShell';

type IconComponent = ComponentType<SvgIconProps>;
type BottomNavLeaf = { key: string; href: string; Icon: IconComponent };
type BottomNavItem = BottomNavLeaf & { children?: ReadonlyArray<BottomNavLeaf> };

const BOTTOM_NAV_ITEMS: ReadonlyArray<BottomNavItem> = [
  { key: 'home', href: '/home', Icon: HomeIcon },
  {
    key: 'matches',
    href: '/matches',
    Icon: CalendarMonthIcon,
    children: [
      { key: 'matchesList', href: '/matches', Icon: CalendarMonthIcon },
      { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
      { key: 'results', href: '/results', Icon: LeaderboardIcon },
      { key: 'loadResults', href: '/matches/load-results', Icon: UploadFileIcon },
    ],
  },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
];

const matchesPath = (href: string, pathname: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const isItemActive = (item: BottomNavItem, pathname: string): boolean => {
  if (item.children?.some((c) => matchesPath(c.href, pathname))) return true;
  return matchesPath(item.href, pathname);
};

const findActiveChildKey = (item: BottomNavItem, pathname: string): string | null => {
  if (!item.children) return null;
  const matching = item.children.filter((c) => matchesPath(c.href, pathname));
  if (matching.length === 0) return null;
  return matching.reduce((a, b) => (b.href.length > a.href.length ? b : a)).key;
};

const DashboardBottomNav = () => {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const activeIndex = BOTTOM_NAV_ITEMS.findIndex((item) => isItemActive(item, pathname));
  const openItem = BOTTOM_NAV_ITEMS.find((item) => item.key === openKey) ?? null;
  const activeChildKey = openItem ? findActiveChildKey(openItem, pathname) : null;

  const handleClose = () => setOpenKey(null);

  return (
    <>
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
          {BOTTOM_NAV_ITEMS.map((item) => {
            const { key, href, Icon, children: subItems } = item;
            const icon = <Icon sx={{ fontSize: '1.375rem' }} />;
            return subItems ? (
              <BottomNavigationAction
                key={key}
                onClick={() => setOpenKey(key)}
                icon={icon}
                aria-label={t(key)}
                aria-haspopup="menu"
              />
            ) : (
              <BottomNavigationAction
                key={key}
                component={Link}
                href={href}
                icon={icon}
                aria-label={t(key)}
              />
            );
          })}
        </BottomNavigation>
      </Paper>

      <SwipeableDrawer
        anchor="bottom"
        open={openItem !== null}
        onOpen={() => {}}
        onClose={handleClose}
        disableSwipeToOpen
        slotProps={{
          paper: {
            sx: {
              display: { xs: 'block', md: 'none' },
              bgcolor: tokens.background,
              backgroundImage: 'none',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTop: `1px solid ${tokens.outlineVariant}33`,
              pb: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: `${tokens.onSurfaceVariant}66`,
            }}
            aria-hidden
          />
        </Box>

        {openItem && (
          <>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: tokens.onSurfaceVariant,
                fontWeight: 800,
                letterSpacing: '0.08em',
                pt: 1,
                pb: 0.5,
              }}
            >
              {t(openItem.key)}
            </Typography>
            <List sx={{ px: 1, pb: 1 }}>
              {openItem.children?.map(({ key, href, Icon }) => {
                const selected = key === activeChildKey;
                return (
                  <ListItemButton
                    key={key}
                    component={Link}
                    href={href}
                    onClick={handleClose}
                    selected={selected}
                    sx={{
                      minHeight: 56,
                      borderRadius: 1.5,
                      mb: 0.5,
                      px: 2,
                      gap: 1.5,
                      color: selected ? tokens.primary : tokens.onSurface,
                      bgcolor: selected ? `${tokens.primaryContainer}1A` : 'transparent',
                      '&:hover': {
                        bgcolor: selected
                          ? `${tokens.primaryContainer}26`
                          : tokens.surfaceContainerHigh,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                      <Icon sx={{ fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(key)}
                      slotProps={{
                        primary: {
                          sx: { fontSize: '0.9375rem', fontWeight: selected ? 700 : 500 },
                        },
                      }}
                    />
                    <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 20 }} />
                  </ListItemButton>
                );
              })}
            </List>
          </>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default DashboardBottomNav;
