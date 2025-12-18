'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    User,
    Building2,
    Phone,
    Mail,
    MapPin,
    Settings,
    FileText,
    ShoppingBag,
    LogOut,
    ChevronRight,
    Edit2,
    CheckCircle,
    Clock,
    Package,
    Shield,
    Bell,
    CreditCard,
    Zap,
} from 'lucide-react';

// Mock user data
const mockUser = {
    id: 1,
    name: 'Алишер Каримов',
    phone: '+998 90 123 45 67',
    email: 'alisher@example.com',
    type: 'business' as const,
    company: 'ООО "АгроХолдинг"',
    inn: '123456789',
    isVerified: true,
    region: 'Ташкент',
    avatar: null,
    createdAt: '2024-01-15',
};

const mockOrders = [
    {
        id: 'ORD-2024-001',
        date: '2024-12-15',
        status: 'processing',
        total: 45000,
        items: 1,
        product: 'Трактор YTO X1204',
    },
    {
        id: 'ORD-2024-002',
        date: '2024-12-10',
        status: 'delivered',
        total: 1500,
        items: 3,
        product: 'Запчасти к трактору',
    },
];

const mockQuotes = [
    {
        id: 'QT-2024-001',
        date: '2024-12-14',
        status: 'pending',
        product: 'Комбайн РСМ 161',
    },
    {
        id: 'QT-2024-002',
        date: '2024-12-08',
        status: 'answered',
        product: 'Дисковая борона KUHN',
        price: 18500,
    },
];

