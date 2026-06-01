'use client';

import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import { getAvatarColor, getInitials } from '@shared/utils/string';
import type { GroupMember } from '../../types';

interface MemberDetailDialogProps {
  open: boolean;
  member: GroupMember | null;
  isCurrentUser: boolean;
  onClose: () => void;
}

const formatNumber = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString();

const MemberDetailDialog = ({ open, member, isCurrentUser, onClose }: MemberDetailDialogProps) => {
  const t = useTranslations('groups.memberDetail');

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: tokens.surfaceContainer,
            backgroundImage: 'none',
            borderRadius: '20px',
            border: `1px solid ${tokens.primary}1A`,
            overflow: 'hidden',
            position: 'relative',
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', bgcolor: `${tokens.background}99` },
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          background: tokens.ctaGradient,
          zIndex: 0,
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
          bgcolor: `${tokens.background}80`,
          border: `1px solid ${tokens.outlineVariant}33`,
          borderRadius: '8px',
          zIndex: 3,
          '&:hover': { bgcolor: `${tokens.background}CC` },
        }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>

      <WorkspacePremiumIcon
        aria-hidden
        sx={{
          position: 'absolute',
          top: 12,
          left: 16,
          color: tokens.onSurface,
          fontSize: 28,
          opacity: 0.8,
          zIndex: 2,
          filter: `drop-shadow(0 2px 8px ${tokens.background}99)`,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 3,
          pt: 6,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 96,
            height: 96,
            bgcolor: getAvatarColor(member.name),
            fontSize: '2rem',
            fontWeight: 800,
            color: tokens.onSurface,
            border: `4px solid ${tokens.surfaceContainer}`,
            boxShadow: `0 8px 32px ${tokens.background}CC`,
            mb: 2,
          }}
        >
          {getInitials(member.name)}
        </Avatar>

        <Box sx={{ display: 'flex', gap: 0.75, mb: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip
            label={member.isAdmin ? t('roleAdmin') : t('roleMember')}
            size="small"
            sx={{
              bgcolor: member.isAdmin ? `${tokens.secondary}26` : `${tokens.onSurfaceVariant}1A`,
              color: member.isAdmin ? tokens.secondary : tokens.onSurfaceVariant,
              fontSize: '0.625rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              height: 20,
            }}
          />
          {isCurrentUser && (
            <Chip
              label={t('youBadge')}
              size="small"
              sx={{
                bgcolor: `${tokens.primary}26`,
                color: tokens.primary,
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                height: 20,
              }}
            />
          )}
        </Box>

        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            color: tokens.onSurface,
            textAlign: 'center',
            lineHeight: 1.1,
            mb: 3,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={member.name}
        >
          {member.name}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            width: '100%',
            mb: 3,
          }}
        >
          <StatTile
            label={t('rankLabel')}
            value={member.rank ? `#${member.rank}` : '—'}
            accent={tokens.primary}
          />
          <StatTile
            label={t('pointsLabel')}
            value={member.points != null ? formatNumber(member.points) : '—'}
            accent={tokens.onSurface}
          />
          <StatTile
            label={t('roleLabel')}
            value={member.isAdmin ? t('roleAdmin') : t('roleMember')}
            accent={member.isAdmin ? tokens.secondary : tokens.onSurfaceVariant}
            small
          />
        </Box>

        <AppButton
          component={Link}
          href={`/users/${member.id}`}
          variant="primary"
          fullWidth
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
        >
          {t('viewProfile')}
        </AppButton>
      </Box>
    </Dialog>
  );
};

interface StatTileProps {
  label: string;
  value: string;
  accent: string;
  small?: boolean;
}

const StatTile = ({ label, value, accent, small }: StatTileProps) => (
  <Box
    sx={{
      bgcolor: tokens.surfaceContainerLow,
      borderRadius: '12px',
      border: `1px solid ${tokens.outlineVariant}1A`,
      p: 1.25,
      textAlign: 'center',
      minWidth: 0,
    }}
  >
    <Typography
      sx={{
        fontSize: '0.5625rem',
        color: tokens.onSurfaceVariant,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        mb: 0.5,
        lineHeight: 1,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: small ? '0.8125rem' : '1.125rem',
        fontWeight: 900,
        color: accent,
        lineHeight: 1.1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={value}
    >
      {value}
    </Typography>
  </Box>
);

export default MemberDetailDialog;
