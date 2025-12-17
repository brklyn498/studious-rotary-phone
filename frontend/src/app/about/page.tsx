import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Shield,
    Truck,
    HeadphonesIcon,
    Award,
    Users,
    MapPin,
    Calendar,
    Target,
    CheckCircle,
} from 'lucide-react';

const milestones = [
    { year: '2010', title: 'Основание компании', description: 'Начало деятельности в сфере сельхозтехники' },
    { year: '2014', title: 'Партнёрство с YTO', description: 'Стали официальным дистрибьютором YTO в Узбекистане' },
    { year: '2018', title: 'Расширение сети', description: 'Открытие региональных представительств' },
    { year: '2022', title: 'Рост продаж', description: 'Более 500 единиц техники продано за год' },
    { year: '2024', title: 'Цифровизация', description: 'Запуск онлайн-платформы' },
];

const values = [
    {
        icon: Shield,
        title: 'Надёжность',
        description: 'Работаем только с проверенными производителями и гарантируем качество каждой единицы техники',
    },
    {
        icon: HeadphonesIcon,
        title: 'Поддержка',
        description: 'Профессиональная консультация и сервисная поддержка на протяжении всего срока эксплуатации',
    },
    {
        icon: Target,
        title: 'Фокус на клиенте',
        description: 'Индивидуальный подход к каждому клиенту и гибкие условия сотрудничества',
    },
    {
        icon: Award,
        title: 'Экспертиза',
        description: 'Более 14 лет опыта в сфере сельскохозяйственной техники',
    },
];

const stats = [
    { value: '14+', label: 'Лет на рынке' },
    { value: '500+', label: 'Единиц техники продано' },
    { value: '12', label: 'Регионов охвата' },
    { value: '50+', label: 'Партнёров и дилеров' },
];

const team = [
    { name: 'Алишер Каримов', role: 'Генеральный директор', image: null },
    { name: 'Дильшод Рахимов', role: 'Коммерческий директор', image: null },
    { name: 'Шахзод Усманов', role: 'Технический директор', image: null },
    { name: 'Нодира Хасанова', role: 'Директор по маркетингу', image: null },
];

export default function AboutPage() {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-20 md:py-28">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            О компании УзАгро
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            Мы помогаем аграриям Узбекистана получить доступ к современной сельскохозяйственной технике
                            от ведущих мировых производителей. Наша миссия — повышение эффективности сельского хозяйства
                            страны через внедрение передовых технологий.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/catalog">
                                <Button size="lg" variant="secondary">
                                    Смотреть каталог
                                </Button>
                            </Link>
                            <Link href="/contacts">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Связаться с нами
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-green-600 mb-2">{stat.value}</p>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши ценности</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Основные принципы, которые определяют нашу работу и отношение к клиентам
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                            <Icon className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                        <p className="text-sm text-gray-600">{value.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">История компании</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Путь развития УзАгро с момента основания до сегодняшнего дня
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-green-200 hidden md:block" />

                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <Card className="inline-block">
                                            <CardContent className="p-6">
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-2">
                                                    {milestone.year}
                                                </span>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                                                <p className="text-gray-600">{milestone.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="hidden md:flex w-4 h-4 bg-green-600 rounded-full border-4 border-green-100 z-10" />
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши партнёры</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Сотрудничаем с ведущими мировыми производителями сельскохозяйственной техники
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {['YTO', 'Rostselmash', 'Foton Lovol', 'KUHN', 'AMAZONE', 'Lemken'].map((brand, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 flex items-center justify-center h-24 shadow-sm">
                                <span className="text-xl font-bold text-gray-400">{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наша команда</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Профессионалы с многолетним опытом в сфере сельскохозяйственной техники
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Users className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Готовы к сотрудничеству?
                    </h2>
                    <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                        Свяжитесь с нами для получения консультации и индивидуального предложения
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contacts">
                            <Button size="lg" variant="secondary">
                                Связаться с нами
                            </Button>
                        </Link>
                        <a href="tel:+998711234567">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                +998 71 123 45 67
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
