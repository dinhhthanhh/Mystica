'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tarotService } from '@/services/tarot.service';
import TarotCard from '@/components/tarot/TarotCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Send, BookOpen, Layout, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const SPREAD_TYPES = [
    { id: '1-card', name: '1 Lá bài', description: 'Câu trả lời nhanh cho một vấn đề cụ thể.', count: 1, icon: BookOpen },
    { id: '3-card', name: '3 Lá bài', description: 'Trải bài Quá khứ - Hiện tại - Tương lai.', count: 3, icon: Layout },
    { id: 'celtic-cross', name: 'Celtic Cross', description: 'Cái nhìn sâu sắc và toàn diện về vấn đề.', count: 10, icon: Layers },
];

export default function TarotReadingPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [deck, setDeck] = useState<any>(null);
    const [step, setStep] = useState<'spread' | 'question' | 'shuffle' | 'pick' | 'result'>('spread');
    const [selectedSpread, setSelectedSpread] = useState<any>(null);
    const [question, setQuestion] = useState('');
    const [pickedCards, setPickedCards] = useState<number[]>([]);
    const [readingResult, setReadingResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        tarotService.getDeckBySlug(slug as string).then(setDeck);
    }, [slug]);

    const handlePickCard = (index: number) => {
        if (pickedCards.length < selectedSpread.count && !pickedCards.includes(index)) {
            const newPicked = [...pickedCards, index];
            setPickedCards(newPicked);
            if (newPicked.length === selectedSpread.count) {
                // Automatically move to results after a short delay or show "See Result" button
            }
        }
    };

    const handleCreateReading = async () => {
        setLoading(true);
        try {
            const result = await tarotService.createReading({
                deckSlug: slug as string,
                spreadType: selectedSpread.id,
                question,
            });
            setReadingResult(result);
            setStep('result');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#8b5cf6', '#ffffff']
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!deck) return <div className="min-h-screen flex items-center justify-center">Đang kết nối với linh hồn bộ bài...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Step Indicator */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center space-x-4">
                    {['Chọn trải bài', 'Đặt câu hỏi', 'Rút bài', 'Kết quả'].map((s, i) => (
                        <div key={i} className="flex items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                (i === 0 && step === 'spread') ||
                                    (i === 1 && step === 'question') ||
                                    (i === 2 && (step === 'shuffle' || step === 'pick')) ||
                                    (i === 3 && step === 'result') ? "bg-mystic-gold border-mystic-gold text-mystic-dark" : "border-mystic-gold/30 text-mystic-gold/50"
                            )}>
                                {i + 1}
                            </div>
                            {i < 3 && <div className="w-8 h-[2px] bg-mystic-gold/20 mx-2" />}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'spread' && (
                    <motion.div
                        key="spread"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-mystic font-bold mb-4">Chọn Trải Bài</h2>
                            <p className="text-foreground/60">Lựa chọn cách thức các lá bài hiển thị thông điệp.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {SPREAD_TYPES.map((spread) => (
                                <Card
                                    key={spread.id}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all flex flex-col items-center text-center group",
                                        selectedSpread?.id === spread.id ? "border-mystic-gold bg-mystic-purple/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-transparent"
                                    )}
                                    onClick={() => setSelectedSpread(spread)}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                                        selectedSpread?.id === spread.id ? "bg-mystic-gold text-mystic-dark" : "bg-mystic-gold/10 text-mystic-gold group-hover:bg-mystic-gold group-hover:text-mystic-dark"
                                    )}>
                                        <spread.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-mystic font-bold text-mystic-gold mb-2">{spread.name}</h3>
                                    <p className="text-sm text-foreground/60">{spread.description}</p>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Button disabled={!selectedSpread} onClick={() => setStep('question')}>
                                Tiếp tục
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'question' && (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-2xl mx-auto space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-mystic font-bold mb-4">Gửi Gắm Câu Hỏi</h2>
                            <p className="text-foreground/60">Hãy tập trung tâm trí và viết ra điều bạn đang băn khoăn (không bắt buộc).</p>
                        </div>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ví dụ: Công việc của tôi trong 3 tháng tới sẽ như thế nào?..."
                            className="w-full h-40 glass rounded-2xl p-6 text-lg focus:outline-none border-mystic-gold/20 focus:border-mystic-gold/50 transition-all"
                        />
                        <div className="flex justify-center space-x-4">
                            <Button variant="outline" onClick={() => setStep('spread')}>Quay lại</Button>
                            <Button onClick={() => setStep('pick')}>Bắt đầu rút bài</Button>
                        </div>
                    </motion.div>
                )}

                {step === 'pick' && (
                    <motion.div
                        key="pick"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-mystic font-bold mb-2">Trực Giác Dẫn Lối</h2>
                            <p className="text-mystic-gold font-medium">
                                Chọn {selectedSpread.count - pickedCards.length} lá bài nữa
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto px-10">
                            {Array.from({ length: 22 }).map((_, i) => (
                                <TarotCard
                                    key={i}
                                    isFlipped={false}
                                    size="sm"
                                    className={cn(
                                        "transition-all duration-500",
                                        pickedCards.includes(i) ? "-translate-y-10 opacity-50 pointer-events-none scale-105" : "hover:-translate-y-4"
                                    )}
                                    onClick={() => handlePickCard(i)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                disabled={pickedCards.length < selectedSpread.count}
                                onClick={handleCreateReading}
                                loading={loading}
                            >
                                Xem kết quả <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && readingResult && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12 max-w-4xl mx-auto"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl md:text-5xl font-mystic font-bold mb-4">Thông Điệp Của Bạn</h2>
                            <p className="text-foreground/60 italic">"{question || 'Câu hỏi thầm kín'}"</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8">
                            {readingResult.cards.map((rc: any, i: number) => (
                                <div key={i} className="text-center space-y-4">
                                    <p className="text-xs font-bold text-mystic-gold uppercase tracking-tighter">{rc.positionMeaning}</p>
                                    <TarotCard
                                        card={rc.cardId}
                                        isFlipped={true}
                                        isReversed={rc.isReversed}
                                        size="md"
                                    />
                                </div>
                            ))}
                        </div>

                        <Card className="mt-12 p-8 border-mystic-gold/20 shadow-2xl relative">
                            <Sparkles className="absolute -top-4 -left-4 h-8 w-8 text-mystic-gold" />
                            <h3 className="text-2xl font-mystic font-bold text-mystic-gold mb-6 border-b border-mystic-gold/10 pb-4">Lời Tiên Tri Từ Mystica Oracle</h3>
                            <div className="text-foreground/90 leading-relaxed text-lg whitespace-pre-wrap font-serif">
                                {readingResult.aiInterpretation}
                            </div>
                        </Card>

                        <div className="flex justify-center pt-8">
                            <Button variant="outline" onClick={() => router.push('/tarot')}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Rút bài mới
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

