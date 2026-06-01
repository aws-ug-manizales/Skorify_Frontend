'use client';

import { useParams } from 'next/navigation';
import GroupResultsView from '@features/groups/components/organisms/GroupResultsView';

const GroupResultsRoute = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  if (!id || id === '_') return null;
  return <GroupResultsView groupId={id} />;
};

export default GroupResultsRoute;
