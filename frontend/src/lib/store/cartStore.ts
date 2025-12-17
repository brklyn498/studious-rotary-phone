import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../api';

export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clear: () => void;
    toggleOpen: (isOpen?: boolean) => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product, quantity = 1) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                            isOpen: true, // Auto-open cart on add
                        };
                    }
                    return {
                        items: [...state.items, { ...product, quantity }],
                        isOpen: true,
                    };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: state.items
                        .map((item) => (item.id === productId ? { ...item, quantity } : item))
                        .filter((item) => item.quantity > 0),
                })),
            clear: () => set({ items: [] }),
            toggleOpen: (isOpen) =>
                set((state) => ({ isOpen: isOpen !== undefined ? isOpen : !state.isOpen })),
            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => {
                    return total + (item.pricing.price_usd || 0) * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'uzagro-cart-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: false,
        }
    )
);
