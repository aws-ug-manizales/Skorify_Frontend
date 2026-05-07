'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslations } from 'next-intl';
import { useModalStore } from '@shared/notifications/strategies/ModalStrategy';

const ModalHost = () => {
  const current = useModalStore((state) => state.current);
  const open = useModalStore((state) => state.open);
  const hide = useModalStore((state) => state.hide);
  const t = useTranslations();
  const tDyn = t as (key: string, values?: Record<string, string | number>) => string;

  const resolveText = (key?: string, raw?: string): string => {
    if (raw) return raw;
    if (key) return tDyn(key, current?.i18nValues);
    return '';
  };

  const title = resolveText(current?.titleKey, current?.title);
  const message = resolveText(current?.messageKey, current?.message);

  const renderActions = () => {
    if (!current) return null;

    if (current.hasTwoButtons && current.actions && current.actions.length >= 2) {
      const [confirm, cancel] = current.actions;
      return (
        <>
          <Button
            onClick={() => {
              cancel.onClick();
              hide();
            }}
            color="inherit"
          >
            {tDyn(cancel.labelKey)}
          </Button>
          <Button
            onClick={() => {
              confirm.onClick();
              hide();
            }}
            variant="contained"
            color="primary"
          >
            {tDyn(confirm.labelKey)}
          </Button>
        </>
      );
    }

    if (current.actions && current.actions.length >= 1) {
      const [action] = current.actions;
      return (
        <Button
          onClick={() => {
            action.onClick();
            hide();
          }}
          variant="contained"
          color="primary"
        >
          {tDyn(action.labelKey)}
        </Button>
      );
    }

    return (
      <Button onClick={hide} variant="contained" color="primary">
        {tDyn('common.close')}
      </Button>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        hide();
      }}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default ModalHost;
