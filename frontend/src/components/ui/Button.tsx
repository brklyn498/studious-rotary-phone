'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    // Base styles - touch-friendly with premium transitions
    'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
    {
        variants: {
            variant: {
                primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5',
                secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/20 hover:shadow-secondary-500/40 hover:-translate-y-0.5',
                outline: 'border border-white/10 text-white hover:bg-white/5 hover:border-white/20',
                ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
                premium: 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-500 hover:to-accent-500 shadow-xl shadow-primary-500/10 hover:shadow-primary-500/30 hover:-translate-y-0.5 animate-glow',
                danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
            },
            size: {
                sm: 'h-9 px-4 text-xs tracking-wide',
                md: 'h-11 px-6 text-sm tracking-wide min-w-[44px]',
                lg: 'h-13 px-8 text-base tracking-wide min-w-[48px]',
                xl: 'h-16 px-10 text-lg tracking-widest min-w-[56px]',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
