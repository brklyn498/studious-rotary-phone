'use client';

import { useCompare } from '@/lib/hooks/useCompare';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { X, Trash2, ArrowLeft } from 'lucide-react';
import { formatPriceUSD } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ComparePage() {
    const { t } = useI18n();
    const { items, removeItem, clear } = useCompare();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="container mx-auto px-4 py-8">{t('common.loading')}</div>;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">{t('catalog.comparison')}</h1>
                <p className="text-gray-500 mb-8">{t('catalog.emptyComparison')}</p>
                <Link href="/catalog">
                    <Button>{t('profile.goToCatalog')}</Button>
                </Link>
            </div>
        );
    }

    // Collect all unique spec keys from all products
    const allSpecKeys = Array.from(
        new Set(
            items.flatMap((item) =>
                item.specifications ? Object.keys(item.specifications) : []
            )
        )
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/catalog" className="text-gray-500 hover:text-green-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">{t('catalog.comparison')}</h1>
                </div>
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('common.clear')}
                </Button>
            </div>

            <div className="overflow-x-auto pb-6">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left w-48 bg-gray-50/50 sticky left-0 z-10 border-b border-gray-100">
                                {/* Header label empty */}
                            </th>
                            {items.map((item) => (
                                <th key={item.id} className="p-4 w-64 align-top border-b border-gray-100 relative group">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="mb-4 relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                                        {item.main_image ? (
                                            <Image src={item.main_image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                    </div>

                                    <Link href={`/catalog/product/${item.slug}`} className="hover:text-green-600 transition-colors">
                                        <h3 className="font-semibold text-lg leading-tight mb-2">{item.name}</h3>
                                    </Link>

                                    <div className="text-xl font-bold text-green-600 mb-4">
                                        {item.pricing.can_see_price
                                            ? formatPriceUSD(item.pricing.price_usd)
                                            : <span className="text-sm font-medium text-gray-500">{t('product.requestPrice')}</span>
                                        }
                                    </div>

                                    <Button className="w-full" size="sm" variant={item.product_type === 'spare_part' ? 'primary' : 'secondary'}>
                                        {item.product_type === 'spare_part' ? t('product.addToCart') : t('product.requestQuote')}
                                    </Button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Brand Row */}
                        <tr>
                            <th className="p-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50 sticky left-0">{t('product.brand')}</th>
                            {items.map((item) => (
                                <td key={item.id} className="p-4 text-center">{item.brand.name}</td>
                            ))}
                        </tr>

                        {/* SKUs */}
                        <tr>
                            <th className="p-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50 sticky left-0">{t('product.sku')}</th>
                            {items.map((item) => (
                                <td key={item.id} className="p-4 text-center text-gray-600 font-mono text-sm">{item.sku}</td>
                            ))}
                        </tr>

                        {/* Dynamic Specs */}
                        {allSpecKeys.map((key) => (
                            <tr key={key}>
                                <th className="p-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50 sticky left-0 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </th>
                                {items.map((item) => {
                                    const spec = item.specifications?.[key];
                                    return (
                                        <td key={item.id} className="p-4 text-center">
                                            {spec ? (
                                                <span>
                                                    {spec.value} <span className="text-gray-400 text-xs">{spec.unit}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
