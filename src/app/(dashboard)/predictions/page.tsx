<<<<<<< HEAD
import PredictionsView from '@features/predictions/components/organisms/PredictionsView';

const PredictionsPage = () => <PredictionsView />;
=======
import { Suspense } from 'react';
import PredictionsView from '@features/predictions/components/organisms/PredictionsView';

const PredictionsPage = () => (
  <Suspense fallback={null}>
    <PredictionsView />
  </Suspense>
);
>>>>>>> origin/develop

export default PredictionsPage;
