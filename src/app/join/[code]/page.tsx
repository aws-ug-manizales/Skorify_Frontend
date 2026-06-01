import JoinByCodeRoute from './JoinByCodeRoute';

export const generateStaticParams = () => [{ code: '_' }];

const JoinByCodePage = () => <JoinByCodeRoute />;

export default JoinByCodePage;
