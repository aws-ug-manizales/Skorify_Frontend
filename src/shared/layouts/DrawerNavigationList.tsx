'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tokens } from '@lib/theme/theme';
import { activeChildKey, matchesPath, type DrawerItem } from './drawerItems';
import { APPBAR_HEIGHT } from '@shared/components/organisms/DashboardNavbar';

type Props = {
  children: ReactNode;
  items: ReadonlyArray<DrawerItem>;
  open: boolean;
  onToggleOpen: () => void;
  pathname: string;
  expandedKeys: ReadonlyArray<string>;
  onToggleExpanded: (key: string) => void;
  t: (key: string) => string;
};

const DrawerNavigationList = ({
  children,
  items,
  open,
  onToggleOpen,
  pathname,
  expandedKeys,
  onToggleExpanded,
  t,
}: Props) => {
  const drawerWidth = open ? 240 : 64;

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
          {items.map((item) => {
            const { key, href, Icon, children: subItems } = item;
            const hasChildren = !!subItems && subItems.length > 0;
            const childKey = activeChildKey(item, pathname);
            const active = hasChildren ? !!childKey : matchesPath(href, pathname);
            const expanded = expandedKeys.includes(key);
            const showChildren = hasChildren && open && expanded;

            return (
              <Box key={key}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <Tooltip
                    title={t(key)}
                    placement="right"
                    arrow
                    disableHoverListener={open}
                    disableFocusListener={open}
                    disableTouchListener={open}
                  >
                    <ListItemButton
                      {...(hasChildren && open
                        ? { onClick: () => onToggleExpanded(key) }
                        : { component: Link, href })}
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
                      {hasChildren &&
                        open &&
                        (expanded ? (
                          <ExpandLessIcon
                            sx={{ color: tokens.onSurfaceVariant, fontSize: '1.125rem' }}
                          />
                        ) : (
                          <ExpandMoreIcon
                            sx={{ color: tokens.onSurfaceVariant, fontSize: '1.125rem' }}
                          />
                        ))}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {hasChildren && (
                  <Collapse in={showChildren} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ mb: 0.5 }}>
                      {subItems.map(({ key: childKeyName, href: childHref, Icon: ChildIcon }) => {
                        const isChildActive = childKey === childKeyName;
                        return (
                          <ListItem key={childKeyName} disablePadding sx={{ mb: 0.25 }}>
                            <ListItemButton
                              component={Link}
                              href={childHref}
                              sx={{
                                borderRadius: '0 8px 8px 0',
                                minHeight: 36,
                                pl: 4.5,
                                pr: 1.5,
                                opacity: isChildActive ? 1 : 0.6,
                                borderLeft: `3px solid ${isChildActive ? tokens.primaryContainer : 'transparent'}`,
                                background: isChildActive
                                  ? `linear-gradient(to right, ${tokens.primaryContainer}1A, transparent)`
                                  : 'transparent',
                                transition: 'opacity 150ms ease, background 150ms ease',
                                '&:hover': {
                                  opacity: 1,
                                  background: isChildActive
                                    ? `linear-gradient(to right, ${tokens.primaryContainer}26, transparent)`
                                    : tokens.surfaceContainerHigh,
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 0, mr: 1.5 }}>
                                <ChildIcon
                                  sx={{
                                    color: isChildActive ? tokens.primary : tokens.onSurfaceVariant,
                                    fontSize: '1.125rem',
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(childKeyName)}
                                slotProps={{
                                  primary: {
                                    sx: {
                                      fontSize: '0.8125rem',
                                      fontWeight: isChildActive ? 700 : 500,
                                      color: isChildActive ? tokens.primary : tokens.onSurface,
                                    },
                                  },
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
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
          <IconButton onClick={onToggleOpen} size="small" aria-label="toggle drawer">
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
          pb: { xs: 8, md: 0 },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default DrawerNavigationList;
