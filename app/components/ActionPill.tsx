'use client';

import { Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionPillProps {
    isVisible: boolean;
    onDuplicate: () => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export function ActionPill({ isVisible, onDuplicate, onDelete, onMoveUp, onMoveDown }: ActionPillProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 bg-gray-900 text-white rounded-full shadow-xl export-exclude"
                    onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                >
                    <button
                        onClick={onDuplicate}
                        className="p-1.5 hover:bg-gray-700 rounded-full transition-colors"
                        title="Duplicate"
                    >
                        <Copy size={14} />
                    </button>
                    <div className="w-px h-3 bg-gray-700 mx-0.5" />

                    {onMoveUp && (
                        <button onClick={onMoveUp} className="p-1.5 hover:bg-gray-700 rounded-full transition-colors" title="Move Up">
                            <ArrowUp size={14} />
                        </button>
                    )}
                    {onMoveDown && (
                        <button onClick={onMoveDown} className="p-1.5 hover:bg-gray-700 rounded-full transition-colors" title="Move Down">
                            <ArrowDown size={14} />
                        </button>
                    )}

                    <div className="w-px h-3 bg-gray-700 mx-0.5" />
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
