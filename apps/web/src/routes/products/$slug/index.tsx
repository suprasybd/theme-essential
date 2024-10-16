import ProductDetails, {
  getProductsDetailsOptions,
} from '@web/pages/products/details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router';
import PendingComponent from '@web/components/PendingComponent/PendingComponent';
import { getProductImagesOption } from '@web/api/products';

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
