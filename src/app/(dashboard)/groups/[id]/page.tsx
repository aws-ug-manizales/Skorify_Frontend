import GroupDetailRoute from './GroupDetailRoute';

// Build emits a placeholder static HTML so `output: 'export'` succeeds; the
// real id is resolved on the client from the URL at runtime. The Amplify
// rewrite `/groups/<*>` → `/groups/_/index.html` (200) is what makes the
// runtime navigation actually reach this shell.
export const generateStaticParams = () => [{ id: '_' }];

const GroupDetailPage = () => <GroupDetailRoute />;

export default GroupDetailPage;
