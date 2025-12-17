import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Wrench,
    Calculator,
    Shield,
    Truck,
    GraduationCap,
    FileText,
    Settings,
    Headphones,
    CheckCircle,
    ChevronRight,
} from 'lucide-react';

const services = [
    {
        id: 'leasing',
        icon: Calculator,
        title: 'Лизинг техники',
        description: 'Выгодные условия лизинга сельскохозяйственной техники. Первоначальный взнос от 20%, срок до 5 лет.',
        features: [
            'Минимальный первоначальный взнос',
            'Гибкий график платежей',
            'Сезонные отсрочки',
            'Быстрое оформление',
        ],
        cta: 'Рассчитать лизинг',
    },
    {
        id: 'service',
        icon: Wrench,
        title: 'Сервисное обслуживание',
        description: 'Полный спектр услуг по техническому обслуживанию и ремонту сельхозтехники.',
        features: [
            'Плановое ТО',
            'Диагностика',
            'Гарантийный ремонт',
            'Выезд специалиста',
        ],
        cta: 'Заказать сервис',
    },
    {
        id: 'warranty',
        icon: Shield,
        title: 'Гарантия',
        description: 'Официальная гарантия производителя на всю технику. Расширенная гарантия на отдельные модели.',
        features: [
            'До 2 лет гарантии',
            'Бесплатный ремонт',
            'Оригинальные запчасти',
            'Поддержка 24/7',
        ],
        cta: 'Условия гарантии',
    },
    {
        id: 'delivery',
        icon: Truck,
        title: 'Доставка',
        description: 'Доставка техники в любой регион Узбекистана. Собственный автопарк и надёжные партнёры.',
        features: [
            'Доставка по всей стране',
            'Страхование груза',
            'Отслеживание онлайн',
            'Разгрузка и установка',
        ],
        cta: 'Рассчитать доставку',
    },
    {
        id: 'training',
        icon: GraduationCap,
        title: 'Обучение',
        description: 'Проводим обучение операторов и механизаторов работе на новой технике.',
        features: [
            'Теоретические курсы',
            'Практические занятия',
            'Сертификат оператора',
            'Обучение на месте',
        ],
        cta: 'Записаться на обучение',
    },
    {
        id: 'consulting',
        icon: Headphones,
        title: 'Консультации',
        description: 'Бесплатные консультации по подбору техники под ваши задачи и условия работы.',
        features: [
            'Анализ потребностей',
            'Подбор техники',
            'Сравнение моделей',
            'Расчёт окупаемости',
        ],
        cta: 'Получить консультацию',
    },
];

const processSteps = [
    { number: '01', title: 'Заявка', description: 'Оставьте заявку на сайте или позвоните нам' },
    { number: '02', title: 'Консультация', description: 'Наш специалист свяжется с вами для уточнения деталей' },
    { number: '03', title: 'Предложение', description: 'Подготовим индивидуальное коммерческое предложение' },
    { number: '04', title: 'Сделка', description: 'Оформление документов и поставка техники' },
];

export default function ServicesPage() {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 md:py-24">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Наши услуги
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            Комплексное обслуживание сельскохозяйственной техники: от подбора и покупки
                            до сервиса и обучения операторов
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                            <Icon className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                        <p className="text-gray-600 mb-4">{service.description}</p>
                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={`/services/${service.id}`}>
                                            <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors">
                                                {service.cta}
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Как мы работаем</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Простой и понятный процесс от заявки до получения техники
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="text-center relative">
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200" />
                                )}
                                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white text-xl font-bold rounded-full mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leasing Calculator Promo */}
            <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">
                                Лизинг сельхозтехники
                            </h2>
                            <p className="text-lg text-amber-100 mb-4">
                                Рассчитайте условия лизинга онлайн. Первоначальный взнос от 20%,
                                ставка от 18% годовых, срок до 5 лет.
                            </p>
                            <ul className="flex flex-wrap gap-4 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Быстрое одобрение
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Без залога
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Сезонные платежи
                                </li>
                            </ul>
                        </div>
                        <Link href="/services/leasing">
                            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
                                <Calculator className="h-5 w-5 mr-2" />
                                Рассчитать лизинг
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Service Request CTA */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Card className="bg-green-800 text-white overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                        Нужен сервис или ремонт?
                                    </h2>
                                    <p className="text-green-100 max-w-xl">
                                        Оставьте заявку на обслуживание техники. Наши специалисты
                                        выедут на место или примут технику в сервисный центр.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/services/service-request">
                                        <Button size="lg" variant="secondary">
                                            <Wrench className="h-5 w-5 mr-2" />
                                            Заявка на сервис
                                        </Button>
                                    </Link>
                                    <a href="tel:+998711234567">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                            Позвонить
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
