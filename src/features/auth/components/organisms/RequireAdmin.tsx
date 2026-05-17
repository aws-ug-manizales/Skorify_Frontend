'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { hydrated, session, isAdmin } = useAuthSession();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!session) {
      router.replace('/auth');
      return;
    }

    if (!isAdmin) {
      router.replace('/403');
    }
  }, [hydrated, isAdmin, router, session]);

  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAdmin;
