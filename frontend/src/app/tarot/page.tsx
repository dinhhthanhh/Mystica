'use client';

import { useState, useEffect } from 'react';
import { tarotService } from '@/services/tarot.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Layout, Layers } from 'lucide-react';
import Link from 'next/link';

const SPREAD_PREVIEW = [
    { name: '1 Lá bài', description: 'Câu trả lời nhanh.', icon: BookOpen },
    { name: '3 Lá bài', description: 'Quá khứ - Hiện tại - Tương lai.', icon: Layout },
    { name: 'Celtic Cross', description: 'Cái nhìn toàn diện.', icon: Layers },
];

export default function TarotDecksPage() {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        tarotService.getDecks()
            .then(setDecks)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-mystic-gold">Đang tải các bộ bài huyền bí...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-mystic font-bold mb-4">Chọn Bộ Bài Của Bạn</h1>
                <p className="text-foreground/60 max-w-xl mx-auto">
                    Mỗi bộ bài mang một năng lượng và phong cách diễn giải riêng biệt. Hãy lắng nghe trực giác của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {decks.map((deck: any) => (
                    <motion.div
                        key={deck._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="flex flex-col h-full hover:bg-mystic-purple/20">
                            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-6 bg-mystic-dark border border-mystic-gold/10">
                                {deck.thumbnailUrl ? (
                                    <img src={deck.thumbnailUrl} alt={deck.name} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Sparkles className="h-12 w-12 text-mystic-gold/20" />
                                    </div>
                                )}
                                {deck.isPremium && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-mystic-gold text-mystic-dark text-[10px] font-bold rounded uppercase">
                                        Premium
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-mystic font-bold mb-2">{deck.name}</h3>
                            <p className="text-sm text-foreground/60 mb-6 flex-grow">{deck.description}</p>

                            <Link href={`/tarot/${deck.slug}`}>
                                <Button className="w-full group">
                                    Chọn bộ bài
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-mystic font-bold mb-4">Các Loại Trải Bài Phổ Biến</h2>
                    <p className="text-foreground/40 italic">Bạn sẽ được chọn loại trải bài sau khi chọn bộ bài yêu thích.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {SPREAD_PREVIEW.map((s, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-mystic-gold/5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-mystic-gold/10 flex items-center justify-center mb-4 text-mystic-gold">
                                <s.icon className="h-6 w-6" />
                            </div>
                            <h4 className="font-mystic font-bold text-mystic-gold mb-1">{s.name}</h4>
                            <p className="text-xs text-foreground/40">{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
