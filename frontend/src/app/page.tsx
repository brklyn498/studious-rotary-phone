'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import {
  Tractor,
  Wheat,
  Wrench,
  Truck,
  Shield,
  HeadphonesIcon,
  BadgeDollarSign,
  ChevronRight,
  ArrowRight,
  Star,
  Settings,
  CircleCheck
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
    { slug: 'tractors', name: t('footer.tractors'), icon: 'tractor', count: 24, size: 'large' },
    { slug: 'harvesters', name: t('footer.harvesters'), icon: 'wheat', count: 12, size: 'small' },
    { slug: 'tillage', name: t('footer.implements'), icon: 'wrench', count: 18, size: 'small' },
    { slug: 'spare-parts', name: t('footer.spareParts'), icon: 'wrench', count: 156, size: 'medium' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Immersive & Premium */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/5 text-primary-500 text-xs font-bold tracking-wider uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                {t('home.hero.subtitle').split(' ')[0]} 2025
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                <span className="text-white">{t('home.hero.title').split(' ').slice(0, 2).join(' ')}</span><br />
                <span className="text-gradient">{t('home.hero.title').split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/catalog">
                  <Button size="lg" variant="premium" className="group">
                    {t('home.hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contacts">
                  <Button size="lg" variant="outline">
                    {t('home.hero.contact')}
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">500+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{t('footer.tractors')}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">24/7</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{t('home.whyUs.service.title')}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">3-5</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{t('home.whyUs.delivery.title')}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square relative rounded-3xl overflow-hidden glass animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent z-10"></div>
                {/* Mock Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tractor size={200} className="text-primary-500/20" />
                </div>

                {/* Float Cards */}
                <div className="absolute top-10 right-10 glass p-4 rounded-2xl border-white/10 backdrop-blur-2xl z-20 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
                      <Star size={16} className="text-white" fill="white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Best Seller</div>
                      <div className="text-sm font-bold text-white">YTO X1204</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 glass p-4 rounded-2xl border-white/10 backdrop-blur-2xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <Settings size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Technology</div>
                      <div className="text-sm font-bold text-white">Smart Engine AI</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Categories - Modern Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              {t('home.categories')}
            </h2>
            <div className="flex justify-between items-end">
              <p className="text-gray-400 max-w-md">
                Browse our curated selection of high-performance agricultural solutions.
              </p>
              <Link href="/catalog" className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-400 font-medium transition-colors">
                {t('common.viewAll')}
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.icon as keyof typeof categoryIcons] || Tractor;
              return (
                <Link
                  key={cat.slug}
                  href="/catalog"
                  className={cn(
                    "group relative overflow-hidden rounded-3xl glass transition-all hover:border-primary-500/30",
                    cat.size === 'large' && "md:col-span-2 md:row-span-2",
                    cat.size === 'medium' && "md:col-span-2",
                    cat.size === 'small' && "md:col-span-1"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                  <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 bg-white/5 flex items-center justify-center opacity-20">
                    <Icon size={cat.size === 'large' ? 120 : 64} className="text-primary-500" />
                  </div>

                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="text-xs text-primary-500 font-bold tracking-[0.2em] uppercase mb-1">{cat.count} Units</div>
                    <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  </div>

                  <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                      <ArrowRight size={20} className="text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - High-Tech Cards */}
      <section className="py-24 bg-white/5 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                {t('home.featured')}
              </h2>
              <p className="text-gray-400">Excellence in every machine, verified for Uzbekistan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/catalog/product/${product.slug}`}>
                  <Card className="group glass border-white/5 hover:border-primary-500/20 overflow-hidden h-full rounded-2xl transition-all duration-300">
                    <div className="aspect-[4/3] relative bg-white/5 flex items-center justify-center overflow-hidden">
                      <Tractor className="w-16 h-16 text-primary-500 opacity-20 group-hover:scale-110 transition-transform" />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="text-[10px] font-bold text-white/50 bg-black/40 backdrop-blur-md px-2 py-1 rounded tracking-tighter uppercase">
                          {product.brand}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-6">
                        {product.price ? (
                          <div className="text-xl font-bold text-gradient">
                            ${product.price.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm font-medium">{t('product.requestPrice')}</div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-primary-500 font-bold bg-primary-500/10 px-2 py-1 rounded">
                          <CircleCheck size={12} />
                          {product.stock === 'in_stock' ? t('product.inStock') : t('product.preOrder')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA - Minimalist & Impactful */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary-900/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-500/20 blur-[150px] rounded-full rotate-12"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Looking for <span className="text-gradient">Custom Solutions?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Our experts will help you find the perfect machinery set for your farm's unique needs and local landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="tel:+998711234567" className="w-full sm:w-auto">
              <Button size="lg" variant="premium" className="w-full">
                {t('product.call')}
              </Button>
            </a>
            <Link href="/contacts" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                {t('home.hero.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
