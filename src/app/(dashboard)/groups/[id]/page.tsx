import GroupDetail from '@features/groups/components/organisms/GroupDetail';

const GroupDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <GroupDetail groupId={id} />;
};

export default GroupDetailPage;
