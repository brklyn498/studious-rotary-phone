'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { catalogApi, type Product, type Category, type Brand } from '@/lib/api';
import {
    ChevronRight,
    SlidersHorizontal,
    Grid3X3,
    List,
    X,
    Loader2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// Mock data for SSR fallback
const mockCategories: Category[] = [
    { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы', product_count: 24 },
    { id: 2, slug: 'harvesters', name: 'Комбайны', name_ru: 'Комбайны', product_count: 12 },
    { id: 3, slug: 'tillage', name: 'Почвообработка', name_ru: 'Почвообработка', product_count: 18 },
    { id: 4, slug: 'sowing', name: 'Посевная техника', name_ru: 'Посевная техника', product_count: 15 },
    { id: 5, slug: 'spare-parts', name: 'Запчасти', name_ru: 'Запчасти', product_count: 156 },
];

const mockBrands: Brand[] = [
    { id: 1, slug: 'yto', name: 'YTO', country: 'Китай', is_verified: true },
    { id: 2, slug: 'rostselmash', name: 'Rostselmash', country: 'Россия', is_verified: true },
    { id: 3, slug: 'foton', name: 'Foton Lovol', country: 'Китай', is_verified: true },
    { id: 4, slug: 'kuhn', name: 'KUHN', country: 'Франция', is_verified: true },
    { id: 5, slug: 'amazone', name: 'AMAZONE', country: 'Германия', is_verified: true },
];

const mockProducts: Product[] = [
    {
        id: 1,
        sku: 'YTO-X1204',
        slug: 'yto-x1204-tractor',
        product_type: 'machinery',
        name: 'Трактор YTO X1204',
        short_description: 'Мощный колесный трактор 120 л.с.',
        main_image: undefined,
        category: mockCategories[0],
        brand: mockBrands[0],
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
        category: mockCategories[0],
        brand: mockBrands[0],
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 35000, price_uzs: 441000000 },
        stock_status: 'in_stock',
        is_featured: false,
    },
    {
        id: 3,
        sku: 'FOTON-TD904',
        slug: 'foton-td904-tractor',
        product_type: 'machinery',
        name: 'Трактор Foton Lovol TD904',
        short_description: 'Надежный трактор для любых задач',
        main_image: undefined,
        category: mockCategories[0],
        brand: mockBrands[2],
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 31000, price_uzs: 390000000 },
        stock_status: 'in_stock',
        is_featured: false,
    },
    {
        id: 4,
        sku: 'RSM-161',
        slug: 'rostselmash-161-combine',
        product_type: 'machinery',
        name: 'Комбайн зерноуборочный РСМ 161',
        short_description: 'Высокопроизводительный зерноуборочный комбайн',
        main_image: undefined,
        category: mockCategories[1],
        brand: mockBrands[1],
        pricing: { show_to_guests: false, can_see_price: false, price_usd: null, price_uzs: null },
        stock_status: 'pre_order',
        is_featured: true,
    },
    {
        id: 5,
        sku: 'KUHN-DISC',
        slug: 'kuhn-disc-harrow',
        product_type: 'machinery',
        name: 'Дисковая борона KUHN Discover',
        short_description: 'Профессиональная дисковая борона',
        main_image: undefined,
        category: mockCategories[2],
        brand: mockBrands[3],
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 18000, price_uzs: 227000000 },
        stock_status: 'in_stock',
        is_featured: false,
    },
    {
        id: 6,
        sku: 'YTO-X1604',
        slug: 'yto-x1604-tractor',
        product_type: 'machinery',
        name: 'Трактор YTO X1604',
        short_description: 'Мощный трактор 160 л.с. для тяжелых работ',
        main_image: undefined,
        category: mockCategories[0],
        brand: mockBrands[0],
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 62000, price_uzs: 780000000 },
        stock_status: 'low_stock',
        is_featured: true,
    },
];

