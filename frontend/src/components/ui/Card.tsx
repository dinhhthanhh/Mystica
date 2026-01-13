'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
    hover?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className, glow = false, hover = true, onClick }: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -5, borderColor: 'rgba(212, 175, 55, 0.4)' } : {}}
            className={cn(
                'glass rounded-2xl p-6 transition-all duration-300',
                glow && 'glow',
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
