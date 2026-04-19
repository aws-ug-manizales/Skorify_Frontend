import { getTranslations } from 'next-intl/server';
import { api } from '@lib/api';
import type { BackendEnvelope } from '@lib/api/types';
import type { Group } from '@features/groups/types';
import GroupDetail from './_components/GroupDetail';
import NotFoundPage from '@shared/components/organisms/NotFoundPage';

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

// ─── MOCK (solo activo cuando NEXT_PUBLIC_MOCK_GROUPS=true en .env.local) ───
const mockGetGroup = (id: string): Group => ({
  id,
  name: 'La Liga de Amigos',
  description: 'Grupo de prueba generado localmente.',
  inviteCode: id.replace('mock-', '').slice(0, 6).toUpperCase() || 'ABC123',
  adminId: 'mock-user-1',
  memberCount: 1,
  createdAt: new Date().toISOString(),
});
// ─────────────────────────────────────────────────────────────────────────────

const GroupDetailPage = async ({ params, searchParams }: GroupDetailPageProps) => {
  const { id } = await params;
  const { created } = await searchParams;
  const t = await getTranslations('groups');

  let group: Group;

  if (process.env.NEXT_PUBLIC_MOCK_GROUPS === 'true') {
    group = mockGetGroup(id);
  } else {
    const result = await api.get<BackendEnvelope<Group>>(`/groups/${id}`);

    if (!result.success) {
      return <NotFoundPage />;
    }

    group = result.data.data;
  }

  return (
    <GroupDetail
      group={group}
      isNew={created === 'true'}
      inviteCodeLabel={t('inviteCodeLabel')}
      inviteLinkLabel={t('inviteLinkLabel')}
      copyLabel={t('inviteCodeCopy')}
      copiedLabel={t('inviteCodeCopied')}
      memberCountLabel={t('memberCount', { count: group.memberCount })}
    />
  );
};

export default GroupDetailPage;
