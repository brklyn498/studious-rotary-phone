'use client';

import { useCompare } from '@/lib/hooks/useCompare';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { X, Trash2, ArrowLeft, Layers, Scale, Zap } from 'lucide-react';
import { formatPriceUSD } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ComparePage() {
    const { t } = useI18n();
    const { items, removeItem, clear } = useCompare();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-primary-500 animate-pulse font-black uppercase tracking-[0.3em]">{t('common.loading')}</div>
        </div>
    );

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center"
                >
                    <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                        <Scale className="w-10 h-10 text-primary-500/50" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{t('catalog.comparison')}</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-12">{t('catalog.emptyComparison')}</p>
                    <Link href="/catalog">
                        <Button size="xl" variant="premium">
                            {t('profile.goToCatalog')}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const allSpecKeys = Array.from(
        new Set(
            items.flatMap((item) =>
                item.specifications ? Object.keys(item.specifications) : []
            )
        )
    );

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-24">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent-500/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16"
                >
                    <div className="flex items-center gap-6">
                        <Link href="/catalog">
                            <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-primary-500/50 transition-all group">
                                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Scale className="w-4 h-4 text-primary-500" />
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Comparison Engine</span>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t('catalog.comparison')}</h1>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="h-14 px-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
                        onClick={clear}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('common.clear')}
                    </Button>
                </motion.div>

                <div className="glass border-white/5 rounded-[3rem] overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[800px] border-collapse bg-transparent">
                            <thead>
                                <tr>
                                    <th className="p-8 text-left w-64 bg-white/[0.02] backdrop-blur-xl sticky left-0 z-20 border-r border-white/5">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selected</div>
                                            <div className="text-2xl font-black text-white uppercase tracking-tighter">{items.length} Units</div>
                                        </div>
                                    </th>
                                    {items.map((item, idx) => (
                                        <th key={item.id} className="p-8 min-w-[300px] align-top relative group border-r border-white/5 last:border-r-0">
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </motion.button>

                                            <div className="mb-6 relative aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden border border-white/5 group-hover:border-primary-500/30 transition-colors">
                                                {item.main_image ? (
                                                    <Image src={item.main_image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-black uppercase tracking-widest text-xs">No Signal</div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent opacity-60" />
                                            </div>

                                            <Link href={`/catalog/product/${item.slug}`} className="block group/link mb-4">
                                                <h3 className="font-black text-white uppercase tracking-tight text-xl leading-none group-hover/link:text-primary-500 transition-colors">{item.name}</h3>
                                            </Link>

                                            <div className="text-3xl font-black text-white tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                                                {item.pricing.can_see_price
                                                    ? formatPriceUSD(item.pricing.price_usd)
                                                    : <div className="text-xs font-black text-primary-500 uppercase tracking-widest">{t('product.requestPrice')}</div>
                                                }
                                            </div>

                                            <Button
                                                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                                variant={item.product_type === 'spare_part' ? 'primary' : 'premium'}
                                            >
                                                {item.product_type === 'spare_part' ? t('product.addToCart') : t('product.requestQuote')}
                                            </Button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <ComparisonRow label={t('product.brand')} items={items} getValue={(item) => item.brand.name} />
                                <ComparisonRow label={t('product.sku')} items={items} getValue={(item) => (
                                    <span className="font-mono text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">{item.sku}</span>
                                )} />

                                {allSpecKeys.map((key) => (
                                    <ComparisonRow
                                        key={key}
                                        label={key.replace(/_/g, ' ')}
                                        items={items}
                                        getValue={(item) => {
                                            const spec = item.specifications?.[key];
                                            return spec ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-white font-black text-lg">{spec.value}</span>
                                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{spec.unit}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-700 font-black">N/A</span>
                                            );
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ label, items, getValue }: { label: string, items: any[], getValue: (item: any) => React.ReactNode }) {
    return (
        <tr className="group hover:bg-white/[0.01] transition-colors">
            <th className="p-8 text-left text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.02] backdrop-blur-xl sticky left-0 z-10 border-r border-white/5 group-hover:text-primary-500 transition-colors">
                {label}
            </th>
            {items.map((item) => (
                <td key={item.id} className="p-8 text-center border-r border-white/5 last:border-r-0">
                    {getValue(item)}
                </td>
            ))}
        </tr>
    );
}
