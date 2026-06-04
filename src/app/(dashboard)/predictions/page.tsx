import { Suspense } from 'react';
import PredictionsView from '@features/predictions/components/organisms/PredictionsView';

const PredictionsPage = () => (
  <Suspense fallback={null}>
    <PredictionsView />
  </Suspense>
);

export default PredictionsPage;
