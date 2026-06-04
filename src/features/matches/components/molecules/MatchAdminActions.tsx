'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as esLocale } from 'date-fns/locale/es';
import { enUS as enLocale } from 'date-fns/locale/en-US';
import AppButton from '@shared/components/atoms/AppButton';
import useSnackbar from '@shared/hooks/useSnackbar';
import { tokens } from '@lib/theme/theme';
import { useEditMatch } from '../../hooks/useEditMatch';
import { useCloseMatch } from '../../hooks/useCloseMatch';
import { useCalculateMatchScore } from '../../hooks/useCalculateMatchScore';
import { useGetMatchById } from '../../hooks/useGetMatchById';
import { useGetTournamentInstancesByTournamentId } from '@features/tournaments';
import { useGetTeamsByQuery } from '@features/teams';
import type { MatchStatus, TournamentInstanceDto } from '@lib/api/skorify';
import type { MatchStatus as UiMatchStatus, MatchTeam } from '../../types';
import TeamBlock from '../atoms/TeamBlock';

type DialogKind = 'edit' | 'close' | 'calculate' | null;

interface MatchAdminActionsProps {
  matchId: string;
  tournamentId: string;
  // UI status of the match; "Calculate" is only allowed once it's closed.
  matchStatus: UiMatchStatus;
  // Raw backend status, used to hide "Calculate" once the match is already
  // calculated (the UI status can't distinguish 'finished' from 'calculated').
  rawStatus?: MatchStatus;
  // Home/away teams (name + flag/shield) so the close dialog can show who is
  // playing, mirroring the match card.
  homeTeam?: MatchTeam;
  awayTeam?: MatchTeam;
  onChanged?: () => void;
}

// `edit-match` rejects the `finished` status (that transition is owned by
// `close-match`), so the editable statuses exclude it. The backend only
// accepts `draft | scheduled | in_progress | finished`, so `cancelled` is
// not a valid edit target either.
const EDITABLE_STATUSES: MatchStatus[] = ['draft', 'scheduled', 'in_progress'];

