import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/api';

interface CompareState {
    items: Product[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clear: () => void;
    toggleOpen: (isOpen?: boolean) => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product) => {
                const { items } = get();
                if (items.find((i) => i.id === product.id)) return;
                if (items.length >= 4) return; // Limit to 4 items
                set({ items: [...items, product], isOpen: true });
            },
            removeItem: (productId) => {
                set((state) => {
                    const newItems = state.items.filter((i) => i.id !== productId);
                    return { items: newItems, isOpen: newItems.length > 0 };
                });
            },
            clear: () => set({ items: [], isOpen: false }),
            toggleOpen: (isOpen) => set((state) => ({ isOpen: isOpen ?? !state.isOpen })),
        }),
        {
            name: 'uzagro-compare-storage',
        }
    )
);
