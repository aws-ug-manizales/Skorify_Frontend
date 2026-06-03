'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppButton from '@shared/components/atoms/AppButton';
import useSnackbar from '@shared/hooks/useSnackbar';
import { useCloseMatches } from '../../hooks/useCloseMatches';
import type { Match } from '../../types';

interface BulkCloseMatchesDialogProps {
  open: boolean;
  onClose: () => void;
  matches: Match[];
  onClosed?: () => void;
}

const BulkCloseMatchesDialog = ({
  open,
  onClose,
  matches,
  onClosed,
}: BulkCloseMatchesDialogProps) => {
  const t = useTranslations('matchesAdmin');
  const snackbar = useSnackbar();
  const { closeMatches, isLoading } = useCloseMatches();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Only matches that are not already finished are eligible to be closed.
  const closable = matches.filter((m) => m.status !== 'finished');

  // Clear the selection on close so the next open starts fresh (avoids an
  // effect that would resync state on every `open` toggle).
  const handleClose = () => {
    setSelected({});
    onClose();
  };

  const toggle = (id: string) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedIds = closable.filter((m) => selected[m.id]).map((m) => m.id);

  const handleConfirm = async () => {
    if (selectedIds.length === 0) return;
    const result = await closeMatches({ matches: selectedIds.map((matchId) => ({ matchId })) });
    if (result) {
      snackbar.success(t('actions.bulkCloseSuccess', { count: result.length }));
      handleClose();
      onClosed?.();
    } else {
      snackbar.error(t('actions.actionError'));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>{t('actions.bulkCloseTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1, fontSize: '0.875rem' }}>
          {t('actions.bulkCloseDescription')}
        </DialogContentText>
        {closable.length === 0 ? (
          <DialogContentText sx={{ fontSize: '0.875rem' }}>
            {t('actions.bulkCloseEmpty')}
          </DialogContentText>
        ) : (
          <List dense>
            {closable.map((m) => (
              <ListItemButton key={m.id} onClick={() => toggle(m.id)} sx={{ borderRadius: 1 }}>
                <Checkbox edge="start" checked={!!selected[m.id]} tabIndex={-1} disableRipple />
                <ListItemText primary={`${m.homeTeam.name} vs ${m.awayTeam.name}`} />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="secondary" onClick={handleClose}>
          {t('actions.cancel')}
        </AppButton>
        <AppButton onClick={handleConfirm} loading={isLoading} disabled={selectedIds.length === 0}>
          {t('actions.confirmClose')}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default BulkCloseMatchesDialog;
