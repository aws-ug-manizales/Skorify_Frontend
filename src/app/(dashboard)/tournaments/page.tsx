import { TournamentsHome } from '@features/tournaments';
import { RequireAdmin } from '@features/auth';

const TournamentsPage = () => (
  <RequireAdmin>
    <TournamentsHome />
  </RequireAdmin>
);

export default TournamentsPage;
