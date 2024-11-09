import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export interface ProductCartType {
  Id?: string;
  ProductId: number;
  VariationId: number;
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
      set((state) => {
        // Check if the item with the same VariationId already exists in the cart
        const existingProduct = state.cart.find(
          (item) => item.VariationId === product.VariationId
        );

        // If it exists, increment the quantity
        if (existingProduct) {
          return {
            cart: state.cart.map((item) =>
              item.VariationId === product.VariationId
                ? { ...item, Quantity: item.Quantity + product.Quantity }
                : item
            ),
          };
        }

        // If it doesn't exist, add the new product to the cart
        return { cart: [...state.cart, { ...product, Id: uuid() }] };
      });
    },
    setPriceMap(id, price) {
      set((state) => ({
        ...state,
        priceMap: { ...state.priceMap, [id]: price },
      }));
    },
    setCart(cart) {
      set((state) => ({ ...state, cart }));
    },
    removeFromCart(id) {
      set((state) => ({
        cart: state.cart.filter((item) => item.Id !== id),
      }));
    },
    clearCart() {
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
