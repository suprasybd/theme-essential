import { createFileRoute } from '@tanstack/react-router';
import Checkout from '@web/pages/checkcout/Checkout';

export const Route = createFileRoute('/checkout')({
  component: () => <Checkout />,
});
