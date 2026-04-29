import GroupDetail from '@features/groups/components/organisms/GroupDetail';

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

const GroupDetailPage = async ({ params }: GroupDetailPageProps) => {
  const { id } = await params;
  return <GroupDetail groupId={id} />;
};

export default GroupDetailPage;