// Numeric input without the native spinner arrows.
const NO_SPINNER_SX = {
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;

const MatchAdminActions = ({
  matchId,
  tournamentId,
  matchStatus,
  rawStatus,
  homeTeam,
  awayTeam,
  onChanged,
}: MatchAdminActionsProps) => {
  const t = useTranslations('matchesAdmin');
  const locale = useLocale();
  const adapterLocale = locale.startsWith('es') ? esLocale : enLocale;
  const snackbar = useSnackbar();

  // Already-calculated matches don't expose a calculate action at all.
  const isCalculated = rawStatus === 'calculated';
  // Scores are only meaningful after the match is closed, so calculating
  // points is gated on the closed (finished) status.
  const canCalculate = (rawStatus ?? matchStatus) === 'finished';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);

  // Edit state
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [kickOff, setKickOff] = useState<Date | null>(null);
  const [status, setStatus] = useState<MatchStatus>('scheduled');

  // Close state
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  // Calculate state
  const [instanceId, setInstanceId] = useState('');

  const { getMatchById, isLoading: loadingMatch } = useGetMatchById();
  const {
    getTeamsByQuery,
    data: teams,
    isLoading: loadingTeams,
  } = useGetTeamsByQuery({
    autoFetch: false,
  });
  const { editMatch, isLoading: editing } = useEditMatch();
  const { closeMatch, isLoading: closing } = useCloseMatch();
  const { calculateMatchScore, isLoading: calculating } = useCalculateMatchScore();
  const {
    getTournamentInstancesByTournamentId,
    data: instances,
    isLoading: loadingInstances,
  } = useGetTournamentInstancesByTournamentId();

  const closeMenu = () => setAnchorEl(null);
  const closeDialog = () => setDialog(null);

  const openEdit = async () => {
    closeMenu();
    setDialog('edit');
    void getTeamsByQuery('');
    const match = await getMatchById({ matchId });
    if (match) {
      setHomeTeamId(match.homeTeamId);
      setAwayTeamId(match.awayTeamId);
      setKickOff(match.kickOff ? new Date(match.kickOff) : null);
      setStatus(EDITABLE_STATUSES.includes(match.status) ? match.status : 'scheduled');
    }
  };

  const openClose = () => {
    closeMenu();
    setHomeScore('');
    setAwayScore('');
    setDialog('close');
  };

  const openCalculate = async () => {
    closeMenu();
    setInstanceId('');
    setDialog('calculate');
    await getTournamentInstancesByTournamentId({ tournamentId });
  };

  const handleEdit = async () => {
    const result = await editMatch({
      matchId,
      homeTeamId: homeTeamId.trim(),
      awayTeamId: awayTeamId.trim(),
      date: kickOff ? kickOff.toISOString() : '',
      status,
    });
    if (result) {
      snackbar.success(t('actions.editSuccess'));
      closeDialog();
      onChanged?.();
    } else {
      snackbar.error(t('actions.actionError'));
    }
  };

  const handleClose = async () => {
    const result = await closeMatch({
      matchId,
      homeScore: homeScore.trim() === '' ? undefined : Number(homeScore),
      awayScore: awayScore.trim() === '' ? undefined : Number(awayScore),
    });
    if (!result) {
      snackbar.error(t('actions.actionError'));
      return;
    }

    snackbar.success(t('actions.closeSuccess'));
    closeDialog();
    onChanged?.();
  };

  const handleCalculate = async () => {
    if (!instanceId) return;
    const result = await calculateMatchScore({ matchId, tournamentInstanceId: instanceId });
    if (result) {
      snackbar.success(t('actions.calculateSuccess'));
      closeDialog();
      onChanged?.();
    } else {
      snackbar.error(t('actions.actionError'));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={t('actions.menuLabel')}
        sx={{ color: tokens.onSurfaceVariant }}
      >
        <MoreVertIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={openEdit}>
          <EditIcon sx={{ fontSize: '1.125rem', mr: 1 }} />
          {t('actions.editAction')}
        </MenuItem>
        <MenuItem onClick={openClose}>
          <LockIcon sx={{ fontSize: '1.125rem', mr: 1 }} />
          {t('actions.closeAction')}
        </MenuItem>
        {!isCalculated && (
          <MenuItem onClick={openCalculate} disabled={!canCalculate}>
            <CalculateIcon sx={{ fontSize: '1.125rem', mr: 1 }} />
            {t('actions.calculateAction')}
          </MenuItem>
        )}
      </Menu>

      {/* Edit */}
      <Dialog open={dialog === 'edit'} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{t('actions.editTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label={t('homeTeamLabel')}
              select
              value={homeTeamId}
              onChange={(e) => setHomeTeamId(e.target.value)}
              fullWidth
              disabled={loadingMatch || loadingTeams}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('awayTeamLabel')}
              select
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              fullWidth
              disabled={loadingMatch || loadingTeams}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            <DateTimePicker
              label={t('kickOffLabel')}
              value={kickOff}
              onChange={setKickOff}
              ampm={false}
              format="dd/MM/yyyy HH:mm"
              disabled={loadingMatch}
              slotProps={{
                textField: {
                  fullWidth: true,
                  slotProps: {
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon
                            sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  },
                },
              }}
            />
            <TextField
              label={t('actions.statusLabel')}
              select
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
              fullWidth
              disabled={loadingMatch}
            >
              {EDITABLE_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {t(`actions.status_${s}`)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton variant="secondary" onClick={closeDialog}>
            {t('actions.cancel')}
          </AppButton>
          <AppButton onClick={handleEdit} loading={editing} disabled={loadingMatch}>
            {t('actions.save')}
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Close */}
      <Dialog open={dialog === 'close'} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{t('actions.closeTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.875rem' }}>
            {t('actions.closeDescription')}
          </DialogContentText>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
              {homeTeam && (
                <TeamBlock name={homeTeam.name} code={homeTeam.code} image={homeTeam.image} />
              )}
              <TextField
                label={t('actions.homeScoreLabel')}
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                fullWidth
                slotProps={{ htmlInput: { min: 0, inputMode: 'numeric' } }}
                sx={NO_SPINNER_SX}
              />
            </Stack>
            <Stack spacing={1.25} alignItems="flex-end" sx={{ flex: 1, minWidth: 0 }}>
              {awayTeam && (
                <TeamBlock
                  name={awayTeam.name}
                  code={awayTeam.code}
                  image={awayTeam.image}
                  align="right"
                />
              )}
              <TextField
                label={t('actions.awayScoreLabel')}
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                fullWidth
                slotProps={{ htmlInput: { min: 0, inputMode: 'numeric' } }}
                sx={NO_SPINNER_SX}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton variant="secondary" onClick={closeDialog}>
            {t('actions.cancel')}
          </AppButton>
          <AppButton onClick={handleClose} loading={closing}>
            {t('actions.confirmClose')}
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Calculate */}
      <Dialog open={dialog === 'calculate'} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{t('actions.calculateTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.875rem' }}>
            {t('actions.calculateDescription')}
          </DialogContentText>
          <TextField
            label={t('actions.instanceLabel')}
            select
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            fullWidth
            disabled={loadingInstances}
            helperText={
              !loadingInstances && instances.length === 0 ? t('actions.noInstances') : undefined
            }
          >
            {instances.map((instance: TournamentInstanceDto) => (
              <MenuItem key={instance.id} value={instance.id}>
                {instance.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton variant="secondary" onClick={closeDialog}>
            {t('actions.cancel')}
          </AppButton>
          <Box>
            <AppButton onClick={handleCalculate} loading={calculating} disabled={!instanceId}>
              {t('actions.confirmCalculate')}
            </AppButton>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default MatchAdminActions;
