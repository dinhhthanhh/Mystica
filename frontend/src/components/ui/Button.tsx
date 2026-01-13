'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-mystic-gold text-mystic-dark hover:bg-mystic-gold/90 border-transparent shadow-[0_0_15px_rgba(212,175,55,0.3)]',
            secondary: 'bg-mystic-purple text-foreground hover:bg-mystic-purple/80 border-mystic-gold/20 shadow-[0_0_15px_rgba(107,33,168,0.3)]',
            outline: 'bg-transparent border-mystic-gold/50 text-mystic-gold hover:bg-mystic-gold/10',
            ghost: 'bg-transparent hover:bg-white/5 text-foreground/80 hover:text-foreground',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-6 py-2.5 text-sm',
            lg: 'px-8 py-3.5 text-base',
        };

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none border disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref as any}
                {...(props as any)}
            >
                {loading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
