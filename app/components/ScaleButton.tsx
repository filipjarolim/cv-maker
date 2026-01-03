'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ScaleButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
}

export function ScaleButton({
    children,
    className,
    variant = 'primary',
    disabled,
    ...props
}: ScaleButtonProps) {
    // Apple-style variants
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 shadow-lg",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
        glass: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 text-gray-800"
    };

    const variantStyles = variants[variant] || variants.primary;

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={twMerge(
                "flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed export-exclude",
                variantStyles,
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
}
