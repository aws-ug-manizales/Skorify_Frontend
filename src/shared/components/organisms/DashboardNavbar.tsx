'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { tokens } from '@lib/theme/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';

const APPBAR_HEIGHT = 64;

type Props = {
  username?: string;
};

const DashboardNavbar = ({ username = 'Usuario' }: Props) => {
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const t = useTranslations('auth');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const profileName = session?.user.displayName || username;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);
  const handleLogout = () => {
    logout();
    handleClose();
    router.replace('/auth');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: APPBAR_HEIGHT,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          height: APPBAR_HEIGHT,
          minHeight: `${APPBAR_HEIGHT}px !important`,
          justifyContent: 'space-between',
        }}
      >
        {/* Brand — left */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.125rem',
            letterSpacing: '-0.04em',
            color: tokens.primary,
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          {tCommon('appName')}
        </Typography>

        {/* Profile — right */}
        <IconButton
          onClick={handleOpen}
          aria-label="user menu"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 2,
            px: 1.5,
            py: 0.75,
            '&:hover': { bgcolor: `${tokens.outlineVariant}1A` },
          }}
        >
          <AccountCircleIcon
            sx={{ color: tokens.onSurfaceVariant, fontSize: '1.75rem', flexShrink: 0 }}
          />
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: '0.875rem',
              fontWeight: 600,
              color: tokens.onSurface,
              lineHeight: 1,
            }}
          >
            {profileName}
          </Typography>
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: tokens.surfaceContainerHigh,
                border: `1px solid ${tokens.outlineVariant}26`,
                boxShadow: tokens.shadowSm,
                minWidth: 180,
                mt: 0.5,
              },
            },
          }}
        >
          <MenuItem
            component={Link}
            href="/profile"
            onClick={handleClose}
            sx={{
              gap: 1.5,
              py: 1.25,
              color: tokens.onSurface,
              '&:hover': { bgcolor: tokens.surfaceContainerHighest },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <AccountCircleIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.1rem' }} />
            </ListItemIcon>
            <ListItemText
              primary={tNav('profile')}
              slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }}
            />
          </MenuItem>
          <Divider sx={{ borderColor: `${tokens.outlineVariant}33` }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              gap: 1.5,
              py: 1.25,
              color: tokens.onSurface,
              '&:hover': { bgcolor: tokens.surfaceContainerHighest },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <LogoutIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.1rem' }} />
            </ListItemIcon>
            <ListItemText
              primary={t('logout')}
              slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }}
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export { APPBAR_HEIGHT };
export default DashboardNavbar;
