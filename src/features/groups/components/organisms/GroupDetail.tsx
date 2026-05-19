'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslations, useLocale } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useGroupDetail } from '../../hooks/useGroupDetail';
import { useLeaveGroup } from '../../hooks/useLeaveGroup';
import GroupDetailSkeleton from './GroupDetailSkeleton';
import GroupHeader from './GroupHeader';
import MemberList from './MemberList';
import ShareGroupDialog from './ShareGroupDialog';
import StandingsTable from './StandingsTable';
import TopPodium from '../molecules/TopPodium';
import { useMatchesList } from '@features/matches/hooks/useMatchesList';
import FinishedMatchCard from '@features/matches/components/molecules/FinishedMatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';

const MOCK_CURRENT_USER_ID = 'mock-admin-id';

const getTournamentLabel = (key: string, t: (key: string) => string) => {
  try {
    return t(key);
  } catch {
    return key;
  }
};

const getStageLabel = (key: string, t: (key: string) => string) => {
  try {
    return t(key);
  } catch {
    return key;
  }
};

interface GroupDetailProps {
  groupId: string;
}

const GroupDetail = ({ groupId }: GroupDetailProps) => {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const m = useTranslations('matches');
  const tResults = useTranslations('results');
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<'standings' | 'results'>('standings');

  const { data, isLoading, error, refetch } = useGroupDetail(groupId);
  const session = useAuthStore((s) => s.session);

  const { items: matchItems, loading: loadingResults } = useMatchesList(20, 'filterFinished');

  const finishedMatches = useMemo(() => {
    return [...matchItems]
      .filter((match) => match.status === 'finished')
      .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime());
  }, [matchItems]);

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

  // TODO: replace with `previousStandings` field returned by the backend after
  // a match is scored. Mock for now: swap top-3 positions so the podium boots
  // in "before" state and animates into the current order on mount.
  const mockedPreviousStandings = useMemo(() => {
    if (!data) return undefined;
    const [first, second, third] = data.standings;
    if (!first || !second || !third) return undefined;
    return [
      { ...third, points: first.points + 4 },
      { ...first, points: second.points - 2 },
      { ...second, points: third.points - 1 },
      ...data.standings.slice(3),
    ];
  }, [data]);

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
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_e, val) => setActiveTab(val)}
              sx={{
                borderBottom: `1px solid ${tokens.outlineVariant}26`,
                '& .MuiTabs-indicator': {
                  bgcolor: tokens.primary,
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: tokens.onSurfaceVariant,
                  minWidth: 120,
                  pb: 1.5,
                  '&.Mui-selected': {
                    color: tokens.primary,
                  },
                },
              }}
            >
              <Tab value="standings" label={t('standingsTitle') || 'Clasificación'} />
              <Tab value="results" label={t('finishedMatchesTitle') || 'Resultados'} />
            </Tabs>

            {activeTab === 'standings' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TopPodium
                  standings={data.standings}
                  previousStandings={mockedPreviousStandings}
                  currentUserId={currentUserId}
                  pointsLabel={t('pointsLabel')}
                />
                <StandingsTable
                  standings={data.standings}
                  previousStandings={mockedPreviousStandings}
                  currentUserId={currentUserId}
                  onRefresh={refetch}
                  isRefreshing={isLoading}
                />
              </Box>
            )}

            {activeTab === 'results' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {loadingResults ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
                      {tResults('loading', { defaultValue: 'Cargando resultados...' })}
                    </Typography>
                  </Box>
                ) : finishedMatches.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
                      {tResults('noMatches', { defaultValue: 'Aún no hay partidos finalizados.' })}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr' }}>
                    {finishedMatches.map((match) => (
                      <FinishedMatchCard
                        key={match.id}
                        match={match}
                        tournamentLabel={getTournamentLabel(match.tournamentKey, m)}
                        stageLabel={getStageLabel(match.stageKey, m)}
                        kickoffLabel={formatKickoff(match.kickoffAt, locale)}
                        vsLabel={m('vs')}
                        predictionLabel={m('predictionLabel', { defaultValue: 'Tu predicción' })}
                        exactLabel={tResults('exact', { defaultValue: 'Acierto exacto' })}
                        partialLabel={tResults('partial', { defaultValue: 'Acierto parcial' })}
                        wrongLabel={tResults('wrong', { defaultValue: 'Incorrecto' })}
                        noPredictionLabel={tResults('noPrediction', {
                          defaultValue: 'Sin predicción',
                        })}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <MemberList members={data.members} currentUserId={currentUserId} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AppCard variant="interactive" href="/predictions">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: { xs: 2, md: 2.5 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: `${tokens.primary}1A`,
                      flexShrink: 0,
                    }}
                  >
                    <SportsSoccerIcon sx={{ color: tokens.primary, fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: tokens.onSurface,
                        fontWeight: 800,
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        lineHeight: 1.2,
                      }}
                    >
                      {t('predictionsCardTitle')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, mt: 0.5 }}>
                      {t('predictionsCardSubtitle')}
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 24 }} />
                </Box>
              </AppCard>
            </Box>
          </Box>
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
