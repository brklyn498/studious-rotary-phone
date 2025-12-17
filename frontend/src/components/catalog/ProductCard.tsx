import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, formatPriceUSD, getStockLabel, getStockColor } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface ProductCardProps {
    product: Product;
    showCompare?: boolean;
}

export function ProductCard({ product, showCompare = true }: ProductCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-shadow duration-300">
            <Link href={`/ru/catalog/product/${product.slug}`}>
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
                            Хит
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
                        {getStockLabel(product.stock_status)}
                    </span>
                </div>
            </Link>

            <CardContent className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>

                {/* Name */}
                <Link href={`/ru/catalog/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* SKU */}
                <p className="text-xs text-gray-400 mb-3">Артикул: {product.sku}</p>

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
                        <p className="text-lg font-medium text-gray-600">Запросить цену</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {product.product_type === 'spare_part' ? (
                        <Button className="flex-1" size="sm">
                            В корзину
                        </Button>
                    ) : (
                        <Button className="flex-1" size="sm" variant="secondary">
                            Запросить КП
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
