import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'premium';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl overflow-hidden transition-all duration-300',
                    {
                        'bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-white/5': variant === 'default',
                        'bg-white dark:bg-zinc-900 shadow-xl shadow-black/10': variant === 'elevated',
                        'border-2 border-gray-300 dark:border-white/10': variant === 'outlined',
                        'glass border border-white/5 shadow-2xl shadow-black/20': variant === 'glass',
                        'bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/10 shadow-2xl': variant === 'premium',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('px-6 py-4 border-b border-white/5', className)} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('p-6', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('px-6 py-4 border-t border-white/5', className)} {...props} />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
