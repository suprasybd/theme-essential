import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { formatPrice } from '@web/libs/helpers/formatPrice';
import {
  getProductAttributeName,
  getProductAttributeOptions,
  getProductImages,
  getProductSku,
  getProductsDetails,
  getProductsDetailsById,
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

  return (
    <Sheet
      open={modalOpen}
      onOpenChange={(data) => {
        if (!data) {
          closeModal();
        }
      }}
    >
      <SheetContent className="p-3 overflow-auto">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Add items to cart</SheetDescription>
        </SheetHeader>
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

          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
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

  const { data: productsDetailsResponse } = useQuery({
    queryKey: ['getProductsDetailsByIdCart', Cart.ProductId],
    queryFn: () => getProductsDetailsById(Cart.ProductId.toString() || '0'),
    enabled: !!Cart.ProductId,
  });

  const productDetails = productsDetailsResponse?.Data;

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', productDetails?.Id],
    queryFn: () => getProductImages(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const { data: productSkuResponse } = useQuery({
    queryKey: ['getProductSku', productDetails?.Id],
    queryFn: () => getProductSku(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const { data: attributeNameResponse } = useQuery({
    queryKey: ['getProductAttributeName', productDetails?.Id],
    queryFn: () => getProductAttributeName(productDetails?.Id || 0),
    enabled: productDetails?.HasVariant && !!productDetails?.Id,
  });

  const { data: attributeOptionsResponse } = useQuery({
    queryKey: ['getProductAttributeOptions', productDetails?.Id],
    queryFn: () => getProductAttributeOptions(productDetails?.Id || 0),
    enabled: productDetails?.HasVariant && !!productDetails?.Id,
  });

  const productImages = productImagesResponse?.Data;
  const productSku = productSkuResponse?.Data;
  const HasVariant = productDetails?.HasVariant;
  const productAttributeName = attributeNameResponse?.Data;
  const productAttributeOptions = attributeOptionsResponse?.Data;

  useEffect(() => {
    if (!HasVariant && productDetails && productSku) {
      setPriceMap(Cart.Id || '', productSku[0].Price * Cart.Quantity);
    }

    if (HasVariant && productDetails && productSku) {
      productSku.map((sku) => {
        if (sku.AttributeOptionId === Cart.ProductAttribute) {
          setPriceMap(Cart.Id || '', sku.Price * Cart.Quantity);
        }
      });
    }
  }, [HasVariant, productDetails, productSku, Cart, setPriceMap]);

  return (
    <div className="flex p-2">
      <div className="mr-3">
        {productImages && (
          <div className="w-[60px] h-fit">
            <img
              src={productImages[0].ImageUrl}
              style={{ width: '100%', height: '100%' }}
              alt="product cart"
            />
          </div>
        )}
      </div>

      <div>
        <h1 className="text-sm">{productDetails?.Title}</h1>

        {productSku && !productDetails?.HasVariant && (
          <div>
            <h3 className="text-sm">
              Price: {formatPrice(productSku[0].Price)}
            </h3>
            <h3 className="text-sm">
              Total Price: {formatPrice(productSku[0].Price * Cart.Quantity)}
            </h3>{' '}
          </div>
        )}

        {productSku && productDetails?.HasVariant && (
          <div>
            {productSku.map((sku) => {
              if (sku.AttributeOptionId === Cart.ProductAttribute) {
                return (
                  <>
                    <h3 className="text-sm">Price: {formatPrice(sku.Price)}</h3>
                    <h3 className="text-sm">
                      Total Price: {formatPrice(sku.Price * Cart.Quantity)}
                    </h3>{' '}
                  </>
                );
              }
            })}
          </div>
        )}

        {productDetails?.HasVariant && (
          <div>
            <span className="block mb-2 font-light text-sm">
              {productAttributeName?.Name}:{' '}
              {productAttributeOptions &&
                productAttributeOptions.map((attribute) => {
                  if (attribute.Id === Cart.ProductAttribute) {
                    return attribute.Value;
                  }
                })}
            </span>
          </div>
        )}

        <span className="block mb-2 font-light text-sm">Quantity</span>
        <div className="flex justify-between">
          <div className="flex">
            <button
              className="border border-gray-400 py-2 px-5"
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
                setQuantity(Cart.Id || '0', parseInt(e.target.value) || 1);
              }}
              type="text"
              className="border w-[50px] border-gray-400 text-center"
              value={quantity}
              step={'any'}
            />
            <button
              className="border border-gray-400 py-2 px-5"
              onClick={(e) => {
                e.preventDefault();

                setQuantity(Cart.Id || '0', quantity + 1);
              }}
            >
              +
            </button>
          </div>

          <button
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
