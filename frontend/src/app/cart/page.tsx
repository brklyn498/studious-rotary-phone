'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatPriceUSD } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const { t } = useI18n();
    const { items, removeItem, updateQuantity, clear, getTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h1>
                <p className="text-gray-500 mb-8 max-w-md">{t('cart.emptyDescription')}</p>
                <Link href="/catalog">
                    <Button size="lg">{t('profile.goToCatalog')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center mb-8">
                    <Link href="/catalog" className="text-gray-500 hover:text-green-600 transition-colors mr-4">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{t('common.cart')} ({items.length})</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start sm:items-center">
                                    {/* Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.main_image ? (
                                            <Image src={item.main_image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                                            <div>
                                                <Link href={`/catalog/product/${item.slug}`} className="font-semibold text-gray-900 hover:text-green-600 line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-500">{t('product.sku')}: {item.sku}</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-bold text-gray-900">
                                                    {item.pricing.can_see_price
                                                        ? formatPriceUSD(item.pricing.price_usd || 0)
                                                        : t('product.requestPrice')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity */}
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title={t('common.clear')}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clear}>
                                {t('cart.clear')}
                            </Button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('cart.summary')}</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>{formatPriceUSD(getTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.tax')}</span>
                                    <span>-</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                                    <span>{t('cart.total')}</span>
                                    <span className="text-green-600">{formatPriceUSD(getTotal())}</span>
                                </div>
                            </div>

                            <Button className="w-full" size="lg">
                                {t('cart.checkout')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    {t('cart.secureCheckout')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
