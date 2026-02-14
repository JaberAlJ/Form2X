'use client';

import { HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useResumeOnboarding } from '@/hooks/use-resume-onboarding';
import { useResearchOnboarding } from '@/hooks/use-research-onboarding';

/**
 * FloatingHelpButton Component
 * 
 * A context-aware floating action button that triggers the appropriate onboarding tour
 * based on the current page. Appears in the bottom-right corner of the screen.
 * 
 * Supported pages:
 * - / (home): Landing page tour
 * - /resume: Resume builder tour
 * - /research: Research paper builder tour
 */
export function FloatingHelpButton() {
    const pathname = usePathname();
    const { startOnboarding: startHomeOnboarding } = useOnboarding();
    const { startOnboarding: startResumeOnboarding } = useResumeOnboarding();
    const { startOnboarding: startResearchOnboarding } = useResearchOnboarding();

    const handleClick = () => {
        if (pathname === '/') {
            startHomeOnboarding();
        } else if (pathname === '/resume') {
            startResumeOnboarding();
        } else if (pathname === '/research') {
            startResearchOnboarding();
        }
    };

    // Get the appropriate label based on the current page
    const getLabel = () => {
        if (pathname === '/') return 'Take Tour';
        if (pathname === '/resume') return 'Resume Help';
        if (pathname === '/research') return 'Research Help';
        return 'Help';
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95 group no-print"
            aria-label="Start guided tour"
            title="Click for a guided tour of this page"
        >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm">{getLabel()}</span>
        </button>
    );
}
