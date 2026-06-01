import { RequireAdmin } from '@features/auth';
import MatchResultSelectionPanel from '@features/matches/components/organisms/MatchResultSelectionPanel';

const LoadResultsPage = () => (
  <RequireAdmin>
    <MatchResultSelectionPanel />
  </RequireAdmin>
);

export default LoadResultsPage;
