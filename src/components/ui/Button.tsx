import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    iconOnly?: boolean; // ✅ NEW: for compact icon-only buttons
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#11435D] text-white border border-[#11435D]',
    secondary:
        'bg-[#141B23] hover:bg-[#1a2332] text-white border border-[#13181D]',
    ghost: 'bg-transparent hover:bg-[#1a2332] text-gray-400 hover:text-white border-0',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600',
};

// Default padding for regular buttons
const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

// Compact padding for icon-only buttons
const iconOnlySizeClasses: Record<ButtonSize, string> = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
};

export const Button: React.FC<ButtonProps> = ({
    label,
    iconLeft,
    iconRight,
    variant = 'secondary',
    size = 'md',
    loading = false,
    fullWidth = false,
    iconOnly = false,
    className = '',
    children,
    disabled,
    ...rest
}) => {
    const base =
        'inline-flex items-center font-medium transition-all duration-150 ease-in-out focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

    // Use compact padding for iconOnly
    const paddingClasses = iconOnly
        ? iconOnlySizeClasses[size]
        : sizeClasses[size];

    // Default to rounded-md unless className includes rounded-
    const roundedClass = className.includes('rounded-') ? '' : 'rounded-md';

    // Default to justify-center unless className includes justify-
    const justifyClass = className.includes('justify-') ? '' : 'justify-center';

    const composed = [
        base,
        justifyClass,
        roundedClass,
        variantClasses[variant],
        paddingClasses,
        fullWidth ? 'w-full' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={composed}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && (
                <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                >
                    <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                    ></circle>
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                    ></path>
                </svg>
            )}

            {iconLeft && !loading && (
                <span className={!iconOnly ? 'mr-2' : ''}>{iconLeft}</span>
            )}

            {iconOnly ? children : label || children}

            {iconRight && !iconOnly && (
                <span className='ml-2'>{iconRight}</span>
            )}
        </button>
    );
};

export default Button;
