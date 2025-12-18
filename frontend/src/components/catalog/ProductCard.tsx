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
import { Check, ShoppingCart, Info, Scale } from 'lucide-react';
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
        <Card className="group glass border-white/5 hover:border-primary-500/30 transition-all duration-500 relative flex flex-col h-full overflow-hidden rounded-2xl">
            <Link href={`/catalog/product/${product.slug}`} className="flex-1">
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10"></div>
                    {product.main_image ? (
                        <Image
                            src={product.main_image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-500/20">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}

                    {/* Featured/Badge Labels */}
                    <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                        {product.is_featured && (
                            <span className="bg-gradient-to-r from-secondary-500 to-accent-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-tighter uppercase shadow-lg shadow-secondary-500/20">
                                HOT
                            </span>
                        )}
                        <span className={cn(
                            'text-[10px] font-bold px-2.5 py-1 rounded-md tracking-tighter uppercase backdrop-blur-md shadow-lg',
                            product.stock_status === 'in_stock' && 'bg-primary-500/80 text-white shadow-primary-500/20',
                            product.stock_status === 'low_stock' && 'bg-amber-500/80 text-white shadow-amber-500/20',
                            product.stock_status === 'pre_order' && 'bg-blue-500/80 text-white shadow-blue-500/20',
                            product.stock_status === 'out_of_stock' && 'bg-red-500/80 text-white shadow-red-500/20',
                        )}>
                            {getStatusLabel(product.stock_status)}
                        </span>
                    </div>

                    {/* Quick Access Overlay (Optional, can add icons here) */}
                </div>

                <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex-1">
                        {/* Brand & Type */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">
                                {product.brand.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                                SKU: {product.sku}
                            </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-base font-bold text-white mb-4 line-clamp-2 group-hover:text-primary-500 transition-colors tracking-tight">
                            {product.name}
                        </h3>

                        {/* Price Section */}
                        <div className="mt-auto">
                            {product.pricing.can_see_price ? (
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-gradient">
                                        {formatPriceUSD(product.pricing.price_usd)}
                                    </span>
                                    {product.pricing.price_uzs && (
                                        <span className="text-xs text-gray-500 font-medium mt-1">
                                            ≈ {product.pricing.price_uzs.toLocaleString('ru-RU')} UZS
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="py-1 px-3 glass border-white/5 inline-block rounded-lg">
                                    <span className="text-sm font-semibold text-gray-400">
                                        {t('product.requestPrice')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Link>

            {/* Compare Toggle */}
            {showCompare && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(product);
                    }}
                    className={cn(
                        "absolute top-3 right-3 z-30 p-2.5 rounded-xl shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/10",
                        isCompared
                            ? "bg-primary-500 text-white border-primary-400 opacity-100"
                            : "bg-black/40 text-gray-400 opacity-0 lg:group-hover:opacity-100 hover:text-white hover:bg-black/60"
                    )}
                    title={t('catalog.compare')}
                >
                    <Scale size={18} />
                </button>
            )}

            {/* Premium CTA Row */}
            <div className="px-5 pb-5 pt-2">
                {product.product_type === 'spare_part' ? (
                    <Button
                        className={cn(
                            "w-full transition-all duration-300 group/btn rounded-xl",
                            isAdded ? "bg-primary-600 text-white" : "bg-white/5 hover:bg-primary-500 text-white"
                        )}
                        size="md"
                        onClick={handleAddToCart}
                        disabled={isAdded}
                    >
                        {isAdded ? (
                            <>
                                <Check size={18} className="mr-2" />
                                {t('common.added')}
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                                {t('product.addToCart')}
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        className="w-full rounded-xl"
                        size="md"
                        variant="premium"
                        onClick={(e) => {
                            window.location.href = `/catalog/product/${product.slug}`;
                        }}
                    >
                        <Info size={18} className="mr-2" />
                        {t('catalog.viewDetails')}
                    </Button>
                )}
            </div>
        </Card >
    );
}
