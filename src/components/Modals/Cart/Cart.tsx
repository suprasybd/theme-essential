import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useToast,
} from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { formatPrice } from '@/libs/helpers/formatPrice';
import {
  getProductImages,
  getProductsDetailsById,
  getProductVariationDetails,
} from '@/api/products';
import { ProductCartType, useCartStore } from '@/store/cartStore';
import { useModalStore } from '@/store/modalStore';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const CartModal: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (modalName === 'cart') {
      setModalOpen(true);
    }
  }, [modalName]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { cart, priceMap } = useCartStore((state) => state);

  const estimatedTotal = useMemo(() => {
    if (priceMap) {
      let estimateTotal = 0;
      Object.keys(priceMap).forEach((key) => {
        estimateTotal += priceMap[key];
      });
      return estimateTotal;
    } else {
      return 0;
    }
  }, [priceMap]);

  const isCartEmpty = useMemo(() => {
    return cart.length === 0;
  }, [cart]);

  return (
    <Sheet
      open={modalOpen}
      onOpenChange={(data) => {
        if (!data) {
          closeModal();
        }
      }}
    >
      <SheetContent className="p-0 overflow-auto w-full md:w-[450px]">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl">Shopping Cart</SheetTitle>
            <SheetDescription>Manage your cart items</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto">
            {isCartEmpty && (
              <div className="h-full w-full flex justify-center items-center p-6">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h1 className="font-bold text-xl mb-2">Your cart is empty</h1>
                  <p className="text-gray-500">Add items to start shopping</p>
                </div>
              </div>
            )}

            {!isCartEmpty && (
              <div className="px-6">
                <div className="divide-y">
                  {cart?.map((cartEach) => (
                    <CartItem key={cartEach.Id} Cart={cartEach} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {!isCartEmpty && (
            <div className="border-t p-6">
              <div className="flex justify-between mb-4">
                <h1 className="text-lg font-medium">Total</h1>
                <h1 className="text-lg font-bold">
                  {formatPrice(estimatedTotal)}
                </h1>
              </div>

              <Link to="/checkout" className="block">
                <Button
                  onClick={closeModal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface CartItemPropsTypes {
  Cart: ProductCartType;
}

export const CartItem: React.FC<CartItemPropsTypes> = ({ Cart }) => {
  const quantity = Cart.Quantity;
  const { removeFromCart, setQuantity, setPriceMap } = useCartStore(
    (state) => state
  );

  const { toast } = useToast();

  const { data: productsDetailsResponse, isSuccess: productGetSuccess } =
    useQuery({
      queryKey: ['getProductsDetailsByIdCart', Cart.ProductId],
      queryFn: () => getProductsDetailsById(Cart.ProductId.toString() || '0'),
      enabled: !!Cart.ProductId,
    });

  const productDetails = productsDetailsResponse?.Data;

  const { data: productVariationResponse } = useQuery({
    queryKey: ['getProductVariation', Cart.VariationId],
    queryFn: () => getProductVariationDetails(Cart.VariationId),
    enabled: !!Cart.VariationId,
  });

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', Cart.VariationId],
    queryFn: () => getProductImages(Cart.VariationId || 0),
    enabled: !!Cart.VariationId,
  });

  const productImages = productImagesResponse?.Data;
  const variation = productVariationResponse?.Data;

  useEffect(() => {
    if (!productDetails && productGetSuccess && Cart.Id) {
      removeFromCart(Cart.Id);
    }

    if (variation && Cart.Id) {
      setPriceMap(Cart.Id, variation?.Price * Cart.Quantity);
    }
  }, [
    productDetails,
    Cart,
    setPriceMap,
    variation,
    productGetSuccess,
    removeFromCart,
  ]);

  const totalInStock = variation?.Inventory || 0;

  return (
    <div className="flex gap-4 py-4">
      <div className="flex-shrink-0">
        {productImages && (
          <div className="w-[100px] h-[100px] rounded-lg overflow-hidden bg-gray-50">
            <img
              className="w-full h-full object-cover"
              src={productImages[0].ImageUrl}
              alt={productDetails?.Title || 'Product image'}
            />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h1 className="font-medium text-sm truncate">
            {productDetails?.Title}
          </h1>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => {
              if (Cart.Id) {
                setPriceMap(Cart.Id, 0);
                removeFromCart(Cart.Id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {variation?.ChoiceName && (
          <p className="text-sm text-gray-500 mt-1">
            Variant: {variation.ChoiceName}
          </p>
        )}

        {variation && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              Price:{' '}
              <span className="font-medium">
                {formatPrice(variation.Price)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Subtotal:{' '}
              <span className="font-medium">
                {formatPrice(variation.Price * Cart.Quantity)}
              </span>
            </p>
          </div>
        )}

        <div className="mt-3">
          <div className="inline-flex items-center rounded-lg border border-gray-200">
            <button
              className="px-3 py-1 hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                if (quantity - 1 >= 1) {
                  setQuantity(Cart.Id || '0', quantity - 1);
                }
              }}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 text-center border-x border-gray-200 py-1"
              value={quantity}
              onChange={(e) => {
                const newQty = parseInt(e.target.value);
                if (newQty > totalInStock) {
                  toast({
                    variant: 'destructive',
                    title: 'Stock Alert',
                    description: 'Not enough items in stock.',
                  });
                  return;
                }
                setQuantity(Cart.Id || '0', newQty || 1);
              }}
            />
            <button
              className="px-3 py-1 hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                if (quantity + 1 > totalInStock) {
                  toast({
                    variant: 'destructive',
                    title: 'Stock Alert',
                    description: 'Not enough items in stock.',
                  });
                  return;
                }
                setQuantity(Cart.Id || '0', quantity + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
