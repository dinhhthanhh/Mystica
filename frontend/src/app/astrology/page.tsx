'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';
import { Star, Map, Wind, Droplets, Flame, Mountain, Sparkles, Heart, Hash, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const elementIcons: any = {
    'Kim': <Star className="h-4 w-4 text-gray-400" />,
    'Mộc': <Wind className="h-4 w-4 text-green-500" />,
    'Thủy': <Droplets className="h-4 w-4 text-blue-500" />,
    'Hỏa': <Flame className="h-4 w-4 text-red-500" />,
    'Thổ': <Mountain className="h-4 w-4 text-amber-700" />,
};

const ASTROLOGY_FEATURES = [
    { href: '/astrology/compatibility', icon: Heart, title: 'Xem Độ Hợp Đôi', desc: 'Tuổi hợp, mệnh hợp, tình duyên' },
    { href: '/astrology/numerology', icon: Hash, title: 'Số Học Cá Nhân', desc: 'Số đường đời, năm cá nhân' },
];

export default function AstrologyPage() {
    const { user, setAuth } = useAuthStore();

    // Parse initial values
    const initialDate = user?.birthDate ? new Date(user.birthDate) : new Date();
    const [day, setDay] = useState(user?.birthDate ? initialDate.getDate().toString() : '');
    const [month, setMonth] = useState(user?.birthDate ? (initialDate.getMonth() + 1).toString() : '');
    const [year, setYear] = useState(user?.birthDate ? initialDate.getFullYear().toString() : '');

    const initialTime = user?.birthTime ? user.birthTime.split(':') : ['12', '00'];
    const [hour, setHour] = useState(initialTime[0]);
    const [minute, setMinute] = useState(initialTime[1] || '00');

    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Construct strings
            const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const birthTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

            const res = await api.put('/users/profile', { birthDate, birthTime });
            setAuth(res.data, localStorage.getItem('accessToken')!);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-mystic font-bold mb-4">Lá Số Của Bạn</h1>
                <p className="text-foreground/60 max-w-xl mx-auto">
                    Giải mã vận mệnh qua Thiên Can, Địa Chi và Ngũ Hành bản mệnh.
                </p>
            </div>

            {/* Quick Links to Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
                {ASTROLOGY_FEATURES.map((feature) => (
                    <Link key={feature.href} href={feature.href}>
                        <Card className="flex items-center gap-4 p-4 hover:bg-mystic-purple/20 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-mystic-gold/10 flex items-center justify-center text-mystic-gold group-hover:bg-mystic-gold group-hover:text-mystic-dark transition-colors">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-mystic font-bold text-mystic-gold">{feature.title}</h4>
                                <p className="text-xs text-foreground/50">{feature.desc}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-foreground/30 group-hover:text-mystic-gold transition-colors" />
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <Card className="lg:col-span-1">
                    <h3 className="text-xl font-mystic font-bold mb-6 border-b border-mystic-gold/10 pb-4">Thông tin ngày sinh</h3>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Ngày sinh (Dương lịch)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    placeholder="Ngày"
                                    type="number"
                                    min="1" max="31"
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                />
                                <Input
                                    placeholder="Tháng"
                                    type="number"
                                    min="1" max="12"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                                <Input
                                    placeholder="Năm"
                                    type="number"
                                    min="1900" max="2100"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Giờ sinh</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Giờ (0-23)"
                                    type="number"
                                    min="0" max="23"
                                    value={hour}
                                    onChange={(e) => setHour(e.target.value)}
                                />
                                <Input
                                    placeholder="Phút"
                                    type="number"
                                    min="0" max="59"
                                    value={minute}
                                    onChange={(e) => setMinute(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" loading={loading}>Cập nhật lá số</Button>
                    </form>
                </Card>

                {/* Interpretation */}
                <div className="lg:col-span-2 space-y-6">
                    {!user?.zodiacSign ? (
                        <div className="h-full flex items-center justify-center p-12 glass rounded-2xl border-dashed border-2 border-mystic-gold/20">
                            <p className="text-foreground/40 italic">Vui lòng cập nhật thông tin ngày sinh để xem lá số.</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {[
                                { label: 'Cung Hoàng Đạo', value: user.zodiacSign, sub: 'Tử vi phương Tây' },
                                { label: 'Tuổi (Con giáp)', value: user.chineseZodiac, sub: 'Tử vi phương Đông' },
                                { label: 'Bản mệnh', value: user.destiny, sub: 'Cung phi' },
                                { label: 'Ngũ hành', value: user.element, sub: 'Hành tính', icon: elementIcons[user.element] },
                                { label: 'Thiên Can', value: user.heavenlyStem, sub: 'Trời định' },
                                { label: 'Địa Chi', value: user.earthlyBranch, sub: 'Đất dưỡng' },
                            ].map((item, i) => (
                                <Card key={i} hover={false} className="flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Map className="h-12 w-12" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest text-mystic-gold font-bold mb-1">{item.label}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-mystic font-bold text-gradient">{item.value}</span>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] text-foreground/40 mt-2">{item.sub}</span>
                                </Card>
                            ))}
                        </motion.div>
                    )}

                    {user?.prediction && (
                        <Card className="p-8 border-mystic-gold/20 shadow-2xl relative overflow-hidden">
                            <Star className="absolute -top-6 -right-6 h-24 w-24 text-mystic-gold/5 rotate-12" />
                            <h4 className="text-2xl font-mystic font-bold text-mystic-gold mb-6 flex items-center">
                                <Sparkles className="h-6 w-6 mr-2" /> Giải mã từ Mystica AI Astrologer
                            </h4>
                            <div className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap font-serif">
                                {user.prediction}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
