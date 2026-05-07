'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslations } from 'next-intl';
import { useModalStore } from '@shared/notifications/strategies/ModalStrategy';
import { resolveNotificationText } from '@shared/notifications/utils';

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

const ModalHost = () => {
  const current = useModalStore((state) => state.current);
  const open = useModalStore((state) => state.open);
  const hide = useModalStore((state) => state.hide);
  const clearAfterClose = useModalStore((state) => state.clearAfterClose);
  const t = useTranslations();
  const tFn = t as unknown as TranslateFn;

  const title = resolveNotificationText(
    tFn,
    current?.titleKey,
    current?.title,
    current?.i18nValues,
  );
  const message = resolveNotificationText(
    tFn,
    current?.messageKey,
    current?.message,
    current?.i18nValues,
  );

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
            {resolveNotificationText(tFn, cancel.labelKey, cancel.label) || tFn('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              confirm.onClick();
              hide();
            }}
            variant="contained"
            color="primary"
          >
            {resolveNotificationText(tFn, confirm.labelKey, confirm.label) || tFn('common.confirm')}
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
          {resolveNotificationText(tFn, action.labelKey, action.label) || tFn('common.confirm')}
        </Button>
      );
    }

    return (
      <Button onClick={hide} variant="contained" color="primary">
        {tFn('common.close')}
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
      TransitionProps={{ onExited: clearAfterClose }}
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
