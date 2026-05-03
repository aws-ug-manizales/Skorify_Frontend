'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useLocale } from 'next-intl';

import { MatchesToolbar } from './MatchesToolbar';
import { getWorldCupWeekOptions2026 } from './weekOptions';
import AppCard from '../../molecules/AppCard';
import AppButton from '../../atoms/AppButton';
import { MOCK_MATCHES } from '@/features/matches/constants/matches.mock';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamFlag: string;
  awayTeamFlag: string;
  date: string;
  isUserPredicted: boolean;
}

const FUNNY_MESSAGES = [
  '¡El más veloz del oeste!',
  '¡Predicción guardada! ¿Futuro pulpo Paul?',
  '¡Apuntado! Ojalá le pegues al marcador...',
  '¡Hecho! Ojalá no sea un 0-0...',
  '¡Guardado! ¿Seguro que no quieres cambiarlo?',
];

type PendingPrediction = {
  homeGoals: string | number;
  awayGoals: string | number;
  isDirty: boolean;
  isEditing: boolean;
};

export const MatchList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [now, setNow] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);
  const [successMatchId, setSuccessMatchId] = useState<string | null>(null);
  const [currentFunnyMessage, setCurrentFunnyMessage] = useState('');

  // Cast para evitar errores de any del mock
  const matchesData = MOCK_MATCHES as unknown as Match[];

  const [pendingPredictions, setPendingPredictions] = useState<Record<string, PendingPrediction>>(
    () => {
      const initial: Record<string, PendingPrediction> = {};
      matchesData.forEach((match: Match) => {
        initial[match.id] = {
          homeGoals: match.isUserPredicted ? 2 : '',
          awayGoals: match.isUserPredicted ? 1 : '',
          isDirty: false,
          isEditing: !match.isUserPredicted,
        };
      });
      return initial;
    },
  );

  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    matchesData.forEach((match: Match) => {
      initial[match.id] = match.isUserPredicted;
    });
    return initial;
  });

  useEffect(() => {
     
    setIsMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const weekOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  const filteredMatches = useMemo(() => {
    return matchesData.filter((match: Match) => {
      const matchDate = new Date(match.date);
      const matchesSearch =
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedWeek) {
        const startDate = new Date('2026-06-11T00:00:00');
        const weekNum = parseInt(selectedWeek);
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (weekNum - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        if (matchDate < weekStart || matchDate >= weekEnd) return false;
      }
      return true;
    });
  }, [searchTerm, selectedWeek, matchesData]);

  const getFormattedTime = (matchDate: string) => {
    const diff = new Date(matchDate).getTime() - now.getTime();
    if (diff <= 0) return '0h 0m 0s';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleGoalsChange = (matchId: string, team: 'home' | 'away', value: string) => {
    // Evitamos que el usuario ponga números negativos directamente
    const numericValue = value === '' ? '' : Math.max(0, parseInt(value)).toString();

    setPendingPredictions((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [`${team}Goals`]: numericValue, isDirty: true },
    }));
  };

  const handleAction = (matchId: string, label: string) => {
    if (label === 'EDITAR') {
      setPendingPredictions((prev) => ({
        ...prev,
        [matchId]: { ...prev[matchId], isEditing: true },
      }));
      return;
    }
    setLoadingMatchId(matchId);
    // eslint-disable-next-line react-hooks/purity
    setCurrentFunnyMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);
    setTimeout(() => {
      setLoadingMatchId(null);
      setSuccessMatchId(matchId);
      setSavedStatus((prev) => ({ ...prev, [matchId]: true }));
      setPendingPredictions((prev) => ({
        ...prev,
        [matchId]: { ...prev[matchId], isDirty: false, isEditing: false },
      }));
      setTimeout(() => setSuccessMatchId(null), 2500);
    }, 1200);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', p: isMobile ? 1 : 2 }}>
      <MatchesToolbar
        teamValue={searchTerm}
        onTeamChange={setSearchTerm}
        teamPlaceholder="Buscar equipo..."
        weekValue={selectedWeek}
        onMonthChange={setSelectedWeek}
        monthLabel="Semana"
        monthAllLabel="Todas las semanas"
        monthOptions={weekOptions}
        onClear={() => {
          setSearchTerm('');
          setSelectedWeek('');
        }}
      />

      <Stack spacing={2}>
        {filteredMatches.map((match: Match) => {
          const msRemaining = new Date(match.date).getTime() - now.getTime();
          const isLocked = msRemaining <= 600000;
          const isLoading = loadingMatchId === match.id;
          const isSuccess = successMatchId === match.id;
          const currentPred = pendingPredictions[match.id];
          const isSaved = savedStatus[match.id];

          let buttonLabel = 'PREDECIR';
          if (isSaved) {
            buttonLabel = currentPred.isEditing ? 'GUARDAR' : 'EDITAR';
          }

          const isInputInvalid =
            currentPred.homeGoals === '' ||
            currentPred.awayGoals === '' ||
            Number(currentPred.homeGoals) < 0 ||
            Number(currentPred.awayGoals) < 0;

          return (
            <AppCard
              key={match.id}
              sx={{ p: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <Box
                  sx={{
                    px: 3,
                    py: isMobile ? 1.5 : 2,
                    textAlign: 'center',
                    minWidth: '175px',
                    width: isMobile ? '100%' : 'auto',
                    borderBottom: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {isMounted ? (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isLocked ? 'error.main' : 'text.disabled',
                          fontWeight: 'bold',
                        }}
                      >
                        {isLocked ? 'EL PARTIDO EMPIEZA EN' : 'CIERRA EN'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: '900',
                          color: isLocked ? 'error.main' : 'primary.light',
                        }}
                      >
                        {getFormattedTime(match.date)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ opacity: 0.3 }}>
                      Cargando...
                    </Typography>
                  )}
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ flex: 1, py: 2, px: 2, width: '100%' }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ flex: 1, justifyContent: 'flex-end' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem' }}
                    >
                      {match.homeTeam}
                    </Typography>
                    <Avatar src={match.homeTeamFlag} sx={{ width: 28, height: 28 }} />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: '80px', justifyContent: 'center' }}
                  >
                    {currentPred.isEditing && !isLocked ? (
                      <>
                        <TextField
                          size="small"
                          type="number"
                          disabled={isLoading}
                          value={currentPred.homeGoals}
                          onChange={(e) => handleGoalsChange(match.id, 'home', e.target.value)}
                          inputProps={{
                            min: 0,
                            style: {
                              textAlign: 'center',
                              fontWeight: 'bold',
                              width: '30px',
                              padding: '6px',
                            },
                          }}
                          sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
                        />
                        <Typography sx={{ opacity: 0.3, mx: 0.5 }}>-</Typography>
                        <TextField
                          size="small"
                          type="number"
                          disabled={isLoading}
                          value={currentPred.awayGoals}
                          onChange={(e) => handleGoalsChange(match.id, 'away', e.target.value)}
                          inputProps={{
                            min: 0,
                            style: {
                              textAlign: 'center',
                              fontWeight: 'bold',
                              width: '30px',
                              padding: '6px',
                            },
                          }}
                          sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
                        />
                      </>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: '900',
                          letterSpacing: '4px',
                          color: isLocked && !isSaved ? 'rgba(255,255,255,0.2)' : 'white',
                        }}
                      >
                        {isSaved ? `${currentPred.homeGoals} - ${currentPred.awayGoals}` : 'X - X'}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ flex: 1, justifyContent: 'flex-start' }}
                  >
                    <Avatar src={match.awayTeamFlag} sx={{ width: 28, height: 28 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem' }}
                    >
                      {match.awayTeam}
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    minWidth: '160px',
                    textAlign: 'center',
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  {isSuccess ? (
                    <Typography
                      variant="caption"
                      color="success.light"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {currentFunnyMessage}
                    </Typography>
                  ) : (
                    <AppButton
                      variant="primary"
                      size="small"
                      disabled={
                        isLoading || isLocked || (buttonLabel !== 'EDITAR' && isInputInvalid)
                      }
                      onClick={() => handleAction(match.id, buttonLabel)}
                      sx={{
                        borderRadius: '8px',
                        minWidth: '120px',
                        width: isMobile ? '100%' : 'auto',
                        opacity: isLocked ? 0.2 : 1,
                      }}
                    >
                      {isLocked ? (
                        'CERRADO'
                      ) : isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        buttonLabel
                      )}
                    </AppButton>
                  )}
                </Box>
              </Stack>
            </AppCard>
          );
        })}
      </Stack>
    </Box>
  );
};
