'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Send,
    Building,
    CheckCircle,
    Sparkles,
    Globe,
    Zap,
    HeadphonesIcon
} from 'lucide-react';

const officeLocations = [
    {
        city: 'Ташкент',
        type: 'Главный офис',
        address: 'ул. Амира Темура, 100, Мирабадский район',
        phone: '+998 71 123 45 67',
        email: 'info@uzagro.uz',
        hours: 'Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 14:00',
    },
    {
        city: 'Самарканд',
        type: 'Региональный офис',
        address: 'ул. Регистан, 50',
        phone: '+998 66 123 45 67',
        email: 'samarkand@uzagro.uz',
        hours: 'Пн-Пт: 9:00 - 18:00',
    },
    {
        city: 'Бухара',
        type: 'Региональный офис',
        address: 'ул. Навои, 25',
        phone: '+998 65 123 45 67',
        email: 'bukhara@uzagro.uz',
        hours: 'Пн-Пт: 9:00 - 18:00',
    },
];

const departments = [
    { name: 'Отдел продаж', phone: '+998 71 123 45 68', email: 'sales@uzagro.uz' },
    { name: 'Сервисный центр', phone: '+998 71 123 45 69', email: 'service@uzagro.uz' },
    { name: 'Отдел запчастей', phone: '+998 71 123 45 70', email: 'parts@uzagro.uz' },
    { name: 'Лизинг', phone: '+998 71 123 45 71', email: 'leasing@uzagro.uz' },
];

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        subject: 'general',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                phone: '',
                email: '',
                company: '',
                subject: 'general',
                message: '',
            });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="bg-background min-h-screen text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 mb-8"
                    >
                        <MessageCircle className="w-4 h-4 text-primary-500" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-500">Contact Us</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter"
                    >
                        Мы Всегда <br /> <span className="text-gradient uppercase">На Связи</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl text-gray-400 max-w-2xl leading-relaxed"
                    >
                        Наши специалисты готовы ответить на ваши вопросы и помочь с выбором техники.
                        Выберите удобный способ связи или посетите наш офис.
                    </motion.p>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Phone, title: 'Телефон', value: '+998 71 123 45 67', sub: 'Ежедневно с 9:00 до 18:00', href: 'tel:+998711234567', color: 'text-primary-500' },
                            { icon: Mail, title: 'Email', value: 'info@uzagro.uz', sub: 'Ответим в течение 24 часов', href: 'mailto:info@uzagro.uz', color: 'text-accent-500' },
                            { icon: MessageCircle, title: 'Telegram', value: '@uzagro', sub: 'Быстрые ответы в мессенджере', href: 'https://t.me/uzagro', color: 'text-blue-500' }
                        ].map((item, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 + 0.3 }}>
                                <Card className="glass border-white/5 group hover:border-white/10 transition-all duration-500">
                                    <CardContent className="p-8 flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                            <item.icon className={`h-7 w-7 ${item.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white uppercase tracking-wider mb-2 text-sm">{item.title}</h3>
                                            <a href={item.href} className="text-xl font-bold text-white group-hover:text-primary-500 transition-colors">
                                                {item.value}
                                            </a>
                                            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-widest">{item.sub}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <Card className="glass border-white/5 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
                                    <CardContent className="p-8 md:p-12">
                                        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Напишите <span className="text-primary-500">Нам</span></h2>

                                        {isSubmitted ? (
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
                                                <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary-500/20">
                                                    <CheckCircle className="h-10 w-10 text-primary-500" />
                                                </div>
                                                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Сообщение отправлено!</h3>
                                                <p className="text-gray-400 font-medium">Мы свяжемся с вами в ближайшее время</p>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ваше имя *</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-600"
                                                            placeholder="Алишер Каримов"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Телефон *</label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-600"
                                                            placeholder="+998 90 123 45 67"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-600"
                                                            placeholder="email@example.com"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Компания</label>
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            value={formData.company}
                                                            onChange={handleChange}
                                                            className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-600"
                                                            placeholder="Название компании"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Тема обращения</label>
                                                    <select
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all"
                                                    >
                                                        <option value="general" className="bg-background">Общий вопрос</option>
                                                        <option value="sales" className="bg-background">Покупка техники</option>
                                                        <option value="service" className="bg-background">Сервис и ремонт</option>
                                                        <option value="parts" className="bg-background">Запчасти</option>
                                                        <option value="leasing" className="bg-background">Лизинг</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Сообщение *</label>
                                                    <textarea
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                        rows={5}
                                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white transition-all resize-none placeholder:text-gray-600"
                                                        placeholder="Опишите ваш вопрос..."
                                                    />
                                                </div>

                                                <Button type="submit" size="lg" isLoading={isSubmitting} variant="premium" className="h-16 px-12 rounded-2xl w-full md:w-auto">
                                                    <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    Отправить сообщение
                                                </Button>
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <Card className="glass border-white/5 overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[40px]" />
                                    <CardContent className="p-8">
                                        <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                            <Sparkles className="h-5 w-5 text-primary-500" />
                                            Отделы компании
                                        </h3>
                                        <ul className="space-y-8">
                                            {departments.map((dept, index) => (
                                                <li key={index} className="relative group/dept">
                                                    <p className="text-gray-400 font-black uppercase tracking-[0.15em] text-[10px] mb-2">{dept.name}</p>
                                                    <a href={`tel:${dept.phone.replace(/\s/g, '')}`} className="block text-lg font-bold text-white hover:text-primary-500 transition-colors mb-1">
                                                        {dept.phone}
                                                    </a>
                                                    <a href={`mailto:${dept.email}`} className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
                                                        {dept.email}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                <Card className="relative overflow-hidden rounded-[2rem] group h-64">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-600 to-accent-800" />
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                    <CardContent className="p-8 relative h-full flex flex-col justify-between text-white">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Нужна Помощь?</h3>
                                            <p className="text-white/70 text-sm font-medium">Бесплатная горячая линия для клиентов</p>
                                        </div>
                                        <a href="tel:+998711234500">
                                            <Button className="w-full h-14 rounded-xl bg-white text-accent-700 hover:bg-gray-100 font-black uppercase tracking-widest group">
                                                <Phone className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                                +998 71 123 45 00
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-24 relative bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Наши <span className="text-gradient">Офисы</span></h2>
                        <Globe className="w-12 h-12 text-primary-500 mx-auto opacity-20" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {officeLocations.map((office, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                                <Card className="glass border-white/5 hover:border-primary-500/30 transition-all duration-500 h-full group">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                                <Building className="h-6 w-6 text-primary-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white uppercase tracking-tight text-lg">{office.city}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{office.type}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-400 font-medium leading-relaxed">{office.address}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Clock className="h-5 w-5 text-gray-500 shrink-0" />
                                                <span className="text-sm text-gray-400 font-medium">{office.hours}</span>
                                            </div>
                                            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                                                <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-colors">
                                                    <Phone className="h-3 w-3" />
                                                    Позвонить
                                                </a>
                                                <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                                    <Mail className="h-3 w-3" />
                                                    Email
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-screen/2 py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="h-full glass border-white/5 rounded-[3rem] overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-background to-accent-900/40 opacity-50 transition-opacity group-hover:opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                <MapPin className="h-20 w-20 text-primary-500/20 mx-auto mb-8 blur-sm group-hover:blur-0 transition-all duration-700" />
                                <h2 className="text-4xl font-black text-white/40 uppercase tracking-tighter mb-4 group-hover:text-white/60 transition-colors">Интерактивная Карта</h2>
                                <p className="text-gray-600 font-black uppercase tracking-widest text-xs">Yandex & Google Maps Integration Coming Soon</p>
                            </motion.div>
                        </div>
                        {/* Decorative scanline */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-scan" />
                    </div>
                </div>
            </section>
        </div>
    );
}
