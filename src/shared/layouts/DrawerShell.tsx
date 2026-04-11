'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Link from 'next/link';
import { tokens } from '@lib/theme/theme';
import { APPBAR_HEIGHT } from '@shared/components/organisms/DashboardNavbar';
import { type ReactNode } from 'react';

const DRAWER_OPEN_WIDTH = 240;
const DRAWER_CLOSED_WIDTH = 64;
export const BOTTOM_NAV_HEIGHT = 64;

const DRAWER_ITEMS = [
  { key: 'home', href: '/home', Icon: HomeIcon },
  { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
  { key: 'matches', href: '/matches', Icon: CalendarMonthIcon },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
] as const;

const DrawerShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const drawerWidth = open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH;

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            top: `${APPBAR_HEIGHT}px`,
            height: `calc(100% - ${APPBAR_HEIGHT}px)`,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            overflowX: 'hidden',
            bgcolor: tokens.surfaceContainerLow,
            border: 'none',
            boxShadow: `1px 0 0 0 ${tokens.outlineVariant}26`,
          },
        }}
      >
        <List sx={{ px: 1, pt: 1.5, pb: 1 }}>
          {DRAWER_ITEMS.map(({ key, href, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <ListItem key={key} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip
                  title={t(key)}
                  placement="right"
                  arrow
                  disableHoverListener={open}
                  disableFocusListener={open}
                  disableTouchListener={open}
                >
                  <ListItemButton
                    component={Link}
                    href={href}
                    sx={{
                      borderRadius: '0 8px 8px 0',
                      minHeight: 44,
                      px: 1.5,
                      justifyContent: open ? 'flex-start' : 'center',
                      opacity: active ? 1 : 0.6,
                      borderLeft: `3px solid ${active ? tokens.primaryContainer : 'transparent'}`,
                      background: active
                        ? `linear-gradient(to right, ${tokens.primaryContainer}26, transparent)`
                        : 'transparent',
                      transition: 'opacity 150ms ease, background 150ms ease',
                      '&:hover': {
                        opacity: 1,
                        background: active
                          ? `linear-gradient(to right, ${tokens.primaryContainer}33, transparent)`
                          : tokens.surfaceContainerHigh,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 0, mr: open ? 1.5 : 0, justifyContent: 'center' }}
                    >
                      <Icon
                        sx={{
                          color: active ? tokens.primary : tokens.onSurfaceVariant,
                          fontSize: '1.25rem',
                        }}
                      />
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={t(key)}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: '0.875rem',
                              fontWeight: active ? 700 : 500,
                              color: active ? tokens.primary : tokens.onSurface,
                            },
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ borderColor: `${tokens.outlineVariant}26` }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: open ? 'flex-end' : 'center',
            px: 1,
            py: 1,
          }}
        >
          <IconButton onClick={() => setOpen(!open)} size="small" aria-label="toggle drawer">
            <ChevronRightIcon
              sx={{
                color: tokens.onSurfaceVariant,
                fontSize: '1.25rem',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease',
              }}
            />
          </IconButton>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          mt: `${APPBAR_HEIGHT}px`,
          pb: { xs: `${BOTTOM_NAV_HEIGHT}px`, md: 0 },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default DrawerShell;
