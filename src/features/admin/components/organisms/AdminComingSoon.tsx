import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppCard from '@shared/components/molecules/AppCard';
import PageHeader from '@shared/components/molecules/PageHeader';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { tokens } from '@lib/theme/theme';

const AdminComingSoon = () => (
  <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
    <PageHeader
      title="Admin"
      subtitle="En proceso"
      icon={<AdminPanelSettingsIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />}
    />

    <AppCard
      variant="default"
      sx={{
        p: 4,
        minHeight: 260,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'grid', gap: 1.25, justifyItems: 'center' }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: tokens.onSurface }}>
          En proceso
        </Typography>
        <Typography sx={{ maxWidth: 480, color: tokens.onSurfaceVariant, lineHeight: 1.6 }}>
          Esta sección estará disponible para tareas administrativas más adelante.
        </Typography>
      </Box>
    </AppCard>
  </Box>
);

export default AdminComingSoon;
