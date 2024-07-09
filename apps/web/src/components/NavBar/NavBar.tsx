import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import {
  ChevronDown,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  UserRound,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { CategoryType, getCategoriesOptions, getSubCategories } from './api';
import { getLogo } from '@web/api/turnstile';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@frontend.suprasy.com/ui';

const NavBar: React.FC = () => {
  const { cart } = useCartStore((state) => state);

  const { setModalPath } = useModalStore((state) => state);

  const navigate = useNavigate();

  const { data: logoResponse } = useQuery({
    queryKey: ['getLogo'],
    queryFn: getLogo,
  });

  const { data: catagoriesResponse } = useSuspenseQuery(getCategoriesOptions());

  const categories = catagoriesResponse?.Data;
  const logo = logoResponse?.Data;

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
            <img
              src={logo?.LogoLink}
              width={'70px'}
              height={'auto'}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex gap-[20px]">
          <button
            className="h-fit"
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
            className="relative h-fit"
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
      <div className="flex mt-10 w-full flex-wrap gap-[30px] justify-center ">
        {categories &&
          categories.length > 0 &&
          categories.map((category) => (
            <CategoryComponent category={category} />
          ))}
      </div>
    </div>
  );
};

const CategoryComponent: React.FC<{ category: CategoryType }> = ({
  category,
}) => {
  const { data: subCategoriesResponse } = useQuery({
    queryKey: ['getSubCategory', category.Id],
    queryFn: () => getSubCategories(category.Id),
    enabled: !!category.Id,
  });

  const subCategories = subCategoriesResponse?.Data;

  return (
    <div>
      {subCategories && subCategories.length > 0 && (
        <div>
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <Link
                key={category.Id.toString()}
                to={'/category/' + category.Name}
                className=" hover:scale-105 transition-all duration-150 flex gap-[3px] justify-center items-center"
              >
                <span>{category.Name}</span>

                <ChevronDown className="h-[20px] w-[20px]" />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="m-0 w-fit !pr-7">
              {subCategories?.map((s) => (
                <div className="my-3">
                  <Link
                    key={s.Id.toString()}
                    to={'/category/' + s.Name}
                    className="hover:underline hover:scale-105 transition-all duration-150"
                  >
                    {s.Name}
                  </Link>
                </div>
              ))}
            </HoverCardContent>
          </HoverCard>
        </div>
      )}
      {subCategories?.length === 0 && (
        <Link
          key={category.Id.toString()}
          to={'/category/' + category.Name}
          className="hover:underline hover:scale-110 transition-all duration-150"
        >
          {category.Name}d
        </Link>
      )}
    </div>
  );
};

export default NavBar;
