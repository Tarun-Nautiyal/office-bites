import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartCustomization {
  option: string;
  choice: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  customizations: CartCustomization[];
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  promoCode: string | null;
  discount: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPromo: (code: string | null, discount?: number) => void;
  getSubtotal: () => number;
  getTotal: (deliveryFee?: number) => number;
  itemCount: () => number;
}

const calcItemPrice = (item: CartItem) => {
  const customTotal = item.customizations.reduce((s, c) => s + c.price, 0);
  return (item.price + customTotal) * item.quantity;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      promoCode: null,
      discount: 0,

      addItem: (item) => {
        const { items, restaurantId } = get();
        if (restaurantId && restaurantId !== item.restaurantId && items.length > 0) {
          if (!confirm('Your cart has items from another restaurant. Clear cart and add this item?')) return;
          set({ items: [], restaurantId: item.restaurantId, promoCode: null, discount: 0 });
        }

        const customKey = JSON.stringify(item.customizations);
        const existing = get().items.find(
          (i) => i.menuItemId === item.menuItemId && JSON.stringify(i.customizations) === customKey
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            ),
            restaurantId: item.restaurantId,
          });
        } else {
          set({
            items: [...get().items, {
              ...item,
              id: `${item.menuItemId}-${Date.now()}`,
              quantity: item.quantity || 1,
            }],
            restaurantId: item.restaurantId,
          });
        }
      },

      removeItem: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        set({
          items,
          restaurantId: items.length ? get().restaurantId : null,
          ...(items.length === 0 ? { promoCode: null, discount: 0 } : {}),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)) });
      },

      clearCart: () => set({ items: [], restaurantId: null, promoCode: null, discount: 0 }),

      setPromo: (code, discount = 0) => set({ promoCode: code, discount }),

      getSubtotal: () => get().items.reduce((s, i) => s + calcItemPrice(i), 0),

      getTotal: (deliveryFee = 0) => {
        const sub = get().getSubtotal();
        return Math.max(0, sub + deliveryFee - get().discount);
      },

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
