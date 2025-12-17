'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Phone, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'phone' | 'code' | 'newPassword' | 'success'>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (phone.length < 9) {
                throw new Error('Введите корректный номер телефона');
            }

            setStep('code');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка отправки кода');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (code.length !== 6) {
                throw new Error('Введите 6-значный код');
            }

            setStep('newPassword');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неверный код');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (newPassword.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }
            if (newPassword !== confirmPassword) {
                throw new Error('Пароли не совпадают');
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
            setStep('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка сброса пароля');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back link */}
                {step !== 'success' && (
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center text-gray-600 hover:text-green-600 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Вернуться к входу
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

                        {/* Step 1: Enter phone */}
                        {step === 'phone' && (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                    Восстановление пароля
                                </h1>
                                <p className="text-gray-600 text-center mb-8">
                                    Введите номер телефона, привязанный к вашему аккаунту
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSendCode} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Номер телефона
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                placeholder="+998 90 123 45 67"
                                                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                                        Отправить код
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Step 2: Enter code */}
                        {step === 'code' && (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                    Введите код
                                </h1>
                                <p className="text-gray-600 text-center mb-8">
                                    Мы отправили SMS с кодом на номер<br />
                                    <span className="font-medium text-gray-900">{phone}</span>
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyCode} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Код из SMS
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            required
                                            placeholder="123456"
                                            maxLength={6}
                                            className="w-full h-12 px-4 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                                        Подтвердить
                                    </Button>

                                    <p className="text-center text-sm text-gray-600">
                                        Не получили код?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setStep('phone')}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            Отправить снова
                                        </button>
                                    </p>
                                </form>
                            </div>
                        )}

                        {/* Step 3: New password */}
                        {step === 'newPassword' && (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                    Новый пароль
                                </h1>
                                <p className="text-gray-600 text-center mb-8">
                                    Придумайте новый пароль для вашего аккаунта
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Новый пароль
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                placeholder="Минимум 6 символов"
                                                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Подтвердите пароль
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="Повторите пароль"
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                                        Сохранить пароль
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Success */}
                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Пароль изменён!
                                </h1>
                                <p className="text-gray-600 mb-8">
                                    Ваш пароль успешно обновлён. Теперь вы можете войти в аккаунт с новым паролем.
                                </p>
                                <Link href="/auth/login">
                                    <Button size="lg" className="w-full">
                                        Войти в аккаунт
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
