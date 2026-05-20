import UserPublicProfileRoute from './UserPublicProfileRoute';

export const generateStaticParams = () => [{ id: '_' }];

const UserPublicProfilePage = () => <UserPublicProfileRoute />;

export default UserPublicProfilePage;
