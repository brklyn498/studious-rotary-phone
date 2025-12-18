'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, Phone, Lock, User, Building2, ArrowLeft, CheckCircle, Zap, ShieldCheck, Mail, MapPin } from 'lucide-react';
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
        'Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Фергана', 'Наманган', 'Навои',
        'Кашкадарья', 'Сурхандарья', 'Хорезм', 'Каракалпакстан', 'Джизак', 'Сырдарья',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
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

    const nextStep = () => step === 1 && setStep(2);
    const prevStep = () => step === 2 && setStep(1);

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
                </div>
            </div>

            <div className="w-full max-w-xl relative z-10">
                {step < 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Link
                            href="/"
                            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white mb-8 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            На главную
                        </Link>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                        <CardContent className="p-8 sm:p-12">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-10"
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-8">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-primary-500/10 blur-xl" />
                                                    <User className="w-8 h-8 text-primary-500 relative z-10" />
                                                </div>
                                            </div>
                                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Регистрация</h1>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Выберите тип профиля</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setUserType('farmer')}
                                                className={`group p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${userType === 'farmer' ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {userType === 'farmer' && (
                                                    <motion.div layoutId="activeType" className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
                                                )}
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${userType === 'farmer' ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-500'
                                                    }`}>
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <h3 className="font-black text-white uppercase tracking-tight mb-2">Фермер</h3>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">Для индивидуальных покупателей и хозяйств</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setUserType('business')}
                                                className={`group p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${userType === 'business' ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {userType === 'business' && (
                                                    <motion.div layoutId="activeType" className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
                                                )}
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${userType === 'business' ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-500'
                                                    }`}>
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <h3 className="font-black text-white uppercase tracking-tight mb-2">Бизнес</h3>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">Для юридических лиц с проверкой ИНН</p>
                                            </button>
                                        </div>

                                        <Button size="xl" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest variant-premium" variant="premium" onClick={nextStep}>
                                            Продолжить
                                        </Button>

                                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                            Уже есть аккаунт?{' '}
                                            <Link href="/auth/login" className="text-primary-500 hover:text-white transition-colors ml-1">
                                                Войти в систему
                                            </Link>
                                        </p>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-8"
                                    >
                                        <button onClick={prevStep} className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors mb-4">
                                            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                                        </button>

                                        <div>
                                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                                                {userType === 'business' ? 'Данные организации' : 'Личные данные'}
                                            </h1>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Заполните форму для регистрации</p>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">ФИО *</label>
                                                    <div className="relative group">
                                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Алишер Каримов"
                                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Телефон *</label>
                                                    <div className="relative group">
                                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+998"
                                                            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    </div>
                                                </div>

                                                {userType === 'business' && (
                                                    <>
                                                        <div className="sm:col-span-2">
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Компания *</label>
                                                            <div className="relative group">
                                                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder='ООО "AGRO GROUP"'
                                                                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">ИНН</label>
                                                            <div className="relative group">
                                                                <input type="text" name="inn" value={formData.inn} onChange={handleChange} placeholder="123456789" maxLength={9}
                                                                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Email</label>
                                                    <div className="relative group">
                                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="mail@example.com"
                                                            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Регион</label>
                                                    <div className="relative group">
                                                        <select name="region" value={formData.region} onChange={handleChange}
                                                            className="w-full h-12 pl-12 pr-10 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm appearance-none cursor-pointer">
                                                            <option value="" className="bg-background text-white">Выбрать...</option>
                                                            {regions.map(r => <option key={r} value={r} className="bg-background text-white">{r}</option>)}
                                                        </select>
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Пароль *</label>
                                                    <div className="relative group">
                                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••"
                                                            className="w-full h-12 pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Повтор *</label>
                                                    <div className="relative group">
                                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••"
                                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <label className="flex items-start gap-3 py-2 cursor-pointer group">
                                                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange}
                                                    className="w-5 h-5 mt-1 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/50" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed group-hover:text-gray-400 transition-colors">
                                                    Я соглашаюсь с <Link href="/terms" className="text-primary-500 underline underline-offset-4">условиями</Link> и <Link href="/privacy" className="text-primary-500 underline underline-offset-4">политикой конфиденциальности</Link>
                                                </span>
                                            </label>

                                            <Button type="submit" size="xl" isLoading={isLoading} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest variant-premium" variant="premium">
                                                Создать профиль
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-center py-10 space-y-8"
                                    >
                                        <div className="w-24 h-24 bg-primary-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20" />
                                            <CheckCircle className="h-12 w-12 text-primary-500 relative z-10" />
                                        </div>
                                        <div className="space-y-4">
                                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Успешно!</h1>
                                            <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed max-w-sm mx-auto tracking-wider">
                                                Аккаунт {userType === 'business' ? 'бизнес-профиля' : 'пользователя'} создан. Мы отправили SMS с кодом подтверждения на указанный номер.
                                            </p>
                                        </div>
                                        <Button size="xl" onClick={() => router.push('/auth/login')} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest variant-premium" variant="premium">
                                            Войти в аккаунт
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="flex justify-center mt-10 gap-8">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-primary-500/50" /> SSL SECURE
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <Zap className="w-4 h-4 text-primary-500/50" /> FAST ACCESS
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
