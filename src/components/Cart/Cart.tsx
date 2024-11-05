import { useCartStore } from '@/store/cartStore';
import { useModalStore } from '@/store/modalStore';
import { ShoppingCart } from 'lucide-react';
import React, { useMemo } from 'react';

const Cart: React.FC = () => {
  const { cart } = useCartStore((state) => state);
  const { setModalPath } = useModalStore((state) => state);

  const totalCartQuantity = useMemo(() => {
    if (cart) {
      let total = 0;
      cart.forEach((cartItem) => {
        total += cartItem.Quantity;
      });
      return total;
    } else {
      return 0;
    }
  }, [cart]);

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div
      onClick={() => {
        setModalPath({ modal: 'cart' });
      }}
      className="p-3 rounded-full flex justify-center items-center fixed bottom-5 right-5 z-10 cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
    >
      <ShoppingCart className="text-gray-700 h-5 w-5" />
      {totalCartQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalCartQuantity}
        </span>
      )}
    </div>
  );
};

export default Cart;
