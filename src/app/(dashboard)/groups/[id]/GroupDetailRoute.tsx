'use client';

import { useParams } from 'next/navigation';
import GroupDetail from '@features/groups/components/organisms/GroupDetail';

const GroupDetailRoute = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  // `_` is the placeholder id baked at build time. Render nothing until the
  // client router replaces it with the real param so we don't hit the API
  // with the literal "_".
  if (!id || id === '_') return null;
  return <GroupDetail groupId={id} />;
};

export default GroupDetailRoute;
