'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '@/lib/hooks/useCompare';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function CompareBar() {
    const { t } = useI18n();
    const { items, isOpen, removeItem, clear, toggleOpen } = useCompare();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <div className={cn(
            "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl glass rounded-2xl shadow-2xl border-white/10 transition-all duration-500 transform",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0 pointer-events-none"
        )}>
            {/* Header / Mobile Toggle Handle */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:hidden">
                <button
                    onClick={() => toggleOpen(false)}
                    className="glass rounded-t-xl px-4 py-1.5 border-b-0 border-white/10 text-[10px] font-black uppercase tracking-widest text-primary-500"
                >
                    {t('common.hide')}
                </button>
            </div>

            <div className="p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Items List */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {items.map((item) => (
                        <div key={item.id} className="relative group shrink-0">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative">
                                {item.main_image ? (
                                    <Image
                                        src={item.main_image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <div className="w-6 h-6 bg-current rounded-full" />
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeItem(item.id);
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {items.length < 4 && (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 text-[10px] font-bold text-center shrink-0">
                            {items.length}/4
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="hidden md:block text-sm text-gray-500 mr-2">
                        {items.length} {t('catalog.productsSelected')}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clear}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline font-bold uppercase tracking-widest text-[10px]">{t('common.clear')}</span>
                    </Button>

                    <Link href="/catalog/compare" className="flex-1 md:flex-none">
                        <Button className="w-full font-bold uppercase tracking-widest text-[10px]" variant="premium">
                            {t('catalog.compareBtn')} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
