import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCartStore } from '@/store/cartStore';
import { useModalStore } from '@/store/modalStore';
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
import { getLogo } from '@/api/turnstile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  SheetFooter,
} from '@/components/ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';

import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/config/profile/logout';
import classNames from 'classnames';
import { useSidebarStore } from '@/store/sidebarStore';

const NavBar: React.FC = () => {
  const { cart } = useCartStore((state) => state);
  const { isAuthenticated, user } = useAuthStore((state) => state);
  const { setModalPath } = useModalStore((state) => state);
  const { toggleSideBar } = useSidebarStore((state) => state);

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
    <div className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1220px] mx-auto">
        {/* Desktop Navigation - Top Row */}
        <div className="hidden md:flex items-center justify-between py-3 px-4 sm:px-8">
          <Link to="/" className="flex-shrink-0">
            <img className="h-10 w-auto" src={logo?.LogoLink} alt="logo" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => setModalPath({ modal: 'search' })}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <UserRound className="h-5 w-5" />
                    <span className="font-medium hidden sm:inline">
                      {user?.FullName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-sm text-slate-500">Signed in as</div>
                    <div className="font-medium truncate">{user?.Email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/details">
                    <DropdownMenuItem>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Orders
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutUser}>
                    <Power className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/login' })}
              >
                <UserRound className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-slate-900 relative"
              onClick={() => setModalPath({ modal: 'cart' })}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {cart && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartQuantity}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Categories - Bottom Row */}
        <div className="hidden md:block border-t border-slate-200">
          <div className="px-4 sm:px-8">
            <div className="flex items-center space-x-8 py-3">
              {categories?.map((category) => (
                <div key={category.Id} className="flex-shrink-0">
                  <CategoryComponent category={category} isMobile={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-4 px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-slate-100 rounded-lg"
              >
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto">
                  <nav className="flex flex-col">
                    {categories?.map((category) => (
                      <div key={category.Id}>
                        <CategoryComponent
                          category={category}
                          isMobile={true}
                        />
                      </div>
                    ))}
                  </nav>
                </div>
                {isAuthenticated && (
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <UserRound className="h-5 w-5" />
                      <span className="font-medium">{user?.FullName}</span>
                    </div>
                    <div className="space-y-3">
                      <Link
                        to="/details"
                        className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                      <button
                        onClick={logoutUser}
                        className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
                      >
                        <Power className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex-shrink-0">
            <img className="h-10 w-auto" src={logo?.LogoLink} alt="logo" />
          </Link>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-slate-100 rounded-full"
              onClick={() => setModalPath({ modal: 'search' })}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              className="p-2 hover:bg-slate-100 rounded-full relative"
              onClick={() => setModalPath({ modal: 'cart' })}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {cart && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {totalCartQuantity}
                </span>
              )}
            </button>
          </div>
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

  if (!isMobile) {
    return (
      <div>
        {subCategories && subCategories.length > 0 ? (
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <Link
                to={'/category/' + category.Name}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span className="font-medium">{category.Name}</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-56 p-2">
              <div className="grid gap-1">
                {subCategories?.map((s) => (
                  <Link
                    key={s.Id.toString()}
                    to={'/category/' + s.Name}
                    className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    {s.Name}
                  </Link>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link
            to={'/category/' + category.Name}
            className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            {category.Name}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {subCategories && subCategories.length > 0 && (
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200">
              <AccordionTrigger className="flex justify-between items-center w-full py-3 px-4 text-left">
                <Link
                  key={category.Id.toString()}
                  to={'/category/' + category.Name}
                  className="text-lg font-medium text-gray-900"
                >
                  {category.Name}
                </Link>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {subCategories?.map((s) => (
                    <Link
                      key={s.Id.toString()}
                      to={'/category/' + s.Name}
                      className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {s.Name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {subCategories?.length === 0 && (
        <Link
          key={category.Id.toString()}
          to={'/category/' + category.Name}
          className={classNames(
            'font-medium transition-colors',
            !isMobile
              ? 'px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
              : 'block py-3 px-4 text-lg text-gray-900 hover:bg-gray-50'
          )}
        >
          {category.Name}
        </Link>
      )}
    </div>
  );
};

export default NavBar;
