'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Shield,
    Award,
    Target,
    Users,
    Sparkles,
    ArrowRight,
    Tractor,
    Rocket,
    Globe,
    Zap,
    History
} from 'lucide-react';

const milestones = [
    { year: '2010', title: 'Основание', description: 'Начало деятельности в сфере сельхозтехники' },
    { year: '2014', title: 'Партнёрство', description: 'Стали официальным дистрибьютором YTO в Узбекистане' },
    { year: '2018', title: 'Расширение', description: 'Открытие региональных представительств' },
    { year: '2022', title: 'Лидерство', description: 'Более 500 единиц техники продано за год' },
    { year: '2024', title: 'Цифровизация', description: 'Запуск онлайн-платформы UzAgro' },
];

const values = [
    {
        icon: Shield,
        title: 'Надёжность',
        description: 'Работаем только с проверенными производителями и гарантируем качество каждой единицы техники',
        color: 'text-primary-500'
    },
    {
        icon: Target,
        title: 'Фокус',
        description: 'Индивидуальный подход к каждому клиенту и гибкие условия сотрудничества',
        color: 'text-accent-500'
    },
    {
        icon: Globe,
        title: 'Масштаб',
        description: 'Охват всех регионов Узбекистана и профессиональная поддержка на местах',
        color: 'text-blue-500'
    },
    {
        icon: Award,
        title: 'Экспертиза',
        description: 'Более 14 лет опыта в сфере сельскохозяйственной техники и сервиса',
        color: 'text-amber-500'
    },
];

const stats = [
    { value: '14+', label: 'Лет на рынке', icon: History },
    { value: '500+', label: 'Техники в год', icon: Tractor },
    { value: '12', label: 'Регионов', icon: Globe },
    { value: '50+', label: 'Партнёров', icon: Users },
];

const team = [
    { name: 'Алишер Каримов', role: 'Генеральный директор', initials: 'АК' },
    { name: 'Дильшод Рахимов', role: 'Коммерческий директор', initials: 'ДР' },
    { name: 'Шахзод Усманов', role: 'Технический директор', initials: 'ШУ' },
    { name: 'Нодира Хасанова', role: 'Директор по маркетингу', initials: 'НХ' },
];

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center pt-20 pb-12 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 mb-8"
                    >
                        <Rocket className="w-4 h-4 text-primary-500" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-500">About UzAgro Platform</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter"
                    >
                        Будущее <span className="text-gradient">Агробизнеса</span> <br />
                        в Узбекистане
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        Мы трансформируем рынок сельскохозяйственной техники, объединяя передовые технологии
                        с глубокой экспертизой и надежным сервисом для каждого фермера.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <Link href="/catalog">
                            <Button size="lg" variant="premium" className="h-16 px-10 rounded-2xl">
                                Смотреть каталог
                            </Button>
                        </Link>
                        <Link href="/contacts">
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5">
                                Связаться с нами
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="w-12 h-12 mx-auto mb-6 rounded-xl glass border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-primary-500/30">
                                        <Icon className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter group-hover:text-primary-500 transition-colors">{stat.value}</p>
                                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-32 relative overflow-hidden bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Наши <span className="text-gradient">Ценности</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Фундамент нашего успеха и надежности</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass h-full border-white/5 hover:border-white/10 transition-all duration-500 group overflow-hidden">
                                        <CardContent className="p-8 relative">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl" />
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                                <Icon className={`h-8 w-8 ${value.color}`} />
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{value.title}</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed font-medium">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">История <span className="text-gradient">Развития</span></h2>
                        <History className="w-12 h-12 text-primary-500 mx-auto opacity-20" />
                    </div>

                    <div className="relative">
                        <div className="absolute left-[8px] md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-primary-500/50 via-primary-500/10 to-transparent" />

                        <div className="space-y-24">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`flex items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 flex flex-col ${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                                        <div className="glass p-8 border-white/5 rounded-[2rem] max-w-md group hover:border-primary-500/30 transition-all duration-500">
                                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs font-black uppercase tracking-widest mb-4">
                                                {milestone.year}
                                            </span>
                                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{milestone.title}</h3>
                                            <p className="text-sm text-gray-400 font-medium leading-relaxed">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] relative z-10 shrink-0" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-32 bg-white/5 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Наши <br className="md:hidden" /> Партнёры</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {['YTO', 'Rostselmash', 'Foton Lovol', 'KUHN', 'AMAZONE', 'Lemken'].map((brand, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="glass rounded-[1.5rem] border-white/5 p-8 flex items-center justify-center h-24 group hover:border-primary-500/20"
                            >
                                <span className="text-lg font-black text-gray-600 group-hover:text-primary-500/50 transition-colors uppercase tracking-widest">{brand}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Наша <span className="text-gradient">Команда</span></h2>
                        <Users className="w-12 h-12 text-primary-500 mx-auto opacity-20" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass border-white/5 hover:border-primary-500/30 transition-all duration-500 group overflow-hidden text-center h-full">
                                    <CardContent className="p-8">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/5 group-hover:border-primary-500/50 transition-all duration-500 overflow-hidden relative">
                                            <span className="text-2xl font-black text-gray-600 group-hover:text-primary-500 transition-colors">{member.initials}</span>
                                            <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-500 transition-colors">{member.name}</h3>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">{member.role}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="glass rounded-[3rem] border-white/5 overflow-hidden p-12 md:p-24 relative group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -mr-48 -mt-48 group-hover:scale-150 transition-transform duration-1000" />

                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter uppercase">
                                Готовы <span className="text-gradient">К Сотрудничеству?</span>
                            </h2>
                            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                Свяжитесь с нами для получения консультации и индивидуального предложения.
                                Ваш успех — наша главная цель.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href="/contacts">
                                    <Button size="lg" variant="premium" className="h-16 px-12 rounded-2xl">
                                        Написать нам
                                    </Button>
                                </Link>
                                <a href="tel:+998711234567">
                                    <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-white/10 text-white hover:bg-white/5">
                                        +998 71 123 45 67
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
