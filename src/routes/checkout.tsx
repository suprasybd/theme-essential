import { createFileRoute } from '@tanstack/react-router';
import Checkout from '@/pages/checkcout/Checkout';

interface CheckoutSearchType {
  products?: string;
}

export const Route = createFileRoute('/checkout')({
  component: () => <Checkout />,
  validateSearch: (search: Record<string, unknown>): CheckoutSearchType => {
    return {
      products: String(search?.products || ''),
    };
  },
});
