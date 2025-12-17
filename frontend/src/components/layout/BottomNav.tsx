'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/ru', icon: Home, label: 'Главная' },
    { href: '/ru/catalog', icon: Grid3X3, label: 'Каталог' },
    { href: '/ru/cart', icon: ShoppingCart, label: 'Корзина', badge: true },
    { href: '/ru/cabinet', icon: User, label: 'Профиль' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/ru' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full relative',
                                'text-gray-500 transition-colors',
                                isActive && 'text-green-600'
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                            {item.badge && (
                                <span className="absolute top-2 right-1/4 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    0
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
