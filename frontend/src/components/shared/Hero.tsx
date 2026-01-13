'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Sparkles, Compass, Moon, Star } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-mystic-accent/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mystic-purple/15 blur-[100px] rounded-full"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border-mystic-gold/20 mb-8">
                        <Sparkles className="h-4 w-4 text-mystic-gold" />
                        <span className="text-xs font-medium tracking-widest uppercase text-mystic-gold">Khám phá Thế giới Huyền bí</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-mystic font-bold mb-8 leading-tight">
                        Ánh Sáng Dẫn Lối <br />
                        <span className="text-gradient">Tâm Hồn Bạn</span>
                    </h1>

                    <p className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Kết nối với trí tuệ cổ xưa qua Tarot, Tử vi và AI Oracle hiện đại.
                        Tìm kiếm câu trả lời cho những thắc mắc sâu thẳm nhất trong lòng bạn.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link href="/tarot">
                            <Button size="lg" className="w-full sm:w-auto">Bắt đầu trải bài</Button>
                        </Link>
                        <Link href="/oracle">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">Trò chuyện với Oracle</Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Icons */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden lg:block absolute -left-20 top-1/2 p-4 glass rounded-2xl"
                >
                    <Compass className="h-8 w-8 text-mystic-gold" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden lg:block absolute -right-20 top-1/3 p-4 glass rounded-2xl"
                >
                    <Moon className="h-8 w-8 text-mystic-gold" />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden lg:block absolute right-1/4 -bottom-10 p-3 glass rounded-xl"
                >
                    <Star className="h-6 w-6 text-mystic-gold" />
                </motion.div>
            </div>
        </section>
    );
}
