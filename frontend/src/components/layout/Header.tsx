'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/lib/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { t } = useI18n();
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navigation = [
        { name: t('common.home'), href: '/' },
        { name: t('common.catalog'), href: '/catalog' },
        { name: t('common.spareParts'), href: '/catalog?type=spare_part' },
        { name: t('common.services'), href: '/services' },
        { name: t('common.about'), href: '/about' },
        { name: t('common.contacts'), href: '/contacts' },
    ];

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism py-2' : 'bg-transparent py-4'
                }`}
        >
            {/* Top bar - Animated to prevent jumping */}
            <AnimatePresence>
                {!isScrolled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:block border-b border-white/5 overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs text-gray-400">
                            <div className="flex items-center gap-6">
                                <a href="tel:+998711234567" className="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
                                    <Phone className="h-3 w-3 text-primary-500" />
                                    +998 71 123 45 67
                                </a>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                                    <span>USD/UZS 12,450.00</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span>{t('common.workingHours')}</span>
                                <LanguageSwitcher showName={false} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-xl">U</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary-500 transition-colors">UzAgro</span>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold leading-none mt-1">Premium Machinery</p>
                        </div>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center gap-8 ml-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm text-gray-300 hover:text-primary-500 font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block w-64">
                            <SearchBar />
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/cart" className="p-2 text-gray-300 hover:text-primary-500 hover:bg-white/5 rounded-xl relative transition-all">
                                <ShoppingCart className="h-5 w-5" />
                                <AnimatePresence>
                                    {mounted && cartCount > 0 && (
                                        <motion.span
                                            key="cart-badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-primary-500/40"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            <Link href="/auth/login">
                                <Button variant="outline" size="sm" className="hidden md:flex rounded-xl border-white/10 hover:bg-white/5">
                                    <User className="h-4 w-4 mr-2" />
                                    {t('common.login')}
                                </Button>
                            </Link>

                            <button
                                className="lg:hidden p-2 text-gray-300 hover:bg-white/5 rounded-xl transition-all"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <div className="md:hidden">
                                <SearchBar />
                            </div>
                            <nav className="flex flex-col gap-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="py-3 px-4 rounded-xl text-gray-300 hover:text-primary-500 hover:bg-white/5 font-medium transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                                <Link href="/auth/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full justify-center rounded-xl bg-primary-500 hover:bg-primary-600">
                                        <User className="h-4 w-4 mr-2" />
                                        {t('common.login')}
                                    </Button>
                                </Link>
                                <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-500">
                                    <LanguageSwitcher showName={true} />
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        +998 71 123 45 67
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
