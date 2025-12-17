import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Footer() {
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
                            Ваш надёжный партнёр в сельскохозяйственной технике.
                            Поставки от ведущих производителей мира.
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
                        <h3 className="text-white font-semibold mb-4">Каталог</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/ru/catalog/tractors" className="hover:text-white">Тракторы</Link></li>
                            <li><Link href="/ru/catalog/harvesters" className="hover:text-white">Комбайны</Link></li>
                            <li><Link href="/ru/catalog/tillage" className="hover:text-white">Почвообработка</Link></li>
                            <li><Link href="/ru/catalog/spare-parts" className="hover:text-white">Запчасти</Link></li>
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Компания</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/ru/about" className="hover:text-white">О нас</Link></li>
                            <li><Link href="/ru/contacts" className="hover:text-white">Контакты</Link></li>
                            <li><Link href="/ru/dealers" className="hover:text-white">Стать дилером</Link></li>
                            <li><Link href="/ru/vacancies" className="hover:text-white">Вакансии</Link></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Контакты</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>г. Ташкент, ул. Буюк Ипак Йули, 15</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>Пн-Пт: 9:00 - 18:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>© 2025 УзАгро. Все права защищены.</p>
                        <div className="flex gap-4">
                            <Link href="/ru/privacy" className="hover:text-white">Политика конфиденциальности</Link>
                            <Link href="/ru/terms" className="hover:text-white">Условия использования</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
