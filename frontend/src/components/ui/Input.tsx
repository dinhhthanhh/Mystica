import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-foreground/80 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-mystic-gold transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    <input
                        className={cn(
                            'flex h-12 w-full rounded-xl glass px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mystic-gold/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-mystic-gold/10 hover:border-mystic-gold/30',
                            icon && 'pl-12',
                            error && 'border-red-500/50 focus-visible:ring-red-500/30',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
