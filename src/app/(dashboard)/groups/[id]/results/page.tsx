import GroupResultsView from '@features/groups/components/organisms/GroupResultsView';

export const generateStaticParams = () => [{ id: '_' }];

export default async function GroupResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <GroupResultsView groupId={resolvedParams.id} />;
}
