'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, Phone, Lock, User, Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

type UserType = 'farmer' | 'business';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<UserType>('farmer');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        inn: '',
        region: '',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const regions = [
        'Ташкент',
        'Ташкентская область',
        'Самарканд',
        'Бухара',
        'Андижан',
        'Фергана',
        'Наманган',
        'Навои',
        'Кашкадарья',
        'Сурхандарья',
        'Хорезм',
        'Каракалпакстан',
        'Джизак',
        'Сырдарья',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validation
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Пароли не совпадают');
            }
            if (formData.password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }
            if (!formData.agreeToTerms) {
                throw new Error('Необходимо согласиться с условиями использования');
            }

            // API Call
            await authApi.register({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                password_confirm: formData.confirmPassword,
                user_type: userType,
                company_name: userType === 'business' ? formData.companyName : undefined,
                inn: userType === 'business' ? formData.inn : undefined,
                region_name: formData.region,
            });

            // Successful registration - show success step
            setStep(3);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Ошибка регистрации. Проверьте данные.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setFormData(prev => ({
            ...prev,
            [target.name]: value,
        }));
        setError(null);
    };

    const nextStep = () => {
        if (step === 1) {
            setStep(2);
        }
    };

    const prevStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back link */}
                {step < 3 && (
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-green-600 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        На главную
                    </Link>
                )}

                <Card className="shadow-xl">
                    <CardContent className="p-8">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">У</span>
                                </div>
                                <span className="text-2xl font-bold text-green-800">УзАгро</span>
                            </Link>
                        </div>

                        {/* Step 1: Choose account type */}
                        {step === 1 && (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                    Регистрация
                                </h1>
                                <p className="text-gray-600 text-center mb-8">
                                    Выберите тип аккаунта
                                </p>

                                <div className="space-y-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={() => setUserType('farmer')}
                                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${userType === 'farmer'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userType === 'farmer' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Фермер / Физическое лицо</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Для индивидуальных покупателей и небольших хозяйств
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setUserType('business')}
                                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${userType === 'business'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userType === 'business' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Бизнес / Организация</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Для юридических лиц с верификацией через ИНН
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <Button size="lg" className="w-full" onClick={nextStep}>
                                    Продолжить
                                </Button>

                                <p className="text-center text-gray-600 mt-6">
                                    Уже есть аккаунт?{' '}
                                    <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                                        Войти
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* Step 2: Registration form */}
                        {step === 2 && (
                            <div>
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center text-gray-600 hover:text-green-600 mb-6"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Назад
                                </button>

                                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                    {userType === 'business' ? 'Регистрация бизнеса' : 'Регистрация'}
                                </h1>
                                <p className="text-gray-600 text-center mb-8">
                                    Заполните данные для создания аккаунта
                                </p>

                                {/* Error message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {userType === 'business' ? 'Контактное лицо' : 'Ваше имя'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Алишер Каримов"
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    {userType === 'business' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Название компании *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder='ООО "Агрохолдинг"'
                                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ИНН (для верификации)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="inn"
                                                    value={formData.inn}
                                                    onChange={handleChange}
                                                    placeholder="123456789"
                                                    maxLength={9}
                                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Введите ИНН для получения B2B условий и оптовых цен
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Номер телефона *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+998 90 123 45 67"
                                                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="email@example.com"
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Регион
                                        </label>
                                        <select
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                        >
                                            <option value="">Выберите регион</option>
                                            {regions.map((region) => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Пароль *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                placeholder="Минимум 6 символов"
                                                className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Подтвердите пароль *
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Повторите пароль"
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <label className="flex items-start gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleChange}
                                            className="w-5 h-5 mt-0.5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Я соглашаюсь с{' '}
                                            <Link href="/terms" className="text-green-600 hover:underline">
                                                условиями использования
                                            </Link>{' '}
                                            и{' '}
                                            <Link href="/privacy" className="text-green-600 hover:underline">
                                                политикой конфиденциальности
                                            </Link>
                                        </span>
                                    </label>

                                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                                        Зарегистрироваться
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Регистрация завершена!
                                </h1>
                                <p className="text-gray-600 mb-8">
                                    Аккаунт успешно создан. Мы отправили SMS с кодом подтверждения на указанный номер телефона.
                                </p>
                                <Button size="lg" onClick={() => router.push('/auth/login')} className="w-full">
                                    Войти в аккаунт
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
