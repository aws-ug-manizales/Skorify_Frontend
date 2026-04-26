'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Stack, Avatar, TextField } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import AppCard from '../../molecules/AppCard';
import AppButton from '../../atoms/AppButton';
import { MOCK_MATCHES } from '@/features/matches/constants/matches.mock';

// Simulamos el import de las opciones de fecha de tu compañero
// Cuando copies su archivo, descomenta la lógica real.
const MOCK_WEEKS = [
  { value: 'all', label: 'Todas las fechas' },
  { value: '1', label: 'Semana 1 (11 jun - 17 jun)' },
  { value: '2', label: 'Semana 2 (18 jun - 24 jun)' },
];

export const MatchList = () => {
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<string | number>('all');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter((match) => {
      const matchDate = new Date(match.date);

      // 1. FILTRO: Solo partidos que NO han terminado (posteriores a "ahora")
      const isFuture = matchDate > now;

      // 2. FILTRO: Buscador por equipo
      const matchesSearch =
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase());

      return isFuture && matchesSearch;
    });
  }, [searchTerm, now]);

  const getRemainingTime = (matchDate: string) => {
    const diff = new Date(matchDate).getTime() - now.getTime();
    if (diff <= 0) return 'EMPEZADO';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', p: 2 }}>
      {/* 📅 TOOLBAR SIMPLIFICADO (Basado en lo que viste de tu compañero) */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          placeholder="Buscar equipo..."
          variant="outlined"
          size="small"
          sx={{ flex: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Aquí puedes poner un Select simple para las semanas del mundial */}
      </Stack>

      <Stack spacing={2}>
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => {
            const hasStarted = new Date(match.date) <= now;

            return (
              <AppCard
                key={match.id}
                sx={{ p: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  sx={{ minHeight: '100px' }}
                >
                  {/* 1. CONTADOR */}
                  <Box sx={{ px: 3, textAlign: 'center', minWidth: '140px' }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontWeight: 'bold' }}
                    >
                      CIERRA EN
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontWeight: '900', color: 'primary.light' }}
                    >
                      {getRemainingTime(match.date)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      width: '1px',
                      height: '50px',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />

                  {/* 2. INPUTS DE PREDICCIÓN Y EQUIPOS */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ flex: 1, py: 2, px: 2 }}
                  >
                    {/* Local */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ flex: 1, justifyContent: 'flex-end' }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        {match.homeTeam}
                      </Typography>
                      <Avatar src={match.homeTeamFlag} sx={{ width: 32, height: 32 }} />
                    </Stack>

                    {/* INPUTS NUMÉRICOS */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        disabled={hasStarted}
                        inputProps={{
                          style: {
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '35px',
                            padding: '5px',
                          },
                        }}
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
                      />
                      <Typography sx={{ opacity: 0.5 }}>-</Typography>
                      <TextField
                        size="small"
                        disabled={hasStarted}
                        inputProps={{
                          style: {
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '35px',
                            padding: '5px',
                          },
                        }}
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
                      />
                    </Stack>

                    {/* Visitante */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ flex: 1, justifyContent: 'flex-start' }}
                    >
                      <Avatar src={match.awayTeamFlag} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {match.awayTeam}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      width: '1px',
                      height: '50px',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />

                  {/* 3. BOTÓN DE ACCIÓN */}
                  <Box sx={{ px: 3, minWidth: '160px', textAlign: 'center' }}>
                    <AppButton
                      variant="primary"
                      size="small"
                      disabled={hasStarted} // Bloqueado si ya empezó
                      sx={{ borderRadius: '8px', opacity: hasStarted ? 0.5 : 1 }}
                    >
                      {match.isUserPredicted ? 'ACTUALIZAR' : 'GUARDAR'}
                    </AppButton>
                    {hasStarted && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: 'block', mt: 0.5, fontSize: '10px' }}
                      >
                        Mercado cerrado
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </AppCard>
            );
          })
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="text.secondary">
              No hay predicciones pendientes para mostrar.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
