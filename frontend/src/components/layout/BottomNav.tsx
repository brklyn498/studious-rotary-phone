'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export function BottomNav() {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems = [
        { href: '/', icon: Home, label: t('common.home') },
        { href: '/catalog', icon: Grid3X3, label: t('common.catalog') },
        { href: '/cart', icon: ShoppingCart, label: t('common.cart'), badge: true },
        { href: '/profile', icon: User, label: t('common.profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-morphism md:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full relative',
                                'text-gray-500 transition-all duration-300',
                                isActive && 'text-primary-500 font-bold scale-110'
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                            {item.badge && (
                                <span className="absolute top-2 right-1/4 bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg shadow-primary-500/40">
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
