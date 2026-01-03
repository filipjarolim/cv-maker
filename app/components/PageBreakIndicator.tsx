'use client';

import { motion } from 'framer-motion';

export function PageBreakIndicator() {
    // A4 height at 96 DPI is approx 1123px.
    // 2nd page break at 2246px.
    // We can map a few pages.
    const breaks = [1123, 2246, 3369];

    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {breaks.map((y, i) => (
                <motion.div
                    key={y}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute w-full border-t border-dashed border-red-400/50 flex items-center justify-end pr-2 no-print export-exclude"
                    style={{ top: `${y}px` }}
                >
                    <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider bg-white/80 px-1 rounded transform translate-y-[-50%]">
                        Page Break {i + 1}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
