'use client';

import { useParams } from 'next/navigation';
import UserPublicProfile from '@features/users/components/organisms/UserPublicProfile';

const UserPublicProfileRoute = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  if (!id || id === '_') return null;
  return <UserPublicProfile userId={id} />;
};

export default UserPublicProfileRoute;
