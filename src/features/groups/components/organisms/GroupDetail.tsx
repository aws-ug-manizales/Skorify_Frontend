'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useGroupDetail } from '../../hooks/useGroupDetail';
import { useLeaveGroup } from '../../hooks/useLeaveGroup';
import GroupDetailSkeleton from './GroupDetailSkeleton';
import GroupHeader from './GroupHeader';
import MatchPredictionList from './MatchPredictionList';
import MemberList from './MemberList';
import ShareGroupDialog from './ShareGroupDialog';
import StandingsTable from './StandingsTable';

const MOCK_CURRENT_USER_ID = 'mock-admin-id';

interface GroupDetailProps {
  groupId: string;
}

const GroupDetail = ({ groupId }: GroupDetailProps) => {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const { data, isLoading, error, refetch } = useGroupDetail(groupId);
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
  const {
    leaveGroup,
    loading: leaveLoading,
    error: leaveError,
    resetError: resetLeaveError,
  } = useLeaveGroup();
  const [leaveOpen, setLeaveOpen] = useState(false);

  const currentUserId = session?.user.id ?? MOCK_CURRENT_USER_ID;
  const isAdmin = data?.group.adminId === currentUserId;

  const adminCount = data?.members.filter((m) => m.isAdmin).length ?? 0;
  const memberCount = data?.members.length ?? 0;
  const isOnlyAdmin = isAdmin && adminCount === 1;

  const handleLeave = async (dissolve?: boolean, assigningNewAdmin?: boolean) => {
    await leaveGroup(groupId, dissolve, assigningNewAdmin);
  };

  const handleLeaveClose = () => {
    if (leaveLoading) return;
    resetLeaveError();
    setLeaveOpen(false);
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
        <GroupHeader
          group={data.group}
          isAdmin={isAdmin}
          onShare={() => setShareOpen(true)}
          onLeave={() => setLeaveOpen(true)}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StandingsTable
              standings={data.standings}
              currentUserId={currentUserId}
              onRefresh={refetch}
              isRefreshing={isLoading}
            />
            <MatchPredictionList matches={data.pendingMatches} />
          </Box>

          <MemberList members={data.members} currentUserId={currentUserId} />
        </Box>
      </Box>

      <ShareGroupDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        group={data.group}
        showSuccessHeader
      />

      <ShareGroupDialog open={shareOpen} onClose={() => setShareOpen(false)} group={data.group} />

      {/* Leave group confirmation dialog */}
      <Dialog
        open={leaveOpen}
        onClose={handleLeaveClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: tokens.surfaceContainerHigh,
              borderRadius: '20px',
              width: { xs: '92vw', sm: 400 },
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
                onClick={handleLeaveClose}
                disabled={leaveLoading}
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
                bgcolor: `${tokens.error}14`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberIcon sx={{ fontSize: '2.5rem', color: tokens.error }} />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: tokens.onSurface,
                  mb: 1,
                }}
              >
                {t('leaveDialogTitle')}
              </Typography>
              <Typography
                sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
              >
                {isOnlyAdmin
                  ? memberCount > 1
                    ? t('leaveBodyOnlyAdmin')
                    : t('leaveBodyDissolve')
                  : t('leaveBody')}
              </Typography>
              {leaveError && (
                <Typography sx={{ fontSize: '0.8125rem', color: tokens.error, mt: 1 }}>
                  {leaveError}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              {isOnlyAdmin && memberCount > 1 ? (
                <>
                  <AppButton
                    variant="primary"
                    fullWidth
                    onClick={() => handleLeave(false, true)}
                    disabled={leaveLoading}
                  >
                    {leaveLoading ? tCommon('loading') : t('leaveAssignAdmin')}
                  </AppButton>
                  <AppButton
                    variant="primary"
                    fullWidth
                    onClick={() => handleLeave(true)}
                    disabled={leaveLoading}
                    sx={{ bgcolor: tokens.error, '&:hover': { bgcolor: `${tokens.error}CC` } }}
                  >
                    {leaveLoading ? tCommon('loading') : t('leaveDissolveCta')}
                  </AppButton>
                </>
              ) : (
                <AppButton
                  variant="primary"
                  fullWidth
                  onClick={() => handleLeave(isOnlyAdmin)}
                  disabled={leaveLoading}
                  sx={{ bgcolor: tokens.error, '&:hover': { bgcolor: `${tokens.error}CC` } }}
                >
                  {leaveLoading ? tCommon('loading') : t('leaveConfirm')}
                </AppButton>
              )}
              <AppButton
                variant="secondary"
                fullWidth
                onClick={handleLeaveClose}
                disabled={leaveLoading}
              >
                {tCommon('cancel')}
              </AppButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GroupDetail;
