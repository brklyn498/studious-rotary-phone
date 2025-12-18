'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatPriceUSD } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const { t } = useI18n();
    const { items, removeItem, updateQuantity, clear, getTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-gray-600 border border-white/5 relative"
                >
                    <ShoppingBag className="w-10 h-10" />
                    <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full" />
                </motion.div>
                <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{t('cart.empty')}</h1>
                <p className="text-gray-500 mb-12 max-w-md font-medium">{t('cart.emptyDescription')}</p>
                <Link href="/catalog">
                    <Button variant="premium" size="xl" className="px-12 rounded-2xl">
                        {t('profile.goToCatalog')}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-24">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap items-center gap-6 mb-12"
                >
                    <Link href="/catalog">
                        <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-white/10 text-gray-400 hover:text-white group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        {t('common.cart')} <span className="text-primary-500">[{items.length}]</span>
                    </h1>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Cart Items */}
                    <div className="flex-1 w-full space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass border-white/5 group hover:border-white/10 transition-all duration-500 rounded-[2rem] overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                                        {/* Image */}
                                        <div className="relative w-full sm:w-32 h-40 sm:h-32 bg-white/5 rounded-2xl flex-shrink-0 overflow-hidden border border-white/5">
                                            {item.main_image ? (
                                                <Image src={item.main_image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-700">
                                                    <ShoppingBag className="w-10 h-10" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="space-y-1">
                                                    <Link href={`/catalog/product/${item.slug}`} className="text-lg font-black text-white hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        {t('product.sku')}: {item.sku}
                                                    </p>
                                                </div>
                                                <div className="text-left md:text-right">
                                                    <p className="text-xl font-black text-white">
                                                        {item.pricing.can_see_price
                                                            ? formatPriceUSD(item.pricing.price_usd || 0)
                                                            : t('product.requestPrice')}
                                                    </p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        {t('common.pricePerUnit')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
                                                {/* Quantity Control */}
                                                <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-black text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{t('cart.itemTotal')}</p>
                                                        <p className="text-lg font-black text-primary-500">
                                                            {item.pricing.can_see_price
                                                                ? formatPriceUSD((item.pricing.price_usd || 0) * item.quantity)
                                                                : '---'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                        title={t('common.clear')}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center py-4">
                            <Button variant="ghost" className="text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]" onClick={clear}>
                                {t('cart.clear')}
                            </Button>
                            <Link href="/catalog" className="text-gray-400 hover:text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                ← {t('cart.continueShopping')}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-96 w-full flex-shrink-0 sticky top-28"
                    >
                        <Card className="glass border-white/5 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">{t('cart.summary')}</h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t('cart.subtotal')}</span>
                                        <span className="text-lg font-bold text-white">{formatPriceUSD(getTotal())}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t('cart.tax')}</span>
                                            <span className="text-[10px] font-bold text-gray-600 uppercase">VAT/NDS 0%</span>
                                        </div>
                                        <span className="text-white">---</span>
                                    </div>
                                    <div className="pt-6 flex justify-between items-end">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 block mb-1">{t('cart.total')}</span>
                                            <span className="text-3xl font-black text-white tracking-tighter leading-none">{formatPriceUSD(getTotal())}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button size="xl" className="w-full h-16 rounded-2xl group relative overflow-hidden variant-premium" variant="premium">
                                    <span className="relative z-10 font-black uppercase tracking-widest">{t('cart.checkout')}</span>
                                    <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <ShieldCheck className="w-4 h-4 text-primary-500/50" />
                                    {t('cart.secureCheckout')}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional info */}
                        <div className="mt-6 glass p-6 rounded-[2rem] border-white/5 flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-5 h-5 text-primary-500" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-wider">
                                Бесплатная доставка при заказе <br />
                                крупной техники через лизинг*
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
