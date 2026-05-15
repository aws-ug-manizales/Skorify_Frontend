import { Suspense } from 'react';
import { GroupsView } from '@features/groups';

const GroupsPage = () => (
  <Suspense fallback={null}>
    <GroupsView />
  </Suspense>
);

export default GroupsPage;