type TabType = 'profile' | 'orders' | 'quotes' | 'settings';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: mockUser.name,
        email: mockUser.email,
        region: mockUser.region,
    });

    const handleSaveProfile = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
    };

    const getStatusStyles = (status: string) => {
        const styles = {
            processing: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
            delivered: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
            pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            answered: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
        const labels = {
            processing: 'В обработке',
            delivered: 'Доставлен',
            cancelled: 'Отменён',
            pending: 'Ожидает',
            answered: 'Ответ получен',
        };
        return {
            class: styles[status as keyof typeof styles],
            label: labels[status as keyof typeof labels]
        };
    };

    const tabs = [
        { id: 'profile' as const, label: 'Профиль', icon: User },
        { id: 'orders' as const, label: 'Заказы', icon: ShoppingBag },
        { id: 'quotes' as const, label: 'Запросы', icon: FileText },
        { id: 'settings' as const, label: 'Настройки', icon: Settings },
    ];

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
            </div>

            {/* Profile Header Hero */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent opacity-30" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-primary-500/50 transition-colors">
                                <div className="absolute inset-0 bg-primary-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <User className="w-16 h-16 text-primary-500 relative z-10" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/40 hover:scale-110 transition-transform">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                                    {mockUser.name}
                                </h1>
                                {mockUser.isVerified && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                        <CheckCircle className="w-3 h-3 text-primary-500" />
                                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">VERIFIED</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary-500/50" />
                                    {mockUser.type === 'business' ? mockUser.company : 'INDIVIDUAL'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary-500/50" />
                                    {mockUser.region}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary-500/50" />
                                    MEMBER SINCE 2024
                                </span>
                            </div>
                        </div>

                        <div className="md:ml-auto flex gap-3">
                            <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 px-6 h-14 font-black uppercase text-[10px] tracking-widest hover:border-primary-500/50">
                                <LogOut className="w-4 h-4 mr-2" /> Выйти
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-32">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <Card className="glass border-white/5 rounded-[2rem] overflow-hidden sticky top-24">
                            <CardContent className="p-3">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full group flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative overflow-hidden ${isActive
                                                        ? 'text-white'
                                                        : 'text-gray-500 hover:text-white'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-tab-bg"
                                                        className="absolute inset-0 bg-primary-500/10 border-l-2 border-primary-500"
                                                    />
                                                )}
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-500' : 'group-hover:text-primary-500'}`} />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 transition-all duration-300 relative z-10 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                                            </button>
                                        );
                                    })}
                                </nav>

                                <div className="mt-8 p-4 mx-2 rounded-3xl bg-primary-500/5 border border-primary-500/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-primary-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">B2B Prime</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed mb-4">
                                        У вас активированы специальные условия для юридических лиц.
                                    </p>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[85%] bg-primary-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Dynamic Content Area */}
                    <main className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
                                            <CardContent className="p-8 md:p-12">
                                                <div className="flex items-center justify-between mb-10">
                                                    <div>
                                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Личные данные</h2>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Управление основной информацией</p>
                                                    </div>
                                                    <Button
                                                        variant="premium"
                                                        onClick={() => setIsEditing(!isEditing)}
                                                        className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px]"
                                                    >
                                                        {isEditing ? 'Отмена' : 'Редактировать'}
                                                    </Button>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-8">
                                                        <InfoItem icon={User} label="Полное имя" value={mockUser.name} />
                                                        <InfoItem icon={Mail} label="Электронная почта" value={mockUser.email} />
                                                    </div>
                                                    <div className="space-y-8">
                                                        <InfoItem icon={Phone} label="Телефон" value={mockUser.phone} />
                                                        <InfoItem icon={MapPin} label="Регион" value={mockUser.region} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {mockUser.type === 'business' && (
                                            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden overflow-hidden relative group">
                                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Building2 className="w-32 h-32" />
                                                </div>
                                                <CardContent className="p-8 md:p-12">
                                                    <div className="mb-10">
                                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Организация</h2>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Юридические данные профиля</p>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                                        <InfoItem icon={Building2} label="Название компании" value={mockUser.company} />
                                                        <InfoItem icon={FileText} label="ИНН огранизации" value={mockUser.inn} />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">История заказов</h2>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Всего: {mockOrders.length}</div>
                                        </div>

                                        {mockOrders.length === 0 ? (
                                            <EmptyState icon={Package} title="Заказов нет" description="Вы еще не совершали покупок в нашем каталоге." action="/catalog" actionLabel="В каталог" />
                                        ) : (
                                            mockOrders.map((order, idx) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <Card className="glass border-white/5 rounded-3xl overflow-hidden hover:border-primary-500/30 transition-all group">
                                                        <CardContent className="p-6">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                                <div className="flex gap-6">
                                                                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                                                                        <Package className="w-8 h-8 text-primary-500/50" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{order.id}</span>
                                                                            <StatusBadge status={order.status} />
                                                                        </div>
                                                                        <h3 className="font-black text-white uppercase tracking-tight mb-1">{order.product}</h3>
                                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {order.date}</span>
                                                                            <span>{order.items} ТОВАР(ОВ)</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right flex flex-col items-end gap-3">
                                                                    <p className="text-3xl font-black text-white tracking-tighter">${order.total.toLocaleString()}</p>
                                                                    <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 hover:border-primary-500/50">Детали</Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* QUOTES TAB */}
                                {activeTab === 'quotes' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Запросы цен</h2>
                                        </div>

                                        {mockQuotes.map((quote, idx) => (
                                            <motion.div
                                                key={quote.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <Card className="glass border-white/5 rounded-3xl overflow-hidden hover:border-accent-500/30 transition-all">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                            <div className="flex gap-6">
                                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                                                                    <FileText className="w-6 h-6 text-accent-500/50" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">{quote.id}</span>
                                                                        <StatusBadge status={quote.status} />
                                                                    </div>
                                                                    <h3 className="font-black text-white uppercase tracking-tight mb-2">{quote.product}</h3>
                                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                                        <Clock className="w-3 h-3" /> {quote.date}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                {quote.price ? (
                                                                    <div className="space-y-2 text-right">
                                                                        <p className="text-[9px] font-black text-accent-500 uppercase tracking-widest">ПРЕДЛОЖЕНИЕ ПОЛУЧЕНО</p>
                                                                        <p className="text-3xl font-black text-white tracking-tighter">${quote.price.toLocaleString()}</p>
                                                                        <Button variant="premium" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Оформить</Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic animate-pulse">ОЖИДАЕТСЯ ОТВЕТ...</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* SETTINGS TAB */}
                                {activeTab === 'settings' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="glass border-white/5 rounded-[2.5rem]">
                                            <CardContent className="p-8">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                                        <Bell className="w-5 h-5 text-primary-500" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Уведомления</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <ToggleItem label="SMS-информирование" description="Статус заказа и оплаты" checked={true} />
                                                    <ToggleItem label="Email-новости" description="Акции и спецпредложения" checked={true} />
                                                    <ToggleItem label="Системные пуши" description="Уведомления в браузере" checked={false} />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="glass border-white/5 rounded-[2.5rem]">
                                            <CardContent className="p-8">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-accent-500" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Безопасность</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    <SettingsButton icon={Lock} label="Изменить пароль" />
                                                    <SettingsButton icon={CreditCard} label="Управление картами" />
                                                    <SettingsButton icon={LogOut} label="Завершить сеансы" />
                                                    <div className="pt-4 mt-4 border-t border-white/5">
                                                        <button className="w-full text-left text-[10px] font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest transition-colors py-2">
                                                            Удалить учетную запись
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="group">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-primary-500/50 group-hover:text-primary-500 transition-colors" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-lg font-bold text-white pl-14">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = {
        processing: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
        delivered: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
        cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        answered: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    const labels: Record<string, string> = {
        processing: 'В ОБРАБОТКЕ',
        delivered: 'ДОСТАВЛЕН',
        cancelled: 'ОТМЕНЕН',
        pending: 'ОЖИДАЕТ',
        answered: 'ГОТОВО',
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${s[status as keyof typeof s]}`}>
            {labels[status]}
        </span>
    );
}

function ToggleItem({ label, description, checked }: { label: string, description: string, checked: boolean }) {
    const [isChecked, setIsChecked] = useState(checked);
    return (
        <div className="flex items-center justify-between group">
            <div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-primary-500 transition-colors">{label}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{description}</p>
            </div>
            <button
                onClick={() => setIsChecked(!isChecked)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isChecked ? 'bg-primary-500' : 'bg-white/10'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isChecked ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );
}

function SettingsButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                <span className="text-[10px] font-black text-gray-300 group-hover:text-white uppercase tracking-widest transition-colors">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 transition-transform group-hover:translate-x-1" />
        </button>
    );
}

function EmptyState({ icon: Icon, title, description, action, actionLabel }: any) {
    return (
        <div className="py-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 mb-8">
                <Icon className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title}</h3>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            <Link href={action}>
                <Button variant="premium" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest">{actionLabel}</Button>
            </Link>
        </div>
    );
}
