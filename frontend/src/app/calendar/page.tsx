'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function CalendarPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setData(null);
        api.get(`/calendar/day/${date}`)
            .then(res => setData(res.data))
            .catch(err => {
                console.error('Calendar API Error:', err);
                setData({ error: true });
            })
            .finally(() => setLoading(false));
    }, [date]);

    const changeDate = (days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split('T')[0]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Date Selector */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <h1 className="text-4xl md:text-5xl font-mystic font-bold">Lịch Vạn Niên</h1>

                <div className="flex items-center space-x-4 glass rounded-full px-6 py-2 border-mystic-gold/20">
                    <button onClick={() => changeDate(-1)} className="p-1 hover:text-mystic-gold transition-colors">
                        <ChevronLeft />
                    </button>
                    <span className="text-lg font-mystic font-bold text-gradient min-w-[120px] text-center">
                        {formatDate(date)}
                    </span>
                    <button onClick={() => changeDate(1)} className="p-1 hover:text-mystic-gold transition-colors">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-mystic-gold border-t-transparent rounded-full" />
                </div>
            ) : data?.error ? (
                <div className="h-[50vh] flex flex-col items-center justify-center glass rounded-3xl border border-mystic-gold/10">
                    <XCircle className="h-16 w-16 text-red-500 mb-4 opacity-20" />
                    <p className="text-foreground/60 italic mb-6">Không thể tải dữ liệu lịch cho ngày này.</p>
                    <Button onClick={() => setDate(new Date().toISOString().split('T')[0])}>Quay lại hôm nay</Button>
                </div>
            ) : data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Day Info */}
                    <Card className="lg:col-span-1 flex flex-col items-center text-center p-10 bg-gradient-to-b from-mystic-purple/20 to-transparent">
                        <span className="text-sm uppercase tracking-[0.2em] text-mystic-gold font-bold mb-4">Ngày Âm Lịch</span>
                        <div className="text-8xl font-mystic font-bold text-gradient mb-2">{data.lunarDay}</div>
                        <div className="text-xl font-mystic text-foreground/80 mb-6">Tháng {data.lunarMonth} năm {data.lunarYear}</div>
                        <div className="w-full h-[1px] bg-mystic-gold/10 mb-8" />

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="p-4 rounded-xl glass bg-white/5">
                                <p className="text-[10px] uppercase text-foreground/40 mb-1">Thiên Can</p>
                                <p className="font-mystic font-bold text-mystic-gold">{data.heavenlyStem}</p>
                            </div>
                            <div className="p-4 rounded-xl glass bg-white/5">
                                <p className="text-[10px] uppercase text-foreground/40 mb-1">Địa Chi</p>
                                <p className="font-mystic font-bold text-mystic-gold">{data.earthlyBranch}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Detailed Advice */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-green-500/10 hover:bg-green-500/5">
                                <div className="flex items-center space-x-3 mb-4">
                                    <CheckCircle className="text-green-500 h-6 w-6" />
                                    <h4 className="text-lg font-mystic font-bold text-green-500">Nên Làm</h4>
                                </div>
                                <ul className="space-y-2 text-sm text-foreground/70">
                                    {data.shouldDo.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2 text-mystic-gold">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="border-red-500/10 hover:bg-red-500/5">
                                <div className="flex items-center space-x-3 mb-4">
                                    <XCircle className="text-red-500 h-6 w-6" />
                                    <h4 className="text-lg font-mystic font-bold text-red-500">Kiêng Kỵ</h4>
                                </div>
                                <ul className="space-y-2 text-sm text-foreground/70">
                                    {data.shouldNotDo.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2 text-red-400">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        <Card>
                            <div className="flex items-center space-x-3 mb-6">
                                <Clock className="text-mystic-gold h-6 w-6" />
                                <h4 className="text-xl font-mystic font-bold text-mystic-gold uppercase tracking-widest">Giờ Hoàng Đạo</h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {data.auspiciousHours.map((hour: string, i: number) => (
                                    <span key={i} className="px-4 py-2 rounded-lg glass bg-mystic-gold/5 text-sm font-medium border border-mystic-gold/20 hover:border-mystic-gold/50 transition-colors">
                                        {hour}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
