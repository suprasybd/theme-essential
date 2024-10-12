import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useToast,
} from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { formatPrice } from '@web/libs/helpers/formatPrice';
import {
  getProductImages,
  getProductsDetailsById,
  getProductVariationDetails,
} from '@web/pages/products/api';
import { ProductCartType, useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

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

  const { cart, priceMap, setCart } = useCartStore((state) => state);

  // persest cart data
  useEffect(() => {
    if (cart && cart.length) {
      // save changes on change cart to localstorage
      localStorage.setItem('CartData', JSON.stringify(cart));
    } else {
      // load from local storage if found in localstorage
      if (localStorage.getItem('CartData')) {
        const parsed = JSON.parse(localStorage.getItem('CartData') || '');
        if (parsed && parsed.length) {
          setCart(parsed);
        }
      }
    }
  }, [cart, setCart]);

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
      <SheetContent className="p-3 overflow-auto w-full md:w-[75%]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Add items to cart</SheetDescription>
        </SheetHeader>
        {isCartEmpty && (
          <div className="h-full w-full flex justify-center items-center">
            <div className="text-center">
              <h1 className="font-bold txt-xl">Cart is empty!</h1>
              <h1>Please add item to cart</h1>
            </div>
          </div>
        )}

        {!isCartEmpty && (
          <>
            <div className="grid gap-4 py-4">
              {cart && (
                <div>
                  {cart.map((cartEach) => (
                    <CartItem Cart={cartEach} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between mt-3">
                <h1>Estimated Total</h1>
                <h1>{formatPrice(estimatedTotal)}</h1>
              </div>

              <Link to="/checkout">
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                  className="w-full my-1 bg-green-500 hover:bg-green-500 hover:shadow-lg"
                >
                  Check Out{' '}
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
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
    <div className="flex p-2">
      <div className="mr-3">
        {productImages && (
          <div className="w-[120px] h-fit">
            <img
              className="rounded-md"
              src={productImages[0].ImageUrl}
              style={{ width: '100%', height: '100%' }}
              alt="product cart"
            />
          </div>
        )}
      </div>

      <div>
        <h1 className="text-sm font-bold">
          {productDetails?.Title} - ({variation?.ChoiceName})
        </h1>

        {variation && (
          <div>
            <h3 className="text-sm">Price: {formatPrice(variation.Price)}</h3>
            <h3 className="text-sm">
              Price x Qty: {formatPrice(variation.Price * Cart.Quantity)}
            </h3>{' '}
          </div>
        )}

        <span className="block mb-2 font-light text-sm">Quantity</span>
        <div className="flex flex-col gap-[6px] md:gap-[0px] md:flex-row items-end justify-between">
          <div className="flex">
            <button
              className="border border-r-0 border-gray-400 py-1 px-5 font-bold rounded-l-full hover:!bg-slate-200"
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
              onChange={(e) => {
                if (parseInt(e.target.value) > totalInStock) {
                  toast({
                    variant: 'destructive',
                    title: 'Stock Alert',
                    description: 'Not enough items in stock.',
                  });
                  return;
                }
                setQuantity(Cart.Id || '0', parseInt(e.target.value) || 1);
              }}
              type="text"
              className="border w-[50px] border-gray-400 text-center "
              value={quantity}
              step={'any'}
            />
            <button
              className="border border-l-0 border-gray-400 py-1 px-5 font-bold rounded-r-full hover:!bg-slate-200"
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

          <button
            className="md:ml-3"
            onClick={() => {
              if (Cart.Id) {
                setPriceMap(Cart.Id, 0);
                removeFromCart(Cart.Id);
              }
            }}
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
