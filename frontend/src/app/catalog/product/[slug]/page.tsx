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
} from 'lucide-react';

// Mock product for fallback
const mockProduct: ProductDetail = {
    id: 1,
    sku: 'YTO-X1204',
    slug: 'yto-x1204-tractor',
    product_type: 'machinery',
    name: 'Трактор YTO X1204',
    short_description: 'Мощный колесный трактор 120 л.с. для всех видов сельскохозяйственных работ',
    full_description: `
    <h3>Описание</h3>
    <p>YTO X1204 — это мощный и надёжный колёсный трактор, предназначенный для выполнения самых разнообразных сельскохозяйственных работ. Двигатель мощностью 120 л.с. обеспечивает высокую производительность даже в сложных условиях.</p>
    
    <h3>Преимущества</h3>
    <ul>
      <li>Высокая проходимость благодаря полному приводу 4WD</li>
      <li>Комфортабельная кабина с кондиционером</li>
      <li>Современная гидравлическая система</li>
      <li>Экономичный расход топлива</li>
      <li>Простота обслуживания и доступность запчастей</li>
    </ul>
  `,
    main_image: undefined,
    category: { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы' },
    brand: { id: 1, slug: 'yto', name: 'YTO', country: 'Китай', is_verified: true },
    pricing: { show_to_guests: true, can_see_price: true, price_usd: 45000, price_uzs: 567000000 },
    stock_status: 'in_stock',
    is_featured: true,
    specifications: {
        engine_power: { value: 120, unit: 'л.с.' },
        engine_type: { value: 'Дизельный' },
        cylinders: { value: 4 },
        displacement: { value: 6.5, unit: 'л' },
        transmission: { value: '16/8 механическая' },
        max_speed: { value: 35, unit: 'км/ч' },
        lift_capacity: { value: 4500, unit: 'кг' },
        pto_speed: { value: '540/1000' },
        fuel_tank: { value: 200, unit: 'л' },
        weight: { value: 5200, unit: 'кг' },
    },
    specifications_formatted: [
        { key: 'engine_power', label: 'Мощность двигателя', value: '120 л.с.' },
        { key: 'engine_type', label: 'Тип двигателя', value: 'Дизельный' },
        { key: 'cylinders', label: 'Количество цилиндров', value: '4' },
        { key: 'displacement', label: 'Объём двигателя', value: '6.5 л' },
        { key: 'transmission', label: 'Трансмиссия', value: '16/8 механическая' },
        { key: 'max_speed', label: 'Максимальная скорость', value: '35 км/ч' },
        { key: 'lift_capacity', label: 'Грузоподъёмность', value: '4500 кг' },
        { key: 'pto_speed', label: 'Скорость ВОМ', value: '540/1000 об/мин' },
        { key: 'fuel_tank', label: 'Топливный бак', value: '200 л' },
        { key: 'weight', label: 'Масса', value: '5200 кг' },
    ],
    images: [],
    documents: [
        { id: 1, doc_type: 'brochure', title: 'Брошюра YTO X1204', file: '/docs/yto-x1204-brochure.pdf' },
        { id: 2, doc_type: 'manual', title: 'Руководство по эксплуатации', file: '/docs/yto-x1204-manual.pdf' },
    ],
    video_url: undefined,
    weight_kg: 5200,
    ships_from: 'Ташкент',
    estimated_delivery_days: 3,
    view_count: 1234,
};

const mockRelatedProducts: Product[] = [
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
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 35000, price_uzs: 441000000 },
        stock_status: 'in_stock',
        is_featured: false,
    },
    {
        id: 6,
        sku: 'YTO-X1604',
        slug: 'yto-x1604-tractor',
        product_type: 'machinery',
        name: 'Трактор YTO X1604',
        short_description: 'Мощный трактор 160 л.с.',
        main_image: undefined,
        category: { id: 1, slug: 'tractors', name: 'Тракторы', name_ru: 'Тракторы' },
        brand: { id: 1, slug: 'yto', name: 'YTO', country: 'Китай' },
        pricing: { show_to_guests: true, can_see_price: true, price_usd: 62000, price_uzs: 780000000 },
        stock_status: 'low_stock',
        is_featured: true,
    },
];

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
                const [productData, relatedData] = await Promise.all([
                    catalogApi.getProduct(slug).catch(() => mockProduct),
                    catalogApi.getRelatedProducts(slug).catch(() => mockRelatedProducts),
                ]);

                setProduct(productData);
                setRelatedProducts(relatedData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('Не удалось загрузить товар');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">{t('common.loading')}</span>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-red-600 mb-4">{error || t('common.error')}</p>
                <Link href="/catalog">
                    <Button>{t('common.back')}</Button>
                </Link>
            </div>
        );
    }

    const allImages = product.main_image
        ? [{ id: 0, image: product.main_image, alt_text: product.name }, ...product.images]
        : product.images.length > 0
            ? product.images
            : [{ id: 0, image: '', alt_text: product.name }];

    return (
        <div className="bg-gray-50 min-h-screen pb-8">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm text-gray-500 flex-wrap">
                        <Link href="/" className="hover:text-green-600">{t('common.home')}</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link href="/catalog" className="hover:text-green-600">{t('catalog.title')}</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-green-600">
                            {product.category.name}
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden border">
                            {allImages[selectedImageIndex]?.image ? (
                                <Image
                                    src={allImages[selectedImageIndex].image}
                                    alt={allImages[selectedImageIndex].alt_text || product.name}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                </div>
                            )}

                            {/* Navigation arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            {/* Featured badge */}
                            {product.is_featured && (
                                <span className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                                    {t('product.hit')}
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {allImages.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            'relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2',
                                            selectedImageIndex === index ? 'border-green-600' : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        {img.image ? (
                                            <Image src={img.image} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Brand & SKU */}
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href={`/catalog?brand=${product.brand.slug}`}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                {product.brand.name}
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">{t('product.sku')}: {product.sku}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-gray-600 mb-6">{product.short_description}</p>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className={cn(
                                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                                product.stock_status === 'in_stock' && 'bg-green-100 text-green-700',
                                product.stock_status === 'low_stock' && 'bg-yellow-100 text-yellow-700',
                                product.stock_status === 'pre_order' && 'bg-blue-100 text-blue-700',
                                product.stock_status === 'out_of_stock' && 'bg-red-100 text-red-700',
                            )}>
                                {product.stock_status === 'in_stock' && <Check className="h-4 w-4" />}
                                {getStatusLabel(product.stock_status)}
                            </span>
                            {product.view_count > 0 && (
                                <span className="text-sm text-gray-500">
                                    Views: {product.view_count.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="bg-gray-100 rounded-xl p-6 mb-6">
                            {product.pricing.can_see_price ? (
                                <div>
                                    <p className="text-3xl font-bold text-green-600">
                                        {formatPriceUSD(product.pricing.price_usd)}
                                    </p>
                                    {product.pricing.price_uzs && (
                                        <p className="text-lg text-gray-600 mt-1">
                                            ≈ {product.pricing.price_uzs.toLocaleString('ru-RU')} сум
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xl font-medium text-gray-700">
                                    {t('product.requestPrice')}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            {product.product_type === 'spare_part' ? (
                                <Button size="lg" className="flex-1">
                                    {t('product.addToCart')}
                                </Button>
                            ) : (
                                <Button size="lg" className="flex-1">
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    {t('product.requestQuote')}
                                </Button>
                            )}
                            <Button size="lg" variant="outline" className="flex-1">
                                <Phone className="h-5 w-5 mr-2" />
                                {t('product.call')}
                            </Button>
                        </div>

                        <div className="flex gap-2 mb-8">
                            <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-2" />
                                {t('product.addToFavorites')}
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                {t('product.share')}
                            </Button>
                        </div>

                        {/* Delivery Info */}
                        <div className="border rounded-xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{t('product.deliveryInfo')}</p>
                                    <p className="text-sm text-gray-600">
                                        {product.ships_from && `${t('product.shipsFrom')} ${product.ships_from}`}
                                        {product.estimated_delivery_days && ` • ${t('product.estimatedDays', { days: product.estimated_delivery_days })}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{t('footer.warranty')}</p>
                                    <p className="text-sm text-gray-600">Official manufacturer warranty</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                    {/* Tab Headers */}
                    <div className="border-b flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={cn(
                                'px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px',
                                activeTab === 'description'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            )}
                        >
                            {t('product.description')}
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={cn(
                                'px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px',
                                activeTab === 'specs'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            )}
                        >
                            {t('product.specifications')}
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={cn(
                                'px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px flex items-center gap-2',
                                activeTab === 'documents'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            )}
                        >
                            <FileText className="h-4 w-4" />
                            {t('product.documents')}
                            {product.documents.length > 0 && (
                                <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                    {product.documents.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: product.full_description || product.short_description || '' }}
                            />
                        )}

                        {activeTab === 'specs' && (
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                                {product.specifications_formatted.map((spec, index) => (
                                    <div
                                        key={spec.key}
                                        className={cn(
                                            'flex justify-between py-3',
                                            index < product.specifications_formatted.length - (product.specifications_formatted.length % 2 === 0 ? 2 : 1) && 'border-b'
                                        )}
                                    >
                                        <span className="text-gray-600">{spec.label}</span>
                                        <span className="font-medium text-gray-900">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-3">
                                {product.documents.length > 0 ? (
                                    product.documents.map((doc) => (
                                        <a
                                            key={doc.id}
                                            href={doc.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FileText className="h-8 w-8 text-red-500" />
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.title}</p>
                                                <p className="text-sm text-gray-500 capitalize">{doc.doc_type}</p>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">{t('product.noDocuments')}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('product.relatedProducts')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
