import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppCard from '@shared/components/molecules/AppCard';
import PageHeader from '@shared/components/molecules/PageHeader';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { tokens } from '@lib/theme/theme';
import { useTranslations } from 'next-intl';

const AdminComingSoon = () => {
  const t = useTranslations('admin');
  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
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
          <Typography sx={{ maxWidth: 480, color: tokens.onSurfaceVariant, lineHeight: 1.6 }}>
            {t('workingMessage')}
          </Typography>
        </Box>
      </AppCard>
    </Box>
  );
};

export default AdminComingSoon;
