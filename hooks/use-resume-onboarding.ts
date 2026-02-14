'use client';

import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import '@/app/driver-custom.css';

const ONBOARDING_KEY = 'form2x-resume-onboarding-completed';

export function useResumeOnboarding() {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

    useEffect(() => {
        const completed = localStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(completed === 'true');
    }, []);

    const startOnboarding = () => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    popover: {
                        title: 'Welcome to Form2Resume! 📄',
                        description: 'Let\'s take a quick tour of the resume builder. This tool helps you create professional, ATS-optimized resumes in minutes.',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#resume-header',
                    popover: {
                        title: 'Header & Controls',
                        description: 'Import/export your resume data, load sample data, or export to HTML. Your work is automatically saved to localStorage.',
                        side: 'bottom',
                        align: 'start',
                    },
                },
                {
                    element: '#resume-tabs',
                    popover: {
                        title: 'Three Main Tabs',
                        description: 'Content: Edit your resume data | Layout: Reorder sections | Styles: Customize fonts, spacing, and colors.',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#resume-content',
                    popover: {
                        title: 'Content Editor',
                        description: 'Fill in your contact information, education, experience, projects, and skills. Required fields are marked with red borders.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#resume-preview',
                    popover: {
                        title: 'Live Preview',
                        description: 'See your resume update in real-time as you type. Use the zoom controls to adjust the view, and toggle between edit and preview modes.',
                        side: 'left',
                        align: 'center',
                    },
                },
                {
                    element: '#resume-export',
                    popover: {
                        title: 'Export Your Resume',
                        description: 'When you\'re ready, click the HTML button to export a standalone file. Make sure all required fields are filled first!',
                        side: 'bottom',
                        align: 'end',
                    },
                },
                {
                    popover: {
                        title: 'You\'re All Set! ✨',
                        description: 'Start building your professional resume. Remember: your progress is automatically saved, so you can come back anytime!',
                    },
                },
            ],
            onDestroyed: () => {
                localStorage.setItem(ONBOARDING_KEY, 'true');
                setHasSeenOnboarding(true);
            },
        });

        driverObj.drive();
    };

    const resetOnboarding = () => {
        localStorage.removeItem(ONBOARDING_KEY);
        setHasSeenOnboarding(false);
    };

    return {
        hasSeenOnboarding,
        startOnboarding,
        resetOnboarding,
    };
}
