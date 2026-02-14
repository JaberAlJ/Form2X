'use client';

import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import '@/app/driver-custom.css';

const ONBOARDING_KEY = 'form2x-onboarding-completed';

export function useOnboarding() {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

    useEffect(() => {
        // Check if user has seen onboarding
        const completed = localStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(completed === 'true');
    }, []);

    const startOnboarding = () => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: '#hero-section',
                    popover: {
                        title: 'Welcome to Form2X! 🎉',
                        description: 'A modular suite of document generators that transform simple forms into professional, industry-standard outputs. Let\'s take a quick tour!',
                        side: 'bottom',
                        align: 'center',
                    },
                },
                {
                    element: '#features-section',
                    popover: {
                        title: 'Powerful Features',
                        description: 'Form2X is built with ATS optimization and LaTeX engine support to ensure your documents meet the highest standards.',
                        side: 'top',
                        align: 'center',
                    },
                },
                {
                    element: '#form2resume-card',
                    popover: {
                        title: 'Form2Resume 📄',
                        description: 'Create professional, ATS-optimized resumes in minutes. Perfect for engineers and professionals who want to stand out.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#form2research-card',
                    popover: {
                        title: 'Form2Research 📚',
                        description: 'Generate IEEE standard research papers with LaTeX equations, figures, and automatic citations. Academic writing made easy!',
                        side: 'right',
                        align: 'start',
                    },
                },
                {
                    element: '#theme-toggle',
                    popover: {
                        title: 'Theme Toggle 🌓',
                        description: 'Switch between light and dark modes to match your preference. Your choice will be saved automatically.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    popover: {
                        title: 'You\'re All Set! ✨',
                        description: 'Choose a tool to get started. Your work is automatically saved to local storage, so you won\'t lose any progress!',
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
