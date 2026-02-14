'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
import { HelpCircle } from 'lucide-react';

/**
 * OnboardingTrigger Component
 * 
 * A button component that allows users to manually restart the onboarding tour.
 * This can be placed in a help menu, settings page, or anywhere users might need
 * to review the tour again.
 * 
 * Usage:
 * ```tsx
 * import { OnboardingTrigger } from '@/components/onboarding-trigger';
 * 
 * // In your component:
 * <OnboardingTrigger />
 * ```
 */
export function OnboardingTrigger() {
    const { startOnboarding } = useOnboarding();

    return (
        <button
            onClick={startOnboarding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            aria-label="Start onboarding tour"
        >
            <HelpCircle className="w-4 h-4" />
            Take Tour
        </button>
    );
}

/**
 * OnboardingTriggerIcon Component
 * 
 * A minimal icon-only version of the trigger, suitable for headers or toolbars.
 * 
 * Usage:
 * ```tsx
 * import { OnboardingTriggerIcon } from '@/components/onboarding-trigger';
 * 
 * // In your component:
 * <OnboardingTriggerIcon />
 * ```
 */
export function OnboardingTriggerIcon() {
    const { startOnboarding } = useOnboarding();

    return (
        <button
            onClick={startOnboarding}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all border border-slate-200 dark:border-slate-800"
            aria-label="Start onboarding tour"
            title="Take a tour"
        >
            <HelpCircle className="w-5 h-5" />
        </button>
    );
}
