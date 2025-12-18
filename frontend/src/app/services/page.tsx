'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Wrench,
    Calculator,
    Shield,
    Truck,
    GraduationCap,
    Headphones,
    CheckCircle2,
    ChevronRight,
    ArrowRight,
    Zap,
    Users,
    Sparkles
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
        color: 'from-primary-500/20 to-primary-700/20',
        iconColor: 'text-primary-500'
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
        color: 'from-accent-500/20 to-accent-700/20',
        iconColor: 'text-accent-500'
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
        color: 'from-blue-500/20 to-blue-700/20',
        iconColor: 'text-blue-500'
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
        color: 'from-purple-500/20 to-purple-700/20',
        iconColor: 'text-purple-500'
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
        color: 'from-amber-500/20 to-amber-700/20',
        iconColor: 'text-amber-500'
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
        color: 'from-emerald-500/20 to-emerald-700/20',
        iconColor: 'text-emerald-500'
    },
];

const processSteps = [
    { number: '01', title: 'Заявка', description: 'Оставьте заявку на сайте или позвоните нам', icon: Zap },
    { number: '02', title: 'Консультация', description: 'Наш специалист свяжется с вами для уточнения деталей', icon: Users },
    { number: '03', title: 'Предложение', description: 'Подготовим индивидуальное коммерческое предложение', icon: Sparkles },
    { number: '04', title: 'Сделка', description: 'Оформление документов и поставка техники', icon: CheckCircle2 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

export default function ServicesPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center pt-20 pb-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-500">Professional Services</span>
                    </motion.div>

                    <div className="max-w-4xl">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] text-white"
                        >
                            <span className="text-gradient">Наши Услуги</span> <br />
                            <span className="opacity-50 text-4xl md:text-5xl">Комплексный Подход</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-gray-400 max-w-2xl leading-relaxed"
                        >
                            От подбора и финансирования до технического обслуживания и обучения.
                            Мы обеспечиваем бесперебойную работу вашего агробизнеса.
                        </motion.p>
                    </div>
                </div>

                <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-l from-primary-500/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[150%] aspect-square border-2 border-white/5 rounded-full animate-spin-slow"></div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {services.map((service) => {
                            const Icon = service.icon;
                            const hoverTextColor = service.iconColor.replace('text-', 'group-hover:text-');

                            return (
                                <motion.div key={service.id} variants={itemVariants}>
                                    <div className="group relative h-full">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-40 blur-3xl transition-opacity duration-500 -z-10`} />
                                        <Card variant="glass" className="h-full border-white/5 group-hover:border-white/20 transition-all duration-500 relative overflow-hidden flex flex-col">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-20" />
                                            <CardContent className="p-8 relative z-10 flex flex-col h-full">
                                                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]`}>
                                                    <Icon className={`h-8 w-8 ${service.iconColor} drop-shadow-[0_0_8px_currentColor]`} />
                                                </div>
                                                <h3 className={`text-2xl font-black text-white mb-4 ${hoverTextColor} transition-colors uppercase tracking-tight`}>{service.title}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>
                                                <ul className="space-y-4 mb-10">
                                                    {service.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">
                                                            <div className={`w-2 h-2 rounded-full ${service.iconColor} shadow-[0_0_12px_currentColor] ring-4 ring-white/5`} />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Link href={`/services/${service.id}`} className="mt-auto">
                                                    <Button variant="premium" className="w-full h-14 rounded-2xl">
                                                        {service.cta}
                                                        <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 skew-y-3 origin-right"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6"
                        >
                            Our Process
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter"
                        >
                            Как Мы <span className="text-gradient">Работаем</span>
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12 relative">
                        {/* Connecting Lines for Desktop */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

                        {processSteps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="relative mb-8 flex justify-center">
                                        <div className="w-20 h-20 bg-background border-4 border-white/5 rounded-[2rem] flex items-center justify-center relative z-10 group-hover:border-primary-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                                            <StepIcon className="w-8 h-8 text-primary-500" />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 glass border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black text-white">
                                                {step.number}
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-primary-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{step.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity">{step.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Leasing Calculator Promo */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[3rem] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-800" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

                        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block"
                                >
                                    Exclusive Offer
                                </motion.div>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter uppercase">
                                    Лизинг <br /> <span className="text-white/60">сельхозтехники</span>
                                </h2>
                                <p className="text-lg text-white/80 mb-10 leading-relaxed font-medium">
                                    Рассчитайте условия лизинга онлайн. Первоначальный взнос от 20%,
                                    от 18% годовых, срок до 5 лет. Быстро, выгодно, прозрачно.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-wider">Быстрое одобрение</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-wider">Сезонные платежи</span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/services/leasing">
                                <Button size="lg" className="h-20 px-10 rounded-3xl bg-white text-primary-600 hover:bg-gray-100 shadow-2xl shadow-black/20 text-lg font-black uppercase tracking-widest group">
                                    <Calculator className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                                    Рассчитать
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Service Request CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <Card className="glass border-white/5 overflow-hidden rounded-[3rem]">
                        <CardContent className="p-8 md:p-20 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-50" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                                <div className="max-w-xl">
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                                        Нужен <span className="text-accent-500">сервис</span> или ремонт?
                                    </h2>
                                    <p className="text-gray-400 font-medium leading-relaxed">
                                        Оставьте заявку на обслуживание техники. Наши специалисты
                                        выедут на место или примут технику в сервисный центр.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                                    <Link href="/services/service-request" className="flex-1">
                                        <Button size="lg" className="w-full h-16 rounded-2xl bg-accent-600 hover:bg-accent-700 text-white font-black uppercase tracking-widest text-xs">
                                            <Wrench className="h-5 w-5 mr-2" />
                                            Оставить заявку
                                        </Button>
                                    </Link>
                                    <a href="tel:+998711234567" className="flex-1">
                                        <Button size="lg" variant="outline" className="w-full h-16 rounded-2xl border-white/10 text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-xs">
                                            <Headphones className="h-5 w-5 mr-2" />
                                            Позвонить
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Visual decoration */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />
            </section>
        </div>
    );
}
