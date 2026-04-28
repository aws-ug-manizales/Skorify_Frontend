'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useGroupDetail } from '../../hooks/useGroupDetail';
import GroupDetailSkeleton from './GroupDetailSkeleton';
import GroupHeader from './GroupHeader';
import MatchPredictionList from './MatchPredictionList';
import MemberList from './MemberList';
import StandingsTable from './StandingsTable';

const MOCK_CURRENT_USER_ID = 'mock-admin-id';

interface GroupDetailProps {
  groupId: string;
}

const GroupDetail = ({ groupId }: GroupDetailProps) => {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const { data, isLoading, error } = useGroupDetail(groupId);
  const session = useAuthStore((s) => s.session);
  const [shareOpen, setShareOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const currentUserId = session?.user.id ?? MOCK_CURRENT_USER_ID;
  const isAdmin = data?.group.adminId === currentUserId;

  const handleCopy = (text: string, onDone?: () => void) => {
    navigator.clipboard.writeText(text).then(() => {
      onDone?.();
    });
  };

  const handleCopyCode = () => {
    if (!data) return;
    handleCopy(data.group.inviteCode, () => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    if (!data) return;
    const link =
      typeof window !== 'undefined'
        ? `${window.location.origin}/join/${data.group.inviteCode}`
        : `/join/${data.group.inviteCode}`;
    handleCopy(link, () => setSnackbarOpen(true));
  };

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <GroupDetailSkeleton />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          pt: 10,
        }}
      >
        <Typography variant="h6" sx={{ color: tokens.onSurface }}>
          {error ? t(error as Parameters<typeof t>[0]) : t('notFound')}
        </Typography>
        <AppButton variant="secondary" onClick={() => window.location.reload()}>
          {tCommon('retry')}
        </AppButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <GroupHeader group={data.group} isAdmin={isAdmin} onShare={() => setShareOpen(true)} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StandingsTable standings={data.standings} currentUserId={currentUserId} />
            <MatchPredictionList matches={data.pendingMatches} />
          </Box>

          <MemberList members={data.members} currentUserId={currentUserId} />
        </Box>
      </Box>

      {/* Share dialog — visible only to admin */}
      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: tokens.surfaceContainerHigh,
            borderRadius: '16px',
            p: 1,
            minWidth: { xs: '88vw', sm: 400 },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: tokens.onSurface, fontWeight: 700 }}>
            {t('shareTitle')}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setShareOpen(false)}
            sx={{ color: tokens.onSurfaceVariant }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, mb: 1 }}>
                {t('inviteCodeLabel')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: tokens.surfaceContainerLowest,
                  borderRadius: '8px',
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    color: tokens.primary,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    fontFamily: 'monospace',
                    fontSize: '1.25rem',
                  }}
                >
                  {data.group.inviteCode}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyCode}
                  sx={{ color: codeCopied ? tokens.success : tokens.onSurfaceVariant }}
                >
                  {codeCopied ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </Box>

            <AppButton
              variant="primary"
              fullWidth
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
            >
              {t('inviteLinkButton')}
            </AppButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        message={t('linkCopied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default GroupDetail;
