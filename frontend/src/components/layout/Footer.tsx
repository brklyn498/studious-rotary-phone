'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="bg-background border-t border-white/5 text-gray-400">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-xl">U</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary-500 transition-colors">UzAgro</span>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold leading-none mt-1">Premium Machinery</p>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500">
                            {t('home.hero.subtitle')}
                        </p>
                        <div className="flex gap-4">
                            <a href="tel:+998711234567" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-primary-500 hover:border-primary-500/30 transition-all">
                                <Phone size={18} />
                            </a>
                            <a href="mailto:info@uzagro.uz" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-primary-500 hover:border-primary-500/30 transition-all">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Catalog links */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.catalog')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/catalog" className="hover:text-primary-500 transition-colors">{t('footer.tractors')}</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary-500 transition-colors">{t('footer.harvesters')}</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary-500 transition-colors">{t('footer.implements')}</Link></li>
                            <li><Link href="/catalog?type=spare_part" className="hover:text-primary-500 transition-colors">{t('footer.spareParts')}</Link></li>
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.company')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-primary-500 transition-colors">{t('footer.aboutUs')}</Link></li>
                            <li><Link href="/contacts" className="hover:text-primary-500 transition-colors">{t('footer.contacts')}</Link></li>
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">{t('footer.leasing')}</Link></li>
                            <li><Link href="/services" className="hover:text-primary-500 transition-colors">{t('footer.delivery')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.contacts')}</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 glass rounded-lg mt-1">
                                    <MapPin size={14} className="text-primary-500" />
                                </div>
                                <span className="leading-relaxed">г. Ташкент, ул. Буюк Ипак Йули, 15</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 glass rounded-lg mt-1">
                                    <Clock size={14} className="text-primary-500" />
                                </div>
                                <span>{t('common.workingHours')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-gray-500">
                        <p>© 2025 UzAgro. {t('common.allRightsReserved')}.</p>
                        <div className="flex gap-8">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
