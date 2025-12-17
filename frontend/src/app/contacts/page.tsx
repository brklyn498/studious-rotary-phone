'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    Users,
    Headphones,
    CheckCircle,
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

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
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
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 md:py-24">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Свяжитесь с нами
                        </h1>
                        <p className="text-xl text-green-100">
                            Наши специалисты готовы ответить на ваши вопросы и помочь с выбором техники
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="py-8 -mt-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
                                    <a href="tel:+998711234567" className="text-green-600 hover:text-green-700 font-medium">
                                        +998 71 123 45 67
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Ежедневно с 9:00 до 18:00</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <a href="mailto:info@uzagro.uz" className="text-green-600 hover:text-green-700 font-medium">
                                        info@uzagro.uz
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Ответим в течение 24 часов</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Telegram</h3>
                                    <a href="https://t.me/uzagro" className="text-blue-600 hover:text-blue-700 font-medium">
                                        @uzagro
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Быстрые ответы в мессенджере</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Отправить сообщение</h2>

                                    {isSubmitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Сообщение отправлено!</h3>
                                            <p className="text-gray-600">Мы свяжемся с вами в ближайшее время</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Ваше имя *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                        placeholder="Алишер Каримов"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Телефон *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                        placeholder="+998 90 123 45 67"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Компания
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                        placeholder="Название компании"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Тема обращения
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                                >
                                                    <option value="general">Общий вопрос</option>
                                                    <option value="sales">Покупка техники</option>
                                                    <option value="service">Сервис и ремонт</option>
                                                    <option value="parts">Запчасти</option>
                                                    <option value="leasing">Лизинг</option>
                                                    <option value="partnership">Партнёрство</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Сообщение *
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={5}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                                                    placeholder="Опишите ваш вопрос или запрос..."
                                                />
                                            </div>

                                            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full md:w-auto">
                                                <Send className="h-5 w-5 mr-2" />
                                                Отправить сообщение
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Departments Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Headphones className="h-5 w-5 text-green-600" />
                                        Отделы компании
                                    </h3>
                                    <ul className="space-y-4">
                                        {departments.map((dept, index) => (
                                            <li key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                                <p className="font-medium text-gray-900">{dept.name}</p>
                                                <a href={`tel:${dept.phone.replace(/\s/g, '')}`} className="text-sm text-green-600 hover:text-green-700">
                                                    {dept.phone}
                                                </a>
                                                <br />
                                                <a href={`mailto:${dept.email}`} className="text-sm text-gray-500 hover:text-gray-700">
                                                    {dept.email}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-800 text-white">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Нужна срочная помощь?</h3>
                                    <p className="text-green-100 text-sm mb-4">
                                        Наша горячая линия работает для вас
                                    </p>
                                    <a href="tel:+998711234500">
                                        <Button variant="secondary" className="w-full">
                                            <Phone className="h-4 w-4 mr-2" />
                                            +998 71 123 45 00
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши офисы</h2>
                        <p className="text-lg text-gray-600">
                            Приходите к нам за консультацией или осмотром техники
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {officeLocations.map((office, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building className="h-5 w-5 text-green-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{office.city}</h3>
                                            <p className="text-sm text-gray-500">{office.type}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600">{office.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-green-600 hover:text-green-700">
                                                {office.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-gray-900">
                                                {office.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-600">{office.hours}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Карта офисов (интеграция с Yandex/Google Maps)</p>
                </div>
            </section>
        </div>
    );
}
