import { MatchList } from '@/shared/components/organisms/MatchList/MatchList';
import { Box, Typography } from '@mui/material';

export default function MatchesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'black',
          mb: 4,
          textTransform: 'uppercase',
          fontStyle: 'italic',
          color: 'white',
        }}
      >
        Próximos Partidos
      </Typography>

      {/* Aquí aterrizan tus tarjetas */}
      <MatchList />
    </Box>
  );
}
