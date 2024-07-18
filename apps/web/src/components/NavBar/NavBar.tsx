import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCartStore } from '@web/store/cartStore';
import { useModalStore } from '@web/store/modalStore';
import {
  ChevronDown,
  Menu,
  Power,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  SheetFooter,
} from '@frontend.suprasy.com/ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@frontend.suprasy.com/ui';

import { useAuthStore } from '@web/store/authStore';
import { logoutUser } from '@web/config/profile/logout';
import classNames from 'classnames';

const NavBar: React.FC = () => {
  const { cart } = useCartStore((state) => state);
  const { isAuthenticated, user } = useAuthStore((state) => state);
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
      <div className="hidden md:flex flex-col justify-center items-center gap-[30px] md:flex-row md:justify-between">
        <div>
          <Search
            className="cursor-pointer"
            onClick={() => {
              setModalPath({ modal: 'search' });
            }}
            strokeWidth={'1px'}
          />
        </div>
        <div className={classNames(isAuthenticated && 'ml-0 md:ml-[180px]')}>
          <Link to="/">
            <img
              className="w-[70px] h-[70px]"
              src={logo?.LogoLink}
              width={'70px'}
              height={'auto'}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex gap-[20px]">
          {isAuthenticated && (
            <div className="flex justify-center gap-[7px]">
              <div className=" pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="relative ml-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Button variant={'outline'}>
                        <UserRound size={'18px'} className="mr-2" />
                        {user?.FullName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        <div>
                          <span>Signed in as</span>
                        </div>
                        <div>
                          <h4>{user?.Email}</h4>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button
                          onClick={logoutUser}
                          variant={'dropdown'}
                          className="w-full justify-start"
                        >
                          <div className="flex gap-[8px] items-center">
                            <Power size={'17px'} />
                            Sign out
                          </div>
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
          {!isAuthenticated && (
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
          )}

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
      <div className="hidden md:flex mt-10 w-full flex-wrap gap-[30px] justify-center ">
        {categories &&
          categories.length > 0 &&
          categories.map((category) => (
            <CategoryComponent category={category} isMobile={false} />
          ))}
      </div>
      {/* mobile menu */}
      <div className="md:hidden flex justify-between">
        <Sheet key={'left'}>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent
            side={'left'}
            className="flex flex-col justify-between overflow-y-scroll w-screen"
          >
            <SheetHeader>
              <SheetDescription>
                <h1 className="text-3xl font-bold">Categories</h1>
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <CategoryComponent category={category} isMobile />
                  ))}
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              {!isAuthenticated && (
                <Link className="w-full" to="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Button
                    onClick={logoutUser}
                    variant={'destructive'}
                    className="w-full justify-start my-3"
                  >
                    <div className="flex gap-[8px] items-center">
                      <Power size={'17px'} />
                      Sign out
                    </div>
                  </Button>
                  <div>
                    <div>
                      <span>Signed in as</span>
                    </div>
                    <div>
                      <h4>{user?.Email}</h4>
                    </div>
                  </div>
                </>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <div className={classNames(isAuthenticated && 'ml-0 md:ml-[180px]')}>
          <Link to="/">
            <img
              className="w-[70px] h-[70px]"
              src={logo?.LogoLink}
              width={'70px'}
              height={'auto'}
              alt="logo"
            />
          </Link>
        </div>
        {/* search and cart mobile */}
        <div className="flex justify-center items-center gap-[10px]">
          <div>
            <Search
              className="cursor-pointer"
              onClick={() => {
                setModalPath({ modal: 'search' });
              }}
              strokeWidth={'1px'}
            />
          </div>
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
    </div>
  );
};

const CategoryComponent: React.FC<{
  category: CategoryType;
  isMobile: boolean;
}> = ({ category, isMobile }) => {
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
          {!isMobile && (
            <HoverCard openDelay={0}>
              <HoverCardTrigger>
                <Link
                  key={category.Id.toString()}
                  to={'/category/' + category.Name}
                  className="hover:underline hover:scale-105 transition-all duration-150 flex gap-[3px] justify-center items-center"
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
          )}

          {isMobile && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-none py-0">
                <AccordionTrigger className="border-none py-0">
                  {' '}
                  <Link
                    key={category.Id.toString()}
                    to={'/category/' + category.Name}
                    className={classNames(
                      isMobile &&
                        'block text-2xl hover:scale-100 font-medium hover:bg-slate-100 hover:no-underline my-2 py-3 px-1 text-slate-800'
                    )}
                  >
                    <span>{category.Name}</span>
                  </Link>
                </AccordionTrigger>
                <AccordionContent>
                  {subCategories?.map((s) => (
                    <div className="my-3">
                      <Link
                        key={s.Id.toString()}
                        to={'/category/' + s.Name}
                        className={
                          'block text-2xl hover:scale-100 font-medium hover:bg-slate-100 hover:no-underline my-2 py-3 px-1 text-slate-800'
                        }
                      >
                        {s.Name}
                      </Link>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
      {subCategories?.length === 0 && (
        <Link
          key={category.Id.toString()}
          to={'/category/' + category.Name}
          className={classNames(
            ' hover:font-medium hover:underline transition-all duration-150',
            isMobile &&
              'block text-2xl !hover:scale-95 text-left font-medium hover:bg-slate-100 hover:no-underline my-2 py-3 px-1 text-slate-800'
          )}
        >
          {category.Name}
        </Link>
      )}
    </div>
  );
};

export default NavBar;
