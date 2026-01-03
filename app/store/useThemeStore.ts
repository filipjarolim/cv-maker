import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontTheme = 'modern' | 'classic' | 'creative';

interface ThemeState {
    accentColor: string;
    fontTheme: FontTheme;
    setAccentColor: (color: string) => void;
    setFontTheme: (theme: FontTheme) => void;
    resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            accentColor: '#F59E0B', // Default Yellow
            fontTheme: 'creative', // Default Poppins
            setAccentColor: (accentColor) => set({ accentColor }),
            setFontTheme: (fontTheme) => set({ fontTheme }),
            resetTheme: () => set({ accentColor: '#F59E0B', fontTheme: 'creative' }),
        }),
        {
            name: 'theme-storage',
        }
    )
);
