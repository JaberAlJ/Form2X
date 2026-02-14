'use client';

import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import '@/app/driver-custom.css';

const ONBOARDING_KEY = 'form2x-research-onboarding-completed';

export function useResearchOnboarding() {
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
                        title: 'Welcome to Form2Research! 📚',
                        description: 'Let\'s explore the research paper builder. Create IEEE-standard papers with LaTeX equations, figures, tables, and automatic citations.',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#research-header',
                    popover: {
                        title: 'Header & Controls',
                        description: 'Import/export your paper data, load sample data, or export to HTML. Auto-save keeps your work safe.',
                        side: 'bottom',
                        align: 'start',
                    },
                },
                {
                    element: '#research-tabs',
                    popover: {
                        title: 'Two Main Tabs',
                        description: 'Manuscript: Edit your paper content | Formatting: Customize column layout, fonts, and margins for IEEE compliance.',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#research-front-matter',
                    popover: {
                        title: 'Front Matter',
                        description: 'Enter your paper title, authors with affiliations, abstract, and keywords. These appear at the top of your paper.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#research-sections',
                    popover: {
                        title: 'Content Sections',
                        description: 'Add sections like Introduction, Methodology, Results. Include figures, tables, and LaTeX equations. Use citation buttons to reference your bibliography.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#research-references',
                    popover: {
                        title: 'References',
                        description: 'Add IEEE-formatted references. Choose publication, book, website, or manual entry. The system auto-formats them for you!',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#research-preview',
                    popover: {
                        title: 'Live Preview',
                        description: 'See your paper rendered in real-time with proper formatting, equations, and citations. Toggle between edit and preview modes.',
                        side: 'left',
                        align: 'center',
                    },
                },
                {
                    popover: {
                        title: 'Ready to Publish! 🎓',
                        description: 'Your research paper is automatically saved. Export to HTML when ready, and your citations will be properly linked!',
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
