'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Stack, Avatar, Tab, Tabs, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

import AppCard from '../../molecules/AppCard';
import AppButton from '../../atoms/AppButton';
import { MOCK_MATCHES } from '@/features/matches/constants/matches.mock';

export const MatchList = () => {
  // Estado para las pestañas (Ayer, Hoy, Mañana). Usamos false para cuando se activa el calendario.
  const [selectedTab, setSelectedTab] = useState<number | false>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Timer para el tiempo restante
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lógica de filtrado por fecha
  const filteredMatches = useMemo(() => {
    let targetDate = new Date();

    if (selectedTab === 0) targetDate.setDate(targetDate.getDate() - 1);
    else if (selectedTab === 2) targetDate.setDate(targetDate.getDate() + 1);
    else if (selectedTab === false && selectedDate) targetDate = selectedDate;

    return MOCK_MATCHES.filter((match) => {
      const matchDate = new Date(match.date);
      return matchDate.toDateString() === targetDate.toDateString();
    });
  }, [selectedTab, selectedDate]);

  const getRemainingTime = (matchDate: string) => {
    const diff = new Date(matchDate).getTime() - now.getTime();
    if (diff <= 0) return 'Cerrado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        {/* 📅 HEADER: FILTROS Y CALENDARIO */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 4 }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
              '& .MuiTab-root': { color: 'text.secondary', fontWeight: 'bold', minWidth: 80 },
              '& .Mui-selected': { color: 'primary.main' },
            }}
          >
            <Tab label="Ayer" />
            <Tab label="Hoy" />
            <Tab label="Mañana" />
          </Tabs>

          <Box>
            <IconButton
              onClick={() => setCalendarOpen(true)}
              sx={{
                bgcolor: selectedTab === false ? 'primary.main' : 'rgba(255,255,255,0.05)',
                color: selectedTab === false ? 'white' : 'primary.main',
                '&:hover': { bgcolor: 'rgba(147, 51, 234, 0.2)' },
              }}
            >
              <CalendarMonthIcon fontSize="small" />
            </IconButton>

            <DatePicker
              open={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setSelectedTab(false); // Desactiva las pestañas fijas para mostrar que manda el calendario
              }}
              slotProps={{ textField: { sx: { display: 'none' } } }}
            />
          </Box>
        </Stack>

        {/* 🏟️ LISTA DE PARTIDOS (ESTILO HORIZONTAL CARD) */}
        <Stack spacing={2}>
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <AppCard
                key={match.id}
                sx={{ p: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  sx={{ minHeight: '90px' }}
                >
                  {/* 1. TIEMPO RESTANTE (Izquierda) */}
                  <Box sx={{ px: 3, textAlign: 'center', minWidth: '150px', py: { xs: 2, md: 0 } }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontWeight: 'bold', display: 'block', mb: 0.5 }}
                    >
                      {match.date === 'Cerrado' ? 'FINALIZADO' : 'CIERRA EN'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontWeight: '900', color: 'primary.light' }}
                    >
                      {getRemainingTime(match.date)}
                    </Typography>
                  </Box>

                  {/* DIVIDER VERTICAL */}
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      width: '1px',
                      height: '50px',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />

                  {/* 2. EQUIPOS Y VS (Centro) */}
                  <Stack
                    direction="row"
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ flex: 1, py: 2 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ width: '40%', justifyContent: 'flex-end' }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {match.homeTeam}
                      </Typography>
                      <Avatar
                        src={match.homeTeamFlag}
                        sx={{ width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                      />
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: '900',
                        color: 'rgba(255,255,255,0.2)',
                        fontStyle: 'italic',
                      }}
                    >
                      VS
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ width: '40%', justifyContent: 'flex-start' }}
                    >
                      <Avatar
                        src={match.awayTeamFlag}
                        sx={{ width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {match.awayTeam}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* DIVIDER VERTICAL */}
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      width: '1px',
                      height: '50px',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />

                  {/* 3. ESTADO Y BOTÓN (Derecha) */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                      px: 3,
                      py: { xs: 2, md: 0 },
                      minWidth: '220px',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: match.isUserPredicted ? 'success.main' : 'warning.main',
                        color: match.isUserPredicted ? 'success.main' : 'warning.main',
                        px: 1.2,
                        py: 0.3,
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 'black',
                      }}
                    >
                      {match.isUserPredicted ? 'PREDICHO' : 'PENDIENTE'}
                    </Box>

                    <AppButton
                      variant="primary"
                      size="small"
                      sx={{ minWidth: '100px', borderRadius: '8px' }}
                    >
                      {match.isUserPredicted ? 'EDITAR' : 'PREDECIR'}
                    </AppButton>
                  </Stack>
                </Stack>
              </AppCard>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography color="text.secondary">
                No hay partidos programados para esta fecha.
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};
