'use client';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '@lib/theme/theme';
import { APPBAR_HEIGHT } from '@shared/components/organisms/DashboardNavbar';
import CreateGroupForm from './CreateGroupForm';

interface CreateGroupDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CreateGroupDrawer = ({ open, onClose }: CreateGroupDrawerProps) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    slotProps={{
      paper: {
        sx: {
          width: { xs: '100vw', sm: 520 },
          marginTop: `${APPBAR_HEIGHT}px`,
          height: `calc(100% - ${APPBAR_HEIGHT}px)`,
          bgcolor: tokens.background,
          backgroundImage: 'none',
          borderLeft: `1px solid ${tokens.outlineVariant}26`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      },
    }}
  >
    {/* Header fijo — solo X */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        px: 2,
        py: 0.5,
        flexShrink: 0,
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          color: tokens.onSurface,
          bgcolor: tokens.surfaceContainerHigh,
          border: `1px solid ${tokens.outlineVariant}33`,
          borderRadius: '8px',
          '&:hover': {
            bgcolor: tokens.surfaceContainerHighest,
            borderColor: `${tokens.outlineVariant}66`,
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>
    </Box>

    {/* Área scrolleable (sin barra visible) */}
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <CreateGroupForm />
    </Box>
  </Drawer>
);

export default CreateGroupDrawer;
