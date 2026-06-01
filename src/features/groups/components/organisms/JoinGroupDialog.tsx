'use client';

import { useTranslations } from 'next-intl';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '@lib/theme/theme';
import JoinGroupFlow from './JoinGroupFlow';

interface JoinGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

const JoinGroupDialog = ({ open, onClose }: JoinGroupDialogProps) => {
  const t = useTranslations('groups.join');

  return (
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
            overflow: 'hidden',
            position: 'relative',
          },
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${tokens.primaryContainer}26 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: tokens.onSurface,
          bgcolor: tokens.surfaceContainerHigh,
          border: `1px solid ${tokens.outlineVariant}33`,
          borderRadius: '8px',
          zIndex: 2,
          '&:hover': {
            bgcolor: tokens.surfaceContainerHighest,
            borderColor: `${tokens.outlineVariant}66`,
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>

      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 2,
              color: tokens.onSurface,
            }}
          >
            {t('title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: tokens.onSurfaceVariant,
              lineHeight: 1.6,
            }}
          >
            {t('subtitle')}
          </Typography>
        </Box>

        <Card
          sx={{
            bgcolor: tokens.surfaceContainerLow,
            borderRadius: '12px',
            border: `1px solid ${tokens.outlineVariant}26`,
            boxShadow: tokens.shadowMd,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <JoinGroupFlow />
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: tokens.onSurfaceVariant,
              fontSize: '0.875rem',
            }}
          >
            {t('contactAdmin')}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default JoinGroupDialog;
