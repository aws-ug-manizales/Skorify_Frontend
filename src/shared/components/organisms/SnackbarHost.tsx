'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useSnackbarStore } from '@store/useSnackbarStore';

const DEFAULT_DURATION = 4500;

const SnackbarHost = () => {
  const queue = useSnackbarStore((state) => state.queue);
  const dismiss = useSnackbarStore((state) => state.dismiss);

  const current = queue[0] ?? null;

  const [open, setOpen] = useState(false);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  // Render-time sync: when a new top-of-queue item arrives, open the snackbar.
  // (Calling setState during render for derived state is supported by React.)
  if (current && current.id !== trackedId) {
    setTrackedId(current.id);
    setOpen(true);
  }

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    if (current) dismiss(current.id);
  };

  return (
    <Snackbar
      key={current?.id ?? 'empty'}
      open={open && !!current}
      autoHideDuration={current?.duration ?? DEFAULT_DURATION}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{ transition: { onExited: handleExited } }}
    >
      {current ? (
        <Alert
          severity={current.severity}
          variant="filled"
          onClose={() => handleClose(undefined, 'closeButton')}
          action={
            current.action ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  current.action?.onClick();
                  handleClose(undefined, 'action');
                }}
              >
                {current.action.label}
              </Button>
            ) : undefined
          }
          sx={{ width: '100%', minWidth: 280, alignItems: 'center' }}
        >
          {current.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};

export default SnackbarHost;