export default function CatalogPage() {
    const { t } = useI18n();
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const sortOptions = [
        { value: '-created_at', label: t('catalog.newest') },
        { value: 'base_price_usd', label: t('catalog.priceAsc') },
        { value: '-base_price_usd', label: t('catalog.priceDesc') },
        { value: 'name_ru', label: t('catalog.byName') },
    ];
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [brands, setBrands] = useState<Brand[]>(mockBrands);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('-created_at');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 12;

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch categories and brands in parallel
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    catalogApi.getCategories().catch(() => null),
                    catalogApi.getBrands().catch(() => null),
                ]);

                // Handle categories - could be array or paginated response
                if (categoriesResponse) {
                    const categoriesArray = Array.isArray(categoriesResponse)
                        ? categoriesResponse
                        : (categoriesResponse as any).results || mockCategories;
                    setCategories(categoriesArray);
                } else {
                    setCategories(mockCategories);
                }

                // Handle brands - could be array or paginated response
                if (brandsResponse) {
                    const brandsArray = Array.isArray(brandsResponse)
                        ? brandsResponse
                        : (brandsResponse as any).results || mockBrands;
                    setBrands(brandsArray);
                } else {
                    setBrands(mockBrands);
                }

                // Fetch products with filters
                const productsResponse = await catalogApi.getProducts({
                    page,
                    page_size: pageSize,
                    category: selectedCategory || undefined,
                    brand: selectedBrand || undefined,
                    ordering: sortBy,
                }).catch(() => null);

                if (productsResponse && productsResponse.results) {
                    setProducts(productsResponse.results);
                    setTotalCount(productsResponse.count);
                } else {
                    setProducts(mockProducts);
                    setTotalCount(mockProducts.length);
                }

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch catalog data:', err);
                // Use mock data on error
                setCategories(mockCategories);
                setBrands(mockBrands);
                setProducts(mockProducts);
                setTotalCount(mockProducts.length);
                setLoading(false);
            }
        };

        fetchData();
    }, [page, selectedCategory, selectedBrand, sortBy]);

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setPage(1);
    };

    const hasActiveFilters = selectedCategory || selectedBrand;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-green-600">{t('common.home')}</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900 font-medium">{t('catalog.title')}</span>
                        {selectedCategory && (
                            <>
                                <ChevronRight className="h-4 w-4 mx-2" />
                                <span className="text-gray-900 font-medium">
                                    {categories.find(c => c.slug === selectedCategory)?.name}
                                </span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Categories Filter */}
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">{t('catalog.categories')}</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className={`w-full text-left px-2 py-1.5 rounded text-sm ${!selectedCategory
                                                    ? 'bg-green-100 text-green-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {t('catalog.allCategories')}
                                            </button>
                                        </li>
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <button
                                                    onClick={() => { setSelectedCategory(category.slug); setPage(1); }}
                                                    className={`w-full text-left px-2 py-1.5 rounded text-sm flex justify-between items-center ${selectedCategory === category.slug
                                                        ? 'bg-green-100 text-green-700 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span>{category.name}</span>
                                                    {category.product_count && (
                                                        <span className="text-xs text-gray-400">{category.product_count}</span>
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Brands Filter */}
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">{t('catalog.brands')}</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => setSelectedBrand(null)}
                                                className={`w-full text-left px-2 py-1.5 rounded text-sm ${!selectedBrand
                                                    ? 'bg-green-100 text-green-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {t('catalog.allBrands')}
                                            </button>
                                        </li>
                                        {brands.map((brand) => (
                                            <li key={brand.id}>
                                                <button
                                                    onClick={() => { setSelectedBrand(brand.slug); setPage(1); }}
                                                    className={`w-full text-left px-2 py-1.5 rounded text-sm ${selectedBrand === brand.slug
                                                        ? 'bg-green-100 text-green-700 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {brand.name}
                                                    <span className="text-xs text-gray-400 ml-1">({brand.country})</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header & Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {selectedCategory
                                        ? categories.find(c => c.slug === selectedCategory)?.name || t('catalog.title')
                                        : t('catalog.title')}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('catalog.found', { count: totalCount })}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Mobile filter button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden flex-1 sm:flex-none"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    {t('catalog.filters')}
                                    {hasActiveFilters && (
                                        <span className="ml-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {(selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0)}
                                        </span>
                                    )}
                                </Button>

                                {/* Sort dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-9 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {/* View mode toggle - Desktop */}
                                <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-sm text-gray-500">{t('catalog.activeFilters')}:</span>
                                {selectedCategory && (
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200"
                                    >
                                        {categories.find(c => c.slug === selectedCategory)?.name}
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                                {selectedBrand && (
                                    <button
                                        onClick={() => setSelectedBrand(null)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200"
                                    >
                                        {brands.find(b => b.slug === selectedBrand)?.name}
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    {t('catalog.resetFilters')}
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                                <span className="ml-3 text-gray-600">{t('common.loading')}</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-20">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()}>
                                    {t('common.error')} ({t('common.back')})
                                </Button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && !error && (
                            <>
                                {products.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-gray-600 mb-4">{t('catalog.noResults')}</p>
                                        <Button onClick={clearFilters}>{t('catalog.resetFilters')}</Button>
                                    </div>
                                ) : (
                                    <div className={`grid gap-6 ${viewMode === 'grid'
                                        ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                                        : 'grid-cols-1'
                                        }`}>
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            {t('catalog.prev')}
                                        </Button>
                                        <span className="px-4 py-2 text-sm text-gray-600">
                                            {t('catalog.page', { current: page, total: totalPages })}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            {t('catalog.next')}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{t('catalog.filters')}</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">{t('catalog.categories')}</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => { setSelectedCategory(null); setPage(1); }}
                                            className={`w-full text-left px-3 py-2 rounded ${!selectedCategory ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                                }`}
                                        >
                                            {t('catalog.allCategories')}
                                        </button>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => { setSelectedCategory(category.slug); setPage(1); }}
                                                className={`w-full text-left px-3 py-2 rounded flex justify-between ${selectedCategory === category.slug ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                                    }`}
                                            >
                                                <span>{category.name}</span>
                                                {category.product_count && (
                                                    <span className="text-gray-400">{category.product_count}</span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Brands */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">{t('catalog.brands')}</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => { setSelectedBrand(null); setPage(1); }}
                                            className={`w-full text-left px-3 py-2 rounded ${!selectedBrand ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                                }`}
                                        >
                                            {t('catalog.allBrands')}
                                        </button>
                                    </li>
                                    {brands.map((brand) => (
                                        <li key={brand.id}>
                                            <button
                                                onClick={() => { setSelectedBrand(brand.slug); setPage(1); }}
                                                className={`w-full text-left px-3 py-2 rounded ${selectedBrand === brand.slug ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                                    }`}
                                            >
                                                {brand.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={clearFilters}>
                                {t('catalog.resetFilters')}
                            </Button>
                            <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                                {t('common.viewAll')} ({totalCount})
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
