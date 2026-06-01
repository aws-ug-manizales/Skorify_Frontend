'use client';

import { useTranslations } from 'next-intl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import UserAvatar from '../atoms/UserAvatar';
import StatusBadge from '../atoms/StatusBadge';
import type { User } from '@features/users/types/user';

type Props = {
  users: User[];
  locale: string;
  onToggleStatus: (userId: string) => void;
};

const UserTable = ({ users, locale, onToggleStatus }: Props) => {
  const t = useTranslations('users');

  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '8px',
        border: `1px solid ${tokens.outlineVariant}26`,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.name')}
            </TableCell>
            <TableCell
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.email')}
            </TableCell>
            <TableCell
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.status')}
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.predictions')}
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.groups')}
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.accuracy')}
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, fontSize: '0.75rem' }}
            >
              {t('table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                '&:hover': { bgcolor: tokens.surfaceContainerHigh },
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <UserAvatar name={user.name} size={36} />
                  <Typography sx={{ color: tokens.onSurface, fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ color: tokens.onSurface, fontWeight: 600 }}>
                  {user.predictions.toLocaleString(locale)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ color: tokens.onSurface, fontWeight: 600 }}>
                  {user.groups}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ color: tokens.tertiary, fontWeight: 600 }}>
                  {user.accuracyRate}%
                </Typography>
              </TableCell>
              <TableCell align="center">
                <AppButton
                  variant={user.status === 'active' ? 'secondary' : 'primary'}
                  size="small"
                  onClick={() => onToggleStatus(user.id)}
                  sx={{
                    fontSize: '0.6875rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  {user.status === 'active' ? t('suspendUser') : t('activateUser')}
                </AppButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
