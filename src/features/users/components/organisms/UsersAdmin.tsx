'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
<<<<<<< HEAD
=======
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
>>>>>>> origin/develop
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';
<<<<<<< HEAD
import AddIcon from '@mui/icons-material/Add';
import AppButton from '@shared/components/atoms/AppButton';
import UserCard from '../molecules/UserCard';
import UserTable from './UserTable';
import CreateUserDrawer from './CreateUserDrawer';
import { tokens } from '@lib/theme/theme';
import type { User } from '@features/users/types/user';
=======
import UserCard from '../molecules/UserCard';
import UserTable from './UserTable';
import AppButton from '@shared/components/atoms/AppButton';
import useSnackbar from '@shared/hooks/useSnackbar';
import { tokens } from '@lib/theme/theme';
import { useGetAvailableUsers } from '@features/users/hooks/useGetAvailableUsers';
import { useUserGroupCounts } from '@features/users/hooks/useUserGroupCounts';
import { useDeleteUser } from '@features/users/hooks/useDeleteUser';
import type { UserDto } from '@lib/api/skorify';
import type { User, UserStatus } from '@features/users/types/user';

// get-available-users only returns identity fields; the group count is resolved
// separately from each user's enrollments. Status is derived from deletedAt.
const mapUserDtoToUser = (dto: UserDto, groups: number): User => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  status: dto.deletedAt ? 'suspended' : 'active',
  groups,
});
>>>>>>> origin/develop

type FilterKey = 'filterAll' | 'filterActive' | 'filterSuspended';
type ViewMode = 'table' | 'cards';

const FILTERS: FilterKey[] = ['filterAll', 'filterActive', 'filterSuspended'];

const UsersAdmin = () => {
  const t = useTranslations('users');
  const locale = useLocale();
<<<<<<< HEAD
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('filterAll');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
=======
  const snackbar = useSnackbar();
  const { data: fetchedUsers, isLoading, getAvailableUsers } = useGetAvailableUsers();
  const userIds = useMemo(() => fetchedUsers.map((u) => u.id), [fetchedUsers]);
  const { counts: groupCounts } = useUserGroupCounts(userIds);
  const { deleteUser, isLoading: isSuspending } = useDeleteUser();
  // "Suspend" is a soft delete (no reactivate endpoint), so we keep a local
  // override map for immediate feedback and derive the rendered users.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, UserStatus>>({});
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('filterAll');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const users = useMemo<User[]>(
    () =>
      fetchedUsers.map((dto) => {
        const base = mapUserDtoToUser(dto, groupCounts[dto.id] ?? 0);
        return statusOverrides[dto.id] ? { ...base, status: statusOverrides[dto.id] } : base;
      }),
    [fetchedUsers, groupCounts, statusOverrides],
  );
>>>>>>> origin/develop

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

<<<<<<< HEAD
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u,
      ),
    );
=======
  // Only active users can be acted on: suspending = soft delete, and there is no
  // reactivate endpoint (the "Activate" button stays disabled for suspended users).
  const handleToggleStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.status !== 'active') return;
    setConfirmUser(user);
  };

  const handleConfirmSuspend = async () => {
    if (!confirmUser) return;
    const ok = await deleteUser(confirmUser.id);
    if (ok) {
      setStatusOverrides((prev) => ({ ...prev, [confirmUser.id]: 'suspended' }));
      snackbar.success(t('suspendSuccess'));
      setConfirmUser(null);
      // Re-sync with the backend so the list reflects the soft delete.
      void getAvailableUsers();
    } else {
      snackbar.error(t('suspendError'));
    }
>>>>>>> origin/develop
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
<<<<<<< HEAD
          <AppButton startIcon={<AddIcon />} onClick={() => setCreateDrawerOpen(true)}>
            {t('create')}
          </AppButton>
=======
>>>>>>> origin/develop
        </Box>
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

<<<<<<< HEAD
      {filteredUsers.length === 0 ? (
=======
      {isLoading && users.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 12,
          }}
        >
          <CircularProgress sx={{ color: tokens.primary }} />
        </Box>
      ) : filteredUsers.length === 0 ? (
>>>>>>> origin/develop
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
<<<<<<< HEAD
        <UserTable users={filteredUsers} locale={locale} onToggleStatus={handleToggleStatus} />
=======
        <UserTable users={filteredUsers} onToggleStatus={handleToggleStatus} />
>>>>>>> origin/develop
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
<<<<<<< HEAD
              <UserCard user={user} locale={locale} onToggleStatus={handleToggleStatus} />
=======
              <UserCard user={user} onToggleStatus={handleToggleStatus} />
>>>>>>> origin/develop
            </Grid>
          ))}
        </Grid>
      )}

<<<<<<< HEAD
      <CreateUserDrawer open={createDrawerOpen} onClose={() => setCreateDrawerOpen(false)} />
=======
      <Dialog
        open={confirmUser !== null}
        onClose={() => !isSuspending && setConfirmUser(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>{t('confirmSuspendTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: tokens.onSurfaceVariant }}>
            {t('confirmSuspendMessage', { name: confirmUser?.name ?? '' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <AppButton
            variant="tertiary"
            onClick={() => setConfirmUser(null)}
            disabled={isSuspending}
          >
            {t('cancel')}
          </AppButton>
          <AppButton variant="primary" onClick={handleConfirmSuspend} loading={isSuspending}>
            {t('confirmSuspendCta')}
          </AppButton>
        </DialogActions>
      </Dialog>
>>>>>>> origin/develop
    </Box>
  );
};

export default UsersAdmin;
