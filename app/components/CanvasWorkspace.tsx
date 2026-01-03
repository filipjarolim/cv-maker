'use client';

import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import clsx from 'clsx';

interface CanvasWorkspaceProps {
    children: ReactNode;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    className?: string;
}

export function CanvasWorkspace({ children, zoom, onZoomChange, className }: CanvasWorkspaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Track mouse position for drag delta
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                // Prevent scrolling when space is pressed
                if (e.target === document.body) e.preventDefault();
                setIsSpacePressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(false);
                setIsDragging(false);
            }
        };

        // Wheel listener for Zoom (Cmd+Scroll)
        const handleWheel = (e: WheelEvent) => {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                const delta = -e.deltaY * 0.001;
                const newZoom = Math.min(Math.max(0.2, zoom + delta), 3);
                onZoomChange(newZoom);
            } else if (isSpacePressed) {
                // If space is held, maybe wheel pans? 
                // Standard behavior is usually just drag, but let's allow wheel pan if space is held?
                // Actually, let's stick to trackpad panning logic which naturally emits wheel events
                // If not zooming, we pan with wheel logic if it's a trackpad
                e.preventDefault();
                setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Add non-passive wheel listener
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [zoom, onZoomChange, isSpacePressed]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isSpacePressed || e.button === 1) { // Space or Middle Click
            setIsDragging(true);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            e.preventDefault(); // Prevent text selection
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={containerRef}
            className={clsx(
                "relative w-full h-screen overflow-hidden bg-gray-50 flex items-center justify-center select-none",
                isSpacePressed ? "cursor-grab" : "cursor-default",
                isDragging && "cursor-grabbing",
                className
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Dot Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    transform: `translate(${pan.x % 20}px, ${pan.y % 20}px)`
                }}
            />

            {/* Content Container */}
            <motion.div
                className="relative origin-center shadow-2xl"
                animate={{
                    x: pan.x,
                    y: pan.y,
                    scale: zoom,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
