'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useI18n } from '@/lib/i18n';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useI18n();

    const navigation = [
        { name: t('common.home'), href: '/' },
        { name: t('common.catalog'), href: '/catalog' },
        { name: t('common.spareParts'), href: '/catalog?type=spare_part' },
        { name: t('common.services'), href: '/services' },
        { name: t('common.about'), href: '/about' },
        { name: t('common.contacts'), href: '/contacts' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Top bar */}
            <div className="bg-green-800 text-white text-sm py-2">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+998711234567" className="flex items-center gap-1 hover:text-green-200">
                            <Phone className="h-4 w-4" />
                            +998 71 123 45 67
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span>{t('common.workingHours')}</span>
                        <span className="text-green-300">|</span>
                        <LanguageSwitcher className="ml-2" showName={false} />
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">У</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-green-800">УзАгро</span>
                            <p className="text-xs text-gray-500">Сельхозтехника</p>
                        </div>
                    </Link>

                    {/* Search bar - desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <SearchBar />
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button className="hidden md:flex p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg">
                            <ShoppingCart className="h-6 w-6" />
                        </button>
                        <Link href="/auth/login">
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                <User className="h-4 w-4 mr-2" />
                                {t('common.login')}
                            </Button>
                        </Link>
                        <button
                            className="lg:hidden p-2 text-gray-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t">
                    <div className="px-4 py-3">
                        <SearchBar />
                    </div>
                    <nav className="px-4 pb-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2 text-gray-700 hover:text-green-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        <Link href="/auth/login" className="block py-2 text-green-600 font-medium">
                            {t('common.login')}
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
