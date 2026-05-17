import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';

const ForbiddenPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      px: 3,
      py: 6,
      bgcolor: tokens.background,
    }}
  >
    <AppCard
      variant="default"
      sx={{
        maxWidth: 520,
        width: '100%',
        p: 4,
        textAlign: 'center',
        display: 'grid',
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: tokens.primary }}>
        403
      </Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: tokens.onSurface }}>
        Acceso restringido
      </Typography>
      <Typography sx={{ color: tokens.onSurfaceVariant, lineHeight: 1.6 }}>
        No tienes permisos para ver esta sección.
      </Typography>
      <Button href="/home" variant="contained">
        Volver al inicio
      </Button>
    </AppCard>
  </Box>
);

export default ForbiddenPage;
