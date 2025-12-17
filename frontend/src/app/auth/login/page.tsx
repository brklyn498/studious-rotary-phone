'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, Phone, Lock, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // API Call
            const response = await authApi.login({
                phone: formData.phone,
                password: formData.password,
            });

            // Save token (Example: local storage or cookie, ideally via userStore)
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);

            // Redirect to home or callback url
            router.push('/');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Ошибка входа. Проверьте номер и пароль.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-green-600 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    На главную
                </Link>

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
                            <h1 className="text-2xl font-bold text-gray-900 mt-6">Вход в аккаунт</h1>
                            <p className="text-gray-600 mt-2">
                                Введите данные для входа в личный кабинет
                            </p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Номер телефона
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
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
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

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
                                </label>
                                <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                                    Забыли пароль?
                                </Link>
                            </div>

                            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                                Войти
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">или</span>
                            </div>
                        </div>

                        {/* Telegram login */}
                        <Button variant="outline" size="lg" className="w-full mb-4">
                            <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.782-.417-1.212.258-1.914.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.155.234.17.331.015.098.034.322.019.496z" />
                            </svg>
                            Войти через Telegram
                        </Button>

                        {/* Register link */}
                        <p className="text-center text-gray-600">
                            Нет аккаунта?{' '}
                            <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
                                Зарегистрироваться
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Входя в систему, вы соглашаетесь с{' '}
                    <Link href="/terms" className="text-green-600 hover:underline">
                        условиями использования
                    </Link>
                </p>
            </div>
        </div>
    );
}
