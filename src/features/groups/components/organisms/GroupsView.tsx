'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import CreateGroupDrawer from './CreateGroupDrawer';

const GroupsView = () => {
  const t = useTranslations('nav');
  const tGroups = useTranslations('groups');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative', minHeight: '100%' }}>
      {/* Top action bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: { xs: 3, md: 4 },
          pt: 3,
          pb: 0,
        }}
      >
        <AppButton
          variant="primary"
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{
            borderRadius: '999px',
            px: 3,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
            boxShadow: `0 0 20px ${tokens.primaryContainer}33`,
          }}
        >
          {tGroups('create')}
        </AppButton>
      </Box>

      {/* Page content (coming soon — replaced by real list in future issue) */}
      <ComingSoonPage title={t('groups')} />

      <CreateGroupDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
};

export default GroupsView;
