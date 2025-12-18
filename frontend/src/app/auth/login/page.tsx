'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, Phone, Lock, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
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
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none select-none">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                </div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        На главную
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                        <CardContent className="p-8 sm:p-12">
                            {/* Logo & Header */}
                            <div className="text-center mb-10">
                                <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                        <Zap className="w-8 h-8 text-primary-500 relative z-10" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-2xl font-black text-white leading-none tracking-tighter uppercase italic">UzAgro</span>
                                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] leading-none">Platform</span>
                                    </div>
                                </Link>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Вход в систему</h1>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                    Крупнейший B2B маркетплейс техники
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Login form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
                                        Номер телефона
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+998 90 123 45 67"
                                            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white font-medium transition-all group-hover:border-white/20"
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                            Пароль
                                        </label>
                                        <Link href="/auth/forgot-password" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-white transition-colors">
                                            Забыли?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white font-medium transition-all group-hover:border-white/20"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/50"
                                    />
                                    <label htmlFor="remember" className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer select-none">
                                        Запомнить это устройство
                                    </label>
                                </div>

                                <Button type="submit" size="xl" isLoading={isLoading} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest variant-premium" variant="premium">
                                    Авторизация
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                                    <span className="px-4 bg-[#0a0f0a] text-gray-600">или</span>
                                </div>
                            </div>

                            {/* Social login */}
                            <div className="grid grid-cols-1 gap-4">
                                <Button variant="outline" size="xl" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <svg className="w-5 h-5 mr-3 text-blue-400 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.782-.417-1.212.258-1.914.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.155.234.17.331.015.098.034.322.019.496z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Telegram Login</span>
                                </Button>
                            </div>

                            {/* Register link */}
                            <div className="mt-10 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Нет аккаунта?{' '}
                                    <Link href="/auth/register" className="text-primary-500 hover:text-white transition-colors ml-1">
                                        Создать профиль
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 space-y-4"
                >
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-primary-500/50" />
                        Безопасная экосистема UzAgro
                    </div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                        Входя в систему, вы соглашаетесь с{' '}
                        <Link href="/terms" className="text-gray-500 hover:text-primary-500 transition-colors underline underline-offset-4">
                            офертой
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
