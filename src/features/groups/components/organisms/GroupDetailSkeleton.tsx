'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { tokens } from '@lib/theme/theme';

const GroupDetailSkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Skeleton
      variant="rounded"
      height={116}
      sx={{ borderRadius: '16px', bgcolor: tokens.surfaceContainerHigh }}
    />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton
          variant="rounded"
          height={280}
          sx={{ borderRadius: '16px', bgcolor: tokens.surfaceContainerHigh }}
        />
        <Skeleton
          variant="rounded"
          height={220}
          sx={{ borderRadius: '16px', bgcolor: tokens.surfaceContainerHigh }}
        />
      </Box>
      <Skeleton
        variant="rounded"
        height={260}
        sx={{ borderRadius: '16px', bgcolor: tokens.surfaceContainerHigh }}
      />
    </Box>
  </Box>
);

export default GroupDetailSkeleton;
