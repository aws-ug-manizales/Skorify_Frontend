'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';
import { tokens } from '@lib/theme/theme';
import { env } from '@lib/env';
import type { Group } from '@features/groups/types';

interface GroupDetailProps {
  group: Group;
  inviteCodeLabel: string;
  inviteLinkLabel: string;
  copyLabel: string;
  copiedLabel: string;
  memberCountLabel: string;
}

const GroupDetail = ({ group, inviteCodeLabel }: GroupDetailProps) => {
  const t = useTranslations('groups');
  const [successOpen, setSuccessOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const flag = sessionStorage.getItem('justCreatedGroup');
    if (flag === group.id) {
      sessionStorage.removeItem('justCreatedGroup');
      return true;
    }
    return false;
  });
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/join/${group.inviteCode}`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(t('whatsappShareText', { link: inviteLink }))}`;

  return (
    <Box sx={{ position: 'relative', minHeight: '100%' }}>
      <ComingSoonPage title={group.name} />

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
            {/* Close */}
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

            {/* Trophy */}
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

            {/* Title */}
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

            {/* Code card */}
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
                {inviteCodeLabel}
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
                  {codeCopied ? t('inviteCodeCopied') : group.inviteCode}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!codeCopied && (
                    <ContentCopyIcon sx={{ fontSize: '1.1rem', color: tokens.onSurfaceVariant }} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Actions */}
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
                startIcon={<WhatsAppIcon sx={{ fontSize: '1rem !important', color: '#25D366' }} />}
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
                  '&:hover': { bgcolor: '#25D3660D' },
                }}
              >
                {t('shareWhatsApp')}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GroupDetail;
