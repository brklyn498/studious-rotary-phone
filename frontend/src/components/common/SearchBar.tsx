'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Tractor, Tag, Building2 } from 'lucide-react';
import { catalogApi, type Product, type Category, type Brand } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

interface SearchResult {
    products: Product[];
    categories: Category[];
    brands: Brand[];
}

// Mock search results for demo
const mockSearchResults: SearchResult = {
    products: [
        {
            id: 1,
            sku: 'YTO-X1204',
            slug: 'yto-x1204-tractor',
            product_type: 'machinery',
            name: 'Трактор YTO X1204',
            short_description: 'Мощный колесный трактор 120 л.с.',
            main_image: undefined,
            category: { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы' },
            brand: { id: 1, slug: 'yto', name: 'YTO', country: 'Китай' },
            pricing: { show_to_guests: true, can_see_price: true, price_usd: 45000, price_uzs: 567000000 },
            stock_status: 'in_stock',
            is_featured: true,
        },
        {
            id: 2,
            sku: 'YTO-X904',
            slug: 'yto-x904-tractor',
            product_type: 'machinery',
            name: 'Трактор YTO X904',
            short_description: 'Универсальный трактор 90 л.с.',
            main_image: undefined,
            category: { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы' },
            brand: { id: 1, slug: 'yto', name: 'YTO', country: 'Китай' },
            pricing: { show_to_guests: true, can_see_price: true, price_usd: 35000, price_uzs: null },
            stock_status: 'in_stock',
            is_featured: false,
        },
    ],
    categories: [
        { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы', product_count: 24 },
    ],
    brands: [
        { id: 1, slug: 'yto', name: 'YTO', country: 'Китай', is_verified: true },
    ],
};

export function SearchBar() {
    const router = useRouter();
    const { t } = useI18n();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResult | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const searchResults = await catalogApi.search(query).catch(() => {
                    // Filter mock data based on query
                    const lowerQuery = query.toLowerCase();
                    return {
                        products: mockSearchResults.products.filter(p =>
                            p.name.toLowerCase().includes(lowerQuery) ||
                            p.sku.toLowerCase().includes(lowerQuery)
                        ),
                        categories: mockSearchResults.categories.filter(c =>
                            c.name.toLowerCase().includes(lowerQuery)
                        ),
                        brands: mockSearchResults.brands.filter(b =>
                            b.name.toLowerCase().includes(lowerQuery)
                        ),
                    };
                });
                setResults(searchResults);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Search error:', error);
                }
                setResults(null);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        } else if (e.key === 'Enter' && query.length >= 2) {
            router.push(`/catalog?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    }, [query, router]);

    const handleClear = () => {
        setQuery('');
        setResults(null);
        inputRef.current?.focus();
    };

    const hasResults = results && (
        results.products.length > 0 ||
        results.categories.length > 0 ||
        results.brands.length > 0
    );

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full h-10 pl-10 pr-10 glass border-white/5 rounded-xl text-white placeholder:text-gray-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                {/* Loading/Clear button */}
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <X className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto border-white/5 p-2 origin-top animate-in fade-in zoom-in-95 duration-200">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            {t('common.loading')}
                        </div>
                    ) : hasResults ? (
                        <div>
                            {/* Products */}
                            {results.products.length > 0 && (
                                <div className="p-2">
                                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                        {t('common.products')}
                                    </p>
                                    {results.products.slice(0, 5).map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/catalog/product/${product.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Tractor className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white truncate group-hover:text-primary-500 transition-colors">{product.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{product.brand.name} • {product.sku}</p>
                                            </div>
                                            {product.pricing.can_see_price && product.pricing.price_usd && (
                                                <p className="text-sm font-black text-gradient">
                                                    ${product.pricing.price_usd.toLocaleString()}
                                                </p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Categories */}
                            {results.categories.length > 0 && (
                                <div className="p-2 border-t border-white/5">
                                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                        {t('catalog.categories')}
                                    </p>
                                    {results.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/catalog?category=${category.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Tag className="h-5 w-5 text-primary-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary-500 transition-colors">{category.name}</p>
                                                {category.product_count && (
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{category.product_count} {t('common.products')}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Brands */}
                            {results.brands.length > 0 && (
                                <div className="p-2 border-t border-white/5">
                                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                        {t('catalog.brands')}
                                    </p>
                                    {results.brands.map((brand) => (
                                        <Link
                                            key={brand.id}
                                            href={`/catalog?brand=${brand.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Building2 className="h-5 w-5 text-accent-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary-500 transition-colors">{brand.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{brand.country}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* View all results */}
                            <div className="p-2 border-t">
                                <Link
                                    href={`/catalog?search=${encodeURIComponent(query)}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-3 py-2.5 text-center text-primary-500 hover:bg-primary-500/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    {t('common.showAllResults', { query })}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            {t('common.noSearchResults', { query })}
                        </div>
                    )
                    }
                </div >
            )}
        </div >
    );
}
