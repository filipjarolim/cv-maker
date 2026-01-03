'use client';

import { Trash2 } from 'lucide-react';

import { ScaleButton } from './ScaleButton';

interface SkillBarProps {
    id: string;
    name: string;
    level: number; // 0-100
    onChange: (field: 'name' | 'level', val: string | number) => void;
    onDelete: () => void;
    compact?: boolean;
}

export function SkillBar({ name, level, onChange, onDelete, compact }: SkillBarProps) {
    if (compact) {
        return (
            <div className="group relative bg-white/5 p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-1">
                    <input
                        value={name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-wider text-sidebar-text focus:text-accent-yellow"
                    />
                    <ScaleButton
                        onClick={onDelete}
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-0.5 h-5 w-5"
                        title="Remove Skill"
                    >
                        <Trash2 size={12} />
                    </ScaleButton>
                </div>
                {/* Simplified Level Indicator for Compact Mode */}
                <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent-yellow transition-all duration-300"
                        style={{ width: `${level}%` }}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={level}
                    onChange={(e) => onChange('level', Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title={`Level: ${level}%`}
                />
            </div>
        )
    }

    return (
        <div className="group relative mb-4">
            <div className="flex justify-between items-center mb-1 text-sidebar-text text-sm font-medium uppercase tracking-wider">
                <input
                    value={name}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="bg-transparent border-none outline-none w-full focus:text-accent-yellow transition-colors"
                />
                <ScaleButton
                    onClick={onDelete}
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-white/10 ml-2 no-print p-1 h-8 w-8"
                    title="Remove Skill"
                >
                    <Trash2 size={16} />
                </ScaleButton>
            </div>

            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-accent-yellow transition-all duration-300"
                    style={{ width: `${level}%` }}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={level}
                    onChange={(e) => onChange('level', Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
