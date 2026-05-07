'use client';

import { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { ToastSeverity, NotificationVertical, NotificationHorizontal } from '@shared/notifications';
import type { ToastItem } from '@shared/notifications/strategies/ToastStrategy';
import { useToastStore } from '@shared/notifications/strategies/ToastStrategy';
import { BOTTOM_NAV_HEIGHT } from '@shared/layouts/DrawerShell';

const SEVERITY_DURATION: Record<ToastSeverity, number> = {
  [ToastSeverity.SUCCESS]: 4000,
  [ToastSeverity.INFO]: 4000,
  [ToastSeverity.WARNING]: 5500,
  [ToastSeverity.ERROR]: 7000,
};

const SEVERITY_COLOR: Record<ToastSeverity, string> = {
  [ToastSeverity.SUCCESS]: tokens.success,
  [ToastSeverity.ERROR]: tokens.error,
  [ToastSeverity.WARNING]: tokens.tertiary,
  [ToastSeverity.INFO]: tokens.primary,
};

const MAX_PREVIEW_CHARS = 60;

const ToastItemEl = ({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) => {
  const t = useTranslations();
  const tDyn = t as (key: string, values?: Record<string, string | number>) => string;
  const [phase, setPhase] = useState<'visible' | 'fading' | 'collapsing'>('visible');
  const [expanded, setExpanded] = useState(false);
  const [capturedHeight, setCapturedHeight] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const startDismiss = () => {
    if (boxRef.current) setCapturedHeight(boxRef.current.offsetHeight);
    setPhase('fading');
    setTimeout(() => setPhase('collapsing'), 200);
    setTimeout(() => onDismiss(), 400);
  };

  const severity = toast.severity ?? ToastSeverity.INFO;
  const severityColor = SEVERITY_COLOR[severity];
  const duration = toast.duration ?? SEVERITY_DURATION[severity];

  const resolveText = (key?: string, raw?: string) => {
    if (raw) return raw;
    if (key) return tDyn(key, toast.i18nValues);
    return '';
  };

  const title = resolveText(toast.titleKey, toast.title);
  const message = resolveText(toast.messageKey, toast.message);

  const isLong = message.length > MAX_PREVIEW_CHARS;
  const preview = isLong ? `${message.slice(0, MAX_PREVIEW_CHARS).trimEnd()}…` : message;
  const remainder = isLong ? message.slice(MAX_PREVIEW_CHARS) : '';

  useEffect(() => {
    const timer = setTimeout(startDismiss, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <Box
      ref={boxRef}
      sx={{
        opacity: phase === 'visible' ? 1 : 0,
        maxHeight: phase === 'collapsing' ? 0 : (capturedHeight ?? 400),
        overflow: 'hidden',
        mb: phase === 'collapsing' ? 0 : 1,
        transition:
          'opacity 200ms ease, max-height 200ms ease 200ms, margin-bottom 200ms ease 200ms',
      }}
    >
      <Alert
        severity={severity as 'success' | 'error' | 'warning' | 'info'}
        onClose={startDismiss}
        sx={{
          minWidth: 240,
          maxWidth: 360,
          py: 1,
          bgcolor: tokens.surfaceContainerHigh,
          color: tokens.onSurface,
          border: `1px solid ${severityColor}50`,
          borderRadius: '12px',
          backdropFilter: 'blur(16px)',
          boxShadow: `0 4px 24px ${severityColor}25, ${tokens.shadowMd}`,
          alignItems: 'flex-start',
          '& .MuiAlert-icon': { color: severityColor, mt: 0.5 },
          '& .MuiAlert-action .MuiIconButton-root': { color: tokens.onSurfaceVariant },
        }}
      >
        {title && (
          <AlertTitle
            sx={{ color: tokens.onSurface, fontWeight: 700, fontSize: '0.875rem', mb: 1 }}
          >
            {title}
          </AlertTitle>
        )}
        <Typography
          variant="body2"
          sx={{ wordBreak: 'break-word', whiteSpace: 'normal', color: tokens.onSurface }}
        >
          {expanded ? message : preview}
        </Typography>
        {isLong && !expanded && (
          <Typography
            component="span"
            variant="caption"
            onClick={() => setExpanded(true)}
            sx={{
              display: 'block',
              mt: 0.5,
              color: severityColor,
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {tDyn('common.showMore')}
          </Typography>
        )}
        {expanded && remainder && (
          <Typography
            variant="body2"
            sx={{ mt: 0.5, wordBreak: 'break-word', whiteSpace: 'normal', color: tokens.onSurface }}
          >
            {remainder}
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

const getContainerSx = (toast: ToastItem) => {
  const v = toast.position?.vertical ?? NotificationVertical.BOTTOM;
  const h = toast.position?.horizontal ?? NotificationHorizontal.CENTER;
  const isBottom = v === NotificationVertical.BOTTOM;

  return {
    position: 'fixed' as const,
    zIndex: 1400,
    display: 'flex',
    flexDirection: (isBottom ? 'column-reverse' : 'column') as 'column' | 'column-reverse',
    pointerEvents: 'none' as const,
    '& > *': { pointerEvents: 'auto' as const },
    ...(isBottom
      ? { bottom: { xs: BOTTOM_NAV_HEIGHT + 12, md: 24 } }
      : { top: { xs: 64, md: 88 } }),
    ...(h === NotificationHorizontal.LEFT && { left: { xs: 16, md: 24 } }),
    ...(h === NotificationHorizontal.RIGHT && { right: { xs: 16, md: 24 } }),
    ...(h === NotificationHorizontal.CENTER && {
      left: '50%',
      transform: 'translateX(-50%)',
    }),
  };
};

const ToastHost = () => {
  const queue = useToastStore((state) => state.queue);
  const dismiss = useToastStore((state) => state.dismiss);

  const groups = queue.reduce<Record<string, ToastItem[]>>((acc, toast) => {
    const v = toast.position?.vertical ?? NotificationVertical.BOTTOM;
    const h = toast.position?.horizontal ?? NotificationHorizontal.CENTER;
    const key = `${v}-${h}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groups).map(([posKey, toasts]) => (
        <Box key={posKey} sx={getContainerSx(toasts[0])}>
          {toasts.map((toast) => (
            <ToastItemEl key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </Box>
      ))}
    </>
  );
};

export default ToastHost;
