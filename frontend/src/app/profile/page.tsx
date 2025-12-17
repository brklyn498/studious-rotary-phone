'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    Heart,
    LogOut,
    ChevronRight,
    Edit2,
    CheckCircle,
    Clock,
    Package,
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            processing: 'bg-yellow-100 text-yellow-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            pending: 'bg-blue-100 text-blue-700',
            answered: 'bg-green-100 text-green-700',
        };
        const labels = {
            processing: 'В обработке',
            delivered: 'Доставлен',
            cancelled: 'Отменён',
            pending: 'Ожидает ответа',
            answered: 'Получен ответ',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const tabs = [
        { id: 'profile' as const, label: 'Профиль', icon: User },
        { id: 'orders' as const, label: 'Заказы', icon: ShoppingBag },
        { id: 'quotes' as const, label: 'Запросы цен', icon: FileText },
        { id: 'settings' as const, label: 'Настройки', icon: Settings },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-green-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="h-10 w-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                                {mockUser.isVerified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 rounded-full text-xs">
                                        <CheckCircle className="h-3 w-3" />
                                        Верифицирован
                                    </span>
                                )}
                            </div>
                            <p className="text-green-200 mt-1">
                                {mockUser.type === 'business' ? mockUser.company : 'Физическое лицо'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <Card>
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                    <hr className="my-2" />
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Выйти
                                    </button>
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold text-gray-900">Личные данные</h2>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                {isEditing ? 'Отмена' : 'Редактировать'}
                                            </Button>
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                    />
                                                </div>
                                                <Button onClick={handleSaveProfile}>Сохранить</Button>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Имя</p>
                                                        <p className="font-medium">{mockUser.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Телефон</p>
                                                        <p className="font-medium">{mockUser.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium">{mockUser.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Регион</p>
                                                        <p className="font-medium">{mockUser.region}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {mockUser.type === 'business' && (
                                    <Card>
                                        <CardContent className="p-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Данные компании</h2>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Компания</p>
                                                        <p className="font-medium">{mockUser.company}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">ИНН</p>
                                                        <p className="font-medium">{mockUser.inn}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Мои заказы</h2>

                                    {mockOrders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">У вас пока нет заказов</p>
                                            <Link href="/catalog">
                                                <Button className="mt-4">Перейти в каталог</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mockOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium text-gray-900">{order.id}</span>
                                                                {getStatusBadge(order.status)}
                                                            </div>
                                                            <p className="text-gray-600 mt-1">{order.product}</p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                <Clock className="inline h-4 w-4 mr-1" />
                                                                {order.date}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                ${order.total.toLocaleString()}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{order.items} товар(ов)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quotes Tab */}
                        {activeTab === 'quotes' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Запросы цен</h2>

                                    <div className="space-y-4">
                                        {mockQuotes.map((quote) => (
                                            <div
                                                key={quote.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium text-gray-900">{quote.id}</span>
                                                            {getStatusBadge(quote.status)}
                                                        </div>
                                                        <p className="text-gray-600 mt-1">{quote.product}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            <Clock className="inline h-4 w-4 mr-1" />
                                                            {quote.date}
                                                        </p>
                                                    </div>
                                                    {quote.price && (
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-green-600">
                                                                ${quote.price.toLocaleString()}
                                                            </p>
                                                            <Link href={`/catalog/product/${quote.id}`}>
                                                                <Button variant="outline" size="sm" className="mt-2">
                                                                    Подробнее
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Уведомления</h2>
                                        <div className="space-y-4">
                                            <label className="flex items-center justify-between">
                                                <span>SMS-уведомления</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span>Email-уведомления</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span>Уведомления о скидках</span>
                                                <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Безопасность</h2>
                                        <div className="space-y-4">
                                            <Button variant="outline" className="w-full justify-between">
                                                Изменить пароль
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between text-red-600 hover:bg-red-50 hover:text-red-700">
                                                Удалить аккаунт
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
