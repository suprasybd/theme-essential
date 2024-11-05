import ProductDetails, {
  getProductsDetailsOptions,
} from '@/pages/products/details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router';
import PendingComponent from '@/components/PendingComponent/PendingComponent';
import { getProductImagesOption } from '@/api/products';

export const Route = createFileRoute('/products/$slug/')({
  loader: async ({ context: { queryClient }, params }) => {
    const pDetails = await queryClient.ensureQueryData(
      getProductsDetailsOptions(params.slug)
    );

    await queryClient.ensureQueryData(getProductImagesOption(pDetails.Data.Id));
  },
  pendingComponent: () => <PendingComponent />,
  component: () => <ProductDetails />,
});
