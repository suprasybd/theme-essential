import { useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import { ShoppingCart } from 'lucide-react';
import React, { useMemo } from 'react';

const Cart: React.FC = () => {
  const { cart } = useCartStore((state) => state);
  const { setModalPath } = useModalStore((state) => state);

  const totalCartQuantity = useMemo(() => {
    if (cart) {
      let total = 0;
      cart.map((cartItem) => {
        total += cartItem.Quantity;
      });
      return total;
    } else {
      return 0;
    }
  }, [cart]);

  return (
    <div
      onClick={() => {
        setModalPath({ modal: 'cart' });
      }}
      className="p-5 rounded-full flex justify-center items-center fixed bottom-10 right-10 z-10 cursor-pointer bg-green-500 border-green-400 border-[3px]"
    >
      <ShoppingCart className="text-white relative bottom-[-6px]" />
      <span className="absolute top-2 right-6 font-bold text-white ">
        {totalCartQuantity}
      </span>
    </div>
  );
};

export default Cart;
