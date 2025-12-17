'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';
import {
  Tractor,
  Wheat,
  Wrench,
  Truck,
  Shield,
  HeadphonesIcon,
  BadgeDollarSign,
  ChevronRight
} from 'lucide-react';

// Category icons mapping
const categoryIcons = {
  'tractor': Tractor,
  'wheat': Wheat,
  'wrench': Wrench,
};

const featuredProducts = [
  {
    id: 1,
    slug: 'yto-x1204-tractor',
    name: 'Трактор YTO X1204',
    brand: 'YTO',
    price: 45000,
    image: null,
    stock: 'in_stock',
  },
  {
    id: 2,
    slug: 'yto-x904-tractor',
    name: 'Трактор YTO X904',
    brand: 'YTO',
    price: 35000,
    image: null,
    stock: 'in_stock',
  },
  {
    id: 3,
    slug: 'foton-td904-tractor',
    name: 'Трактор Foton Lovol TD904',
    brand: 'Foton',
    price: 31000,
    image: null,
    stock: 'in_stock',
  },
  {
    id: 4,
    slug: 'rostselmash-161-combine',
    name: 'Комбайн РСМ 161',
    brand: 'Rostselmash',
    price: null,
    image: null,
    stock: 'pre_order',
  },
];

export default function HomePage() {
  const { t } = useI18n();

  const categories = [
    { slug: 'tractors', name: t('footer.tractors'), icon: 'tractor', count: 24 },
    { slug: 'harvesters', name: t('footer.harvesters'), icon: 'wheat', count: 12 },
    { slug: 'tillage', name: t('footer.implements'), icon: 'wrench', count: 18 },
    { slug: 'spare-parts', name: t('footer.spareParts'), icon: 'wrench', count: 156 },
  ];

  const whyUs = [
    {
      icon: Shield,
      title: t('home.whyUs.warranty.title'),
      description: t('home.whyUs.warranty.description'),
    },
    {
      icon: Truck,
      title: t('home.whyUs.delivery.title'),
      description: t('home.whyUs.delivery.description'),
    },
    {
      icon: HeadphonesIcon,
      title: t('home.whyUs.service.title'),
      description: t('home.whyUs.service.description'),
    },
    {
      icon: BadgeDollarSign,
      title: t('home.whyUs.experience.title'),
      description: t('home.whyUs.experience.description'),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('home.hero.cta')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contacts">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  {t('home.hero.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.categories')}
            </h2>
            <Link href="/catalog" className="text-green-600 hover:text-green-700 font-medium flex items-center">
              {t('common.viewAll')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Tractor;
              return (
                <Link key={category.slug} href={`/catalog`}>
                  <Card className="group hover:border-green-500 hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                        <IconComponent className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{t('catalog.found', { count: category.count })}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.featured')}
            </h2>
            <Link href="/catalog" className="text-green-600 hover:text-green-700 font-medium flex items-center">
              {t('common.viewAll')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/catalog/product/${product.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                    <Tractor className="w-16 h-16 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.price ? (
                      <p className="text-xl font-bold text-green-600">
                        ${product.price.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-gray-600">{t('product.requestPrice')}</p>
                    )}
                    <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${product.stock === 'in_stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {product.stock === 'in_stock' ? t('product.inStock') : t('product.preOrder')}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            {t('home.whyUs.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Нужна консультация специалиста?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Наши эксперты помогут подобрать оптимальное решение для вашего хозяйства
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+998711234567">
              <Button size="lg" variant="secondary">
                {t('product.call')}
              </Button>
            </a>
            <Link href="/contacts">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {t('home.hero.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
