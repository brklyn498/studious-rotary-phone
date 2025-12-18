'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { catalogApi, type Product, type Category, type Brand } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    SlidersHorizontal,
    Grid3X3,
    List,
    X,
    Loader2,
    Filter,
    ArrowUpDown,
    Check
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function CatalogPage() {
    const { t } = useI18n();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
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

    const [products, setProducts] = useState<Product[]>([]);

    const sortOptions = [
        { value: '-created_at', label: t('catalog.newest') },
        { value: 'base_price_usd', label: t('catalog.priceAsc') },
        { value: '-base_price_usd', label: t('catalog.priceDesc') },
        { value: 'name_ru', label: t('catalog.byName') },
    ];

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    catalogApi.getCategories().catch(err => []),
                    catalogApi.getBrands().catch(err => []),
                ]);

                if (categoriesResponse) {
                    const categoriesArray = Array.isArray(categoriesResponse)
                        ? categoriesResponse
                        : (categoriesResponse as any).results || [];
                    setCategories(categoriesArray);
                }

                if (brandsResponse) {
                    const brandsArray = Array.isArray(brandsResponse)
                        ? brandsResponse
                        : (brandsResponse as any).results || [];
                    setBrands(brandsArray);
                }

                const productsResponse = await catalogApi.getProducts({
                    page,
                    page_size: pageSize,
                    category: selectedCategory || undefined,
                    brand: selectedBrand || undefined,
                    ordering: sortBy,
                });

                if (productsResponse && productsResponse.results) {
                    setProducts(productsResponse.results);
                    setTotalCount(productsResponse.count);
                } else {
                    setProducts([]);
                    setTotalCount(0);
                }

            } catch (err) {
                console.error('Failed to fetch catalog data:', err);
                setError(t('common.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, selectedCategory, selectedBrand, sortBy, t]);

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setPage(1);
    };

    const hasActiveFilters = selectedCategory || selectedBrand;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Breadcrumb & Title */}
                <div className="mb-10">
                    <nav className="flex items-center text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-4">
                        <Link href="/" className="hover:text-primary-500 transition-colors">{t('common.home')}</Link>
                        <ChevronRight size={14} className="mx-2 opacity-50" />
                        <span className={cn(!selectedCategory ? "text-primary-500" : "text-gray-400")}>{t('catalog.title')}</span>
                        {selectedCategory && (
                            <>
                                <ChevronRight size={14} className="mx-2 opacity-50" />
                                <span className="text-primary-500">
                                    {categories.find(c => c.slug === selectedCategory)?.name}
                                </span>
                            </>
                        )}
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                {selectedCategory
                                    ? categories.find(c => c.slug === selectedCategory)?.name || t('catalog.title')
                                    : t('catalog.title')}
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium">
                                {t('catalog.found', { count: totalCount })} premium machines available
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center glass p-1 rounded-xl border-white/5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        viewMode === 'grid' ? "bg-primary-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        viewMode === 'list' ? "bg-primary-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Glass Style */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {/* Categories */}
                            <div className="glass rounded-[2rem] p-6 border-white/5">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-primary-500/10 rounded-lg">
                                        <Filter size={18} className="text-primary-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t('catalog.categories')}</h3>
                                </div>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group",
                                            !selectedCategory
                                                ? "bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span>{t('catalog.allCategories')}</span>
                                        {!selectedCategory && <Check size={14} />}
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => { setSelectedCategory(category.slug); setPage(1); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group",
                                                selectedCategory === category.slug
                                                    ? "bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span>{category.name}</span>
                                            {selectedCategory === category.slug ? (
                                                <Check size={14} />
                                            ) : (
                                                <span className="text-[10px] text-gray-600 font-bold group-hover:text-primary-500">{category.product_count}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            <div className="glass rounded-[2rem] p-6 border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 px-1">{t('catalog.brands')}</h3>
                                <div className="grid grid-cols-1 gap-1">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand.id}
                                            onClick={() => { setSelectedBrand(selectedBrand === brand.slug ? null : brand.slug); setPage(1); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between",
                                                selectedBrand === brand.slug
                                                    ? "bg-accent-500/10 text-accent-500 font-bold border border-accent-500/20"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span className="truncate">{brand.name}</span>
                                            {selectedBrand === brand.slug && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Upper Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="lg:hidden flex-1 glass border-white/10 text-white"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <SlidersHorizontal size={18} className="mr-2" />
                                    {t('catalog.filters')}
                                </Button>

                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                                        <ArrowUpDown size={14} />
                                    </div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 glass border-white/5 rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value} className="bg-background">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active Chips */}
                        <AnimatePresence>
                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap items-center gap-2 mb-8"
                                >
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">{t('catalog.activeFilters')}:</span>
                                    {selectedCategory && (
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="px-3 py-1.5 glass rounded-lg text-xs font-bold text-primary-500 border-primary-500/20 flex items-center gap-2 hover:bg-primary-500/10 transition-colors"
                                        >
                                            {categories.find(c => c.slug === selectedCategory)?.name}
                                            <X size={14} />
                                        </button>
                                    )}
                                    {selectedBrand && (
                                        <button
                                            onClick={() => setSelectedBrand(null)}
                                            className="px-3 py-1.5 glass rounded-lg text-xs font-bold text-accent-500 border-accent-500/20 flex items-center gap-2 hover:bg-accent-500/10 transition-colors"
                                        >
                                            {brands.find(b => b.slug === selectedBrand)?.name}
                                            <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-gray-400 hover:text-white transition-colors underline underline-offset-4 ml-2"
                                    >
                                        {t('catalog.resetFilters')}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Loading/Empty/Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 glass rounded-[2rem] border-white/5">
                                <Loader2 size={40} className="animate-spin text-primary-500 mb-4" />
                                <p className="text-gray-400 font-medium">{t('common.loading')}</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-32 glass rounded-[2rem] border-white/5">
                                <p className="text-red-400 font-bold mb-6">{error}</p>
                                <Button onClick={() => window.location.reload()} variant="premium">
                                    {t('common.error')} ({t('common.back')})
                                </Button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 glass rounded-[2rem] border-white/5">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                    <Filter size={32} />
                                </div>
                                <p className="text-white text-lg font-bold mb-6">{t('catalog.noResults')}</p>
                                <Button onClick={clearFilters} variant="outline">{t('catalog.resetFilters')}</Button>
                            </div>
                        ) : (
                            <>
                                <div className={cn(
                                    "grid gap-8",
                                    viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                                )}>
                                    {products.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-16 pb-12">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={page === 1}
                                            onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="rounded-xl glass border-white/10"
                                        >
                                            <ChevronRight className="rotate-180" size={18} />
                                        </Button>
                                        <div className="glass px-6 py-2 rounded-xl text-xs font-black text-white uppercase tracking-widest border-white/5">
                                            {t('catalog.page', { current: page, total: totalPages })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={page === totalPages}
                                            onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="rounded-xl glass border-white/10"
                                        >
                                            <ChevronRight size={18} />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setMobileFiltersOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 h-full w-full max-w-[20rem] bg-background border-l border-white/10 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-black text-white tracking-tighter uppercase">{t('catalog.filters')}</h2>
                                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-500 hover:text-white p-2">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                                <div>
                                    <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest mb-6">{t('catalog.categories')}</h3>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => { setSelectedCategory(null); setPage(1); }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all",
                                                !selectedCategory ? "bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20" : "text-gray-400"
                                            )}
                                        >
                                            {t('catalog.allCategories')}
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => { setSelectedCategory(category.slug); setPage(1); }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between",
                                                    selectedCategory === category.slug ? "bg-primary-500/10 text-primary-500 font-bold border border-primary-500/20" : "text-gray-400"
                                                )}
                                            >
                                                <span>{category.name}</span>
                                                <span className="text-[10px] opacity-40">{category.product_count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-black text-accent-500 uppercase tracking-widest mb-6">{t('catalog.brands')}</h3>
                                    <div className="grid grid-cols-1 gap-1">
                                        {brands.map((brand) => (
                                            <button
                                                key={brand.id}
                                                onClick={() => { setSelectedBrand(brand.slug); setPage(1); }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 rounded-xl text-sm transition-all",
                                                    selectedBrand === brand.slug ? "bg-accent-500/10 text-accent-500 font-bold border border-accent-500/20" : "text-gray-400"
                                                )}
                                            >
                                                {brand.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-background/80 backdrop-blur-md grid grid-cols-2 gap-4">
                                <Button variant="outline" className="rounded-xl glass border-white/10" onClick={clearFilters}>
                                    {t('catalog.resetFilters')}
                                </Button>
                                <Button className="rounded-xl" variant="premium" onClick={() => setMobileFiltersOpen(false)}>
                                    OK
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
