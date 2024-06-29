import ProductDetails, {
  getProductsDetailsOptions,
} from '@web/pages/products/details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router';
import PendingComponent from '@web/components/PendingComponent/PendingComponent';

export const Route = createFileRoute('/products/$slug/')({
  loader: ({ context: { queryClient }, params }) => {
    const a = queryClient.ensureQueryData(
      getProductsDetailsOptions(params.slug)
    );

    return a;
  },
  pendingComponent: () => <PendingComponent />,
  component: () => <ProductDetails />,
});
