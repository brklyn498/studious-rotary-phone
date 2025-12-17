'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">У</span>
                            </div>
                            <span className="text-xl font-bold text-white">УзАгро</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            {t('home.hero.subtitle')}
                        </p>
                        <div className="space-y-2 text-sm">
                            <a href="tel:+998711234567" className="flex items-center gap-2 hover:text-white">
                                <Phone className="h-4 w-4" />
                                +998 71 123 45 67
                            </a>
                            <a href="mailto:info@uzagro.uz" className="flex items-center gap-2 hover:text-white">
                                <Mail className="h-4 w-4" />
                                info@uzagro.uz
                            </a>
                        </div>
                    </div>

                    {/* Catalog links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('footer.catalog')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/catalog" className="hover:text-white">{t('footer.tractors')}</Link></li>
                            <li><Link href="/catalog" className="hover:text-white">{t('footer.harvesters')}</Link></li>
                            <li><Link href="/catalog" className="hover:text-white">{t('footer.implements')}</Link></li>
                            <li><Link href="/catalog?type=spare_part" className="hover:text-white">{t('footer.spareParts')}</Link></li>
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('footer.company')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white">{t('footer.aboutUs')}</Link></li>
                            <li><Link href="/contacts" className="hover:text-white">{t('footer.contacts')}</Link></li>
                            <li><Link href="/services" className="hover:text-white">{t('footer.leasing')}</Link></li>
                            <li><Link href="/services" className="hover:text-white">{t('footer.delivery')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('footer.contacts')}</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>г. Ташкент, ул. Буюк Ипак Йули, 15</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>{t('common.workingHours')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>© 2025 УзАгро. {t('common.allRightsReserved')}.</p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
