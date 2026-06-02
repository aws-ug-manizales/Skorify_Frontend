'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import JoinGroupDialog from '@features/groups/components/organisms/JoinGroupDialog';
import { useAuthSession } from '@features/auth';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import { useGetTournamentById } from '../../hooks/useGetTournamentById';

type TournamentStatus = 'active' | 'upcoming' | 'finished';

const STATUS_COLORS: Record<TournamentStatus, string> = {
  active: tokens.success,
  upcoming: tokens.tertiary,
  finished: tokens.onSurfaceVariant,
};

const deriveStatus = (start: Date | null, end: Date | null, now: Date): TournamentStatus => {
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'finished';
  }
  if (now < start) return 'upcoming';
  if (now > end) return 'finished';
  return 'active';
};

interface TournamentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string | null;
}

const TournamentDetailDialog = ({ open, onClose, tournamentId }: TournamentDetailDialogProps) => {
  const t = useTranslations('tournaments');
  const tDetail = useTranslations('tournaments.detail');
  const locale = useLocale();
  const router = useRouter();
  const { canCreateGroups } = useAuthSession();

  const { data, isLoading, error, getTournamentById, reset } = useGetTournamentById();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  const isFinished = useMemo(() => {
    if (!data) return false;
    // Treat missing/invalid dates as finished too — same rule as the list view
    // so a tournament without valid dates can't be joined or used as a group base.
    if (!data.end_date) return true;
    const end = new Date(data.end_date);
    if (Number.isNaN(end.getTime())) return true;
    return end < new Date();
  }, [data]);

  const handleJoin = () => {
    if (isFinished) return;
    setJoinDialogOpen(true);
  };

  const handleCreateGroup = () => {
    if (isFinished || !tournamentId) return;
    onClose();
    router.push(`/groups?create=1&tournamentId=${tournamentId}`);
  };

  useEffect(() => {
    if (!open || !tournamentId) return;
    void getTournamentById({ tournamentId });
  }, [getTournamentById, open, tournamentId]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formatDateSafe = (date: Date | null): string =>
    !date || Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: tokens.background,
              backgroundImage: 'none',
              borderRadius: '16px',
              border: `1px solid ${tokens.outlineVariant}26`,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 1.5 }}>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: tokens.onSurface,
              bgcolor: tokens.surfaceContainerHigh,
              border: `1px solid ${tokens.outlineVariant}33`,
              borderRadius: '8px',
            }}
          >
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pt: 1.5, pb: 3 }}>
          {isLoading && !data && (
            <Stack gap={2}>
              <Skeleton variant="rounded" height={56} />
              <Skeleton variant="rounded" height={180} />
            </Stack>
          )}

          {!isLoading && (error || !data) && (
            <Stack alignItems="center" sx={{ py: 6, textAlign: 'center' }} gap={1.5}>
              <EmojiEventsIcon sx={{ fontSize: '3rem', color: `${tokens.onSurfaceVariant}4D` }} />
              <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
                {tDetail('notFound')}
              </Typography>
            </Stack>
          )}

          {data &&
            (() => {
              const start = data.start_date ? new Date(data.start_date) : null;
              const end = data.end_date ? new Date(data.end_date) : null;
              const status = deriveStatus(start, end, new Date());
              const matchTypeKey =
                data.match_type === 'single_match_per_round'
                  ? 'matchTypeSingle'
                  : data.match_type === 'home_and_away_per_round'
                    ? 'matchTypeHomeAway'
                    : null;

              return (
                <Stack gap={2.5}>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: tokens.surfaceContainerHigh,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <EmojiEventsIcon sx={{ color: tokens.primary, fontSize: '1.375rem' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          letterSpacing: '-0.02em',
                          color: tokens.onSurface,
                          lineHeight: 1.2,
                        }}
                      >
                        {data.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={t(status)}
                      sx={{
                        bgcolor: `${STATUS_COLORS[status]}1A`,
                        color: STATUS_COLORS[status],
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontSize: '0.625rem',
                      }}
                    />
                  </Stack>

                  <Stack
                    divider={<Box sx={{ height: 1, bgcolor: `${tokens.outlineVariant}1F` }} />}
                    sx={{
                      bgcolor: tokens.surfaceContainerLow,
                      borderRadius: '12px',
                    }}
                  >
                    <DetailRow
                      icon={<CalendarMonthIcon sx={{ color: tokens.onSurfaceVariant }} />}
                      label={tDetail('datesLabel')}
                      value={`${formatDateSafe(start)}  →  ${formatDateSafe(end)}`}
                    />
                    <DetailRow
                      icon={<SportsSoccerIcon sx={{ color: tokens.onSurfaceVariant }} />}
                      label={tDetail('matchTypeLabel')}
                      value={matchTypeKey ? t(matchTypeKey) : '—'}
                    />
                    <DetailRow
                      icon={<VpnKeyIcon sx={{ color: tokens.onSurfaceVariant }} />}
                      label={tDetail('tokenLabel')}
                      value={data.token}
                      monospace
                    />
                  </Stack>
                </Stack>
              );
            })()}
        </DialogContent>

        {data && (
          <Box sx={{ px: 3, pb: 3, pt: 0 }}>
            {isFinished && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: tokens.onSurfaceVariant,
                  textAlign: 'center',
                  mb: 1.5,
                }}
              >
                {tDetail('finishedHint')}
              </Typography>
            )}
            <DialogActions sx={{ p: 0, gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
              <AppButton
                variant="secondary"
                fullWidth
                disabled={isFinished}
                startIcon={<GroupAddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleJoin}
                sx={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {tDetail('joinCta')}
              </AppButton>
              {canCreateGroups && (
                <AppButton
                  variant="primary"
                  fullWidth
                  disabled={isFinished}
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={handleCreateGroup}
                  sx={{
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {tDetail('createGroupCta')}
                </AppButton>
              )}
            </DialogActions>
          </Box>
        )}
      </Dialog>
      <JoinGroupDialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} />
    </>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  monospace?: boolean;
}

const DetailRow = ({ icon, label, value, monospace }: DetailRowProps) => (
  <Stack direction="row" alignItems="center" gap={2} sx={{ px: 2.5, py: 2 }}>
    <Box sx={{ display: 'flex', flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          color: tokens.primary,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.875rem',
          color: tokens.onSurface,
          fontFamily: monospace ? 'ui-monospace, monospace' : undefined,
          wordBreak: monospace ? 'break-all' : 'normal',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default TournamentDetailDialog;
