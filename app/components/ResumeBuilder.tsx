'use client';

import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { FloatingDock } from './FloatingDock';
import { ThemeRegistry } from './ThemeRegistry';
import { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { asBlob } from 'html-docx-js-typescript';
import { PageBreakIndicator } from './PageBreakIndicator';
import { CanvasWorkspace } from './CanvasWorkspace';

export default function ResumeBuilder() {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [zoom, setZoom] = useState(0.8);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleFitView = () => {
        const scale = Math.min((window.innerHeight - 100) / 1200, 1);
        setZoom(scale);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportPNG = async () => {
        if (contentRef.current) {
            try {
                // html-to-image handles modern CSS (like oklab) better than html2canvas
                const dataUrl = await toPng(contentRef.current, {
                    quality: 0.95,
                    backgroundColor: '#ffffff',
                    // Add pixel ratio for better quality
                    pixelRatio: 2
                });

                const link = document.createElement('a');
                link.download = 'resume.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error("PNG transformation failed", err);
                alert("Failed to export PNG. See console.");
            }
        }
    };

    const handleExportWord = async () => {
        if (contentRef.current && typeof window !== 'undefined') {
            const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Resume</title>
            </head>
            <body>
              ${contentRef.current.outerHTML}
            </body>
          </html>
        `;

            try {
                const blob = await asBlob(html, {
                    orientation: 'portrait',
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }
                });

                const url = URL.createObjectURL(blob as Blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'resume.docx';
                link.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Word export failed", err);
                alert("Export to Word failed. Complex layouts might not be supported.");
            }
        }
    };

    if (!isClient) return null;

    return (
        <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">

            <CanvasWorkspace zoom={zoom} onZoomChange={setZoom}>
                <div
                    ref={contentRef}
                    id="resume-content"
                    className="w-[210mm] h-[297mm] overflow-hidden bg-white shadow-2xl flex flex-col md:flex-row print:shadow-none print:w-full print:max-w-none print:transform-none relative"
                >
                    <PageBreakIndicator />
                    <Sidebar />
                    <MainContent />
                </div>
            </CanvasWorkspace>

            {/* Floating Dock */}
            <FloatingDock
                onPrint={handlePrint}
                onExportPng={handleExportPNG}
                onExportWord={handleExportWord}
                zoom={zoom}
                setZoom={setZoom}
                onFitView={handleFitView}
            />

            <ThemeRegistry />

        </div>
    );
}
