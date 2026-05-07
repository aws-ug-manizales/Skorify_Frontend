'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';
import UserCard from '../molecules/UserCard';
import UserTable from './UserTable';
import { tokens } from '@lib/theme/theme';
import type { User } from '@features/users/types/user';
import { INITIAL_USERS } from '../../data/mockUsers';

type FilterKey = 'filterAll' | 'filterActive' | 'filterSuspended';
type ViewMode = 'table' | 'cards';

const FILTERS: FilterKey[] = ['filterAll', 'filterActive', 'filterSuspended'];

const UsersAdmin = () => {
  const t = useTranslations('users');
  const locale = useLocale();
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('filterAll');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const filteredUsers = useMemo(() => {
    let result = users;

    if (activeFilter !== 'filterAll') {
      result = result.filter(
        (u) => u.status === (activeFilter === 'filterActive' ? 'active' : 'suspended'),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query),
      );
    }

    return result;
  }, [users, activeFilter, searchQuery]);

  const activeCount = users.filter((u) => u.status === 'active').length;

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u,
      ),
    );
  };

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 6,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.04em',
              color: tokens.onSurface,
              textTransform: 'uppercase',
              lineHeight: 1,
              mb: 1.5,
            }}
          >
            {t('title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: tokens.onSurfaceVariant,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {users.length.toLocaleString(locale)} {t('total')}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '0.625rem',
            color: tokens.success,
            bgcolor: `${tokens.success}1A`,
            px: 1.5,
            py: 0.5,
            borderRadius: '4px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {activeCount} {t('status.active').toLowerCase()}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.125rem' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: { sm: 300 },
            '& .MuiOutlinedInput-root': {
              bgcolor: tokens.surfaceContainerLowest,
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <IconButton
              key={f}
              onClick={() => setActiveFilter(f)}
              size="small"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                borderRadius: '4px',
                px: 1.5,
                py: 0.5,
                color: activeFilter === f ? tokens.primary : tokens.onSurfaceVariant,
                bgcolor:
                  activeFilter === f ? `${tokens.primaryContainer}26` : tokens.surfaceContainerHigh,
              }}
            >
              {t(f)}
            </IconButton>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            onClick={() => setViewMode('table')}
            size="small"
            sx={{
              borderRadius: '4px',
              color: viewMode === 'table' ? tokens.primary : tokens.onSurfaceVariant,
              bgcolor:
                viewMode === 'table' ? `${tokens.primaryContainer}26` : tokens.surfaceContainerHigh,
            }}
          >
            <TableViewIcon sx={{ fontSize: '1.125rem' }} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('cards')}
            size="small"
            sx={{
              borderRadius: '4px',
              color: viewMode === 'cards' ? tokens.primary : tokens.onSurfaceVariant,
              bgcolor:
                viewMode === 'cards' ? `${tokens.primaryContainer}26` : tokens.surfaceContainerHigh,
            }}
          >
            <GridViewIcon sx={{ fontSize: '1.125rem' }} />
          </IconButton>
        </Box>
      </Box>

      {filteredUsers.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 12,
            gap: 2,
          }}
        >
          <PeopleIcon sx={{ fontSize: '3rem', color: `${tokens.onSurfaceVariant}4D` }} />
          <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
            {t('noUsers')}
          </Typography>
        </Box>
      ) : viewMode === 'table' ? (
        <UserTable users={filteredUsers} locale={locale} onToggleStatus={handleToggleStatus} />
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <UserCard user={user} locale={locale} onToggleStatus={handleToggleStatus} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UsersAdmin;
