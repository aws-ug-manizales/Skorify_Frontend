'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinkIcon from '@mui/icons-material/Link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { env } from '@lib/env';
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
  const [successOpen, setSuccessOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const flag = sessionStorage.getItem('justCreatedGroup');
    if (flag === groupId) {
      sessionStorage.removeItem('justCreatedGroup');
      return true;
    }
    return false;
  });
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const currentUserId = session?.user.id ?? MOCK_CURRENT_USER_ID;
  const isAdmin = data?.group.adminId === currentUserId;

  const handleCopyCode = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.group.inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!data) return;
    const link = `${env.NEXT_PUBLIC_APP_URL}/join/${data.group.inviteCode}`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyLinkForShare = async () => {
    if (!data) return;
    const link = `${env.NEXT_PUBLIC_APP_URL}/join/${data.group.inviteCode}`;
    await navigator.clipboard.writeText(link);
    setSnackbarOpen(true);
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

  const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/join/${data.group.inviteCode}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(t('whatsappShareText', { link: inviteLink }))}`;

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

      {/* Success dialog — shown once after group creation */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: tokens.surfaceContainerHigh,
              borderRadius: '20px',
              width: { xs: '92vw', sm: 440 },
              maxWidth: '100%',
              p: 0,
            },
          },
          backdrop: {
            sx: { backdropFilter: 'blur(4px)', bgcolor: `${tokens.background}99` },
          },
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <IconButton
                size="small"
                onClick={() => setSuccessOpen(false)}
                sx={{
                  color: tokens.onSurfaceVariant,
                  bgcolor: tokens.surfaceContainerHighest,
                  borderRadius: '8px',
                  '&:hover': { bgcolor: `${tokens.outlineVariant}33` },
                }}
              >
                <CloseIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>

            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: tokens.surfaceContainerLow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 32px ${tokens.primaryContainer}33`,
              }}
            >
              <EmojiEventsIcon
                sx={{
                  fontSize: '2.5rem',
                  background: tokens.ctaGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.625rem', sm: '1.875rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 1.05,
                  color: tokens.onSurface,
                }}
              >
                {t('successTitle1')}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.625rem', sm: '1.875rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 1.05,
                  background: tokens.ctaGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('successTitle2')}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '0.8125rem',
                  color: tokens.onSurfaceVariant,
                  lineHeight: 1.6,
                }}
              >
                {t('successSubtitle')}
              </Typography>
            </Box>

            {/* Invite code card */}
            <Box
              sx={{
                width: '100%',
                bgcolor: tokens.surfaceContainerLow,
                borderRadius: '14px',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  color: tokens.primary,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                {t('inviteCodeLabel')}
              </Typography>

              <Box
                onClick={handleCopyCode}
                sx={{
                  width: '100%',
                  height: { xs: '64px', sm: '70px' },
                  bgcolor: codeCopied ? `${tokens.secondary}0D` : tokens.surfaceContainerHighest,
                  borderRadius: '10px',
                  px: 2,
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 32px',
                  alignItems: 'center',
                  transition: 'all 250ms ease',
                  cursor: 'pointer',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {codeCopied && <CheckIcon sx={{ fontSize: '1.1rem', color: tokens.secondary }} />}
                </Box>
                <Typography
                  sx={{
                    fontFamily: codeCopied ? 'inherit' : 'monospace',
                    fontSize: codeCopied ? '0.9375rem' : { xs: '1.5rem', sm: '1.75rem' },
                    fontWeight: 800,
                    letterSpacing: codeCopied ? '0.05em' : '0.14em',
                    color: codeCopied ? tokens.secondary : tokens.onSurface,
                    textAlign: 'center',
                    transition: 'color 250ms ease',
                  }}
                >
                  {codeCopied ? t('inviteCodeCopied') : data.group.inviteCode}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!codeCopied && (
                    <ContentCopyIcon sx={{ fontSize: '1.1rem', color: tokens.onSurfaceVariant }} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Share actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              <Button
                fullWidth
                startIcon={
                  linkCopied ? (
                    <CheckIcon sx={{ fontSize: '1rem !important', color: tokens.secondary }} />
                  ) : (
                    <LinkIcon sx={{ fontSize: '1rem !important' }} />
                  )
                }
                onClick={handleCopyLink}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px',
                  color: linkCopied ? tokens.secondary : tokens.onSurface,
                  bgcolor: linkCopied ? `${tokens.secondary}0D` : tokens.surfaceContainerLow,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 250ms ease',
                  '&:hover': {
                    bgcolor: linkCopied ? `${tokens.secondary}1A` : tokens.surfaceContainer,
                  },
                }}
              >
                {linkCopied ? t('linkCopied') : t('copyInviteLink')}
              </Button>

              <Button
                fullWidth
                component="a"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={
                  <WhatsAppIcon sx={{ fontSize: '1rem !important', color: tokens.whatsapp }} />
                }
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px',
                  color: tokens.onSurface,
                  bgcolor: tokens.surfaceContainerLow,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: `${tokens.whatsapp}0D` },
                }}
              >
                {t('shareWhatsApp')}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Share dialog — visible only to admin */}
      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: tokens.surfaceContainerHigh,
              borderRadius: '16px',
              p: 1,
              minWidth: { xs: '88vw', sm: 400 },
            },
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
              onClick={handleCopyLinkForShare}
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
