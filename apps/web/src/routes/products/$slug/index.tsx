import ProductDetails from '@web/pages/products/details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/products/$slug/')({
  component: () => <ProductDetails />,
});
