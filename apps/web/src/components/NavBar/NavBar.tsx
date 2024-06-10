import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import { Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import React, { useMemo } from 'react';
import { getCategories } from './api';

const NavBar: React.FC = () => {
  const { setModalPath } = useModalStore((state) => state);
  const { cart } = useCartStore((state) => state);

  const { data: catagoriesResponse } = useQuery({
    queryFn: () => getCategories(),
    queryKey: ['getCategoriesResponse'],
  });
  const categories = catagoriesResponse?.Data;

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
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <div className="flex justify-between">
        <div>
          <Search strokeWidth={'1px'} />
        </div>
        <div>
          <Link to="/">
            <h1 className="font-bold">Suprasy</h1>
          </Link>
        </div>
        <div className="flex gap-[20px]">
          <button>
            <User strokeWidth={'1px'} />
          </button>

          <button
            className="relative"
            onClick={() => {
              setModalPath({ modal: 'cart' });
            }}
          >
            <ShoppingBag strokeWidth={'1px'} />

            {cart && cart.length > 0 && (
              <div className="absolute top-[-5px] right-[-8px] bg-green-500 text-white rounded-full text-sm px-[5px]">
                {totalCartQuantity}
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="flex mt-10 w-full gap-[30px] justify-center font-light ">
        {categories &&
          categories.length &&
          categories.map((category) => (
            <Link
              to={'/category/' + category.Name}
              className="hover:underline hover:font-normal"
            >
              {category.Name}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default NavBar;
