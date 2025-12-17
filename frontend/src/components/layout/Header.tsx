'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navigation = [
    { name: 'Главная', href: '/ru' },
    { name: 'Каталог', href: '/ru/catalog' },
    { name: 'Запчасти', href: '/ru/catalog?type=spare_part' },
    { name: 'Услуги', href: '/ru/services' },
    { name: 'О компании', href: '/ru/about' },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                        <span>Пн-Пт: 9:00 - 18:00</span>
                        <span className="text-green-300">|</span>
                        <span>RU</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/ru" className="flex items-center gap-2">
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
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Поиск техники и запчастей..."
                                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
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
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <User className="h-4 w-4 mr-2" />
                            Войти
                        </Button>
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
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Поиск..."
                                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <nav className="px-4 pb-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 text-gray-700 hover:text-green-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        <Link href="/ru/auth/login" className="block py-2 text-green-600 font-medium">
                            Войти
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
