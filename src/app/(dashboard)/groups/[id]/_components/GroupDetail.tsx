'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import type { Group } from '@features/groups/types';

interface ShareContentProps {
  inviteLink: string;
  linkCopied: boolean;
  onCopyLink: () => void;
  onClose: () => void;
  showHandle: boolean;
}

const ShareContent = ({
  inviteLink,
  linkCopied,
  onCopyLink,
  onClose,
  showHandle,
}: ShareContentProps) => (
  <Box>
    {showHandle && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: '999px',
            bgcolor: `${tokens.outlineVariant}66`,
          }}
        />
      </Box>
    )}

    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          color: tokens.primary,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Compartir invitación
      </Typography>
      <IconButton size="small" onClick={onClose} sx={{ color: tokens.onSurfaceVariant }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>

    <Box
      sx={{
        bgcolor: tokens.surfaceContainerHighest,
        borderRadius: '10px',
        px: 2,
        py: 1.5,
        mb: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: tokens.onSurfaceVariant,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {inviteLink}
      </Typography>
    </Box>

    <Divider sx={{ mb: 2.5 }} />

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        fullWidth
        startIcon={
          linkCopied ? (
            <CheckIcon sx={{ color: tokens.secondary }} />
          ) : (
            <LinkIcon sx={{ color: tokens.primary }} />
          )
        }
        onClick={onCopyLink}
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1.5,
          borderRadius: '10px',
          color: linkCopied ? tokens.secondary : tokens.onSurface,
          bgcolor: linkCopied ? `${tokens.secondary}0D` : 'transparent',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 250ms ease',
          '&:hover': { bgcolor: `${tokens.primary}0D` },
        }}
      >
        {linkCopied ? '¡Enlace copiado!' : 'Copiar link'}
      </Button>

      <Button
        fullWidth
        startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
        disableRipple
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1.5,
          borderRadius: '10px',
          color: tokens.onSurface,
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          opacity: 0.5,
          cursor: 'default',
          '&:hover': { bgcolor: 'transparent' },
        }}
      >
        Compartir por WhatsApp
      </Button>
    </Box>
  </Box>
);

interface GroupDetailProps {
  group: Group;
  inviteCodeLabel: string;
  inviteLinkLabel: string;
  copyLabel: string;
  copiedLabel: string;
  memberCountLabel: string;
}

const GroupDetail = ({ group, inviteCodeLabel, copiedLabel }: GroupDetailProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
  const containerRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const inviteLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/join/${group.inviteCode}`
      : `/join/${group.inviteCode}`;

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

  return (
    <Box ref={containerRef} sx={{ position: 'relative', minHeight: '100%' }}>
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 5,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Trophy icon */}
        <Box
          sx={{
            width: 112,
            height: 112,
            borderRadius: '50%',
            bgcolor: tokens.surfaceContainerHigh,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${tokens.primaryContainer}33`,
          }}
        >
          <EmojiEventsIcon
            sx={{
              fontSize: '3.5rem',
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
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              color: tokens.onSurface,
            }}
          >
            ¡Grupo Creado
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
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
            con éxito!
          </Typography>
          <Typography
            sx={{ mt: 1.5, fontSize: '0.9375rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
          >
            Tu arena digital está lista para la acción.
          </Typography>
        </Box>

        {/* Invite code card */}
        <Box
          sx={{
            width: '100%',
            bgcolor: tokens.surfaceContainerLow,
            borderRadius: '20px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: tokens.primary,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {inviteCodeLabel}
          </Typography>

          {/* Code */}
          <Box
            sx={{
              width: '100%',
              bgcolor: tokens.surfaceContainerHighest,
              borderRadius: '12px',
              py: 2.5,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: { xs: '1.75rem', md: '2rem' },
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: tokens.onSurface,
              }}
            >
              {group.inviteCode}
            </Typography>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, width: '100%' }}>
            {/* Copy code with inline tooltip */}
            <Box sx={{ position: 'relative' }}>
              {codeCopied && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -32,
                    left: '50%',
                    bgcolor: tokens.surfaceContainerHighest,
                    color: tokens.secondary,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    px: 1.25,
                    py: 0.5,
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '@keyframes fadeUp': {
                      '0%': { opacity: 0, transform: 'translateX(-50%) translateY(4px)' },
                      '15%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
                      '85%': { opacity: 1 },
                      '100%': { opacity: 0 },
                    },
                    animation: 'fadeUp 2s ease forwards',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <CheckIcon sx={{ fontSize: '0.7rem' }} />
                  {copiedLabel}
                </Box>
              )}
              <Button
                variant="outlined"
                startIcon={
                  codeCopied ? (
                    <CheckIcon sx={{ fontSize: '1rem !important', color: tokens.secondary }} />
                  ) : (
                    <ContentCopyIcon sx={{ fontSize: '1rem !important' }} />
                  )
                }
                onClick={handleCopyCode}
                sx={{
                  width: '100%',
                  borderRadius: '999px',
                  borderColor: codeCopied ? tokens.secondary : tokens.primary,
                  color: codeCopied ? tokens.secondary : tokens.primary,
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  py: 1.25,
                  transition: 'all 300ms ease',
                  '&:hover': {
                    borderColor: codeCopied ? tokens.secondary : tokens.primary,
                    bgcolor: codeCopied ? `${tokens.secondary}0D` : `${tokens.primary}0D`,
                  },
                }}
              >
                Copiar código
              </Button>
            </Box>

            {/* Share link */}
            <Button
              variant="outlined"
              startIcon={<ShareIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={() => setShareOpen(true)}
              sx={{
                borderRadius: '999px',
                borderColor: tokens.secondary,
                color: tokens.secondary,
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                py: 1.25,
                '&:hover': {
                  borderColor: tokens.secondary,
                  bgcolor: `${tokens.secondary}0D`,
                },
              }}
            >
              Compartir link
            </Button>
          </Box>
        </Box>

        {/* CTA */}
        <AppButton
          variant="primary"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/groups')}
          sx={{
            borderRadius: '999px',
            py: 1.75,
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 800,
          }}
        >
          Ir al detalle del grupo
        </AppButton>

        {/* Decorative grid */}
        <Box
          aria-hidden
          sx={{
            width: 180,
            height: 90,
            opacity: 0.25,
            backgroundImage: `
              linear-gradient(${tokens.primary}55 1px, transparent 1px),
              linear-gradient(90deg, ${tokens.primary}55 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
          }}
        />
      </Box>

      {/* Share — bottom sheet en móvil, modal relativo al contenedor en desktop */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          PaperProps={{
            sx: {
              maxHeight: '50vh',
              borderRadius: '20px 20px 0 0',
              bgcolor: tokens.surfaceContainerHigh,
              px: 3,
              pt: 2,
              pb: 4,
            },
          }}
        >
          <ShareContent
            inviteLink={inviteLink}
            linkCopied={linkCopied}
            onCopyLink={handleCopyLink}
            onClose={() => setShareOpen(false)}
            showHandle
          />
        </Drawer>
      ) : (
        <Dialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          disablePortal
          container={() => containerRef.current}
          sx={{
            position: 'absolute',
            '& .MuiBackdrop-root': { position: 'absolute' },
          }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: tokens.surfaceContainerHigh,
                borderRadius: '16px',
                width: 420,
                maxWidth: '90%',
                p: 0,
              },
            },
          }}
        >
          <DialogContent sx={{ p: 3 }}>
            <ShareContent
              inviteLink={inviteLink}
              linkCopied={linkCopied}
              onCopyLink={handleCopyLink}
              onClose={() => setShareOpen(false)}
              showHandle={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default GroupDetail;
