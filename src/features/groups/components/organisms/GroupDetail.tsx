'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
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
import MatchCard from '@features/matches/components/molecules/MatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import { useGetPredictionsByUser } from '@features/predictions/hooks/useGetPredictionsByUser';
import { isMatchLocked } from '@features/predictions/hooks/useMatchCountdown';

interface GroupDetailProps {
  groupId: string;
}

const GroupDetail = ({ groupId }: GroupDetailProps) => {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const m = useTranslations('matches');
  const p = useTranslations('predictions');
  const tResults = useTranslations('results');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'standings' | 'upcoming' | 'results'>(() => {
    const tab = searchParams.get('tab');
    return tab === 'upcoming' || tab === 'results' ? tab : 'standings';
  });
  const isDesktop = useMediaQuery('(min-width:900px)');

  // On mobile, hide the members list on the matches/results tabs — it only adds
  // noise there; keep it on desktop where it lives in a dedicated sidebar column.
  const showMembers = isDesktop || activeTab === 'standings';

  const { data, isLoading, error, refetch } = useGroupDetail(groupId);
  const currentUserId = useCurrentUserId() ?? '';

  // Remount the podium/table whenever the ranking changes so their mount-time
  // rank-change animation replays on each refetch (they only animate on mount).
  const standingsKey = useMemo(
    () => (data?.standings ?? []).map((s) => `${s.userId}:${s.rank}:${s.points}`).join('|'),
    [data?.standings],
  );

  // Results tab: finished matches of this group's tournament, compared against
  // the user's predictions in this group (the group is the tournament instance).
  const { items: matchItems, loading: loadingResults } = useMatchesList(
    20,
    'filterFinished',
    data?.group.tournamentId,
  );

  // Upcoming tab: every not-yet-finished match of this group's tournament, with
  // the user's predictions attached when available. We fetch all statuses (large
  // page size) and filter client-side so in-progress matches show too — they
  // appear locked rather than being hidden.
  const { items: upcomingItems, loading: loadingUpcoming } = useMatchesList(
    200,
    'filterAll',
    data?.group.tournamentId,
  );

  const { getPredictionsByUser, data: userPredictions } = useGetPredictionsByUser();
  useEffect(() => {
    if (!currentUserId) return;
    void getPredictionsByUser({ userId: currentUserId, tournamentInstanceId: groupId });
  }, [currentUserId, groupId, getPredictionsByUser]);

  const predictionByMatch = useMemo(() => {
    const map: Record<string, { home: number; away: number }> = {};
    (userPredictions ?? []).forEach((prediction) => {
      map[prediction.matchId] = { home: prediction.homeScore, away: prediction.awayScore };
    });
    return map;
  }, [userPredictions]);

  // Backend verdict per match (the same values that feed the ranking).
  const verdictByMatch = useMemo(() => {
    const map: Record<
      string,
      { earnedPoints: number; hasExactResult: boolean; isCalculated?: boolean }
    > = {};
    (userPredictions ?? []).forEach((prediction) => {
      map[prediction.matchId] = {
        earnedPoints: prediction.earnedPoints,
        hasExactResult: prediction.hasExactResult,
        isCalculated: prediction.isCalculated,
      };
    });
    return map;
  }, [userPredictions]);

  const finishedMatches = useMemo(() => {
    return [...matchItems]
      .filter((match) => match.status === 'finished')
      .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime())
      .map((match) => ({
        ...match,
        prediction: predictionByMatch[match.id] ?? match.prediction,
      }));
  }, [matchItems, predictionByMatch]);

  const upcomingMatches = useMemo(() => {
    // Show every match that hasn't finished (upcoming + in-progress/live).
    // Matches within the lock window or already in progress still appear but
    // are rendered non-predictable below, mirroring the predictions view.
    return [...upcomingItems]
      .filter((match) => match.status !== 'finished')
      .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
      .map((match) => ({
        ...match,
        prediction: predictionByMatch[match.id] ?? match.prediction,
      }));
  }, [upcomingItems, predictionByMatch]);

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

  const isAdmin = currentUserId !== '' && data?.group.adminId === currentUserId;

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
        <GroupHeader group={data.group} isAdmin={isAdmin} onShare={() => setShareOpen(true)} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
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
              <Tab value="upcoming" label={t('upcomingMatchesTitle') || 'Próximos partidos'} />
              <Tab value="results" label={t('finishedMatchesTitle') || 'Resultados'} />
            </Tabs>

            {activeTab === 'standings' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TopPodium
                  key={`podium-${standingsKey}`}
                  standings={data.standings}
                  previousStandings={data.previousStandings}
                  currentUserId={currentUserId}
                  pointsLabel={t('pointsLabel')}
                />
                <StandingsTable
                  key={`table-${standingsKey}`}
                  standings={data.standings}
                  previousStandings={data.previousStandings}
                  currentUserId={currentUserId}
                  onRefresh={refetch}
                  isRefreshing={isLoading}
                />
              </Box>
            )}

            {activeTab === 'upcoming' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {loadingUpcoming ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
                      {t('upcomingMatchesLoading')}
                    </Typography>
                  </Box>
                ) : upcomingMatches.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
                      {t('upcomingMatchesEmpty')}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr' }}>
                    {upcomingMatches.map((match) => {
                      // In-progress matches, or those within the 10-min lock
                      // window, are shown but can't be predicted: skip the
                      // click-through to the prediction drawer and dim the card.
                      const locked = match.status === 'live' || isMatchLocked(match.kickoffAt);
                      const card = (
                        <MatchCard
                          match={match}
                          tournamentLabel={data.group.name}
                          stageLabel={
                            match.stageKey === 'finals' ? m('stageFinals') : m('stageGroup')
                          }
                          statusLabel={
                            match.status === 'live'
                              ? m('live')
                              : locked
                                ? p('closed')
                                : m('upcoming')
                          }
                          kickoffLabel={formatKickoff(match.kickoffAt, locale)}
                          vsLabel={m('vs')}
                          predictionLabel={m('predictionLabel')}
                        />
                      );

                      if (locked) {
                        return (
                          <Box key={match.id} sx={{ opacity: 0.7 }}>
                            {card}
                          </Box>
                        );
                      }

                      return (
                        <Box
                          key={match.id}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            router.push(`/predictions?group=${groupId}&match=${match.id}`)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              router.push(`/predictions?group=${groupId}&match=${match.id}`);
                            }
                          }}
                          sx={{ cursor: 'pointer', borderRadius: '8px', outline: 'none' }}
                        >
                          {card}
                        </Box>
                      );
                    })}
                  </Box>
                )}
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
                        tournamentLabel={data.group.name}
                        stageLabel={
                          match.stageKey === 'finals' ? m('stageFinals') : m('stageGroup')
                        }
                        kickoffLabel={formatKickoff(match.kickoffAt, locale)}
                        exactLabel={tResults('exact', { defaultValue: 'Acierto exacto' })}
                        partialLabel={tResults('partial', { defaultValue: 'Acierto parcial' })}
                        wrongLabel={tResults('wrong', { defaultValue: 'Incorrecto' })}
                        noPredictionLabel={tResults('noPrediction', {
                          defaultValue: 'Sin predicción',
                        })}
                        earnedPoints={verdictByMatch[match.id]?.earnedPoints}
                        hasExactResult={verdictByMatch[match.id]?.hasExactResult}
                        isCalculated={verdictByMatch[match.id]?.isCalculated}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {showMembers && <MemberList members={data.members} currentUserId={currentUserId} />}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AppCard variant="interactive" href={`/predictions?group=${groupId}`}>
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
