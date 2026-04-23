'use client';

import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import MatchAutocompleteField, {
  type MatchAutocompleteOption,
} from '../atoms/MatchAutocompleteField';
import SelectedMatchSummary from '../molecules/SelectedMatchSummary';
import { useMatchesStore } from '../../store';

interface MatchSelectionFormValues {
  matchId: string;
}

const MatchResultSelectionPanel = () => {
  const t = useTranslations('matches.resultForm');
  const locale = useLocale();
  const { matches, teams, tournaments } = useMatchesStore();

  const { control } = useForm<MatchSelectionFormValues>({
    defaultValues: {
      matchId: '',
    },
  });

  const selectedMatchId = useWatch({
    control,
    name: 'matchId',
  });

  const teamById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const tournamentById = useMemo(
    () => new Map(tournaments.map((tournament) => [tournament.id, tournament])),
    [tournaments],
  );

  const matchOptions = useMemo<MatchAutocompleteOption[]>(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return matches.map((match) => {
      const homeTeamName = teamById.get(match.home_team_id)?.name ?? t('fallbackTeam');
      const awayTeamName = teamById.get(match.away_team_id)?.name ?? t('fallbackTeam');
      const tournamentName =
        tournamentById.get(match.tournament_id)?.name ?? t('fallbackTournament');
      const stageLabel = t(`stageOptions.${match.stage}`);
      const kickOffLabel = formatter.format(new Date(match.kick_off));

      return {
        id: match.id,
        label: `${homeTeamName} vs ${awayTeamName} • ${tournamentName} • ${kickOffLabel} • ${stageLabel}`,
      };
    });
  }, [locale, matches, t, teamById, tournamentById]);

  const selectedMatchSummary = useMemo(() => {
    if (!selectedMatchId) {
      return undefined;
    }

    const match = matches.find((item) => item.id === selectedMatchId);
    if (!match) {
      return undefined;
    }

    const fullDateFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const homeTeamName = teamById.get(match.home_team_id)?.name ?? t('fallbackTeam');
    const awayTeamName = teamById.get(match.away_team_id)?.name ?? t('fallbackTeam');
    const tournamentName = tournamentById.get(match.tournament_id)?.name ?? t('fallbackTournament');

    return {
      teams: `${homeTeamName} vs ${awayTeamName}`,
      tournament: tournamentName,
      kickOff: fullDateFormatter.format(new Date(match.kick_off)),
      stage: t(`stageOptions.${match.stage}`),
      venue: match.venue,
      status: t(`statusOptions.${match.status}`),
    };
  }, [locale, matches, selectedMatchId, t, teamById, tournamentById]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: tokens.onSurface,
            textTransform: 'uppercase',
            lineHeight: 1,
            mb: 1,
          }}
        >
          {t('title')}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant, maxWidth: 620 }}>
          {t('subtitle')}
        </Typography>
      </Box>

      <AppCard variant="default" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MatchAutocompleteField<MatchSelectionFormValues>
          name="matchId"
          control={control}
          label={t('matchLabel')}
          placeholder={t('matchPlaceholder')}
          helperText={t('matchHelper')}
          options={matchOptions}
          rules={{
            required: t('validation.matchRequired'),
          }}
        />

        <SelectedMatchSummary
          title={t('selectionSummaryTitle')}
          emptyStateLabel={t('selectionEmpty')}
          fields={{
            teams: t('fields.teams'),
            tournament: t('fields.tournament'),
            kickOff: t('fields.kickOff'),
            stage: t('fields.stage'),
            venue: t('fields.venue'),
            status: t('fields.status'),
          }}
          matchSummary={selectedMatchSummary}
        />
      </AppCard>
    </Box>
  );
};

export default MatchResultSelectionPanel;
