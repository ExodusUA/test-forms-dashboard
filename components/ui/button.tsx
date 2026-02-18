import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark focus:ring-brand-orange',
    secondary: 'border border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
    danger: 'border border-red-800 text-red-400 hover:bg-red-900/50 focus:ring-red-500',
    ghost: 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 focus:ring-gray-600',
};

const buttonSizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        disabled,
        children,
        ...props
    }, ref) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
                    'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                    buttonVariants[variant],
                    buttonSizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
