'use client';

import { Settings, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore, FontTheme } from '../store/useThemeStore';
import clsx from 'clsx';

const PRESET_COLORS = [
    '#F59E0B', // Amber (Default)
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#EC4899', // Pink
];

interface SettingsPanelProps {
    onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
    const { accentColor, fontTheme, setAccentColor, setFontTheme } = useThemeStore();

    return (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-6 w-80 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm flex items-center gap-2">
                    <Settings size={16} /> Theme Settings
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-black/5 rounded-full"
                >
                    <X size={18} />
                </button>
            </div>

            {/* COLOR PICKER */}
            <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 mb-3 block uppercase tracking-wider">Accent Color</label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                    {PRESET_COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                            style={{ backgroundColor: color }}
                        >
                            {accentColor.toLowerCase() === color.toLowerCase() && <Check size={14} className="text-white drop-shadow-md" />}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-white/20">
                    <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-medium">Custom Hex Code</span>
                </div>
            </div>

            {/* FONT SWITCHER */}
            <div>
                <label className="text-xs font-semibold text-gray-500 mb-3 block uppercase tracking-wider">Typography</label>
                <div className="space-y-2">
                    {(['creative', 'modern', 'classic'] as FontTheme[]).map((font) => (
                        <button
                            key={font}
                            onClick={() => setFontTheme(font)}
                            className={clsx(
                                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all border",
                                fontTheme === font
                                    ? "border-accent-yellow/50 bg-white shadow-sm text-gray-900 font-medium translate-x-1"
                                    : "border-transparent text-gray-600 hover:bg-white/50"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span>{font.charAt(0).toUpperCase() + font.slice(1)}</span>
                                {fontTheme === font && <div className="w-2 h-2 rounded-full bg-accent-yellow" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
