import { useCompareStore } from '@/lib/store/compareStore';
import type { Product } from '@/lib/api';

export function useCompare() {
    const { items, isOpen, addItem, removeItem, clear, toggleOpen } = useCompareStore();

    const isInCompare = (productId: number) => {
        return items.some((item) => item.id === productId);
    };

    const toggleCompare = (product: Product) => {
        if (isInCompare(product.id)) {
            removeItem(product.id);
        } else {
            addItem(product);
        }
    };

    return {
        items,
        isOpen,
        addItem,
        removeItem,
        clear,
        toggleOpen,
        isInCompare,
        toggleCompare,
    };
}
