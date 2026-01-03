'use client';

import { ReactNode } from 'react';
import { Reorder, useDragControls, motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface SectionDragWrapperProps {
    id: string;
    children: ReactNode;
}

export function SectionDragWrapper({ id, children }: SectionDragWrapperProps) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={id}
            id={id}
            dragListener={false}
            dragControls={controls}
            className="group relative"
            whileDrag={{
                scale: 1.02,
                rotate: 1,
                zIndex: 50,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            }}
            // Animate layout changes for other items
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Grip Handle - Visible on Hover */}
            <div
                className="absolute -left-8 top-0 h-full w-8 flex items-start pt-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing no-print"
                onPointerDown={(e) => controls.start(e)}
            >
                <div className="p-1 rounded bg-gray-100/80 hover:bg-blue-100 border border-transparent hover:border-blue-200 transition-colors">
                    <GripVertical size={16} className="text-gray-400 hover:text-blue-500" />
                </div>
            </div>

            {/* Content Backdrop Blur during drag (optional visual effect) */}
            <div className="bg-white">
                {children}
            </div>
        </Reorder.Item>
    );
}
