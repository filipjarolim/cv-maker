'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComponentProps, useEffect, useRef, useState } from 'react';

interface EditableFieldProps extends ComponentProps<'input'> {
    value: string;
    onSave: (value: string) => void;
    multiline?: boolean;
    className?: string;
    placeholder?: string;
    warningThreshold?: number;
}

export function EditableField({
    value,
    onSave,
    multiline = false,
    className,
    placeholder,
    warningThreshold,
    ...props
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Density Warning Logic
    const isDense = warningThreshold && value ? value.length > warningThreshold : false;

    // Sync with prop value if it changes externally
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (localValue !== value) {
            onSave(localValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            handleBlur();
        }
    };

    const commonClasses = twMerge(
        "bg-transparent border border-transparent rounded px-1 -mx-1 hover:bg-gray-100/50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 outline-none transition-all w-full text-inherit font-inherit leading-inherit min-h-[1.5em] box-border",
        className
    );

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    autoFocus
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={twMerge(
                        commonClasses,
                        "bg-white text-gray-900 resize-none overflow-hidden block h-auto min-h-[1.5em]"
                    )}
                    placeholder={placeholder}
                    rows={Math.max(1, value.split('\n').length)}
                    {...(props as ComponentProps<'textarea'>)}
                />
            );
        }

        return (
            <input
                autoFocus
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={twMerge(
                    commonClasses,
                    "bg-white text-gray-900"
                )}
                placeholder={placeholder}
                {...props}
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={twMerge(
                "cursor-text min-w-[20px] rounded px-1 -mx-1 border border-transparent hover:border-gray-200 transition-colors duration-200",
                isDense ? "text-amber-600 bg-amber-50 hover:bg-amber-100/50 border-amber-200" : "hover:bg-gray-50",
                (!value || value.trim() === "") && "text-gray-400 italic",
                className
            )}
            title={isDense ? "This section is getting dense. Consider shortening for better readability." : "Click to edit"}
        >
            {value || placeholder}
        </div>
    );
}
