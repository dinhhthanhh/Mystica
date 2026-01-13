'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            await authService.login(data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[url('/bg-stars.png')] bg-fixed bg-cover overflow-hidden relative">
            <div className="absolute inset-0 bg-radial-mystic opacity-50 pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                <Card className="p-8 sm:p-12 space-y-8 glass border-mystic-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]" glow>
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <div className="flex justify-center relative">
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border border-mystic-gold/10 rounded-full border-dashed"
                            ></motion.div>
                            <Sparkles className="h-14 w-14 text-mystic-gold mb-2 relative z-10 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        </div>
                        <h1 className="text-4xl font-mystic font-bold bg-gradient-to-r from-mystic-gold via-white to-mystic-gold bg-clip-text text-transparent">
                            Chào mừng trở lại
                        </h1>
                        <p className="text-foreground/60">
                            Tiếp tục hành trình tâm linh và khám phá vận mệnh của bạn
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-4">
                            <Input
                                label="Địa chỉ Email"
                                placeholder="example@gmail.com"
                                icon={<Mail size={18} />}
                                error={errors.email?.message as string}
                                {...register('email')}
                            />
                            <div className="space-y-1">
                                <Input
                                    label="Mật khẩu"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock size={18} />}
                                    error={errors.password?.message as string}
                                    {...register('password')}
                                />
                                <div className="flex justify-end pr-1">
                                    <Link href="/forgot-password" title="Quên mật khẩu?" className="text-xs text-mystic-gold/60 hover:text-mystic-gold transition-colors">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button type="submit" className="w-full py-6 text-lg font-bold shadow-mystic-gold/20" loading={loading}>
                                Khám phá ngay
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-mystic-gold/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="bg-mystic-dark/50 backdrop-blur-md px-4 text-foreground/40 font-medium italic">Kết nối nguồn năng lượng</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="w-full py-4 border-mystic-gold/20 hover:bg-white/5 group relative overflow-hidden"
                                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full py-4 border-mystic-gold/20 hover:bg-white/5 group relative overflow-hidden"
                                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>

                        <p className="text-center text-sm text-foreground/60 italic font-medium">
                            Chưa tìm thấy duyên phận?{' '}
                            <Link href="/register" className="text-mystic-gold hover:text-white transition-colors underline decoration-mystic-gold/30 underline-offset-4">
                                Đăng ký hành trình
                            </Link>
                        </p>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
}
