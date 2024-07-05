import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  UserRound,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { getCategoriesOptions } from './api';

const NavBar: React.FC = () => {
  const { cart } = useCartStore((state) => state);

  const { setModalPath } = useModalStore((state) => state);

  const navigate = useNavigate();

  const { data: catagoriesResponse } = useSuspenseQuery(getCategoriesOptions());
  const categories = catagoriesResponse?.Data;

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

  return (
    <div className="w-full max-w-[1220px] mx-auto gap-6 py-6 px-4 sm:px-8  bg-white  border border-t-0 border-l-0 border-r-0 border-b-slate-300">
      <div className="flex justify-between">
        <div>
          <Search
            className="cursor-pointer"
            onClick={() => {
              setModalPath({ modal: 'search' });
            }}
            strokeWidth={'1px'}
          />
        </div>
        <div>
          <Link to="/">
            <h1 className="font-bold">Suprasy</h1>
          </Link>
        </div>
        <div className="flex gap-[20px]">
          <button
            onClick={() => {
              navigate({ to: '/login' });
            }}
          >
            <UserRound
              className="text-black hover:scale-110"
              strokeWidth={'1px'}
            />
          </button>

          <button
            className="relative"
            onClick={() => {
              setModalPath({ modal: 'cart' });
            }}
          >
            <ShoppingCart
              className="text-black hover:scale-110"
              strokeWidth={'1px'}
            />

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
              key={category.Id.toString()}
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
