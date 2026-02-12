'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type PersistenceStatus = 'saved' | 'syncing' | 'idle';

export function useFormPersistence<T>(
    key: string,
    initialData: T,
    debounceMs: number = 1000
) {
    const [data, setData] = useState<T>(initialData);
    const [status, setStatus] = useState<PersistenceStatus>('idle');
    const [isLoaded, setIsLoaded] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (error) {
                console.error(`Error loading ${key} from localStorage:`, error);
            }
        }
        setIsLoaded(true);
    }, [key]);

    // Save to localStorage with debouncing
    const saveData = useCallback((updater: T | ((prev: T) => T)) => {
        setData(prev => {
            const nextData = typeof updater === 'function'
                ? (updater as (prev: T) => T)(prev)
                : updater;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setStatus('syncing');

            timeoutRef.current = setTimeout(() => {
                try {
                    localStorage.setItem(key, JSON.stringify(nextData));
                    setStatus('saved');
                    setTimeout(() => setStatus('idle'), 2000);
                } catch (error) {
                    console.error(`Error saving ${key} to localStorage:`, error);
                    setStatus('idle');
                }
            }, debounceMs);

            return nextData;
        });
    }, [key, debounceMs]);

    // Clear data from localStorage
    const clearData = useCallback(() => {
        localStorage.removeItem(key);
        setData(initialData);
        setStatus('idle');
    }, [key, initialData]);

    return {
        data,
        saveData,
        clearData,
        status,
        isLoaded
    };
}
