'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Hash, Sparkles, Calendar, Star, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function NumerologyPage() {
    const { user } = useAuthStore();
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
    const [yearResult, setYearResult] = useState<any>(null);

    useEffect(() => {
        if (user?.birthDate) {
            const date = new Date(user.birthDate);
            setBirthDate(date.toISOString().split('T')[0]);
        }
    }, [user]);

    const handleCalculate = async () => {
        if (!birthDate) return;
        setLoading(true);
        try {
            const res = await api.get(`/astrology/numerology?birthDate=${birthDate}`);
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateYear = async () => {
        if (!birthDate || !yearInput) return;
        try {
            const res = await api.get(`/astrology/personal-year?birthDate=${birthDate}&year=${yearInput}`);
            setYearResult(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getNumberColor = (num: number) => {
        const colors: Record<number, string> = {
            1: 'text-red-400', 2: 'text-orange-400', 3: 'text-yellow-400',
            4: 'text-green-400', 5: 'text-cyan-400', 6: 'text-blue-400',
            7: 'text-purple-400', 8: 'text-pink-400', 9: 'text-indigo-400',
            11: 'text-mystic-gold', 22: 'text-mystic-gold', 33: 'text-mystic-gold',
        };
        return colors[num] || 'text-foreground';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-mystic font-bold mb-4 text-gradient">
                    Số Học Pythagore
                </h1>
                <p className="text-foreground/60 max-w-xl mx-auto">
                    Khám phá con số định mệnh và năng lượng cá nhân của bạn thông qua Numerology.
                </p>
            </div>

            <Card className="max-w-xl mx-auto mb-12">
                <h3 className="text-xl font-mystic font-bold text-mystic-gold mb-6 flex items-center gap-2">
                    <Hash className="h-5 w-5" /> Nhập ngày sinh
                </h3>
                <div className="space-y-4">
                    <Input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full"
                    />
                    <Button onClick={handleCalculate} loading={loading} disabled={!birthDate} className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" /> Tính số học
                    </Button>
                </div>
            </Card>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Life Path Number */}
                    <Card className="p-8 border-mystic-gold/30 relative overflow-hidden">
                        <Star className="absolute top-4 right-4 h-16 w-16 text-mystic-gold/10" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`text-6xl font-bold font-mystic ${getNumberColor(result.lifePathNumber.number)}`}>
                                {result.lifePathNumber.number}
                            </div>
                            <div>
                                <h3 className="text-xl font-mystic font-bold text-mystic-gold">Số Đường Đời</h3>
                                <p className="text-sm text-foreground/50">Life Path Number</p>
                            </div>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">{result.lifePathNumber.meaning}</p>
                    </Card>

                    {/* Personal Year */}
                    <Card className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`text-5xl font-bold font-mystic ${getNumberColor(result.personalYear.number)}`}>
                                {result.personalYear.number}
                            </div>
                            <div>
                                <h3 className="text-xl font-mystic font-bold text-mystic-gold">
                                    Năm Cá Nhân {result.personalYear.year}
                                </h3>
                                <p className="text-sm text-foreground/50">Personal Year</p>
                            </div>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">{result.personalYear.meaning}</p>
                    </Card>

                    {/* Check other years */}
                    <Card>
                        <h4 className="text-lg font-mystic font-bold text-mystic-gold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Xem năm cá nhân khác
                        </h4>
                        <div className="flex gap-4">
                            <Input
                                type="number"
                                value={yearInput}
                                onChange={(e) => setYearInput(e.target.value)}
                                min="1900"
                                max="2100"
                                className="flex-grow"
                            />
                            <Button onClick={handleCalculateYear} variant="outline">
                                <TrendingUp className="mr-2 h-4 w-4" /> Xem
                            </Button>
                        </div>
                        {yearResult && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 p-4 glass rounded-xl"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-3xl font-bold ${getNumberColor(yearResult.number)}`}>
                                        {yearResult.number}
                                    </span>
                                    <span className="text-foreground/50">Năm {yearInput}</span>
                                </div>
                                <p className="text-sm text-foreground/70">{yearResult.meaning}</p>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
