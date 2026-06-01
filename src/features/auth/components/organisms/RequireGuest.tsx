'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';

const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { hydrated, session } = useAuthSession();

  useEffect(() => {
    if (hydrated && session) {
      router.replace('/home');
    }
  }, [hydrated, session, router]);

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

  if (session) {
    return null;
  }

  return <>{children}</>;
};

export default RequireGuest;
