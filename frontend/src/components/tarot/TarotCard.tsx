'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TarotCardProps {
    card?: any;
    isFlipped: boolean;
    isReversed?: boolean;
    onClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function TarotCard({
    card,
    isFlipped,
    isReversed = false,
    onClick,
    className,
    size = 'md'
}: TarotCardProps) {
    const sizeClasses = {
        sm: 'w-24 h-40',
        md: 'w-40 h-64',
        lg: 'w-56 h-80',
    };

    return (
        <div
            className={cn('perspective-1000 cursor-pointer', sizeClasses[size], className)}
            onClick={onClick}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="relative w-full h-full transform-style-3d shadow-xl rounded-xl"
            >
                {/* Card Back */}
                <div className="absolute inset-0 backface-hidden z-10">
                    <div className="w-full h-full rounded-xl glass border-2 border-mystic-gold/30 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                        <div className="w-[90%] h-[90%] border border-mystic-gold/20 rounded-lg flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-2 border-mystic-gold flex items-center justify-center">
                                <div className="w-2 h-2 bg-mystic-gold rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Front */}
                <motion.div
                    className="absolute inset-0 backface-hidden rotate-y-180 z-20"
                    style={{ rotateZ: isReversed ? 180 : 0 }}
                >
                    <div className="w-full h-full rounded-xl overflow-hidden glass border-2 border-mystic-gold/50 bg-black">
                        {card?.imageUrl ? (
                            <Image
                                src={card.imageUrl}
                                alt={card.nameVi || 'Tarot Card'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                <span className="text-mystic-gold font-mystic text-lg font-bold">{card?.nameVi}</span>
                                <span className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">{card?.nameEn}</span>
                            </div>
                        )}

                        {/* Overlay for name */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-xs font-mystic font-bold text-white text-center">{card?.nameVi}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
