import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export interface ProductCartType {
  Id?: string;
  ProductId: number;
  ProductAttribute?: number;
  Quantity: number;
}

export interface CartStoreTypes {
  cart: ProductCartType[];
  priceMap: Record<string, number>;
  setPriceMap: (id: string, price: number) => void;
  addToCart: (product: ProductCartType) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (cart: ProductCartType[]) => void;
  setQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStoreTypes>()(
  devtools((set) => ({
    cart: [],
    priceMap: {},
    addToCart(product) {
      set((state) => ({ cart: [...state.cart, { ...product, Id: uuid() }] }));
    },
    setPriceMap(id, price) {
      set((state) => ({
        ...state,
        priceMap: { ...state.priceMap, [id]: price },
      }));
    },
    setCart(cart) {
      set((state) => ({ ...state, cart: cart as any }));
    },
    removeFromCart(id) {
      set((state) => {
        const afterRemove = state.cart.filter((item) => item.Id !== id);
        if (afterRemove.length === 0) {
          localStorage.removeItem('CartData');
        }
        return { cart: state.cart.filter((item) => item.Id !== id) };
      });
    },
    clearCart() {
      localStorage.removeItem('CartData');
      set({ cart: [] });
    },
    setQuantity(id, quantity) {
      set((state) => ({
        cart: state.cart.map((item) =>
          item.Id === id ? { ...item, Quantity: quantity } : item
        ),
      }));
    },
  }))
);
