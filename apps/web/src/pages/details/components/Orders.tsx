import { Button } from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import {
  getOrders,
  getOrderProducts,
  OrderType,
  OrdersProductType,
} from '@web/api/orders';
import React from 'react';
import { PaginationType } from '@web/libs/types/responseTypes';
import PaginationMain from '@web/components/Pagination/Pagination';
import { formatPrice } from '@web/libs/helpers/formatPrice';
import {
  getProductImages,
  getProductVariationDetails,
  getProductsDetailsById,
} from '@web/api/products';
import ImagePreview from '@web/components/Image/ImagePreview';
import { Image } from 'lucide-react';
import cn from 'classnames';

const Orders = () => {
  const [limit] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const { data: ordersResponse } = useQuery({
    queryKey: ['getOrders', page, limit],
    queryFn: () => getOrders({ Page: page, Limit: limit }),
  });

  const orders = ordersResponse?.Data;

  return (
    <div>
      {orders?.map((order) => (
        <OrdersCard key={order.Id} order={order} />
      ))}

      {ordersResponse?.Pagination && (
        <PaginationMain
          PaginationDetails={ordersResponse.Pagination}
          setPage={setPage}
        />
      )}
    </div>
  );
};

const OrdersCard: React.FC<{ order: OrderType }> = ({ order }) => {
  const { data: orderProductsResponse } = useQuery({
    queryKey: ['getOrderProducts', order.Id],
    queryFn: () => getOrderProducts(order.Id),
  });

  const orderProducts = orderProductsResponse?.Data;

  return (
    <div className="p-3 rounded-md border my-3">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="font-medium">Order #{order.Id}</div>
          <div className="text-sm text-gray-500">Status: {order.Status}</div>
          <div className="text-sm text-gray-500">
            Date: {new Date(order.CreatedAt).toLocaleDateString()}
          </div>
        </div>
        <div>
          <Button>View Details</Button>
        </div>
      </div>

      {/* Order Products */}
      <div className="space-y-2">
        {orderProducts?.map((product) => (
          <OrderProductCard key={product.Id} product={product} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{formatPrice(order.ShippingMethodPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>{formatPrice(order.DeliveryMethodPrice)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>
            {formatPrice(
              orderProducts?.reduce(
                (acc, product) => acc + product.Price * product.Quantity,
                0
              ) || 0 + order.ShippingMethodPrice + order.DeliveryMethodPrice
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const OrderProductCard: React.FC<{ product: OrdersProductType }> = ({
  product,
}) => {
  // Get variation details first
  const { data: variationResponse } = useQuery({
    queryKey: ['getVariationDetails', product.VariationId],
    queryFn: () => getProductVariationDetails(product.VariationId),
    enabled: !!product.VariationId,
  });

  const variation = variationResponse?.Data;

  // Get product details using ProductId from variation
  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetails', variation?.ProductId],
    queryFn: () =>
      getProductsDetailsById(variation?.ProductId.toString() || ''),
    enabled: !!variation?.ProductId,
  });

  // Get product images
  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', product.VariationId],
    queryFn: () => getProductImages(product.VariationId),
    enabled: !!product.VariationId,
  });

  const productDetails = productDetailsResponse?.Data;
  const productImages = productImagesResponse?.Data;

  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div
          className={cn(
            'w-[60px] h-[60px]',
            'bg-slate-200 flex justify-center items-center rounded-md overflow-hidden'
          )}
        >
          {productImages && productImages.length > 0 ? (
            <ImagePreview
              className="w-full h-full object-cover"
              src={productImages[0].ImageUrl}
              alt={productDetails?.Title || 'Product image'}
            />
          ) : (
            <Image size={'30px'} className="text-slate-400" />
          )}
        </div>

        <div>
          <div className="font-medium">
            {productDetails?.Title || 'Loading...'}
            {variation && (
              <span className="text-sm text-gray-600 ml-2">
                ({variation.ChoiceName})
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Quantity: {product.Quantity}
          </div>
          <div className="text-sm">
            Price: {formatPrice(product.Price)}
            <span className="mx-2">·</span>
            Total: {formatPrice(product.Price * product.Quantity)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
