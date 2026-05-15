import UserPublicProfile from '@features/users/components/organisms/UserPublicProfile';

interface UserPublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = () => [{ id: '_' }];

const UserPublicProfilePage = async ({ params }: UserPublicProfilePageProps) => {
  const { id } = await params;
  return <UserPublicProfile userId={id} />;
};

export default UserPublicProfilePage;
