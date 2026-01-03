'use client';

import { useThemeStore } from '../store/useThemeStore';
import { useEffect } from 'react';

export function ThemeRegistry() {
    const { accentColor, fontTheme } = useThemeStore();

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent-yellow', accentColor);
        root.style.setProperty('--color-accent-yellow', accentColor); // For Tailwind v4 if mapped

        // Font Logic
        // We assume the fonts are loaded in layout.tsx as variables: 
        // --font-poppins, --font-inter, etc.
        // But we need to define new pairings.

        let fontPrimary = '';

        switch (fontTheme) {
            case 'modern':
                fontPrimary = 'var(--font-inter), sans-serif';
                break;
            case 'classic':
                // We didn't import classic fonts yet, we might need to add them to layout.tsx
                // For now, let's use a standard serif fallback or just Inter/system serif
                fontPrimary = 'Georgia, "Times New Roman", Times, serif';
                break;
            case 'creative':
            default:
                fontPrimary = 'var(--font-poppins), sans-serif';
                break;
        }

        root.style.setProperty('--font-sans', fontPrimary);

    }, [accentColor, fontTheme]);

    return null;
}
