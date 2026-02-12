'use client';

import { Cloud, Check, Loader2 } from 'lucide-react';
import { PersistenceStatus } from '@/hooks/useFormPersistence';

interface PersistenceIndicatorProps {
    status: PersistenceStatus;
    className?: string;
}

export function PersistenceIndicator({ status, className = '' }: PersistenceIndicatorProps) {
    if (status === 'syncing') {
        return (
            <div className={`flex items-center gap-1.5 text-blue-500 ${className}`}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Saving...</span>
            </div>
        );
    }

    if (status === 'saved' || status === 'idle') {
        return (
            <div className={`flex items-center gap-1.5 text-slate-400 dark:text-slate-500 ${className}`}>
                <Cloud className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
            </div>
        );
    }

    return null;
}
