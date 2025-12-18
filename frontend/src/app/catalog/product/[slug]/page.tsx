'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { catalogApi, type ProductDetail, type Product } from '@/lib/api';
import { formatPriceUSD, cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { ProductCard } from '@/components/catalog/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Loader2,
    Check,
    Truck,
    Shield,
    FileText,
    Share2,
    Heart,
    Phone,
    MessageCircle,
    Info,
    LayoutGrid,
    Scale,
    Maximize2
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'sonner';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { t } = useI18n();

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'documents'>('description');
    const { addItem, removeItem } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!product) return;

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

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            setLoading(true);
            setError(null);

            try {
                const productData = await catalogApi.getProduct(slug);
                setProduct(productData);

                try {
                    const relatedData = await catalogApi.getRelatedProducts(slug);
                    setRelatedProducts(relatedData);
                } catch (err) {
                    console.warn('Failed to fetch related products', err);
                    setRelatedProducts([]);
                }
            } catch (err: any) {
                console.error('Failed to fetch product:', err);
                setError(err.message === 'API Error: 404 Not Found'
                    ? t('catalog.noResults')
                    : t('common.error')
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, t]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
                <span className="text-gray-500 font-bold uppercase tracking-[0.2em]">{t('common.loading')}...</span>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center container px-4">
                <div className="glass p-10 rounded-[2rem] text-center border-white/5 max-w-md w-full">
                    <p className="text-red-400 font-bold mb-8 text-lg">{error || t('common.error')}</p>
                    <Link href="/catalog" className="w-full">
                        <Button variant="premium" className="w-full h-14 rounded-2xl">{t('common.back')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const allImages = product.main_image
        ? [{ id: 0, image: product.main_image, alt_text: product.name }, ...product.images]
        : product.images.length > 0
            ? product.images
            : [{ id: 0, image: '', alt_text: product.name }];

    return (
        <div className="min-h-screen pt-24 pb-20 overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Breadcrumb */}
                <nav className="flex items-center text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 mb-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2">
                    <Link href="/" className="hover:text-primary-500 transition-colors shrink-0">{t('common.home')}</Link>
                    <ChevronRight size={12} className="mx-2 opacity-50 shrink-0" />
                    <Link href="/catalog" className="hover:text-primary-500 transition-colors shrink-0">{t('catalog.title')}</Link>
                    <ChevronRight size={12} className="mx-2 opacity-50 shrink-0" />
                    <span className="text-white shrink-0 truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative aspect-video glass rounded-[2.5rem] overflow-hidden border-white/5 flex items-center justify-center p-8 group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImageIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-full h-full"
                                >
                                    {allImages[selectedImageIndex]?.image ? (
                                        <Image
                                            src={allImages[selectedImageIndex].image}
                                            alt={allImages[selectedImageIndex].alt_text || product.name}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary-500/10">
                                            <Maximize2 size={120} />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Badge */}
                            {product.is_featured && (
                                <div className="absolute top-8 left-8 z-30">
                                    <span className="bg-gradient-to-r from-secondary-500 to-accent-600 text-white text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase shadow-2xl shadow-secondary-500/20">
                                        {t('product.hit')}
                                    </span>
                                </div>
                            )}

                            {/* Fav & Share Quick Actions */}
                            <div className="absolute top-8 right-8 z-30 flex flex-col gap-3">
                                <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors border-white/5 shadow-xl backdrop-blur-3xl">
                                    <Heart size={18} />
                                </button>
                                <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors border-white/5 shadow-xl backdrop-blur-3xl">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {/* Navigation Overlay */}
                            {allImages.length > 1 && (
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                                        className="h-14 w-14 glass rounded-2xl flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 border-white/5 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                                        className="h-14 w-14 glass rounded-2xl flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 border-white/5 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar px-2"
                            >
                                {allImages.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            'relative w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden transition-all duration-300',
                                            selectedImageIndex === index
                                                ? 'ring-2 ring-primary-500 scale-105 shadow-lg shadow-primary-500/20 glass border-white/10'
                                                : 'glass border-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                                        )}
                                    >
                                        {img.image ? (
                                            <Image src={img.image} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <Maximize2 size={24} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 flex flex-col"
                    >
                        {/* Brand & Badge */}
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href={`/catalog?brand=${product.brand.slug}`}
                                className="glass px-4 py-2 rounded-xl text-primary-500 font-black text-[10px] tracking-[0.3em] uppercase border-white/5 hover:border-primary-500/30 transition-all"
                            >
                                {product.brand.name}
                            </Link>
                            <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                                {t('product.sku')}: <span className="text-gray-300">{product.sku}</span>
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                            {product.name}
                        </h1>

                        {/* Description */}
                        {product.short_description && (
                            <p className="text-gray-400 text-lg font-medium mb-8 leading-relaxed">
                                {product.short_description}
                            </p>
                        )}

                        {/* Status & Views */}
                        <div className="flex items-center gap-6 mb-10">
                            <span className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest',
                                product.stock_status === 'in_stock' && 'bg-primary-500/10 text-primary-500 border border-primary-500/20',
                                product.stock_status === 'low_stock' && 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                                product.stock_status === 'pre_order' && 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
                                product.stock_status === 'out_of_stock' && 'bg-red-500/10 text-red-500 border border-red-500/20',
                            )}>
                                {product.stock_status === 'in_stock' && <Check size={14} />}
                                {getStatusLabel(product.stock_status)}
                            </span>
                            {product.view_count > 0 && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        MODELS VIEWED: {product.view_count.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price Area */}
                        <div className="glass rounded-[2rem] p-8 border-white/5 mb-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700"></div>
                            {product.pricing.can_see_price ? (
                                <div className="relative z-10">
                                    <p className="text-4xl font-black text-gradient mb-2">
                                        {formatPriceUSD(product.pricing.price_usd)}
                                    </p>
                                    {product.pricing.price_uzs && (
                                        <p className="text-lg text-gray-500 font-bold tracking-tight">
                                            ≈ {product.pricing.price_uzs.toLocaleString('ru-RU')} UZS
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500">
                                        <Info />
                                    </div>
                                    <p className="text-xl font-black text-white tracking-widest uppercase">
                                        {t('product.requestPrice')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Primary Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {product.product_type === 'spare_part' ? (
                                <Button
                                    size="lg"
                                    className={cn("h-16 rounded-[1.25rem] text-sm uppercase tracking-widest font-black transition-all duration-500",
                                        isAdded ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "")}
                                    onClick={handleAddToCart}
                                    variant={isAdded ? "primary" : "premium"}
                                    disabled={isAdded}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="h-5 w-5 mr-3" />
                                            {t('common.added')}
                                        </>
                                    ) : (
                                        <>
                                            <LayoutGrid className="h-5 w-5 mr-3" />
                                            {t('product.addToCart')}
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button size="lg" variant="premium" className="h-16 rounded-[1.25rem] text-sm uppercase tracking-widest font-black">
                                    <MessageCircle className="h-5 w-5 mr-3" />
                                    {t('product.requestQuote')}
                                </Button>
                            )}
                            <Button size="lg" variant="outline" className="h-16 rounded-[1.25rem] glass border-white/5 text-white hover:bg-white/5 uppercase text-sm tracking-widest font-black">
                                <Phone className="h-5 w-5 mr-3" />
                                {t('product.call')}
                            </Button>
                        </div>

                        {/* Comparison Tooltip/Link (Mock) */}
                        <button className="flex items-center gap-3 text-gray-500 hover:text-primary-500 transition-colors px-2 mb-10 w-fit">
                            <Scale size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t('catalog.compare')}</span>
                        </button>

                        {/* Logistics info */}
                        <div className="glass rounded-[2rem] p-6 border-white/5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{t('product.deliveryInfo')}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                        {product.ships_from && `${t('product.shipsFrom')} ${product.ships_from}`}
                                        {product.estimated_delivery_days && ` • ${t('product.estimatedDays', { days: product.estimated_delivery_days })}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-500">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{t('footer.warranty')}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                        ORIGINAL MANUFACTURER WARRANTY • 24M
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section - Premium Glass Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        {['description', 'specs', 'documents'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    'px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 border',
                                    activeTab === tab
                                        ? 'bg-primary-500/10 border-primary-500/30 text-primary-500 shadow-lg shadow-primary-500/10'
                                        : 'glass border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                                )}
                            >
                                {t(`product.${tab}`)}
                            </button>
                        ))}
                    </div>

                    <div className="glass rounded-[3rem] p-10 border-white/5 min-h-[300px] shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/5 blur-[80px] rounded-full"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                {activeTab === 'description' && (
                                    <div
                                        className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed
                                          prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                                          prose-strong:text-white prose-a:text-primary-500 hover:prose-a:text-primary-400"
                                        dangerouslySetInnerHTML={{ __html: product.full_description || product.short_description || '' }}
                                    />
                                )}

                                {activeTab === 'specs' && (
                                    <div className="grid sm:grid-cols-2 gap-x-16 gap-y-0">
                                        {product.specifications_formatted.map((spec, index) => (
                                            <div
                                                key={spec.key}
                                                className="group flex flex-col py-6 border-b border-white/5 hover:border-primary-500/20 transition-colors"
                                            >
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-primary-500/70 transition-colors">{spec.label}</span>
                                                    <span className="text-lg font-black text-white tracking-tight">{spec.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {product.documents.length > 0 ? (
                                            product.documents.map((doc) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-6 p-6 glass rounded-3xl border-white/5 hover:border-primary-500/30 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                                                >
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-inner">
                                                        <FileText size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg tracking-tight mb-1 group-hover:text-primary-500 transition-colors">{doc.title}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{doc.doc_type} • PDF (1.2MB)</p>
                                                    </div>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-20 opacity-30">
                                                <FileText size={64} className="mx-auto mb-4" />
                                                <p className="font-bold uppercase tracking-widest">{t('product.noDocuments')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{t('product.relatedProducts')}</h2>
                            <Link href="/catalog" className="text-primary-500 text-xs font-black tracking-widest uppercase hover:underline">{t('common.viewAll')}</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((relatedProduct, i) => (
                                <motion.div
                                    key={relatedProduct.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <ProductCard product={relatedProduct} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
