'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Palette, RotateCcw, Download, FileText, Image as ImageIcon, Printer, ZoomIn, ZoomOut, Maximize, Undo2, Redo2, LayoutTemplate, Grid, List } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useState, useEffect } from 'react';
import { SettingsPanel } from './SettingsPanel';

interface FloatingDockProps {
    onPrint: () => void;
    onExportPng: () => void;
    onExportWord: () => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    onFitView: () => void;
}

export function FloatingDock({ onPrint, onExportPng, onExportWord, zoom, setZoom, onFitView }: FloatingDockProps) {
    const { resetResume, undo, redo, layout, updateLayout } = useResumeStore();
    const [activeTab, setActiveTab] = useState<'none' | 'theme' | 'layout'>('none');

    // Keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                e.preventDefault();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                redo();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your resume to default data? All changes will be lost.")) {
            resetResume();
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-4 z-50 print:hidden">

            <AnimatePresence>
                {/* Theme Panel */}
                {activeTab === 'theme' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 left-0 -translate-x-1/2 mb-4"
                    >
                        <SettingsPanel onClose={() => setActiveTab('none')} />
                    </motion.div>
                )}

                {/* Layout Panel */}
                {activeTab === 'layout' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 left-0 -translate-x-1/2 mb-4 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 w-80"
                    >
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Layout Tuner</h3>

                        {/* Density Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                                <span>Density (Gap)</span>
                                <span>{layout?.sectionGap || 48}px</span>
                            </div>
                            <input
                                type="range"
                                min="16"
                                max="96"
                                step="8"
                                value={layout?.sectionGap || 48}
                                onChange={(e) => updateLayout('sectionGap', Number(e.target.value))}
                                className="w-full accent-blue-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Skills Mode Toggle */}
                        <div>
                            <div className="text-xs font-semibold text-gray-600 mb-2">Skills Display</div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => updateLayout('skillsMode', 'list')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${layout?.skillsMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <List size={14} /> List
                                </button>
                                <button
                                    onClick={() => updateLayout('skillsMode', 'grid')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${layout?.skillsMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Grid size={14} /> Grid
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DOCK BAR */}
            <motion.div
                className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* History Controls */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
                    <button onClick={undo} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Undo (Cmd+Z)">
                        <Undo2 size={20} />
                    </button>
                    <button onClick={redo} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Redo (Cmd+Y)">
                        <Redo2 size={20} />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
                    <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Zoom Out">
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-xs font-medium w-8 text-center tabular-nums text-gray-500 hidden sm:block">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Zoom In">
                        <ZoomIn size={20} />
                    </button>
                    <button onClick={onFitView} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Fit to Screen">
                        <Maximize size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Layout Button */}
                    <button
                        onClick={() => setActiveTab(activeTab === 'layout' ? 'none' : 'layout')}
                        className={`p-2 rounded-xl transition-all duration-300 ${activeTab === 'layout' ? 'bg-blue-100 text-blue-600 scale-110' : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Layout Tuner"
                    >
                        <LayoutTemplate size={20} />
                    </button>

                    {/* Theme Button */}
                    <button
                        onClick={() => setActiveTab(activeTab === 'theme' ? 'none' : 'theme')}
                        className={`p-2 rounded-xl transition-all duration-300 ${activeTab === 'theme' ? 'bg-blue-100 text-blue-600 scale-110' : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Customize Theme"
                    >
                        <Palette size={20} />
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    {/* Actions */}
                    <button onClick={onPrint} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Print PDF">
                        <Printer size={20} />
                    </button>
                    <button onClick={onExportPng} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600" title="Export PNG">
                        <Download size={20} />
                    </button>
                    <button onClick={handleReset} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition-colors" title="Reset All Data">
                        <RotateCcw size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
