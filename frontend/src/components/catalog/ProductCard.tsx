'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, formatPriceUSD } from '@/lib/utils';
import type { Product } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { useCompare } from '@/lib/hooks/useCompare';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';
import { Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
    showCompare?: boolean;
}

export function ProductCard({ product, showCompare = true }: ProductCardProps) {
    const { t } = useI18n();
    const { isInCompare, toggleCompare } = useCompare();
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const isCompared = isInCompare(product.id);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem(product);
        setIsAdded(true);

        toast.success(t('cart.addedToCart', { name: product.name }), {
            description: formatPriceUSD(product.pricing.price_usd || 0),
            action: {
                label: t('common.undo'),
                onClick: () => removeItem(product.id)
            },
        });

        setTimeout(() => setIsAdded(false), 2000);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'in_stock': return t('product.inStock');
            case 'low_stock': return t('product.lowStock');
            case 'pre_order': return t('product.preOrder');
            case 'out_of_stock': return t('product.outOfStock');
            default: return status;
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-shadow duration-300 relative">
            <Link href={`/catalog/product/${product.slug}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {product.main_image ? (
                        <Image
                            src={product.main_image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}

                    {/* Featured badge */}
                    {product.is_featured && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                            Hit
                        </span>
                    )}

                    {/* Stock status */}
                    <span className={cn(
                        'absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded',
                        product.stock_status === 'in_stock' && 'bg-green-100 text-green-700',
                        product.stock_status === 'low_stock' && 'bg-yellow-100 text-yellow-700',
                        product.stock_status === 'pre_order' && 'bg-blue-100 text-blue-700',
                        product.stock_status === 'out_of_stock' && 'bg-red-100 text-red-700',
                    )}>
                        {getStatusLabel(product.stock_status)}
                    </span>
                </div>
            </Link>

            {/* Compare Toggle (visible on hover or if active) */}
            {showCompare && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(product);
                    }}
                    className={cn(
                        "absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-all duration-200",
                        isCompared
                            ? "bg-green-600 text-white opacity-100"
                            : "bg-white text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-green-50 hover:text-green-600"
                    )}
                    title={t('catalog.compare')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="M7 21h10" />
                        <path d="M12 3v18" />
                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                    </svg>
                </button>
            )}

            <CardContent className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>

                {/* Name */}
                <Link href={`/catalog/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* SKU */}
                <p className="text-xs text-gray-400 mb-3">{t('product.sku')}: {product.sku}</p>

                {/* Price */}
                <div className="mb-4">
                    {product.pricing.can_see_price ? (
                        <div>
                            <p className="text-xl font-bold text-green-600">
                                {formatPriceUSD(product.pricing.price_usd)}
                            </p>
                            {product.pricing.price_uzs && (
                                <p className="text-sm text-gray-500">
                                    ≈ {product.pricing.price_uzs.toLocaleString('ru-RU')} сум
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-lg font-medium text-gray-600">{t('product.requestPrice')}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {product.product_type === 'spare_part' ? (
                        <Button
                            className={cn(
                                "flex-1 transition-all duration-300",
                                isAdded ? "bg-green-700" : ""
                            )}
                            size="sm"
                            onClick={handleAddToCart}
                            disabled={isAdded}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-4 h-4 mr-1" />
                                    {t('common.added')}
                                </>
                            ) : (
                                t('product.addToCart')
                            )}
                        </Button>
                    ) : (
                        <Button className="flex-1" size="sm" variant="secondary">
                            {t('product.requestQuote')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card >
    );
}
