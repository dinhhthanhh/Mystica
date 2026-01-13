'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Scale, Flame, Droplets, Wind, Mountain, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const elementIcons: Record<string, React.ReactNode> = {
    'Kim': <Star className="h-5 w-5 text-gray-300" />,
    'Mộc': <Wind className="h-5 w-5 text-green-500" />,
    'Thủy': <Droplets className="h-5 w-5 text-blue-500" />,
    'Hỏa': <Flame className="h-5 w-5 text-red-500" />,
    'Thổ': <Mountain className="h-5 w-5 text-amber-600" />,
};

export default function CompatibilityPage() {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = async () => {
        if (!date1 || !date2) return;
        setLoading(true);
        try {
            const res = await api.post('/astrology/compatibility', {
                date1,
                date2,
            });
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-mystic font-bold mb-4 text-gradient">
                    Xem Độ Hợp Đôi
                </h1>
                <p className="text-foreground/60 max-w-xl mx-auto">
                    Khám phá sự tương hợp giữa hai người dựa trên Cung Hoàng Đạo, Con Giáp và Ngũ Hành.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto mb-12">
                <h3 className="text-xl font-mystic font-bold text-mystic-gold mb-6 flex items-center gap-2">
                    <Heart className="h-5 w-5" /> Nhập thông tin hai người
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground/80">Người thứ nhất</label>
                        <Input
                            type="date"
                            value={date1}
                            onChange={(e) => setDate1(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground/80">Người thứ hai</label>
                        <Input
                            type="date"
                            value={date2}
                            onChange={(e) => setDate2(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <Button onClick={handleCalculate} loading={loading} disabled={!date1 || !date2}>
                        <Sparkles className="mr-2 h-4 w-4" /> Xem độ hợp
                    </Button>
                </div>
            </Card>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Overall Score */}
                    <Card className="text-center p-8 border-mystic-gold/30">
                        <div className="mb-4">
                            <span className={cn("text-7xl font-bold font-mystic", getScoreColor(result.overallScore))}>
                                {result.overallScore}%
                            </span>
                        </div>
                        <p className="text-xl text-foreground/80 italic">{result.overallDescription}</p>
                    </Card>

                    {/* Person Profiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[result.person1, result.person2].map((person, i) => (
                            <Card key={i} className="relative overflow-hidden">
                                <div className="absolute top-3 right-3 opacity-20">
                                    {elementIcons[person.element]}
                                </div>
                                <h4 className="text-lg font-mystic font-bold text-mystic-gold mb-4">
                                    Người {i + 1}
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-foreground/50">Cung:</span> <span className="font-medium">{person.zodiacSign}</span></p>
                                    <p><span className="text-foreground/50">Tuổi:</span> <span className="font-medium">{person.chineseZodiac}</span></p>
                                    <p><span className="text-foreground/50">Mệnh:</span> <span className="font-medium">{person.destiny}</span></p>
                                    <p><span className="text-foreground/50">Ngũ Hành:</span> <span className="font-medium">{person.element}</span></p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Detailed Compatibility */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <Scale className="h-8 w-8 text-mystic-gold mx-auto mb-3" />
                            <h4 className="font-mystic font-bold mb-2">Cung Hoàng Đạo</h4>
                            <p className={cn("text-3xl font-bold mb-2", getScoreColor(result.zodiacCompatibility.score))}>
                                {result.zodiacCompatibility.score}%
                            </p>
                            <p className="text-xs text-foreground/60">{result.zodiacCompatibility.description}</p>
                        </Card>

                        <Card className="text-center">
                            <Heart className="h-8 w-8 text-mystic-gold mx-auto mb-3" />
                            <h4 className="font-mystic font-bold mb-2">Con Giáp (Tuổi)</h4>
                            <p className={cn("text-3xl font-bold mb-2", getScoreColor(result.chineseZodiacCompatibility.score))}>
                                {result.chineseZodiacCompatibility.score}%
                            </p>
                            <p className="text-xs text-foreground/60">{result.chineseZodiacCompatibility.description}</p>
                        </Card>

                        <Card className="text-center">
                            <Flame className="h-8 w-8 text-mystic-gold mx-auto mb-3" />
                            <h4 className="font-mystic font-bold mb-2">Ngũ Hành</h4>
                            <p className={cn("text-3xl font-bold mb-2", getScoreColor(result.elementCompatibility.score))}>
                                {result.elementCompatibility.score}%
                            </p>
                            <p className="text-sm text-mystic-gold font-medium mb-1">{result.elementCompatibility.relation}</p>
                            <p className="text-xs text-foreground/60">{result.elementCompatibility.description}</p>
                        </Card>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
