'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import clsx from 'clsx';

export default function CalendarPage() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
    const [monthData, setMonthData] = useState<any[]>([]);
    const [dayDetail, setDayDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    // Fetch monthly data
    useEffect(() => {
        setLoading(true);
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        api.get(`/calendar/lunar?year=${year}&month=${month}`)
            .then(res => setMonthData(res.data))
            .catch(err => console.error('Month API Error:', err))
            .finally(() => setLoading(false));
    }, [currentMonth]);

    // Fetch day details
    useEffect(() => {
        setDetailLoading(true);
        api.get(`/calendar/day/${selectedDate}`)
            .then(res => setDayDetail(res.data))
            .catch(err => console.error('Day Detail API Error:', err))
            .finally(() => setDetailLoading(false));
    }, [selectedDate]);

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToToday = () => {
        const now = new Date();
        setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
        setSelectedDate(now.toISOString().split('T')[0]);
    };

    interface GridItem {
        day: number;
        isCurrentMonth: boolean;
        date: string;
        lunarDay?: string | number;
        isTerm?: boolean;
        term?: string;
        isFirstLunar?: boolean;
        lunarMonth?: number;
    }

    // Calculate grid days
    const calendarGrid = useMemo<GridItem[]>(() => {
        const firstDay = currentMonth.getDay(); // 0 for Sunday
        const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();

        const grid: GridItem[] = [];

        // Fill previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            grid.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthLastDay - i).toISOString().split('T')[0]
            });
        }

        // Fill current month days
        monthData.forEach(d => {
            grid.push({
                day: d.solarDay,
                lunarDay: d.lunarDay,
                isCurrentMonth: true,
                isTerm: d.isTerm,
                term: d.term,
                isFirstLunar: d.isFirstLunar,
                lunarMonth: d.lunarMonth,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d.solarDay).toISOString().split('T')[0]
            });
        });

        // Fill next month days
        const remaining = 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i).toISOString().split('T')[0]
            });
        }

        return grid;
    }, [currentMonth, monthData]);

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-12">

                {/* Top: Monthly Calendar */}
                <div className="w-full space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <h1 className="text-4xl font-mystic font-bold text-gradient">Lịch Vạn Niên</h1>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" onClick={goToToday} className="px-6 rounded-full glass border-mystic-gold/20">
                                Hôm nay
                            </Button>
                            <div className="flex items-center glass rounded-full p-1 border-mystic-gold/10">
                                <button onClick={prevMonth} className="p-2 hover:text-mystic-gold transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 font-mystic font-bold text-lg min-w-[140px] text-center">
                                    Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
                                </span>
                                <button onClick={nextMonth} className="p-2 hover:text-mystic-gold transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-6 border-mystic-gold/10 shadow-2xl overflow-hidden relative">
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {weekDays.map(d => (
                                <div key={d} className="text-center py-3 text-xs font-bold uppercase tracking-widest text-mystic-gold/60">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="animate-spin h-8 w-8 border-4 border-mystic-gold border-t-transparent rounded-full" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-7 gap-1">
                                {calendarGrid.map((day: GridItem, idx) => {
                                    const isSelected = selectedDate === day.date;
                                    const isToday = new Date().toISOString().split('T')[0] === day.date;

                                    return (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedDate(day.date)}
                                            className={clsx(
                                                "relative h-20 md:h-32 p-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center group",
                                                day.isCurrentMonth ? "hover:bg-mystic-gold/10" : "opacity-20 pointer-events-none",
                                                isSelected ? "bg-mystic-gold text-mystic-purple shadow-mystic-gold/30" : isToday ? "border border-mystic-gold/40" : "glass bg-white/5"
                                            )}
                                        >
                                            <span className={clsx(
                                                "text-xl font-bold transition-all",
                                                isSelected ? "scale-110" : ""
                                            )}>
                                                {day.day}
                                            </span>
                                            {day.lunarDay && (
                                                <span className={clsx(
                                                    "text-[10px] sm:text-sm opacity-60 font-medium",
                                                    day.isFirstLunar ? "text-red-400 font-bold" : ""
                                                )}>
                                                    {day.isFirstLunar ? `${day.lunarDay}/${day.lunarMonth}` : day.lunarDay}
                                                </span>
                                            )}
                                            {day.isTerm && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-mystic-gold opacity-60 shadow-[0_0_10px_rgba(212,175,55,1)]" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom: Day Detail (Full Width) */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {detailLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="w-full flex items-center justify-center p-20"
                            >
                                <div className="animate-spin h-12 w-12 border-4 border-mystic-gold border-t-transparent rounded-full" />
                            </motion.div>
                        ) : dayDetail ? (
                            <motion.div
                                key={selectedDate}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="space-y-12 pb-24"
                            >
                                {/* Row 1: Main Header and Key Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <Card className="lg:col-span-1 relative overflow-hidden p-10 flex flex-col items-center text-center border-mystic-gold/10 bg-gradient-to-br from-mystic-purple/60 to-mystic-black">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-mystic-gold/40" />
                                        <span className="text-[12px] uppercase tracking-[0.5em] text-mystic-gold mb-6 font-bold opacity-80">Bản Tin Chi Tiết</span>

                                        <div className="flex flex-col items-center mb-8">
                                            <div className="text-lg font-medium opacity-60 mb-2">{dayDetail.solar.weekDay}</div>
                                            <div className="text-7xl font-mystic font-bold text-gradient mb-3">
                                                {dayDetail.solar.day}·{dayDetail.solar.month}
                                            </div>
                                            <div className="text-2xl font-mystic text-mystic-gold/80 mb-4">{dayDetail.solar.year}</div>
                                            <div className="px-6 py-2 rounded-full glass text-[11px] text-mystic-gold border-mystic-gold/20 font-bold uppercase tracking-[0.3em]">
                                                Dương Lịch
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="lg:col-span-2 p-10 flex flex-col justify-center border-mystic-gold/10 bg-white/5">
                                        <div className="flex flex-col space-y-8">
                                            <div>
                                                <div className="text-2xl text-foreground font-bold mb-4">{dayDetail.lunar.fullDate}</div>
                                                <div className="text-lg text-mystic-gold/80 italic font-medium">Ngũ hành: {dayDetail.lunar.naYin}</div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="p-5 rounded-3xl glass bg-white/5 border-mystic-gold/10 flex flex-col items-center">
                                                    <span className="text-[10px] uppercase opacity-40 mb-2 tracking-widest">Thiên Can</span>
                                                    <span className="text-xl font-mystic font-bold text-mystic-gold">{dayDetail.lunar.heavenlyStem}</span>
                                                </div>
                                                <div className="p-5 rounded-3xl glass bg-white/5 border-mystic-gold/10 flex flex-col items-center">
                                                    <span className="text-[10px] uppercase opacity-40 mb-2 tracking-widest">Địa Chi</span>
                                                    <span className="text-xl font-mystic font-bold text-mystic-gold">{dayDetail.lunar.earthlyBranch}</span>
                                                </div>
                                                <div className="p-5 rounded-3xl glass bg-white/5 border-mystic-gold/10 flex flex-col items-center">
                                                    <span className="text-[10px] uppercase opacity-40 mb-2 tracking-widest">Con Giáp</span>
                                                    <span className="text-xl font-mystic font-bold text-mystic-gold">{dayDetail.lunar.zodiac}</span>
                                                </div>
                                                <div className="p-5 rounded-3xl glass bg-white/5 border-mystic-gold/10 flex flex-col items-center">
                                                    <span className="text-[10px] uppercase opacity-40 mb-2 tracking-widest">Tiết Khí</span>
                                                    <span className="text-lg font-mystic font-bold text-cyan-400">{dayDetail.term || 'Không có'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Row 2: Feng Shui and Departure */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        <Card className="p-8 border-mystic-gold/10 border-t-2 border-t-cyan-500/30">
                                            <div className="flex items-center space-x-4 mb-6">
                                                <Info className="text-cyan-400 w-6 h-6" />
                                                <h4 className="font-mystic font-bold text-cyan-400 text-lg tracking-[0.2em] uppercase">Thông Tin Phong Thủy</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <div className="opacity-40 text-[11px] uppercase tracking-wider font-bold">Trực (12 Kiến trừ)</div>
                                                    <div className="text-lg font-bold text-foreground/90">{dayDetail.details.zhiXing}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="opacity-40 text-[11px] uppercase tracking-wider font-bold">Sao (28 Tú)</div>
                                                    <div className="text-lg font-bold text-foreground/90">{dayDetail.details.xiu}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="opacity-40 text-[11px] uppercase tracking-wider font-bold">Lục Diêu</div>
                                                    <div className="text-lg font-bold text-mystic-gold">{dayDetail.details.liuYao}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="opacity-40 text-[11px] uppercase tracking-wider font-bold">Vật Hầu</div>
                                                    <div className="text-lg font-bold text-foreground/90">{dayDetail.details.wuHou}</div>
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                                <div><span className="opacity-50 uppercase text-[10px] font-bold mr-4">Bành Tổ Bách Kỵ:</span> <span className="text-foreground/80 font-medium">{dayDetail.details.pengZuGan}, {dayDetail.details.pengZuZhi}</span></div>
                                                <div><span className="opacity-50 uppercase text-[10px] font-bold mr-4">Tuổi Xung Khắc:</span> <span className="text-red-400 font-bold">{dayDetail.details.chong}</span></div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 border-mystic-gold/10 border-t-2 border-t-amber-500/30">
                                            <div className="flex items-center space-x-4 mb-8">
                                                <CalendarIcon className="text-amber-400 w-6 h-6" />
                                                <h4 className="font-mystic font-bold text-amber-400 text-lg tracking-[0.2em] uppercase">Hướng Xuất Hành</h4>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="flex flex-col p-6 rounded-[2rem] glass bg-white/5 border-mystic-gold/10 items-center">
                                                    <span className="opacity-40 text-[10px] uppercase font-bold mb-3">Hỷ Thần</span>
                                                    <span className="text-xl font-bold text-mystic-gold">{dayDetail.details.directions.xi}</span>
                                                </div>
                                                <div className="flex flex-col p-6 rounded-[2rem] glass bg-white/5 border-mystic-gold/10 items-center">
                                                    <span className="opacity-40 text-[10px] uppercase font-bold mb-3">Tài Thần</span>
                                                    <span className="text-xl font-bold text-mystic-gold">{dayDetail.details.directions.cai}</span>
                                                </div>
                                                <div className="flex flex-col p-6 rounded-[2rem] glass bg-white/5 border-mystic-gold/10 items-center">
                                                    <span className="opacity-40 text-[10px] uppercase font-bold mb-3">Hạc Thần</span>
                                                    <span className="text-xl font-bold text-red-400">{dayDetail.details.directions.fu}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="glass rounded-[2.5rem] p-8 border-l-8 border-l-green-500 border-mystic-gold/10 bg-green-500/5 hover:bg-green-500/10 transition-all group">
                                                <div className="flex items-center space-x-4 mb-6">
                                                    <CheckCircle className="text-green-500 w-7 h-7 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-mystic font-bold text-green-500 text-xl tracking-widest uppercase">Việc Nên Làm</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {dayDetail.shouldDo.length > 0 && dayDetail.shouldDo[0] !== 'Không có' ? dayDetail.shouldDo.map((item: string, i: number) => (
                                                        <span key={i} className="text-sm text-foreground/80 bg-green-500/20 px-4 py-1.5 rounded-2xl border border-green-500/30">
                                                            {item}
                                                        </span>
                                                    )) : <span className="text-sm text-foreground/40 italic font-medium">Bình thường</span>}
                                                </div>
                                            </div>

                                            <div className="glass rounded-[2.5rem] p-8 border-l-8 border-l-red-500 border-mystic-gold/10 bg-red-500/5 hover:bg-red-500/10 transition-all group">
                                                <div className="flex items-center space-x-4 mb-6">
                                                    <XCircle className="text-red-500 w-7 h-7 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-mystic font-bold text-red-500 text-xl tracking-widest uppercase">Việc Kiêng Kỵ</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {dayDetail.shouldNotDo.length > 0 && dayDetail.shouldNotDo[0] !== 'Không có' ? dayDetail.shouldNotDo.map((item: string, i: number) => (
                                                        <span key={i} className="text-sm text-foreground/80 bg-red-500/20 px-4 py-1.5 rounded-2xl border border-red-500/30">
                                                            {item}
                                                        </span>
                                                    )) : <span className="text-sm text-foreground/40 italic font-medium">Bình hòa</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="p-8 border-mystic-gold/10 bg-black/40">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-4">
                                                    <Clock className="text-mystic-gold w-6 h-6" />
                                                    <h4 className="font-mystic font-bold text-mystic-gold text-lg tracking-[0.2em] uppercase">Khung Giờ Trong Ngày</h4>
                                                </div>
                                                <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest font-bold opacity-60">
                                                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-mystic-gold mr-2" /> Hoàng Đạo</span>
                                                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-gray-600 mr-2" /> Hắc Đạo</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {dayDetail.auspiciousHours.map((hour: any, i: number) => (
                                                    <div key={i} className={clsx(
                                                        "flex flex-col p-5 rounded-3xl border transition-all hover:scale-105 items-center text-center",
                                                        hour.isAuspicious ? "bg-mystic-gold/10 border-mystic-gold/40 shadow-mystic-gold/10" : "bg-black/40 border-white/5 opacity-50"
                                                    )}>
                                                        <span className={clsx(
                                                            "text-[13px] font-bold mb-1",
                                                            hour.isAuspicious ? "text-mystic-gold" : "text-foreground/60"
                                                        )}>{hour.name}</span>
                                                        <span className="text-[11px] opacity-50 font-mono mb-2">{hour.time.split(' - ')[0]}</span>
                                                        <span className="text-[9px] uppercase tracking-widest font-bold opacity-30 italic">{hour.tianShen}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Row 3: Departure Hours (Lý Thuần Phong) */}
                                <Card className="p-10 border-mystic-gold/10 bg-gradient-to-br from-indigo-900/20 to-black">
                                    <div className="flex items-center space-x-5 mb-10">
                                        <Clock className="text-indigo-400 w-8 h-8" />
                                        <h4 className="font-mystic font-bold text-indigo-400 text-2xl tracking-[0.3em] uppercase">Giờ Xuất Hành (Lý Thuần Phong)</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                                        {dayDetail.departureHours.slice(0, 12).map((hour: any, i: number) => (
                                            <div key={i} className="group relative pl-6 border-l-2 border-white/10 hover:border-indigo-500/60 transition-all">
                                                <div className="flex justify-between items-baseline mb-3">
                                                    <span className="font-bold text-lg text-foreground/90">{hour.name} <span className="text-mystic-gold/60 font-normal ml-2">({hour.zhi})</span></span>
                                                    <span className="text-xs opacity-50 font-mono bg-white/5 px-2 py-0.5 rounded-lg">{hour.time}</span>
                                                </div>
                                                <p className="text-sm text-foreground/50 group-hover:text-foreground/80 transition-colors leading-relaxed italic">
                                                    {hour.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
