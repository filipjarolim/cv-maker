'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { ScaleButton } from './ScaleButton';

interface MagicButtonProps {
    currentText: string;
    onUpdate: (newText: string) => void;
}

export function MagicButton({ currentText, onUpdate }: MagicButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleMagic = () => {
        if (!currentText) return;

        setIsLoading(true);

        // Simulate AI delay
        setTimeout(() => {
            // Simple mock "improvement" logic
            const improvedText = currentText.startsWith("Improved: ")
                ? currentText
                : `Improved: ${currentText}\n\n(AI Enhanced: Demonstrating successful mock integration. The text has been polished for a more professional tone.)`;

            onUpdate(improvedText);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <ScaleButton
            onClick={handleMagic}
            disabled={isLoading}
            variant="primary"
            className="ml-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white w-7 h-7 p-0 shadow-md border-0 no-print inline-flex"
            title="AI Rewrite (Mock)"
        >
            <Sparkles size={14} className={isLoading ? "animate-spin" : ""} />
        </ScaleButton>
    );
}
